"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import ReactDOMServer from "react-dom/server";
import ForceGraph2D, { type ForceGraphMethods, type NodeObject } from "react-force-graph-2d";
import type { IntelligenceCategory, UserProfile } from "@/types/intelligence";
import { computeGraph, type GraphNode, type GraphLink } from "@/lib/intelligenceLayout";
import { CATEGORY_ACCENT_RGB, CATEGORY_ICONS } from "@/config/intelligenceColors";
import styles from "./IntelligenceGraph.module.css";

type IntelligenceGraphProps = {
  profile: UserProfile;
  activeCategories: "all" | ReadonlySet<IntelligenceCategory>;
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string) => void;
};

type GNode = NodeObject<GraphNode>;
type GLink = Omit<GraphLink, "source" | "target"> & { source: string | GNode; target: string | GNode };

const INK = "233, 237, 241";
const OUTLINE = "255, 255, 255";

function resolveId(ref: string | number | GNode | undefined): string {
  if (ref && typeof ref === "object") return String(ref.id);
  return String(ref);
}

function nodeRadius(node: GraphNode, degree: number): number {
  if (node.kind === "center") return 11 + Math.sqrt(degree) * 0.8;
  if (node.kind === "category") return 5 + Math.sqrt(degree) * 1.6;
  if (node.kind === "leaf" && node.imageUrl) return 4.5;
  return 3.2;
}

const DOT_SPACING = 34;
const BLUR_STRENGTH = 15;

function confidenceDash(confidence: GraphLink["confidence"]): number[] {
  if (confidence === "confirmed") return [];
  if (confidence === "inferred") return [4, 2];
  return [1, 2];
}

function clamp01(v: number): number {
  return Math.min(1, Math.max(0, v));
}

function hashUnit(id: string): number {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 10000) / 10000;
}

function nodeDepth(node: GraphNode): number {
  if (node.kind === "center") return 0;
  if (node.kind === "category") return 0.08 + hashUnit(node.id) * 0.12;
  return 0.25 + hashUnit(node.id) * 0.75;
}

const ZOOM_DEPTH_RANGE = 4;

export function IntelligenceGraph({
  profile,
  activeCategories,
  selectedNodeId,
  onSelectNode,
}: IntelligenceGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const fgRef = useRef<ForceGraphMethods<GraphNode, GraphLink> | undefined>(undefined);
  const avatarCache = useRef<Map<string, HTMLImageElement>>(new Map());
  const iconCache = useRef<Map<IntelligenceCategory, HTMLImageElement>>(new Map());
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [hoverNodeId, setHoverNodeId] = useState<string | null>(null);

  const { nodes, links } = useMemo(() => {
    const graph = computeGraph(profile, activeCategories);
    const sortedNodes = [...graph.nodes].sort(
      (a, b) => nodeDepth(b) - nodeDepth(a)
    );
    return { nodes: sortedNodes, links: graph.links };
  }, [profile, activeCategories]);

  const degreeById = useMemo(() => {
    const map = new Map<string, number>();
    links.forEach((link) => {
      map.set(link.source, (map.get(link.source) ?? 0) + 1);
      map.set(link.target, (map.get(link.target) ?? 0) + 1);
    });
    return map;
  }, [links]);

  const neighborsById = useMemo(() => {
    const map = new Map<string, Set<string>>();
    nodes.forEach((n) => map.set(n.id, new Set([n.id])));
    links.forEach((link) => {
      map.get(link.source)?.add(link.target);
      map.get(link.target)?.add(link.source);
    });
    return map;
  }, [nodes, links]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      setSize({ width: entry.contentRect.width, height: entry.contentRect.height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const fg = fgRef.current;
    if (!fg) return;
    fg.d3Force("charge")?.strength(-140);
    fg.d3Force("link")?.distance((link: GLink) => {
      const sourceKind = typeof link.source === "object" ? link.source.kind : undefined;
      return sourceKind === "center" ? 90 : 26;
    });
    fg.d3ReheatSimulation();
  }, [nodes]);

  const pendingFitRef = useRef(false);
  const baseScaleRef = useRef(1);
  useEffect(() => {
    pendingFitRef.current = true;
  }, [profile.id]);

  function getAvatarImage(url: string): HTMLImageElement {
    let img = avatarCache.current.get(url);
    if (!img) {
      img = new window.Image();
      img.src = url;
      avatarCache.current.set(url, img);
    }
    return img;
  }

  function getIconImage(category: IntelligenceCategory): HTMLImageElement {
    let img = iconCache.current.get(category);
    if (!img) {
      const Icon = CATEGORY_ICONS[category];
      const svg = ReactDOMServer.renderToStaticMarkup(
        <Icon variant="Bold" size={24} color="#ffffff" />
      );
      img = new window.Image();
      img.src = `data:image/svg+xml;base64,${btoa(svg)}`;
      iconCache.current.set(category, img);
    }
    return img;
  }

  return (
    <div className={styles.canvas} ref={containerRef}>
      {size.width > 0 && size.height > 0 && (
        <ForceGraph2D<GraphNode, GraphLink>
          ref={fgRef}
          width={size.width}
          height={size.height}
          graphData={{ nodes, links }}
          nodeId="id"
          backgroundColor="rgba(0,0,0,0)"
          nodeRelSize={4}
          onRenderFramePre={(ctx) => {
            const t = ctx.getTransform();
            const inv = t.inverse();
            const topLeft = inv.transformPoint({ x: 0, y: 0 });
            const bottomRight = inv.transformPoint({ x: size.width, y: size.height });
            const startX = Math.floor(topLeft.x / DOT_SPACING) * DOT_SPACING;
            const startY = Math.floor(topLeft.y / DOT_SPACING) * DOT_SPACING;
            const dotRadius = 1.4 / Math.max(t.a, 0.35);
            ctx.save();
            ctx.fillStyle = `rgba(${OUTLINE}, 0.16)`;
            for (let gx = startX; gx <= bottomRight.x; gx += DOT_SPACING) {
              for (let gy = startY; gy <= bottomRight.y; gy += DOT_SPACING) {
                ctx.beginPath();
                ctx.arc(gx, gy, dotRadius, 0, Math.PI * 2);
                ctx.fill();
              }
            }
            ctx.restore();
          }}
          cooldownTime={5000}
          d3AlphaDecay={0.02}
          d3VelocityDecay={0.35}
          warmupTicks={60}
          onEngineStop={() => {
            if (pendingFitRef.current) {
              pendingFitRef.current = false;
              fgRef.current?.zoomToFit(400, 80);
              window.setTimeout(() => {
                baseScaleRef.current = fgRef.current?.zoom() ?? baseScaleRef.current;
              }, 450);
            }
          }}
          enableNodeDrag
          onNodeClick={(node) => {
            if (node.kind === "center") return;
            onSelectNode(node.nodeId);
          }}
          onNodeHover={(node) => setHoverNodeId(node ? node.id : null)}
          nodeCanvasObjectMode={() => "replace"}
          nodeCanvasObject={(node, ctx, globalScale) => {
            const x = node.x ?? 0;
            const y = node.y ?? 0;
            const degree = degreeById.get(node.id) ?? 0;
            const r = nodeRadius(node, degree);
            const dimmed = hoverNodeId !== null && !neighborsById.get(hoverNodeId)?.has(node.id);
            const isSelected = node.kind !== "center" && selectedNodeId === node.nodeId;

            ctx.save();
            ctx.globalAlpha = dimmed ? 0.25 : 1;

            if (node.kind === "center") {
              const img = getAvatarImage(node.profile.avatarUrl);
              ctx.beginPath();
              ctx.arc(x, y, r, 0, Math.PI * 2);
              ctx.closePath();
              if (img.complete && img.naturalWidth > 0) {
                ctx.save();
                ctx.clip();
                ctx.drawImage(img, x - r, y - r, r * 2, r * 2);
                ctx.restore();
              } else {
                ctx.fillStyle = "#ffffff";
                ctx.fill();
              }
              ctx.lineWidth = 1.5;
              ctx.strokeStyle = `rgba(${OUTLINE}, 0.14)`;
              ctx.stroke();
              ctx.restore();
              return;
            }

            const accent = CATEGORY_ACCENT_RGB[node.category];
            const fillAlpha =
              node.confidence === "confirmed" ? 0.92 : node.confidence === "inferred" ? 0.72 : 0.48;

            const showProductImage = node.kind === "leaf" && !!node.imageUrl && globalScale > 2.5;
            const productImg = showProductImage ? getAvatarImage(node.imageUrl as string) : null;

            const depth = nodeDepth(node);
            const zoomProgress = clamp01((globalScale - baseScaleRef.current) / ZOOM_DEPTH_RANGE);
            const isFocused = hoverNodeId === node.id || isSelected || showProductImage;
            const focusDiff =
              isFocused || node.kind !== "leaf" ? 0 : Math.max(0, zoomProgress - depth);
            const blurWorld = Math.min(9, focusDiff * BLUR_STRENGTH);
            const perspectiveScale = node.kind === "leaf" ? 1.3 - depth * 0.55 : 1;
            const depthAlpha = 1 - Math.min(0.45, focusDiff * 0.55);
            const dr = r * perspectiveScale;

            ctx.globalAlpha = (dimmed ? 0.25 : 1) * depthAlpha;
            if (blurWorld > 0.4) {
              ctx.filter = `blur(${blurWorld.toFixed(1)}px)`;
            }

            ctx.beginPath();
            ctx.arc(x, y, dr, 0, Math.PI * 2);
            if (productImg && productImg.complete && productImg.naturalWidth > 0) {
              ctx.save();
              ctx.clip();
              ctx.drawImage(productImg, x - dr, y - dr, dr * 2, dr * 2);
              ctx.restore();
            } else {
              ctx.fillStyle = `rgba(${accent}, ${fillAlpha})`;
              ctx.fill();
            }
            ctx.beginPath();
            ctx.arc(x, y, dr, 0, Math.PI * 2);
            ctx.setLineDash(confidenceDash(node.confidence).map((v) => v / Math.max(globalScale, 0.6)));
            ctx.lineWidth = isSelected ? 2.5 : 1.25;
            ctx.strokeStyle = isSelected ? `rgb(${accent})` : `rgba(${INK}, 0.2)`;
            ctx.stroke();
            ctx.setLineDash([]);

            ctx.filter = "none";

            if (node.kind === "category") {
              const icon = getIconImage(node.category);
              if (icon.complete && icon.naturalWidth > 0) {
                const iconSize = dr * 1.1;
                ctx.drawImage(icon, x - iconSize / 2, y - iconSize / 2, iconSize, iconSize);
              }
            }

            const showLabel =
              node.kind === "category" || hoverNodeId === node.id || isSelected || globalScale > 2.2;

            if (showLabel) {
              const fontSize = node.kind === "category" ? 3.6 : 3;
              ctx.font = `${node.kind === "category" ? 600 : 500} ${fontSize}px Ravi, sans-serif`;
              ctx.textAlign = "center";
              ctx.textBaseline = "top";
              ctx.fillStyle = `rgba(${INK}, ${dimmed ? 0.35 : 0.85 * depthAlpha})`;
              ctx.fillText(node.label, x, y + dr + 1.5);
            }

            ctx.restore();
          }}
          nodePointerAreaPaint={(node, color, ctx) => {
            const x = node.x ?? 0;
            const y = node.y ?? 0;
            const degree = degreeById.get(node.id) ?? 0;
            const r = nodeRadius(node, degree);
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(x, y, r + 3, 0, Math.PI * 2);
            ctx.fill();
          }}
          linkColor={(link) => {
            const l = link as unknown as GLink;
            const sourceId = resolveId(l.source);
            const targetId = resolveId(l.target);
            const dimmed =
              hoverNodeId !== null &&
              !(neighborsById.get(hoverNodeId)?.has(sourceId) && neighborsById.get(hoverNodeId)?.has(targetId));
            if (l.kind === "related") {
              return `rgba(${CATEGORY_ACCENT_RGB[l.category]}, ${dimmed ? 0.04 : 0.16})`;
            }
            return `rgba(${CATEGORY_ACCENT_RGB[l.category]}, ${dimmed ? 0.08 : 0.4})`;
          }}
          linkWidth={(link) =>
            link.kind === "related" ? 0.5 : 0.6 + Math.max(0, Math.min(1, link.strength)) * 1.4
          }
          linkLineDash={(link) => {
            if (link.kind === "related") return [1, 3];
            const dash = confidenceDash(link.confidence);
            return dash.length ? dash : null;
          }}
          linkDirectionalParticles={(link) => (link.kind === "hierarchy" && link.confidence === "confirmed" ? 1 : 0)}
          linkDirectionalParticleWidth={1.4}
          linkDirectionalParticleSpeed={0.004}
          linkDirectionalParticleColor={(link) => `rgb(${CATEGORY_ACCENT_RGB[link.category]})`}
        />
      )}
    </div>
  );
}
