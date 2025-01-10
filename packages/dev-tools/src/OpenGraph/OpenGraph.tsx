"use client";

import humanize from "humanize-string";
import { FileImageIcon, ImagesIcon, LinkIcon, TwitterIcon } from "lucide-react";
import type { Metadata } from "next";
import React, { memo, useEffect, useState } from "react";
import { Details, DetailsContent, Summary } from "../ui/Details";
import styles from "./OpenGraph.module.css";

import { classed } from "@tw-classed/react";
import { usePathname } from "next/navigation";
import * as TabsPrimitive from "../ui/Tabs";

const Tabs = TabsPrimitive.TabsRoot;
const TabsList = classed("div", styles.tabList!);
const TabTrigger = classed(TabsPrimitive.TabsTrigger, styles.tabTrigger!);
const Tab = classed(TabsPrimitive.Tab, styles.tab!);

const Description = classed("p", styles.description!);
const Title = classed("p", styles.title!);

export interface OpenGraphProps {}

function getLinkData(link: HTMLLinkElement) {
  return {
    href: link.href,
    rel: link.rel,
    type: link.type,
  };
}

export const OpenGraph = ({}: OpenGraphProps) => {
  const pathname = usePathname();
  const [metadata, setMetadata] = useState<Metadata | null>(null);

  useEffect(() => {
    const metatags = document.querySelectorAll("meta");

    const og = (Array.from(metatags) as Element[]).reduce((acc, meta) => {
      const property = meta.getAttribute("property");
      const name = meta.getAttribute("name");
      const content = meta.getAttribute("content");

      if (!content) return acc;

      if (property) {
        acc.append(property, content);
      }
      if (name) {
        acc.append(name, content);
      }

      return acc;
    }, new URLSearchParams());

    /**
     * OPENGRAPH
     */

    const openGraph: Metadata["openGraph"] = {};

    og.has("og:title") && (openGraph.title = og.get("og:title")!);
    og.has("og:description") &&
      (openGraph.description = og.get("og:description")!);
    og.has("og:locale") && (openGraph.locale = og.get("og:locale")!);
    og.has("og:site_name") && (openGraph.siteName = og.get("og:site_name")!);
    og.has("og:type") && ((openGraph as any).type = og.get("og:type")!);
    og.has("og:url") && (openGraph.url = og.get("og:url")!);
    og.has("og:image") && (openGraph.images = og.getAll("og:image"));

    /**
     * TWITTER
     */

    const twitter: Metadata["twitter"] = {};
    og.has("twitter:card") && ((twitter as any).card = og.get("twitter:card")!);
    og.has("twitter:site") && (twitter.site = og.get("twitter:site")!);
    og.has("twitter:title") && (twitter.title = og.get("twitter:title")!);
    og.has("twitter:description") &&
      (twitter.description = og.get("twitter:description")!);
    og.has("twitter:image") && (twitter.images = og.getAll("twitter:image"));

    /**
     * ALTERNATES
     */

    const alternates: Metadata["alternates"] = {};

    const canonicalLink = document.querySelector<HTMLLinkElement>(
      "link[rel=canonical]"
    );
    if (canonicalLink) {
      const data = getLinkData(canonicalLink);
      alternates.canonical = data.href;
    }

    const meta: Metadata = {
      title: document.title,
      openGraph,
      twitter,
      alternates,
    };

    setMetadata(meta);
  }, [pathname]);

  const ogImages = metadata?.openGraph?.images;
  const twitterImages = metadata?.twitter?.images;

  const firstOgImage = Array.isArray(ogImages) ? ogImages[0] : ogImages;
  const firstTwitterImage = Array.isArray(twitterImages)
    ? twitterImages[0]
    : twitterImages;

  if (!metadata) return;

  return (
    <div className={styles.root}>
      <div style={{ flexGrow: 1 }}>
        {metadata && <Traverse object={metadata} name="Tags" />}
      </div>
      <div className={styles.tabs}>
        <Tabs defaultValue="Google">
          <TabsList>
            <TabTrigger value="Google">Google</TabTrigger>
            <TabTrigger value="OG">OpenGraph</TabTrigger>
            <TabTrigger value="Twitter">Twitter</TabTrigger>
          </TabsList>

          <Tab asChild value="Google">
            <article>
              {firstOgImage && (
                <img src={firstOgImage.toString()} className={styles.ogImage} />
              )}
              <Title>{String(metadata?.title)}</Title>
              <Description>
                {String(metadata?.openGraph?.description)}
              </Description>
            </article>
          </Tab>
          <Tab asChild value="OG">
            <article>
              {firstOgImage && (
                <img src={firstOgImage.toString()} className={styles.ogImage} />
              )}
              <Title>{String(metadata?.openGraph?.title)}</Title>
              <Description className={styles.description}>
                {String(metadata?.openGraph?.description || "missing")}
              </Description>
            </article>
          </Tab>
          <Tab asChild value="Twitter">
            <article>
              {firstTwitterImage && (
                <img
                  src={firstTwitterImage.toString()}
                  className={styles.ogImage}
                />
              )}
              <Title>{String(metadata?.twitter?.title)}</Title>
              <Description className={styles.description}>
                {String(metadata?.twitter?.description || "missing")}
              </Description>
            </article>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

type RecursiveKeys<T> = T extends object
  ? {
      [K in keyof T]: K | (T[K] extends object ? RecursiveKeys<T[K]> : never);
    }[keyof T]
  : never;

type X = RecursiveKeys<Metadata>;

const Icons: Partial<Record<Exclude<X, undefined>, React.ReactNode>> = {
  openGraph: <FileImageIcon />,
  twitter: <TwitterIcon />,
  ["images" as any]: <ImagesIcon />,
  alternates: <LinkIcon />,
};

const Traverse = memo(
  ({
    object,
    name,
    nested,
    nestedName,
    level = 0,
  }: {
    object: Record<string, any> | any[] | string | number;
    name?: string;
    nested?: boolean;
    nestedName?: string;
    open?: boolean;
    level?: number;
  }) => {
    if (Array.isArray(object)) {
      return (
        <Details open={level === 0} name={nestedName} data-nested={nested}>
          <Summary>
            {name && (Icons[name as keyof typeof Icons] || null)}
            {humanize(name || "Array")}
          </Summary>
          <DetailsContent>
            {object.map((item, index) => (
              <Traverse
                nested
                object={item}
                key={index}
                name={name}
                nestedName={name}
                level={level + 1}
              />
            ))}
          </DetailsContent>
        </Details>
      );
    }

    if (typeof object === "object") {
      return (
        <Details open={level === 0} name={nestedName} data-nested={nested}>
          <Summary>
            {name && (Icons[name as keyof typeof Icons] || null)}
            {humanize(name || "Object")}
          </Summary>
          <DetailsContent>
            {Object.entries(object).map(([key, value]) => (
              <Traverse
                level={level + 1}
                nested
                object={value}
                key={key}
                name={key}
                nestedName={name}
              />
            ))}
          </DetailsContent>
        </Details>
      );
    }

    if (typeof object === "string" || typeof object === "number") {
      if (typeof object === "string" && URL.canParse(object)) {
        return (
          <table className={styles.text}>
            <thead>
              <tr>
                <th style={{ width: "min(40px, 4vw)" }}></th>
                <th style={{ width: "100%" }}></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                {name && (
                  <td>
                    <code>{humanize(name)}</code>
                  </td>
                )}
                <td>
                  <a href={object} target="_blank">
                    <LinkIcon /> {object}
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        );
      }

      return (
        <table className={styles.text}>
          <thead>
            <tr>
              <th style={{ width: "min(40px, 4vw)" }}></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>{humanize(name ? name : "")}</code>
              </td>
              <td>
                <code>{object}</code>
              </td>
            </tr>
          </tbody>
        </table>
      );
    }

    return null;
  }
);
