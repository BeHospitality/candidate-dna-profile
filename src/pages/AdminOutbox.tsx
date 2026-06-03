// Admin-only Hub outbox monitor.
// Gating: caller must paste the admin secret (DNA_OUTBOUND_SECRET).
// The secret is sent server-side as x-admin-secret and validated by the edge
// function. We never persist it to localStorage — only sessionStorage for the
// current tab — to limit blast radius. No public links anywhere reference this route.
import { useEffect, useState } from "react";

const ENDPOINT = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/hub-outbox-status`;
const SECRET_KEY = "be-admin-outbox-secret";

type Row = {
  id: string;
  assessment_id: string;
  email: string | null;
  status: "pending" | "in_flight" | "delivered" | "dead";
  attempts: number;
  last_error: string | null;
  next_attempt_at: string | null;
  last_attempt_at: string | null;
  delivered_at: string | null;
  first_attempt_at: string | null;
  created_at: string;
};

type StatusResponse = {
  window: string;
  generated_at: string;
  counts: { delivered: number; pending: number; in_flight: number; dead: number };
  total_attempts: number;
  failure_reasons: { reason: string; count: number }[];
  rows: Row[];
};

const StatusBadge = ({ status }: { status: Row["status"] }) => {
  const styles: Record<Row["status"], string> = {
    delivered: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    pending: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    in_flight: "bg-sky-500/15 text-sky-300 border-sky-500/30",
    dead: "bg-rose-500/15 text-rose-300 border-rose-500/30",
  };
  return (
    <span className={`inline-block rounded border px-2 py-0.5 text-xs font-medium ${styles[status]}`}>
      {status}
    </span>
  );
};

const fmtTime = (iso: string | null) => (iso ? new Date(iso).toLocaleString() : "—");

const AdminOutbox = () => {
  const [secret, setSecret] = useState<string>(() => sessionStorage.getItem(SECRET_KEY) ?? "");
  const [draft, setDraft] = useState("");
  const [data, setData] = useState<StatusResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | Row["status"]>("all");

  const fetchStatus = async (s: string) => {
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch(ENDPOINT, {
        method: "GET",
        headers: { "x-admin-secret": s },
      });
      if (resp.status === 401) {
        setError("Invalid admin secret");
        setSecret("");
        sessionStorage.removeItem(SECRET_KEY);
        setData(null);
        return;
      }
      if (!resp.ok) {
        const body = await resp.text();
        setError(`HTTP ${resp.status}: ${body.slice(0, 200)}`);
        return;
      }
      const json = (await resp.json()) as StatusResponse;
      setData(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (secret) fetchStatus(secret);
  }, [secret]);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed) return;
    sessionStorage.setItem(SECRET_KEY, trimmed);
    setSecret(trimmed);
    setDraft("");
  };

  const handleLogout = () => {
    sessionStorage.removeItem(SECRET_KEY);
    setSecret("");
    setData(null);
  };

  if (!secret) {
    return (
      <div className="min-h-screen bg-navy-radial flex items-center justify-center px-4">
        <form
          onSubmit={handleUnlock}
          className="w-full max-w-sm rounded-lg border border-border bg-card p-6 space-y-4"
        >
          <div>
            <h1 className="text-lg font-semibold text-foreground">Hub Outbox — Admin</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Restricted. Paste the admin secret to view delivery status.
            </p>
          </div>
          <input
            type="password"
            autoFocus
            autoComplete="off"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Admin secret"
            className="w-full rounded border border-border bg-background px-3 py-2 text-sm text-foreground"
          />
          {error && <p className="text-xs text-rose-400">{error}</p>}
          <button
            type="submit"
            className="w-full rounded bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
          >
            Unlock
          </button>
        </form>
      </div>
    );
  }

  const filteredRows = data?.rows.filter((r) => statusFilter === "all" || r.status === statusFilter) ?? [];

  return (
    <div className="min-h-screen bg-navy-radial px-4 py-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Hub Outbox — last 24h</h1>
            {data && (
              <p className="text-xs text-muted-foreground">
                Generated {new Date(data.generated_at).toLocaleString()}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => fetchStatus(secret)}
              disabled={loading}
              className="rounded border border-border bg-card px-3 py-1.5 text-sm text-foreground disabled:opacity-50"
            >
              {loading ? "Refreshing…" : "Refresh"}
            </button>
            <button
              onClick={handleLogout}
              className="rounded border border-border bg-card px-3 py-1.5 text-sm text-muted-foreground"
            >
              Log out
            </button>
          </div>
        </header>

        {error && (
          <div className="rounded border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-300">
            {error}
          </div>
        )}

        {data && (
          <>
            <section className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {(["delivered", "in_flight", "pending", "dead"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(statusFilter === s ? "all" : s)}
                  className={`rounded-lg border bg-card p-3 text-left transition ${
                    statusFilter === s ? "border-primary" : "border-border"
                  }`}
                >
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">{s}</div>
                  <div className="text-2xl font-bold text-foreground mt-1">
                    {data.counts[s] ?? 0}
                  </div>
                </button>
              ))}
              <div className="rounded-lg border border-border bg-card p-3">
                <div className="text-xs uppercase tracking-wide text-muted-foreground">
                  Total attempts
                </div>
                <div className="text-2xl font-bold text-foreground mt-1">
                  {data.total_attempts}
                </div>
              </div>
            </section>

            {data.failure_reasons.length > 0 && (
              <section className="rounded-lg border border-border bg-card p-4">
                <h2 className="text-sm font-semibold text-foreground mb-2">
                  Failure reasons (non-delivered)
                </h2>
                <ul className="space-y-1.5">
                  {data.failure_reasons.map((f) => (
                    <li
                      key={f.reason}
                      className="flex items-start justify-between gap-3 text-xs"
                    >
                      <code className="font-mono text-rose-300 break-all">{f.reason}</code>
                      <span className="shrink-0 rounded bg-muted px-2 py-0.5 text-muted-foreground">
                        ×{f.count}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section className="rounded-lg border border-border bg-card overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 border-b border-border">
                <h2 className="text-sm font-semibold text-foreground">
                  Rows {statusFilter !== "all" && `(filter: ${statusFilter})`} — {filteredRows.length}
                </h2>
                {statusFilter !== "all" && (
                  <button
                    onClick={() => setStatusFilter("all")}
                    className="text-xs text-muted-foreground underline"
                  >
                    Clear filter
                  </button>
                )}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-muted/30 text-muted-foreground">
                    <tr>
                      <th className="px-3 py-2 text-left font-medium">Status</th>
                      <th className="px-3 py-2 text-left font-medium">Email</th>
                      <th className="px-3 py-2 text-left font-medium">Assessment</th>
                      <th className="px-3 py-2 text-right font-medium">Attempts</th>
                      <th className="px-3 py-2 text-left font-medium">Last attempt</th>
                      <th className="px-3 py-2 text-left font-medium">Next attempt</th>
                      <th className="px-3 py-2 text-left font-medium">Last error</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredRows.map((r) => (
                      <tr key={r.id} className="hover:bg-muted/10">
                        <td className="px-3 py-2"><StatusBadge status={r.status} /></td>
                        <td className="px-3 py-2 text-foreground">{r.email ?? <span className="text-muted-foreground italic">none</span>}</td>
                        <td className="px-3 py-2 font-mono text-muted-foreground">{r.assessment_id.slice(0, 8)}…</td>
                        <td className="px-3 py-2 text-right text-foreground">{r.attempts}</td>
                        <td className="px-3 py-2 text-muted-foreground">{fmtTime(r.last_attempt_at)}</td>
                        <td className="px-3 py-2 text-muted-foreground">{r.status === "pending" ? fmtTime(r.next_attempt_at) : "—"}</td>
                        <td className="px-3 py-2 text-rose-300 max-w-md truncate" title={r.last_error ?? ""}>
                          {r.last_error ?? "—"}
                        </td>
                      </tr>
                    ))}
                    {filteredRows.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-3 py-6 text-center text-muted-foreground">
                          No rows in this window.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminOutbox;
