import { motion } from "framer-motion";
import { IconArrowRight } from "@tabler/icons";
import clsx from "clsx";
import { DatasetSelect } from "@/components/DatasetSelect";
import styles from "./Suggestions.module.css";

const data = [
  {
    title: "Distribution",
    content: "What's the country distribution of global 500 companies in 2022?",
  },
  {
    title: "Profit",
    content: "What are the top 10 companies by profit in 2022?",
  },
  {
    title: "Growth",
    content:
      "Which 10 companies had the highest increase by profit from 2018 to 2022?",
  },
  {
    title: "Efficiency",
    content: "Top 10 companies generate the most profit with every employee?",
  },
];

export const Suggestions = ({ showingResult, className, onSelect }) => {
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
      {showingResult && <DatasetSelect className={styles.dataset} />}
      {data.map((v) => (
        <a
          key={v.content}
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => onSelect?.(v.content)}
        >
          <h2>
            {v.title} <IconArrowRight />
          </h2>
          <p>{v.content}</p>
        </a>
      ))}
    </motion.div>
  );
};
