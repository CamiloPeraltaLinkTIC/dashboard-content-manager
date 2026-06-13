"use client";

import postsData from "@/data/instagram-posts.json";
import type { Post } from "@/lib/instagram-types";
import { Dashboard } from "@/components/instagram/Dashboard";
import { Analyst } from "@/components/instagram/Analyst";

const posts = postsData as Post[];

export default function PerfilesActoresPage() {
  return (
    <div className="bg-[#03060d] min-h-screen">
      <Dashboard posts={posts} account="actoreselectorales" />
      <Analyst />
    </div>
  );
}
