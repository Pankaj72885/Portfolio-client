"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { Briefcase, Calendar } from "lucide-react";

interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate?: string;
  description: string;
  current?: boolean;
}

interface ExperienceSectionProps {
  experiences?: Experience[];
  isLoading?: boolean;
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
};

export function ExperienceSection({
  experiences = [],
  isLoading,
}: ExperienceSectionProps) {
  return (
    <section id="experience" className="py-24 bg-slate-900">
      <div className="mx-auto max-w-5xl px-6">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-sm font-semibold uppercase tracking-widest text-indigo-400">
            Experience
          </h2>
          <p className="mt-2 text-3xl font-bold text-white sm:text-4xl">
            My Professional Journey
          </p>
          <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
            The path that shaped my skills and expertise
          </p>
        </motion.div>

        {/* Timeline */}
        {isLoading ? (
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-800 md:left-1/2" />
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="relative mb-12 pl-16 md:pl-0 md:ml-[50%] md:w-1/2 md:pr-0 md:pl-12"
              >
                <Skeleton className="h-32 w-full bg-slate-800 rounded-xl" />
              </div>
            ))}
          </div>
        ) : (
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-500 via-purple-500 to-slate-800 md:left-1/2 md:-translate-x-1/2" />

            {experiences.map((experience, index) => (
              <motion.div
                key={experience.id}
                className={`relative mb-12 ${
                  index % 2 === 0
                    ? "md:ml-0 md:mr-[50%] md:pr-12 md:text-right"
                    : "md:ml-[50%] md:pl-12"
                } pl-16 md:pl-0 md:w-1/2`}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {/* Timeline Dot */}
                <div
                  className={`absolute top-6 left-6 h-5 w-5 rounded-full border-4 border-slate-950 ${
                    experience.current
                      ? "bg-green-500 shadow-lg shadow-green-500/50"
                      : "bg-indigo-500"
                  } md:left-auto ${
                    index % 2 === 0 ? "md:-right-2.5" : "md:-left-2.5"
                  }`}
                />

                {/* Card */}
                <div className="group rounded-xl border border-slate-800 bg-slate-950/50 p-6 backdrop-blur-sm transition-all hover:border-indigo-500/50 hover:bg-slate-900/80">
                  {/* Date Badge */}
                  <div
                    className={`inline-flex items-center gap-1.5 rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-400 ${
                      index % 2 === 0 ? "md:ml-auto" : ""
                    }`}
                  >
                    <Calendar className="h-3 w-3" />
                    {formatDate(experience.startDate)} —{" "}
                    {experience.current
                      ? "Present"
                      : experience.endDate
                      ? formatDate(experience.endDate)
                      : ""}
                  </div>

                  {/* Content */}
                  <h3 className="mt-3 text-xl font-semibold text-white">
                    {experience.role}
                  </h3>
                  <div
                    className={`flex items-center gap-2 mt-1 ${
                      index % 2 === 0 ? "md:justify-end" : ""
                    }`}
                  >
                    <Briefcase className="h-4 w-4 text-indigo-400" />
                    <span className="text-indigo-400 font-medium">
                      {experience.company}
                    </span>
                  </div>
                  <p className="mt-4 text-slate-400 leading-relaxed">
                    {experience.description}
                  </p>

                  {experience.current && (
                    <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                      </span>
                      Currently Working
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!isLoading && experiences.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400">No experience added yet</p>
          </div>
        )}
      </div>
    </section>
  );
}
