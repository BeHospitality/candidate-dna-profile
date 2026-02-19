import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { storage, type EntryMode } from "@/lib/storage";
import { validateMagicLink } from "@/lib/persistence";
import { testDbConnection } from "@/utils/dbConnectionTest";

const DbTestPanel = () => {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const run = async () => {
    setLoading(true);
    const r = await testDbConnection();
    setResults(r);
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto text-center">
      <Button onClick={run} variant="outline" size="sm" disabled={loading} className="rounded-xl text-xs">
        {loading ? "Testing..." : "🧪 Test DB Connection"}
      </Button>
      {results && (
        <pre className="mt-3 text-left text-xs bg-black/50 text-green-400 p-4 rounded-xl overflow-auto max-h-60">
          {JSON.stringify(results, null, 2)}
        </pre>
      )}
    </div>
  );
};

const archetypePreviews = [
  {
    emoji: "🦁",
    name: "Lion",
    tagline: "The Autonomous Leader",
    desc: "Decisive, independent, visionary. You take charge and drive results.",
  },
  {
    emoji: "🐋",
    name: "Whale",
    tagline: "The Collaborative Anchor",
    desc: "Empathetic, supportive, adaptive. You build bridges and lift teams.",
  },
  {
    emoji: "🦅",
    name: "Falcon",
    tagline: "The Precision Specialist",
    desc: "Detail-oriented, systematic, expert. You master craft and optimize.",
  },
];

const Index = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [validating, setValidating] = useState(false);

  useEffect(() => {
    let mode: EntryMode = "public";
    let token: string | undefined;
    let orgCode: string | undefined;

    if (location.pathname === "/assess") {
      mode = "candidate";
      token = searchParams.get("token") || undefined;

      // Validate magic link token
      if (token) {
        setValidating(true);
        validateMagicLink(token).then((result) => {
          setValidating(false);
          if (!result.valid) {
            setTokenError("This link is invalid or has expired.");
          } else {
            orgCode = result.orgCode;
            storage.setEntryMode({ mode, token, orgCode, candidateEmail: result.candidateEmail, candidateName: result.candidateName });
          }
        });
        return; // Don't set entry mode yet, wait for validation
      }
    } else if (location.pathname === "/team") {
      mode = "team";
      orgCode = searchParams.get("org") || undefined;
    }

    storage.setEntryMode({ mode, token, orgCode });
  }, [location.pathname, searchParams]);

  const handleStart = () => {
    navigate("/assessment");
  };

  if (validating) {
    return (
      <div className="min-h-screen bg-navy-radial flex items-center justify-center">
        <p className="text-lg text-muted-foreground">Validating your link...</p>
      </div>
    );
  }

  if (tokenError) {
    return (
      <div className="min-h-screen bg-navy-radial flex flex-col items-center justify-center px-4">
        <div className="text-6xl mb-6">🔗</div>
        <h1 className="text-2xl font-bold text-foreground mb-3">Link Invalid</h1>
        <p className="text-muted-foreground mb-6 text-center max-w-md">{tokenError}</p>
        <Button onClick={() => navigate("/")} variant="outline" className="rounded-xl">
          Go to Public Assessment
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-radial flex flex-col">
      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-8 text-sm text-muted-foreground">
            <Sparkles className="w-4 h-4 text-primary" />
            Work Archetype Assessment
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
            Discover Your{" "}
            <span className="text-gradient-gold">Work DNA</span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-xl mx-auto">
            12 questions. 5 minutes. Uncover the archetype that drives your
            career success.
          </p>

          <Button
            size="lg"
            onClick={handleStart}
            className="text-lg px-8 py-6 rounded-xl font-bold animate-pulse-gold"
          >
            Start Assessment
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </motion.div>

        {/* Archetype Preview Cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-16 max-w-3xl mx-auto w-full px-4"
        >
          {archetypePreviews.map((a, idx) => (
            <motion.div
              key={a.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + idx * 0.15, duration: 0.4 }}
              className="glass-card p-6 text-center hover:scale-105 transition-transform duration-300"
            >
              <div className="text-5xl mb-3">{a.emoji}</div>
              <h3 className="font-bold text-lg text-foreground mb-1">
                {a.name}
              </h3>
              <p className="text-sm text-primary font-medium mb-2">
                {a.tagline}
              </p>
              <p className="text-xs text-muted-foreground">{a.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Temporary DB Test */}
      <div className="px-4 pb-4">
        <DbTestPanel />
      </div>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-muted-foreground">
        Candidate DNA Profile · Powered by Be Connect
      </footer>
    </div>
  );
};

export default Index;
