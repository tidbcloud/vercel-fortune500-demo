import { motion } from "framer-motion";
import { Inter } from "@next/font/google";
import clsx from "clsx";
import styles from "./Suggestions.module.css";

const inter = Inter({ subsets: ["latin"] });

export const Suggestions = ({ showingResult, className }) => {
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
      <a className={styles.card} target="_blank" rel="noopener noreferrer">
        <h2 className={inter.className}>
          Distribution <span>-&gt;</span>
        </h2>
        <p className={inter.className}>
          How many companies become global 500 from each country in 2022?
        </p>
      </a>

      <a className={styles.card} target="_blank" rel="noopener noreferrer">
        <h2 className={inter.className}>
          Cash Machine <span>-&gt;</span>
        </h2>
        <p className={inter.className}>
          What are the top 10 companies by profit in 2022?
        </p>
      </a>

      <a className={styles.card} target="_blank" rel="noopener noreferrer">
        <h2 className={inter.className}>
          Growth <span>-&gt;</span>
        </h2>
        <p className={inter.className}>
          which 10 companies had the highest increase by profit from 2018 to
          2022?
        </p>
      </a>

      <a className={styles.card} target="_blank" rel="noopener noreferrer">
        <h2 className={inter.className}>
          Efficiency <span>-&gt;</span>
        </h2>
        <p className={inter.className}>
          Top 10 companies generate the most profit with every employee?
        </p>
      </a>
    </motion.div>
  );
};
