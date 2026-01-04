"use client";

import { Header } from "@/components/layout/header";
import { QueryProvider } from "@/components/providers/query-provider";
import { Footer } from "@/components/sections/footer";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { blogApi, profileApi } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  Heart,
  MessageSquare,
  Search,
  Tag,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  coverImage?: string;
  tags?: string[];
  readTime?: number;
  published: boolean;
  createdAt: string;
  _count?: { likes: number; comments: number };
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

function BlogListContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const { data: posts, isLoading } = useQuery({
    queryKey: ["blog-posts", selectedTag],
    queryFn: async () => {
      const response = await blogApi.getAll(selectedTag || undefined);
      return response.data.posts as BlogPost[];
    },
  });

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      try {
        const response = await profileApi.get();
        return response.data.profile;
      } catch {
        return null;
      }
    },
  });

  // Get all unique tags
  const allTags =
    posts?.reduce((acc, post) => {
      post.tags?.forEach((tag) => {
        if (!acc.includes(tag)) acc.push(tag);
      });
      return acc;
    }, [] as string[]) || [];

  // Filter posts by search query
  const filteredPosts =
    posts?.filter(
      (post) =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <Header />

      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-5xl px-6">
          {/* Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold text-white sm:text-5xl">Blog</h1>
            <p className="mt-4 text-lg text-slate-400">
              Thoughts, tutorials, and insights about web development
            </p>
          </motion.div>

          {/* Search & Filter */}
          <motion.div
            className="mb-12 space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
              <Input
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-slate-800 bg-slate-900 pl-12 text-white placeholder:text-slate-500"
              />
            </div>

            {/* Tags */}
            {allTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedTag(null)}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition-colors ${
                    selectedTag === null
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  All
                </button>
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() =>
                      setSelectedTag(tag === selectedTag ? null : tag)
                    }
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition-colors ${
                      selectedTag === tag
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    <Tag className="h-3 w-3" />
                    {tag}
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Posts List */}
          {isLoading ? (
            <div className="space-y-8">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex gap-6 rounded-2xl border border-slate-800 bg-slate-900/50 p-6"
                >
                  <Skeleton className="h-40 w-40 shrink-0 rounded-lg bg-slate-800" />
                  <div className="flex-1 space-y-3">
                    <Skeleton className="h-6 w-3/4 bg-slate-800" />
                    <Skeleton className="h-4 w-full bg-slate-800" />
                    <Skeleton className="h-4 w-2/3 bg-slate-800" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <motion.div
              className="space-y-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredPosts.map((post) => (
                <motion.article
                  key={post.id}
                  variants={itemVariants}
                  className="group"
                >
                  <Link
                    href={`/blog/${post.slug}`}
                    className="flex flex-col gap-6 rounded-2xl border border-slate-800 bg-slate-900/50 p-6 transition-all hover:border-indigo-500/50 hover:bg-slate-900/80 sm:flex-row"
                  >
                    {/* Image */}
                    <div className="relative h-48 w-full shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 sm:h-40 sm:w-40">
                      {post.coverImage ? (
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <span className="text-4xl font-bold text-indigo-500/30">
                            {post.title.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold text-white group-hover:text-indigo-400 transition-colors">
                        {post.title}
                      </h2>
                      {post.excerpt && (
                        <p className="mt-2 text-slate-400 line-clamp-2">
                          {post.excerpt}
                        </p>
                      )}

                      {/* Meta */}
                      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(post.createdAt)}
                        </span>
                        {post.readTime && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {post.readTime} min read
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          {post._count?.likes || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          {post._count?.comments || 0}
                        </span>
                      </div>

                      {/* Tags */}
                      {post.tags && post.tags.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {post.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-400"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </Link>
                </motion.article>
              ))}
            </motion.div>
          )}

          {!isLoading && filteredPosts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-lg text-slate-400">
                {searchQuery
                  ? "No posts found matching your search"
                  : "No blog posts yet"}
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer name={profile?.name} socialLinks={profile?.socialLinks} />
    </div>
  );
}

export default function BlogPage() {
  return (
    <QueryProvider>
      <BlogListContent />
    </QueryProvider>
  );
}
