import { createStyles } from "@mantine/core";
import TitleWithLogo from "@/components/TitleWithLogo";

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
    fontSize: 38,
    cursor: "pointer",

    "@media (max-width: 700px)": {
      fontSize: 18,
    },

    "@media (max-width: 389px)": {
      fontSize: 16,
    },
  },
});

export const BrandSection: React.FC<{ onClick: () => void }> = ({
  onClick,
}) => {
  const { classes } = useStyles();
  return (
    <div className={classes.root}>
      <div className={classes.slogan} onClick={onClick}>
        <TitleWithLogo />
      </div>
    </div>
  );
};
