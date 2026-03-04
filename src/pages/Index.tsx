import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { storage, type EntryMode } from "@/lib/storage";
import { validateMagicLink } from "@/lib/persistence";
import BrandHeader from "@/components/BrandHeader";
import DynamicFooter from "@/components/DynamicFooter";

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
        return;
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
      <BrandHeader />

      {/* SECTION 1: HERO */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 py-16 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
            <span className="text-gradient-gold">Are you a Lion, a Whale, or a Falcon?</span>
          </h1>

          <p className="text-lg sm:text-xl text-[#9ca3af] mb-4 max-w-xl mx-auto">
            One profile that changes how you see your career.
          </p>
          <p className="text-lg sm:text-xl text-[#9ca3af] mb-8 max-w-xl mx-auto">
            Find out where you truly belong in hospitality.
          </p>

          {/* Archetype icons above CTA */}
          <div className="flex items-center justify-center gap-6 sm:gap-10 mb-8">
            {archetypePreviews.map((a, idx) => (
              <motion.div
                key={a.name}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + idx * 0.12, duration: 0.4 }}
                className="flex flex-col items-center"
              >
                <span className="text-5xl sm:text-6xl mb-1">{a.emoji}</span>
                <span className="text-xs sm:text-sm font-semibold text-foreground">{a.name}</span>
              </motion.div>
            ))}
          </div>

          <Button
            size="lg"
            onClick={handleStart}
            className="text-lg px-10 py-7 rounded-xl font-bold animate-pulse-gold"
          >
            Start Your DNA Discovery →
          </Button>

          <p className="text-sm text-muted-foreground/70 mt-4">
            Free. No sign-up to start. Your first result in 3 minutes.
          </p>
        </motion.div>
      </section>

      {/* SECTION 2: STAT CARDS */}
      <section className="px-4 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto"
        >
          {[
            { number: "23", label: "Dimensions Measured", sub: "Cognitive, personality, EQ, reliability & more" },
            { number: "6", label: "Sectors Matched", sub: "From boutique hotels to cruise lines" },
            { number: "8", label: "Departments Ranked", sub: "Find your perfect department fit" },
          ].map((stat) => (
            <div key={stat.number} className="glass-card p-6 text-center border border-[#1a2332]">
              <div className="text-4xl font-extrabold text-[#f59e0b] mb-1">{stat.number}</div>
              <div className="text-sm font-semibold text-foreground mb-1">{stat.label}</div>
              <div className="text-xs text-[#9ca3af]">{stat.sub}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* SECTION 3: ARCHETYPE PREVIEW CARDS */}
      <section className="px-4 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-center mb-8">
            Three Tribes. Which One Are You?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {archetypePreviews.map((a, idx) => (
              <motion.div
                key={a.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + idx * 0.15, duration: 0.4 }}
                className="glass-card p-6 text-center hover:scale-105 transition-transform duration-300"
              >
                <div className="text-5xl mb-3">{a.emoji}</div>
                <h3 className="font-bold text-lg text-foreground mb-1">{a.name}</h3>
                <p className="text-sm text-primary font-medium mb-2">{a.tagline}</p>
                <p className="text-xs text-muted-foreground">{a.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* SECTION 4: HOW IT WORKS */}
      <section className="px-4 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-center mb-8">
            How It Works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { step: "1", title: "Choose Your Path", desc: "Entry, Experienced, or Executive — the assessment adapts to your career stage." },
              { step: "2", title: "Answer in Chapters", desc: "6 named chapters, each unlocking new insights about yourself. Stop anytime with value." },
              { step: "3", title: "Get Your DNA Profile", desc: "Archetype, sector matches, department ranking, career pathway — and a shareable DNA Card." },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-[#f59e0b] text-[#0f1729] flex items-center justify-center text-lg font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-[#9ca3af]">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* SECTION 5: SECOND CTA */}
      <section className="px-4 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center max-w-xl mx-auto"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">
            Ready to Discover Your DNA?
          </h2>
          <Button
            size="lg"
            onClick={handleStart}
            className="text-lg px-10 py-7 rounded-xl font-bold animate-pulse-gold"
          >
            Start Your DNA Assessment
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <p className="text-sm text-muted-foreground/70 mt-4">
            Takes 3–18 minutes depending on your path. Every chapter delivers a result.
          </p>
        </motion.div>
      </section>

      {/* SECTION 6: FOOTER */}
      <DynamicFooter />
    </div>
  );
};

export default Index;
