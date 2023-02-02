import { createStyles } from "@mantine/core";
import { Logo } from "@/components/Logo";
import { config } from "@/config";

const useStyles = createStyles({
  root: {
    marginBottom: 24,
  },
  slogan: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    fontWeight: 700,
    fontSize: 24,
    cursor: "pointer",

    "@media (max-width: 700px)": {
      fontSize: 18,
    },

    "@media (max-width: 389px)": {
      fontSize: 16,
    },
  },
});

export const BrandSection = ({ onClick }) => {
  const { classes } = useStyles();
  return (
    <div className={classes.root}>
      <p className={classes.slogan} onClick={onClick}>
        <Logo />
        <span>{config.title}</span>
      </p>
    </div>
  );
};
