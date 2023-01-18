import { motion } from "framer-motion";
import { Inter } from "@next/font/google";
import clsx from "clsx";
import styles from "./Suggestions.module.css";

const inter = Inter({ subsets: ["latin"] });

export const Suggestions = ({ showingResult, className, onSelect }) => {
  const data = [
    {
      title: "Distribution",
      content:
        "what's the country distribution of global 500 companies in 2022?",
    },
    {
      title: "Cash Machine",
      content: "What are the top 10 companies by profit in 2022?",
    },
    {
      title: "Growth",
      content:
        "which 10 companies had the highest increase by profit from 2018 to 2022?",
    },
    {
      title: "Efficiency",
      content: "Top 10 companies generate the most profit with every employee?",
    },
  ];
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={clsx(
        styles.grid,
        showingResult && styles.withResult,
        className
      )}
    >
      {data.map((v) => (
        <a
          key={v.content}
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => onSelect?.(v.content)}
        >
          <h2 className={inter.className}>
            {v.title} <span>-&gt;</span>
          </h2>
          <p className={inter.className}>{v.content}</p>
        </a>
      ))}
    </motion.div>
  );
};
