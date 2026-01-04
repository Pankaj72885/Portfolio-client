"use client";

import { AdminHeader } from "@/components/admin/admin-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { contactApi } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle, Clock, Mail, Trash2 } from "lucide-react";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function MessagesPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["messages"],
    queryFn: async () => {
      const response = await contactApi.getAll();
      return response.data.contacts as ContactMessage[];
    },
  });

  const markReadMutation = useMutation({
    mutationFn: (id: string) => contactApi.markRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => contactApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
  });

  const handleMarkRead = (id: string) => {
    markReadMutation.mutate(id);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this message?")) {
      deleteMutation.mutate(id);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const unreadCount = data?.filter((m) => !m.read).length || 0;

  return (
    <div className="min-h-screen">
      <AdminHeader
        title="Messages"
        description={`Contact form submissions${
          unreadCount > 0 ? ` (${unreadCount} unread)` : ""
        }`}
      />

      <div className="p-6 space-y-6">
        {/* Messages List */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-slate-800 bg-slate-900/50">
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-48 bg-slate-800" />
                  <Skeleton className="mt-2 h-4 w-32 bg-slate-800" />
                  <Skeleton className="mt-4 h-20 w-full bg-slate-800" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {data?.map((message) => (
              <Card
                key={message.id}
                className={`border-slate-800 ${
                  message.read
                    ? "bg-slate-900/50"
                    : "bg-slate-900/80 border-l-4 border-l-indigo-500"
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600">
                          <span className="text-sm font-medium text-white">
                            {message.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">
                            {message.name}
                          </h3>
                          <a
                            href={`mailto:${message.email}`}
                            className="text-sm text-indigo-400 hover:underline"
                          >
                            {message.email}
                          </a>
                        </div>
                        {!message.read && (
                          <span className="rounded-full bg-indigo-500/20 px-2 py-0.5 text-xs font-medium text-indigo-400">
                            New
                          </span>
                        )}
                      </div>
                      {message.subject && (
                        <p className="mt-3 font-medium text-slate-300">
                          {message.subject}
                        </p>
                      )}
                      <p className="mt-2 text-slate-400 whitespace-pre-line">
                        {message.message}
                      </p>
                      <div className="mt-3 flex items-center gap-1 text-xs text-slate-500">
                        <Clock className="h-3 w-3" />
                        {formatDate(message.createdAt)}
                      </div>
                    </div>
                    <div className="flex gap-1 ml-4">
                      {!message.read && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleMarkRead(message.id)}
                          className="h-8 w-8 text-green-400 hover:text-green-300"
                          title="Mark as read"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(message.id)}
                        className="h-8 w-8 text-red-400 hover:text-red-300"
                        title="Delete"
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
              <Mail className="h-12 w-12 text-slate-600" />
              <p className="mt-4 text-lg text-slate-400">No messages yet</p>
              <p className="text-sm text-slate-500">
                When visitors send messages, they&apos;ll appear here
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
