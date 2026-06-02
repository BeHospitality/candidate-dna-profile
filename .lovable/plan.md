
## Decisions taken (since you skipped the questions)

- **Backfill scope**: all `assessments` rows with no successful `hub_outbox` delivery. Hub upserts on email+assessment_id so duplicates are safe; this guarantees the PRE-FIX cohort is recovered.
- **Video reminder cadence**: immediate email on skip + 48h nudge + 7-day final, then stop. Warm tone, profile stays `video_incomplete`.
- **Cross-device resume**: email-bound autosave + one-time magic resume link emailed to that address. No raw-email lookup (GDPR + answer privacy).
- **Batch shape**: one unpublished batch, all 5 workstreams. You review once.
- **Guardrails honored**: scoring/archetype engine untouched. No claims of partnerships/programs. All copy literally true. Nothing published.

---

## 1. Hub-relay durable outbox (highest priority)

**New table `public.hub_outbox`** (migration):
- `id uuid pk`, `assessment_id uuid`, `email text`, `payload jsonb`, `status text` (`pending|in_flight|delivered|dead`), `attempts int default 0`, `next_attempt_at timestamptz`, `last_error text`, `last_attempt_at timestamptz`, `delivered_at timestamptz`, `created_at timestamptz`.
- RLS: deny all anon/auth reads/writes. Only service_role + edge functions touch it.
- Index on `(status, next_attempt_at)`.

**Edge function `hub-outbox-worker`** (cron every 1 min via `pg_cron` + `pg_net`):
- Pull up to 25 rows where `status='pending' AND next_attempt_at <= now()`.
- For each: mark `in_flight`, POST to existing `hub-relay` internal contract (reuse `DNA_REVEAL_WEBHOOK_SECRET`).
- On 2xx: `delivered`, set `delivered_at`.
- On failure: increment attempts, set exponential backoff (1m, 5m, 15m, 1h, 4h, 12h). After 24h elapsed since first attempt → `dead`, write `audit_log` row `hub_outbox_dead_letter`.
- Log every attempt to `audit_log` with `event_type='hub_outbox_attempt'`.

**Wire-in**: `fireHubRelayReveal` now inserts into `hub_outbox` (via a new `secure-rpc` action `enqueue_hub_outbox`) instead of calling `hub-relay` directly. Keep the direct call as a best-effort first try inside the worker only — frontend is purely "enqueue then forget".

**Backfill edge function `hub-outbox-backfill`** (one-shot, admin-callable with `DNA_OUTBOUND_SECRET` header):
- For every `assessments` row where no `hub_outbox` row exists with `status='delivered'` for that assessment_id, build the same payload `fireHubRelayReveal` would have built (rehydrate from `archetype`, `dimension_scores`, joined participant email/name/path), insert into `hub_outbox` as `pending`. Worker picks them up on the next tick.
- Returns count enqueued. You call it once after deploy.

## 2. Ethics screen rewrite

Replace `ConsentGate.tsx` copy with a warm, benefit-led version. Concrete structure:
- Lead: "Your answers are yours. Here's exactly what we share — and what we never will."
- Three short truthful bullets: (a) what employers see (archetype + dimension scores + sector fit), (b) what they never see (raw answers, free text), (c) you can request deletion any time at the privacy address already in `Privacy.tsx`.
- Single primary CTA "I'm in — start my profile", secondary "Read the full privacy notice" → existing `/privacy`.
- No new claims. No partnerships invented. Same `consent_log` write.

## 3. Video step: blocker → "skip for now"

- Video step UI gets a second secondary CTA: "Email me a link to do this later".
- On skip: write `video_status='skipped_pending'` on the participant record (new column), enqueue Brevo "add your video" email with a tokenised resume link to the video-only step. Funnel event `video_skipped`.
- Profile flag `video_complete=false` surfaces on results page as a gentle banner: "Your profile is 90% there — add your 60-second intro to unlock matches" with one CTA, no nagging modal.
- Cron `video-reminder-worker` (same pg_cron schedule, runs hourly): finds `video_status='skipped_pending'` rows where (a) 48h elapsed and no 48h nudge sent, or (b) 7d elapsed and no final sent. Sends Brevo template, stamps `video_nudge_48h_at` / `video_nudge_7d_at`. Stops after 7-day.
- Migration adds: `video_status text`, `video_skipped_at timestamptz`, `video_nudge_48h_at timestamptz`, `video_nudge_7d_at timestamptz`, `video_completed_at timestamptz` to `dna_participants`.

## 4. Funnel instrumentation

- New table `public.funnel_events` (`id`, `session_id`, `email` nullable, `event_name`, `metadata jsonb`, `created_at`). Insert-only, deny reads to anon/auth, service_role full.
- Tiny client helper `src/lib/funnel.ts` → `track(event, meta?)` posts via a new `funnel-ingest` edge function (verify_jwt=false, anon-rate-limited).
- Events emitted: `assessment_started`, `chapter_completed` (with chapter id), `ethics_shown`, `ethics_signed`, `video_shown`, `video_recorded`, `video_skipped`, `assessment_completed`, `results_viewed`, `hub_delivery_succeeded`, `hub_delivery_dead`.

## 5. Autosave + cross-device resume

- New table `public.assessment_progress` keyed by `email` (unique): `email`, `experience_path`, `current_question`, `answers jsonb`, `phase1_results jsonb`, `updated_at`. Deny all direct anon access; mutations go through new `secure-rpc` actions `save_progress` and `load_progress_by_token`.
- Frontend: existing localStorage stays as fast cache. Every 5 questions OR on chapter boundary, debounced call to `save_progress` (only if email present — i.e. after capture).
- Cross-device entry: on `/` add a small "Continue on another device?" link → email input → calls existing `send-resume-email` (already JWT-verified) which now writes a `resume_tokens` row pointing at the `assessment_progress` row. Landing on that link hydrates from server, overwrites localStorage, drops candidate at the right question.

---

## Files / surfaces touched

**Migrations (1 file)**: `hub_outbox`, `funnel_events`, `assessment_progress` tables + grants + RLS + indexes; alter `dna_participants` for video columns; pg_cron schedule for the two workers.

**Edge functions (new)**: `hub-outbox-worker`, `hub-outbox-backfill`, `video-reminder-worker`, `funnel-ingest`.
**Edge functions (edited)**: `secure-rpc` (add `enqueue_hub_outbox`, `save_progress`, `load_progress_by_token`), `send-resume-email` (cross-device path).

**Frontend**:
- `src/components/ConsentGate.tsx` — warm rewrite
- `src/components/assessment/` — video step skip CTA, autosave hook, funnel events at boundaries
- `src/pages/ArchetypeReveal.tsx` — swap direct hub-relay for outbox enqueue, results-page video banner
- `src/pages/Index.tsx` — "continue on another device" entry
- `src/lib/funnel.ts` (new), `src/lib/persistence.ts` (autosave call sites), `src/lib/hubRelayReveal.ts` (route via outbox)

**Memory updates**: `mem://architecture/api-integration` (outbox), `mem://features/save-and-resume` (cross-device), new `mem://features/funnel-events`, new `mem://features/video-skip-flow`.

## What stays untouched
Scoring engine, archetype data, signature matching, sector/department/geography matching, results visualisations, PDF export, SEO tags, branding tokens.

## Verification before handover
- `supabase--linter` after migration.
- Smoke-test outbox worker manually via `supabase--curl_edge_functions`.
- Browser walkthrough at 390×844 of: ethics screen, video skip path, autosave kicking in, resume-on-other-device link.
- Confirm nothing is published (Lovable publish is manual; I will not call publish tools).

## Sequencing inside this build
1. Migration (tables, grants, RLS, cron, alter participants).
2. Edge functions (worker, backfill, reminder, funnel-ingest, secure-rpc additions).
3. Frontend rewrites + autosave + funnel calls + outbox enqueue.
4. Memory updates.
5. Trigger backfill once and report counts.
6. Summary of every change back to you.

Approve and I'll start with the migration.
