"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: number;
  icon?: string;
}

interface SkillsSectionProps {
  skills?: Skill[];
  isLoading?: boolean;
}

const categoryColors: Record<string, string> = {
  Frontend: "from-blue-500 to-cyan-500",
  Backend: "from-green-500 to-emerald-500",
  Database: "from-orange-500 to-amber-500",
  DevOps: "from-purple-500 to-pink-500",
  Tools: "from-red-500 to-rose-500",
  Languages: "from-indigo-500 to-violet-500",
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export function SkillsSection({ skills = [], isLoading }: SkillsSectionProps) {
  // Group skills by category
  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <section id="skills" className="py-24 bg-background">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-sm font-semibold uppercase tracking-widest text-primary">
            Skills & Expertise
          </h2>
          <p className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">
            Technologies I Work With
          </p>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            A comprehensive toolkit built through years of hands-on experience
          </p>
        </motion.div>

        {/* Skills Grid */}
        {isLoading ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-2xl border border-border bg-card/50 p-6"
              >
                <Skeleton className="h-6 w-32 bg-muted mb-6" />
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j}>
                      <Skeleton className="h-4 w-24 bg-muted mb-2" />
                      <Skeleton className="h-2 w-full bg-muted" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {Object.entries(groupedSkills).map(([category, categorySkills]) => (
              <motion.div
                key={category}
                variants={itemVariants}
                className="group relative rounded-2xl border border-border bg-card/50 p-6 backdrop-blur-sm transition-all hover:border-primary/50 hover:bg-card/80"
              >
                {/* Category Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className={`h-10 w-10 rounded-lg bg-gradient-to-br ${
                      categoryColors[category] || "from-slate-500 to-slate-600"
                    } flex items-center justify-center`}
                  >
                    <span className="text-lg font-bold text-white">
                      {category.charAt(0)}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {category}
                  </h3>
                </div>

                {/* Skills */}
                <div className="space-y-4">
                  {categorySkills.map((skill) => (
                    <div key={skill.id}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-medium text-foreground/90">
                          {skill.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {skill.proficiency}%
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                        <motion.div
                          className={`h-full rounded-full bg-gradient-to-r ${
                            categoryColors[category] ||
                            "from-slate-500 to-slate-600"
                          }`}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.proficiency}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.2 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Hover Glow Effect */}
                <div
                  className={`absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br ${
                    categoryColors[category] || "from-slate-500 to-slate-600"
                  } opacity-0 blur-xl transition-opacity group-hover:opacity-10`}
                />
              </motion.div>
            ))}
          </motion.div>
        )}

        {!isLoading && skills.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No skills added yet</p>
          </div>
        )}
      </div>
    </section>
  );
}
