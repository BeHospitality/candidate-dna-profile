import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import type { MicroRewardContent } from "@/utils/microRewardEngine";

interface MicroRewardProps {
  content: MicroRewardContent;
  onDismiss: () => void;
}

const MicroReward = ({ content, onDismiss }: MicroRewardProps) => {
  const [showTapHint, setShowTapHint] = useState(false);

  useEffect(() => {
    const hintTimer = setTimeout(() => setShowTapHint(true), 1000);
    const autoTimer = setTimeout(() => onDismiss(), 2800);
    return () => {
      clearTimeout(hintTimer);
      clearTimeout(autoTimer);
    };
  }, [onDismiss]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onDismiss}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center cursor-pointer"
      style={{
        background: `
          radial-gradient(circle at 50% 40%, rgba(245,158,11,0.15) 0%, transparent 60%),
          rgba(15, 23, 41, 0.97)
        `,
      }}
    >
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-[11px] font-bold text-primary uppercase tracking-widest mb-6"
      >
        INSIGHT UNLOCKED
      </motion.p>

      <motion.div
        initial={{ scale: 0.3 }}
        animate={{ scale: [0.3, 1.15, 1.0] }}
        transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
        className="text-7xl mb-6"
      >
        {content.emoji}
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="text-[22px] font-bold text-foreground text-center px-8 mb-2"
      >
        {content.insight}
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="text-[15px] text-muted-foreground text-center px-8"
      >
        {content.sublabel}
      </motion.p>

      <AnimatePresence>
        {showTapHint && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-12 text-xs text-primary"
          >
            tap to continue →
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MicroReward;
