import { Button, createStyles } from "@mantine/core";
import Link from "next/link"

const useStyles = createStyles(() => ({
  root: {
    marginLeft: 60,
  },
  text: {
    color: '#666666',
    fontSize: 16,
    marginBottom: 18,
 },
  title: {
    color: '#333333',
    fontSize: 24,
    marginBottom: 18,
  },
}));

export const UploadBlock = ({ showingResult }) => {
  const { classes } = useStyles();
  return (
    <div className={classes.root} style={showingResult ? { marginLeft: 0 } : {}}>
      <div className={classes.title}>Explore</div>
      <div className={classes.text}>
        {showingResult ? "Changed another dataset?" : "Try your own data?"}
      </div>
      <div>
        <Link href="/">
          <Button variant="light">Explore your own data</Button>
        </Link>
      </div>
    </div>
  );
};
