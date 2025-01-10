import { classed } from "@tw-classed/react";
import styles from "./Details.module.css";

export const Details = classed.details(styles.root!);
export const Summary = classed.summary(styles.summary!);

export const DetailsContent = classed.div(styles.content!);
