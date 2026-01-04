"use client";

import { useState } from "react";
import { AdminHeader } from "@/components/admin/admin-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Pencil, Trash2, FileText, Eye, EyeOff, MessageSquare, Heart } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { blogApi } from "@/lib/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const blogSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  excerpt: z.string().optional(),
  content: z.string().min(50, "Content must be at least 50 characters"),
  coverImage: z.string().optional(),
  tags: z.string().optional(),
  published: z.boolean().optional(),
});

type BlogFormData = z.infer<typeof blogSchema>;

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  coverImage?: string;
  tags?: string[];
  published: boolean;
  readTime?: number;
  createdAt: string;
  _count?: { likes: number; comments: number };
}

export default function BlogPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const queryClient = useQueryClient();

  const form = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      coverImage: "",
      tags: "",
      published: false,
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: ["blog-admin"],
    queryFn: async () => {
      const response = await blogApi.getAllAdmin();
      return response.data.posts as BlogPost[];
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: BlogFormData) => {
      const payload = {
        ...data,
        tags: data.tags?.split(",").map((t) => t.trim()).filter(Boolean) || [],
      };
      return blogApi.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-admin"] });
      setIsOpen(false);
      form.reset();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: BlogFormData }) => {
      const payload = {
        ...data,
        tags: data.tags?.split(",").map((t) => t.trim()).filter(Boolean) || [],
      };
      return blogApi.update(id, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-admin"] });
      setIsOpen(false);
      setEditingPost(null);
      form.reset();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => blogApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-admin"] });
    },
  });

  const onSubmit = (data: BlogFormData) => {
    if (editingPost) {
      updateMutation.mutate({ id: editingPost.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    form.reset({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || "",
      content: post.content,
      coverImage: post.coverImage || "",
      tags: post.tags?.join(", ") || "",
      published: post.published,
    });
    setIsOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this post?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setEditingPost(null);
      form.reset();
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen">
      <AdminHeader
        title="Blog"
        description="Manage your blog posts"
      />

      <div className="p-6 space-y-6">
        {/* Add Button */}
        <div className="flex justify-end">
          <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                <Plus className="mr-2 h-4 w-4" />
                New Post
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-700 max-w-3xl">
              <DialogHeader>
                <DialogTitle className="text-white">
                  {editingPost ? "Edit Post" : "Create New Post"}
                </DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-300">Title</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="My Amazing Blog Post"
                              className="border-slate-700 bg-slate-800 text-white"
                              onChange={(e) => {
                                field.onChange(e);
                                if (!editingPost) {
                                  form.setValue("slug", generateSlug(e.target.value));
                                }
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="slug"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-300">Slug</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="my-amazing-blog-post"
                              className="border-slate-700 bg-slate-800 text-white"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="excerpt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-300">Excerpt (optional)</FormLabel>
                        <FormControl>
                          <textarea
                            {...field}
                            rows={2}
                            placeholder="A brief summary of your post..."
                            className="w-full rounded-md border border-slate-700 bg-slate-800 p-3 text-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-300">Content (Markdown)</FormLabel>
                        <FormControl>
                          <textarea
                            {...field}
                            rows={12}
                            placeholder="Write your blog post content here..."
                            className="w-full rounded-md border border-slate-700 bg-slate-800 p-3 text-white font-mono text-sm"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="coverImage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-300">Cover Image URL</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="https://..."
                              className="border-slate-700 bg-slate-800 text-white"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="tags"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-300">Tags (comma-separated)</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="react, nextjs, tutorial"
                              className="border-slate-700 bg-slate-800 text-white"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="published"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2">
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="h-4 w-4 rounded border-slate-700 bg-slate-800"
                          />
                        </FormControl>
                        <FormLabel className="text-slate-300 !mt-0">Publish immediately</FormLabel>
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700"
                    disabled={createMutation.isPending || updateMutation.isPending}
                  >
                    {createMutation.isPending || updateMutation.isPending
                      ? "Saving..."
                      : editingPost
                      ? "Update Post"
                      : "Create Post"}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Posts List */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-slate-800 bg-slate-900/50">
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-3/4 bg-slate-800" />
                  <Skeleton className="mt-2 h-4 w-1/2 bg-slate-800" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {data?.map((post) => (
              <Card key={post.id} className="border-slate-800 bg-slate-900/50">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-white">{post.title}</h3>
                        {post.published ? (
                          <span className="flex items-center gap-1 rounded-full bg-green-500/20 px-2 py-0.5 text-xs font-medium text-green-400">
                            <Eye className="h-3 w-3" />
                            Published
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 rounded-full bg-yellow-500/20 px-2 py-0.5 text-xs font-medium text-yellow-400">
                            <EyeOff className="h-3 w-3" />
                            Draft
                          </span>
                        )}
                      </div>
                      {post.excerpt && (
                        <p className="mt-1 text-sm text-slate-400 line-clamp-2">{post.excerpt}</p>
                      )}
                      <div className="mt-3 flex items-center gap-4 text-sm text-slate-500">
                        <span>{formatDate(post.createdAt)}</span>
                        {post.readTime && <span>{post.readTime} min read</span>}
                        <span className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          {post._count?.likes || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          {post._count?.comments || 0}
                        </span>
                      </div>
                      {post.tags && post.tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {post.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-300"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-1 ml-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(post)}
                        className="h-8 w-8 text-slate-400 hover:text-white"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(post.id)}
                        className="h-8 w-8 text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && (!data || data.length === 0) && (
          <Card className="border-slate-800 bg-slate-900/50">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-slate-600" />
              <p className="mt-4 text-lg text-slate-400">No blog posts yet</p>
              <p className="text-sm text-slate-500">
                Click &quot;New Post&quot; to start writing
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
