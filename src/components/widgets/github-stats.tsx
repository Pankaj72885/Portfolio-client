"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Code, GitBranch, Star, Users } from "lucide-react";

interface GitHubStatsProps {
  username: string;
}

interface GitHubUser {
  public_repos: number;
  followers: number;
  following: number;
  public_gists: number;
}

export function GitHubStats({ username }: GitHubStatsProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["github-stats", username],
    queryFn: async () => {
      const response = await fetch(`https://api.github.com/users/${username}`);
      if (!response.ok) throw new Error("Failed to fetch");
      return response.json() as Promise<GitHubUser>;
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  if (isLoading || !data) return null;

  const stats = [
    { label: "Repositories", value: data.public_repos, icon: Code },
    { label: "Followers", value: data.followers, icon: Users },
    { label: "Following", value: data.following, icon: Star },
    { label: "Gists", value: data.public_gists, icon: GitBranch },
  ];

  return (
    <motion.div
      className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 text-center backdrop-blur-sm"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <stat.icon className="mx-auto h-5 w-5 text-indigo-400" />
          <p className="mt-2 text-2xl font-bold text-white">{stat.value}</p>
          <p className="text-xs text-slate-500">{stat.label}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}
