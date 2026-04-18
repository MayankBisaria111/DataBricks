import { ReactNode } from "react";
import { motion } from "framer-motion";

type CardProps = {
  title?: string;
  children?: ReactNode;
  className?: string;
};

export default function Card({ title, children, className = "" }: CardProps) {
  return (
    <motion.section
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`rounded-3xl border border-white/70 bg-white/80 p-5 shadow-[0_10px_40px_rgba(15,23,42,0.08)] backdrop-blur ${className}`}
    >
      {title ? <h3 className="mb-3 text-sm font-semibold text-slate-700">{title}</h3> : null}
      {children}
    </motion.section>
  );
}
