// Cross-device autosave. Debounces server writes so we never spam the RPC
// even if the candidate flies through questions. Only fires when we have a
// canonical email (post-capture); pure-localStorage mode for anonymous flows.
import { useEffect, useRef } from "react";
import { invokeSecureRpc } from "@/lib/secureRpc";
import { track } from "@/lib/funnel";

interface AutosaveArgs {
  answers: Record<number, unknown>;
  currentQuestion: number;
  experiencePath?: string | null;
  totalQuestions?: number | null;
  enabled?: boolean;
  debounceMs?: number;
}

export function useAutosaveProgress({
  answers,
  currentQuestion,
  experiencePath,
  totalQuestions,
  enabled = true,
  debounceMs = 2500,
}: AutosaveArgs) {
  const timer = useRef<number | null>(null);
  const lastSig = useRef<string>("");

  useEffect(() => {
    if (!enabled) return;
    const rawEmail = localStorage.getItem("beconnect-email");
    const email = rawEmail ? rawEmail.toLowerCase().trim() : "";
    if (!email) return; // pre-capture: localStorage is enough

    const sig = `${currentQuestion}:${Object.keys(answers).length}`;
    if (sig === lastSig.current) return;
    lastSig.current = sig;

    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(async () => {
      try {
        const { error } = await invokeSecureRpc("save_progress", {
          p_email: email,
          p_experience_path: experiencePath ?? null,
          p_current_question: currentQuestion,
          p_answers: answers,
          p_total_questions: totalQuestions ?? null,
        });
        if (!error) track("autosave_synced", { current_question: currentQuestion });
      } catch (err) {
        console.warn("[autosave] failed", err);
      }
    }, debounceMs) as unknown as number;

    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [answers, currentQuestion, experiencePath, totalQuestions, enabled, debounceMs]);
}
