"use client";

import { useReportWebVitals } from "next/web-vitals";
import { useEffect, useState } from "react";
import styles from "./Overview.module.css";
import { Card, CardContent, CardTitle } from "../ui/Card";
import { usePathname } from "next/navigation";
import { classed } from "@tw-classed/react";

type M = Parameters<Parameters<typeof useReportWebVitals>[0]>[0];

export const RenderPerformance = () => {
  const [metricMap, setMetricMap] = useState<Map<string, M>>(
    new Map<string, M>()
  );
  const voidableMetricsMap = new Map<string, M>();
  const pathname = usePathname();

  useEffect(() => {
    setMetricMap(new Map(voidableMetricsMap));
    const interval = setInterval(() => {
      setMetricMap(new Map(voidableMetricsMap));
    }, 2000);

    return () => clearInterval(interval);
  }, [pathname]);

  useReportWebVitals((metric) => {
    voidableMetricsMap.set(metric.name, metric);
  });

  const TTFB = metricMap.get("TTFB") as M;
  const FCP = metricMap.get("FCP");
  const FID = metricMap.get("FID");
  const LCP = metricMap.get("LCP");

  return (
    <div className={styles.cards}>
      {TTFB && (
        <Card>
          <CardTitle>{TTFB.name}</CardTitle>
          <CardContent>
            <p>{TTFB.value.toFixed(2)}</p>
            <Description>{TTFB.rating}</Description>
          </CardContent>
        </Card>
      )}
      {FCP && (
        <Card>
          <CardTitle>{FCP.name}</CardTitle>
          <CardContent>
            <p>{FCP.value.toFixed(2)}</p>
            <Description>{FCP.rating}</Description>
          </CardContent>
        </Card>
      )}
      {FID && (
        <Card>
          <CardTitle>{FID.name}</CardTitle>
          <CardContent>
            <p>{FID.value.toFixed(2)}</p>
            <Description>{FID.rating}</Description>
          </CardContent>
        </Card>
      )}
      {LCP && (
        <Card>
          <CardTitle>{LCP.name}</CardTitle>
          <CardContent>
            <p>{LCP.value.toFixed(2)}</p>
            <Description>{LCP.rating}</Description>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const Description = classed("p", styles.description!);
