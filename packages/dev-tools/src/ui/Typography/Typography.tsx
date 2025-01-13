import { classed } from "@tw-classed/react";
import styles from "./Typography.module.css";

export const Typography = classed("p", styles.root!, {
  variants: {
    variant: {
      title: styles.title!,
    },
  },
});
