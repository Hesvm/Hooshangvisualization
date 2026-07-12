export type ConfidenceLevel = "confirmed" | "inferred" | "weak";

export type IntelligenceCategory =
  | "kharid"
  | "kalaha"
  | "mali"
  | "salamat"
  | "sabkeZendegi"
  | "makanha"
  | "amoozesh"
  | "dastgahha"
  | "appHayeMotasel"
  | "servisha"
  | "ravabet"
  | "goftogooha"
  | "tarjihat"
  | "risk"
  | "ahdaf";

export type IntelligenceNode = {
  id: string;
  kind: "category" | "leaf";
  category: IntelligenceCategory;
  label: string;
  confidence: ConfidenceLevel;
  confidenceScore: number; // 0-100
  summary: string;
  evidence: string[];
  lastUpdated: string; // pre-formatted relative Persian string
  aiRecommendation?: string;
  relatedNodeIds?: string[];
  imageUrl?: string;
};

export type IntelligenceEdge = {
  id: string;
  source: string; // node id
  target: string; // node id
  strength: number; // 0-1, drives stroke width
};

export type UserProfile = {
  id: string;
  name: string;
  avatarUrl: string;
  statusLine: string; // e.g. "۳ گفتگوی فعال"
  nodes: IntelligenceNode[];
  edges: IntelligenceEdge[];
};
