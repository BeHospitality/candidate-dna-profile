import { motion } from "framer-motion";
import { useRef, type ReactNode } from "react";

interface ScrollRevealSectionProps {
  children: ReactNode;
  className?: string;
}

const ScrollRevealSection = ({ children, className = "" }: ScrollRevealSectionProps) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.5, ease: "easeOut" }}
    className={className}
  >
    {children}
  </motion.div>
);

export default ScrollRevealSection;
