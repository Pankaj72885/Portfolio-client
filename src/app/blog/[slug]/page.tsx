"use client";

import { LoginModal } from "@/components/auth/login-modal";
import { Header } from "@/components/layout/header";
import { QueryProvider } from "@/components/providers/query-provider";
import { Footer } from "@/components/sections/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { blogApi, profileApi } from "@/lib/api";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Heart,
  Loader2,
  LogIn,
  MessageSquare,
  Send,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    name?: string;
    photoUrl?: string;
  };
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  tags?: string[];
  readTime?: number;
  createdAt: string;
  comments: Comment[];
  _count: { likes: number };
}

function BlogPostContent() {
  const params = useParams();
  const slug = params.slug as string;
  const queryClient = useQueryClient();
  const { user, loading: authLoading } = useAuth();
  const [commentText, setCommentText] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);

  const isLoggedIn = !!user;

  const { data, isLoading } = useQuery({
    queryKey: ["blog-post", slug],
    queryFn: async () => {
      const response = await blogApi.get(slug);
      return {
        post: response.data.post as BlogPost,
        userLiked: response.data.userLiked as boolean,
      };
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

  const likeMutation = useMutation({
    mutationFn: () => blogApi.like(data?.post.id || ""),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-post", slug] });
    },
  });

  const commentMutation = useMutation({
    mutationFn: (content: string) =>
      blogApi.addComment(data?.post.id || "", content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-post", slug] });
      setCommentText("");
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: string) =>
      blogApi.deleteComment(data?.post.id || "", commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-post", slug] });
    },
  });

  const handleLike = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    likeMutation.mutate();
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    if (commentText.trim()) {
      commentMutation.mutate(commentText);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatCommentDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatDate(dateStr);
  };

  if (isLoading || authLoading) {
    return (
      <div className="min-h-screen bg-slate-950">
        <Header />
        <main className="pt-24 pb-16">
          <div className="mx-auto max-w-3xl px-6">
            <Skeleton className="h-8 w-3/4 bg-slate-800 mb-4" />
            <Skeleton className="h-4 w-1/2 bg-slate-800 mb-8" />
            <Skeleton className="h-64 w-full bg-slate-800 rounded-xl mb-8" />
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-4 w-full bg-slate-800" />
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!data?.post) {
    return (
      <div className="min-h-screen bg-slate-950">
        <Header />
        <main className="pt-24 pb-16">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h1 className="text-2xl font-bold text-white">Post not found</h1>
            <Link
              href="/blog"
              className="mt-4 inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const { post, userLiked } = data;

  return (
    <div className="min-h-screen bg-slate-950">
      <Header />
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />

      <main className="pt-24 pb-16">
        <article className="mx-auto max-w-3xl px-6">
          {/* Back Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </Link>
          </motion.div>

          {/* Title */}
          <motion.h1
            className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {post.title}
          </motion.h1>

          {/* Meta */}
          <motion.div
            className="mt-6 flex flex-wrap items-center gap-4 text-sm text-slate-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
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
          </motion.div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <motion.div
              className="mt-4 flex flex-wrap gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-indigo-500/10 px-3 py-1 text-sm text-indigo-400"
                >
                  #{tag}
                </span>
              ))}
            </motion.div>
          )}

          {/* Cover Image */}
          {post.coverImage && (
            <motion.div
              className="mt-8 overflow-hidden rounded-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full object-cover"
              />
            </motion.div>
          )}

          {/* Content */}
          <motion.div
            className="prose prose-invert prose-lg max-w-none mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="whitespace-pre-wrap text-slate-300 leading-relaxed">
              {post.content}
            </div>
          </motion.div>

          {/* Like & Share */}
          <motion.div
            className="mt-12 flex items-center gap-4 pt-8 border-t border-slate-800"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Button
              variant="outline"
              onClick={handleLike}
              disabled={likeMutation.isPending}
              className={`border-slate-700 ${
                userLiked
                  ? "bg-red-500/10 text-red-400 border-red-500/50"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {likeMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Heart
                  className={`mr-2 h-4 w-4 ${userLiked ? "fill-current" : ""}`}
                />
              )}
              {post._count.likes} {post._count.likes === 1 ? "Like" : "Likes"}
            </Button>
            {!isLoggedIn && (
              <button
                onClick={() => setShowLoginModal(true)}
                className="flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300"
              >
                <LogIn className="h-4 w-4" />
                Login to like & comment
              </button>
            )}
          </motion.div>

          {/* Comments Section */}
          <motion.div
            className="mt-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h2 className="flex items-center gap-2 text-2xl font-semibold text-white">
              <MessageSquare className="h-6 w-6 text-indigo-400" />
              Comments ({post.comments.length})
            </h2>

            {/* Comment Form */}
            <form onSubmit={handleSubmitComment} className="mt-6">
              <div className="flex gap-3">
                <Input
                  placeholder={
                    isLoggedIn
                      ? "Write a comment..."
                      : "Login to write a comment"
                  }
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onClick={() => !isLoggedIn && setShowLoginModal(true)}
                  className="border-slate-700 bg-slate-900 text-white placeholder:text-slate-500"
                />
                <Button
                  type="submit"
                  disabled={!commentText.trim() || commentMutation.isPending}
                  className="bg-indigo-600 hover:bg-indigo-700 shrink-0"
                >
                  {commentMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </form>

            {/* Comments List */}
            <div className="mt-8 space-y-6">
              {post.comments.length === 0 ? (
                <p className="text-slate-500 text-center py-8">
                  No comments yet. Be the first to comment!
                </p>
              ) : (
                post.comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="rounded-xl border border-slate-800 bg-slate-900/50 p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600">
                          {comment.user.photoUrl ? (
                            <img
                              src={comment.user.photoUrl}
                              alt={comment.user.name || "User"}
                              className="h-full w-full rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-sm font-medium text-white">
                              {(comment.user.name || "U")
                                .charAt(0)
                                .toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-white">
                            {comment.user.name || "Anonymous"}
                          </p>
                          <p className="text-xs text-slate-500">
                            {formatCommentDate(comment.createdAt)}
                          </p>
                        </div>
                      </div>
                      {user && comment.user.id === user.uid && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            deleteCommentMutation.mutate(comment.id)
                          }
                          className="h-8 w-8 text-slate-500 hover:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <p className="mt-3 text-slate-300">{comment.content}</p>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </article>
      </main>

      <Footer name={profile?.name} socialLinks={profile?.socialLinks} />
    </div>
  );
}

export default function BlogPostPage() {
  return (
    <QueryProvider>
      <AuthProvider>
        <BlogPostContent />
      </AuthProvider>
    </QueryProvider>
  );
}
