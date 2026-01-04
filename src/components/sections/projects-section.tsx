"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { ChevronRight, ExternalLink, Github, Star } from "lucide-react";
import { useState } from "react";

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  technologies: string[];
  liveLink?: string;
  repoLink?: string;
  image?: string;
  challenges?: string;
  improvements?: string;
  featured?: boolean;
}

interface ProjectsSectionProps {
  projects?: Project[];
  isLoading?: boolean;
}

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
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export function ProjectsSection({
  projects = [],
  isLoading,
}: ProjectsSectionProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <section id="projects" className="py-24 bg-background">
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
            Portfolio
          </h2>
          <p className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">
            Featured Projects
          </p>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            A selection of my best work showcasing skills and problem-solving
            abilities
          </p>
        </motion.div>

        {/* Projects Grid */}
        {isLoading ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-2xl border border-border bg-card/50 overflow-hidden"
              >
                <Skeleton className="h-48 w-full bg-muted" />
                <div className="p-6 space-y-3">
                  <Skeleton className="h-6 w-3/4 bg-muted" />
                  <Skeleton className="h-4 w-full bg-muted" />
                  <Skeleton className="h-4 w-2/3 bg-muted" />
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
            {projects.map((project) => (
              <motion.div
                key={project.id}
                variants={itemVariants}
                className="group relative rounded-2xl border border-border bg-card/50 overflow-hidden cursor-pointer transition-all hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10"
                onClick={() => setSelectedProject(project)}
              >
                {/* Image */}
                <div className="relative h-48 bg-gradient-to-br from-primary/20 to-purple-500/20 overflow-hidden">
                  {project.image ? (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <div className="text-6xl font-bold text-primary/30">
                        {project.title.charAt(0)}
                      </div>
                    </div>
                  )}

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-60" />

                  {/* Featured Badge */}
                  {project.featured && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-yellow-500/90 px-2.5 py-1 text-xs font-medium text-black">
                      <Star className="h-3 w-3" fill="currentColor" />
                      Featured
                    </div>
                  )}

                  {/* Quick Links */}
                  <div className="absolute bottom-3 left-3 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                    {project.liveLink && (
                      <a
                        href={project.liveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                    {project.repoLink && (
                      <a
                        href={project.repoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
                      >
                        <Github className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                    {project.description}
                  </p>

                  {/* Technologies */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.technologies.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 4 && (
                      <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
                        +{project.technologies.length - 4}
                      </span>
                    )}
                  </div>

                  {/* View More */}
                  <div className="mt-4 flex items-center gap-1 text-sm text-primary opacity-0 transition-opacity group-hover:opacity-100">
                    View Details
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {!isLoading && projects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No projects added yet</p>
          </div>
        )}

        {/* Project Detail Modal */}
        <Dialog
          open={!!selectedProject}
          onOpenChange={() => setSelectedProject(null)}
        >
          <DialogContent className="max-h-[90vh] overflow-y-auto bg-card border-border max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-2xl text-foreground">
                {selectedProject?.title}
              </DialogTitle>
            </DialogHeader>

            {selectedProject && (
              <div className="space-y-6">
                {/* Image */}
                {selectedProject.image && (
                  <div className="relative h-64 rounded-lg overflow-hidden">
                    <img
                      src={selectedProject.image}
                      alt={selectedProject.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}

                {/* Description */}
                <div>
                  <h4 className="text-sm font-medium text-primary mb-2">
                    Description
                  </h4>
                  <p className="text-foreground/90">
                    {selectedProject.description}
                  </p>
                </div>

                {/* Technologies */}
                <div>
                  <h4 className="text-sm font-medium text-primary mb-2">
                    Technologies
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full bg-muted px-3 py-1 text-sm text-foreground/80"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Challenges */}
                {selectedProject.challenges && (
                  <div>
                    <h4 className="text-sm font-medium text-orange-400 mb-2">
                      Challenges Faced
                    </h4>
                    <p className="text-foreground/90 whitespace-pre-line">
                      {selectedProject.challenges}
                    </p>
                  </div>
                )}

                {/* Improvements */}
                {selectedProject.improvements && (
                  <div>
                    <h4 className="text-sm font-medium text-green-400 mb-2">
                      Future Improvements
                    </h4>
                    <p className="text-foreground/90 whitespace-pre-line">
                      {selectedProject.improvements}
                    </p>
                  </div>
                )}

                {/* Links */}
                <div className="flex gap-4 pt-4">
                  {selectedProject.liveLink && (
                    <Button
                      asChild
                      className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      <a
                        href={selectedProject.liveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Live Demo
                      </a>
                    </Button>
                  )}
                  {selectedProject.repoLink && (
                    <Button
                      variant="outline"
                      className="border-input text-foreground hover:bg-muted"
                      asChild
                    >
                      <a
                        href={selectedProject.repoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Github className="mr-2 h-4 w-4" />
                        View Code
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
