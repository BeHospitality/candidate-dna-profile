import { motion } from "framer-motion";
import type { RankingItem } from "@/data/questions";

interface RankingQuestionProps {
  items: RankingItem[];
  ranking: string[];
  onRank: (ranking: string[]) => void;
}

const RankingQuestion = ({ items, ranking, onRank }: RankingQuestionProps) => {
  const handleClick = (text: string) => {
    if (ranking.includes(text)) {
      onRank(ranking.filter((r) => r !== text));
    } else if (ranking.length < items.length) {
      onRank([...ranking, text]);
    }
  };

  const getRank = (text: string) => {
    const idx = ranking.indexOf(text);
    return idx === -1 ? null : idx + 1;
  };

  const rankLabels = ["1st", "2nd", "3rd", "4th"];

  return (
    <div className="flex flex-col gap-3 w-full max-w-lg mx-auto">
      <p className="text-sm text-muted-foreground text-center mb-2">
        Tap in order of importance (1st → {items.length === 4 ? '4th' : '3rd'})
      </p>
      {items.map((item, idx) => {
        const rank = getRank(item.text);
        return (
          <motion.button
            key={item.text}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.3 }}
            onClick={() => handleClick(item.text)}
            className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
              rank !== null
                ? "border-primary bg-primary/10 gold-border-glow"
                : "border-border bg-card hover:border-primary/40"
            }`}
          >
            <div className="flex items-center gap-3">
              <span
                className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold ${
                  rank !== null
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                {rank !== null ? rankLabels[rank - 1] : "—"}
              </span>
              <span className="font-medium text-foreground">{item.text}</span>
            </div>
          </motion.button>
        );
      })}
      {ranking.length > 0 && (
        <button
          onClick={() => onRank([])}
          className="text-sm text-muted-foreground hover:text-foreground mt-2 underline"
        >
          Reset ranking
        </button>
      )}
    </div>
  );
};

export default RankingQuestion;
