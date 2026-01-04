"use client";

import { AdminHeader } from "@/components/admin/admin-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { statsApi } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import {
  Code,
  Eye,
  FileText,
  FolderKanban,
  Heart,
  Mail,
  MessageSquare,
  TrendingUp,
} from "lucide-react";

const recentActivity = [
  { icon: Eye, text: "Portfolio viewed 156 times today", time: "2 hours ago" },
  {
    icon: Heart,
    text: "New like on 'Building a CMS' blog post",
    time: "5 hours ago",
  },
  {
    icon: MessageSquare,
    text: "New comment on 'React Best Practices'",
    time: "1 day ago",
  },
  { icon: Mail, text: "New contact message from John Doe", time: "2 days ago" },
];

export default function AdminDashboard() {
  const { data: statsData } = useQuery({
    queryKey: ["stats"],
    queryFn: async () => {
      try {
        const response = await statsApi.get();
        return response.data.stats;
      } catch {
        return null;
      }
    },
  });

  const stats = [
    {
      title: "Total Projects",
      value: statsData?.projects?.toString() || "0",
      icon: FolderKanban,
      change: "Active Projects",
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Skills",
      value: statsData?.skills?.toString() || "0",
      icon: Code,
      change: "Technical Skills",
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Blog Posts",
      value: statsData?.blogs?.toString() || "0",
      icon: FileText,
      change: "Published Posts",
      color: "from-orange-500 to-red-500",
    },
    {
      title: "Messages",
      value: statsData?.messages?.toString() || "0",
      icon: Mail,
      change: `${statsData?.messages || 0} unread`,
      color: "from-green-500 to-emerald-500",
    },
  ];

  return (
    <div className="min-h-screen">
      <AdminHeader
        title="Dashboard"
        description="Welcome back! Here's what's happening."
      />

      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title} className="border-slate-800 bg-slate-900/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">{stat.title}</p>
                    <p className="text-3xl font-bold text-white">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">{stat.change}</p>
                  </div>
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br ${stat.color}`}
                  >
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activity */}
        <Card className="border-slate-800 bg-slate-900/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <TrendingUp className="h-5 w-5 text-indigo-400" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 rounded-lg border border-slate-800 bg-slate-900 p-4"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800">
                    <activity.icon className="h-5 w-5 text-indigo-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-300">{activity.text}</p>
                    <p className="text-xs text-slate-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card className="border-slate-800 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 hover:from-indigo-500/20 hover:to-purple-500/20 transition-colors cursor-pointer">
            <CardContent className="flex items-center gap-4 p-6">
              <FolderKanban className="h-8 w-8 text-indigo-400" />
              <div>
                <p className="font-semibold text-white">Add New Project</p>
                <p className="text-sm text-slate-400">Showcase your work</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-800 bg-gradient-to-br from-green-500/10 to-emerald-500/10 hover:from-green-500/20 hover:to-emerald-500/20 transition-colors cursor-pointer">
            <CardContent className="flex items-center gap-4 p-6">
              <FileText className="h-8 w-8 text-green-400" />
              <div>
                <p className="font-semibold text-white">Write Blog Post</p>
                <p className="text-sm text-slate-400">Share your knowledge</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-800 bg-gradient-to-br from-orange-500/10 to-red-500/10 hover:from-orange-500/20 hover:to-red-500/20 transition-colors cursor-pointer">
            <CardContent className="flex items-center gap-4 p-6">
              <Code className="h-8 w-8 text-orange-400" />
              <div>
                <p className="font-semibold text-white">Update Skills</p>
                <p className="text-sm text-slate-400">Keep your skills fresh</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
