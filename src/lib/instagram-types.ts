export type MediaType = "REELS" | "CAROUSEL_ALBUM" | "IMAGE" | "VIDEO" | string;

export interface Post {
  id: string;
  date: string; // YYYY-MM-DD
  type: MediaType;
  caption: string;
  permalink: string;
  mediaUrl: string;
  likes: number;
  comments: number;
  saved: number;
  shares: number;
  reach: number;
  engagement: number;
  videoViews: number;
  plays: number;
  engagementRate: number; // %
}
