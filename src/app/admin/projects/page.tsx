"use client";

import { AdminHeader } from "@/components/admin/admin-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { projectsApi } from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ExternalLink,
  FolderKanban,
  Github,
  Pencil,
  Plus,
  Star,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  technologies: z.string().min(1, "At least one technology is required"),
  liveLink: z.string().optional(),
  repoLink: z.string().optional(),
  image: z.string().optional(),
  challenges: z.string().optional(),
  improvements: z.string().optional(),
  featured: z.boolean().optional(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

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

export default function ProjectsPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const queryClient = useQueryClient();

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      technologies: "",
      liveLink: "",
      repoLink: "",
      image: "",
      challenges: "",
      improvements: "",
      featured: false,
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const response = await projectsApi.getAll();
      return response.data.projects as Project[];
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: ProjectFormData) => {
      const payload = {
        ...data,
        technologies: data.technologies.split(",").map((t) => t.trim()),
      };
      return projectsApi.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setIsOpen(false);
      form.reset();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ProjectFormData }) => {
      const payload = {
        ...data,
        technologies: data.technologies.split(",").map((t) => t.trim()),
      };
      return projectsApi.update(id, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setIsOpen(false);
      setEditingProject(null);
      form.reset();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => projectsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  const onSubmit = (data: ProjectFormData) => {
    if (editingProject) {
      updateMutation.mutate({ id: editingProject.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    form.reset({
      title: project.title,
      slug: project.slug,
      description: project.description,
      technologies: project.technologies.join(", "),
      liveLink: project.liveLink || "",
      repoLink: project.repoLink || "",
      image: project.image || "",
      challenges: project.challenges || "",
      improvements: project.improvements || "",
      featured: project.featured || false,
    });
    setIsOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setEditingProject(null);
      form.reset();
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  return (
    <div className="min-h-screen">
      <AdminHeader
        title="Projects"
        description="Showcase your portfolio projects"
      />

      <div className="p-6 space-y-6">
        {/* Add Button */}
        <div className="flex justify-end">
          <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                <Plus className="mr-2 h-4 w-4" />
                Add Project
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-700 max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-white">
                  {editingProject ? "Edit Project" : "Add New Project"}
                </DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-300">
                            Title
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="eTuitionBD"
                              className="border-slate-700 bg-slate-800 text-white"
                              onChange={(e) => {
                                field.onChange(e);
                                if (!editingProject) {
                                  form.setValue(
                                    "slug",
                                    generateSlug(e.target.value)
                                  );
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
                              placeholder="etuitionbd"
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
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-300">
                          Description
                        </FormLabel>
                        <FormControl>
                          <textarea
                            {...field}
                            rows={3}
                            placeholder="Describe your project..."
                            className="w-full rounded-md border border-slate-700 bg-slate-800 p-3 text-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="technologies"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-300">
                          Technologies (comma-separated)
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="React, Node.js, MongoDB, Tailwind CSS"
                            className="border-slate-700 bg-slate-800 text-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="liveLink"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-300">
                            Live URL
                          </FormLabel>
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
                      name="repoLink"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-300">
                            GitHub URL
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="https://github.com/..."
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
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-300">
                          Image URL
                        </FormLabel>
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
                    name="challenges"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-300">
                          Challenges Faced
                        </FormLabel>
                        <FormControl>
                          <textarea
                            {...field}
                            rows={2}
                            placeholder="What challenges did you overcome?"
                            className="w-full rounded-md border border-slate-700 bg-slate-800 p-3 text-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="improvements"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-300">
                          Future Improvements
                        </FormLabel>
                        <FormControl>
                          <textarea
                            {...field}
                            rows={2}
                            placeholder="What would you add next?"
                            className="w-full rounded-md border border-slate-700 bg-slate-800 p-3 text-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="featured"
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
                        <FormLabel className="text-slate-300 !mt-0">
                          Featured Project
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700"
                    disabled={
                      createMutation.isPending || updateMutation.isPending
                    }
                  >
                    {createMutation.isPending || updateMutation.isPending
                      ? "Saving..."
                      : editingProject
                      ? "Update Project"
                      : "Add Project"}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Projects Grid */}
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-slate-800 bg-slate-900/50">
                <CardContent className="p-0">
                  <Skeleton className="h-48 w-full bg-slate-800" />
                  <div className="p-4 space-y-2">
                    <Skeleton className="h-6 w-3/4 bg-slate-800" />
                    <Skeleton className="h-4 w-full bg-slate-800" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data?.map((project) => (
              <Card
                key={project.id}
                className="border-slate-800 bg-slate-900/50 overflow-hidden"
              >
                <CardContent className="p-0">
                  {/* Image */}
                  <div className="relative h-48 bg-gradient-to-br from-indigo-500/20 to-purple-500/20">
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <FolderKanban className="h-16 w-16 text-indigo-400/50" />
                      </div>
                    )}
                    {project.featured && (
                      <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-yellow-500/90 px-2 py-1 text-xs font-medium text-black">
                        <Star className="h-3 w-3" />
                        Featured
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-white">
                      {project.title}
                    </h3>
                    <p className="mt-1 text-sm text-slate-400 line-clamp-2">
                      {project.description}
                    </p>

                    {/* Technologies */}
                    <div className="mt-3 flex flex-wrap gap-1">
                      {project.technologies.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-300"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 4 && (
                        <span className="text-xs text-slate-500">
                          +{project.technologies.length - 4} more
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex gap-2">
                        {project.liveLink && (
                          <a
                            href={project.liveLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-lg bg-slate-800 p-2 text-slate-400 hover:text-white"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                        {project.repoLink && (
                          <a
                            href={project.repoLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-lg bg-slate-800 p-2 text-slate-400 hover:text-white"
                          >
                            <Github className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(project)}
                          className="h-8 w-8 text-slate-400 hover:text-white"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(project.id)}
                          className="h-8 w-8 text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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
              <FolderKanban className="h-12 w-12 text-slate-600" />
              <p className="mt-4 text-lg text-slate-400">
                No projects added yet
              </p>
              <p className="text-sm text-slate-500">
                Click &quot;Add Project&quot; to showcase your work
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
