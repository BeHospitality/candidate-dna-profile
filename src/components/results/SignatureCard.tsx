import { motion } from "framer-motion";
import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { SignatureCombination } from "@/data/signatureCombinations";

interface SignatureCardProps {
  combination: SignatureCombination;
}

const SignatureCard = ({ combination }: SignatureCardProps) => {
  const { toast } = useToast();

  const handleShare = async () => {
    const text = `I just found out I'm ${combination.name} — ${combination.tagline}.\nDiscover your hospitality DNA at be-connect-dna.lovable.app`;

    if (navigator.share) {
      try {
        await navigator.share({ text });
        return;
      } catch {
        // Fall through to clipboard
      }
    }

    await navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: "Share text copied to clipboard." });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="rounded-xl border-l-4 border-l-primary p-6 space-y-4"
      style={{ background: "hsl(var(--card))" }}
    >
      <p className="text-[11px] font-bold text-primary uppercase tracking-widest">
        YOUR SIGNATURE
      </p>

      <h3 className="text-2xl sm:text-[28px] font-bold text-foreground leading-tight">
        {combination.name}
      </h3>

      <p className="text-base italic text-primary">{combination.tagline}</p>

      <p className="text-[15px] text-muted-foreground leading-relaxed">
        {combination.description}
      </p>

      <div
        className="rounded-lg p-3 border-l-2"
        style={{
          background: "rgba(255,255,255,0.04)",
          borderColor: "hsl(var(--primary) / 0.4)",
        }}
      >
        <p className="text-sm text-foreground">
          <span className="text-primary font-medium">Teams need you because </span>
          {combination.teams_need_you}
        </p>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={handleShare}
        className="rounded-lg border-primary/40 text-primary hover:bg-primary/10"
      >
        <Share2 className="w-4 h-4 mr-2" />
        Share your signature →
      </Button>
    </motion.div>
  );
};

export default SignatureCard;
