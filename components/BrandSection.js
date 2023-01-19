import { createStyles } from "@mantine/core";
import { Logo } from "@/components/Logo";

const useStyles = createStyles({
  slogan: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    fontWeight: 700,
    fontSize: 24,
    marginBottom: 16,
    cursor: "pointer",

    "@media (max-width: 700px)": {
      fontSize: 18,
    },

    "@media (max-width: 389px)": {
      fontSize: 14,
    },
  },
});

export const BrandSection = ({ onClick }) => {
  const { classes } = useStyles();
  return (
    <p className={classes.slogan} onClick={onClick}>
      <Logo />
      <span>SmartChart - Instant Data Exploration</span>
    </p>
  );
};
