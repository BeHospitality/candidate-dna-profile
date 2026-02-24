import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, Mail, Loader2, X, BookmarkPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createResumeToken, sendResumeEmail, type ResumeTokenData } from "@/lib/resumeTokens";
import { useToast } from "@/hooks/use-toast";

interface SaveProgressDialogProps {
  data: ResumeTokenData;
  onClose: () => void;
}

const SaveProgressDialog = ({ data, onClose }: SaveProgressDialogProps) => {
  const { toast } = useToast();
  const [state, setState] = useState<"saving" | "saved" | "error">("saving");
  const [resumeUrl, setResumeUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);

  // Create the token on mount
  useEffect(() => {
    createResumeToken(data).then((token) => {
      if (token) {
        const url = `${window.location.origin}/resume/${token}`;
        setResumeUrl(url);
        setState("saved");

        // Auto-send email if available
        if (data.email) {
          setSendingEmail(true);
          sendResumeEmail(data.email, url).then((ok) => {
            setSendingEmail(false);
            if (ok) setEmailSent(true);
          });
        }
      } else {
        setState("error");
      }
    });
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(resumeUrl);
    setCopied(true);
    toast({ title: "Link copied!", description: "Bookmark it or send it to yourself." });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="glass-card p-6 sm:p-8 rounded-2xl w-full max-w-md relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {state === "saving" && (
          <div className="text-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-foreground font-semibold">Saving your progress…</p>
          </div>
        )}

        {state === "error" && (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">😕</div>
            <p className="text-foreground font-semibold mb-2">Couldn't save</p>
            <p className="text-sm text-muted-foreground mb-4">
              Something went wrong. Your progress is still saved locally — you can continue in this browser.
            </p>
            <Button onClick={onClose} variant="outline" className="rounded-xl">
              Close
            </Button>
          </div>
        )}

        {state === "saved" && (
          <div className="space-y-5">
            <div className="text-center">
              <div className="text-4xl mb-2">🔖</div>
              <h2 className="text-xl font-bold text-foreground mb-1">Progress Saved!</h2>
              <p className="text-sm text-muted-foreground">
                Use this link to resume anytime within 7 days.
              </p>
            </div>

            {/* Resume link */}
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-secondary rounded-xl px-3 py-2.5 text-xs text-muted-foreground truncate font-mono">
                {resumeUrl}
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCopy}
                className="rounded-xl shrink-0"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>

            {/* Email status */}
            {data.email && (
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                {sendingEmail ? (
                  <span className="text-muted-foreground">Sending to {data.email}…</span>
                ) : emailSent ? (
                  <span className="text-primary">✓ Resume link sent to {data.email}</span>
                ) : (
                  <span className="text-muted-foreground">Email delivery failed — use the link above</span>
                )}
              </div>
            )}

            <Button onClick={onClose} className="w-full rounded-xl font-bold" size="lg">
              Continue Assessment
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default SaveProgressDialog;
