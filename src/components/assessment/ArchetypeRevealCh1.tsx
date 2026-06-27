import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { archetypeData } from "@/lib/archetypes";
import type { Archetype } from "@/lib/scoring";

interface Props {
  archetype: Archetype;
  onContinue: () => void;
}

/**
 * A/B treatment-only Chapter 1 archetype reveal. Only rendered when
 * the existing confidence gate (MIN_CH1_ANSWERS + MIN_ARCH_MARGIN) has
 * already passed in chapterInsight.ts. Never forces an archetype.
 */
const ArchetypeRevealCh1 = ({ archetype, onContinue }: Props) => {
  const data = archetypeData[archetype];
  return (
    <div className="min-h-screen bg-navy-radial flex flex-col items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="w-full max-w-md mx-auto rounded-3xl border border-border/60 bg-card/90 backdrop-blur p-6 sm:p-8 text-center shadow-xl"
      >
        <div className="text-6xl sm:text-7xl mb-4" aria-hidden="true">
          {data.emoji}
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
          You're a {data.name}
        </h2>
        <p className="mt-2 text-base sm:text-lg text-primary font-medium">
          {data.tagline}
        </p>

        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {data.traits.map((t) => (
            <span
              key={t}
              className="text-xs sm:text-sm px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20"
            >
              {t}
            </span>
          ))}
        </div>

        <p className="mt-6 text-sm text-muted-foreground italic">
          Early read — this can sharpen as you go.
        </p>
        <p className="mt-2 text-xs text-muted-foreground/80">
          There are no right or wrong answers. Stay honest, not strategic.
        </p>
        <p className="mt-1 text-xs text-muted-foreground/80">
          This does not decide whether you qualify for any programme.
        </p>

        <Button
          onClick={onContinue}
          size="lg"
          className="mt-7 w-full rounded-xl font-bold"
        >
          Keep going to unlock your full profile and your club matches
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </motion.div>
    </div>
  );
};

export default ArchetypeRevealCh1;
