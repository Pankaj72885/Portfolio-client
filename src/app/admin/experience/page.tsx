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
import { experienceApi } from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Briefcase, Calendar, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const experienceSchema = z.object({
  company: z.string().min(1, "Company is required"),
  role: z.string().min(1, "Role is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  description: z.string().min(10, "Description must be at least 10 characters"),
  current: z.boolean().optional(),
});

type ExperienceFormData = z.infer<typeof experienceSchema>;

interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate?: string;
  description: string;
  current?: boolean;
}

export default function ExperiencePage() {
  const [isOpen, setIsOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(
    null
  );
  const queryClient = useQueryClient();

  const form = useForm<ExperienceFormData>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      company: "",
      role: "",
      startDate: "",
      endDate: "",
      description: "",
      current: false,
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: ["experience"],
    queryFn: async () => {
      const response = await experienceApi.getAll();
      return response.data.experiences as Experience[];
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: ExperienceFormData) => experienceApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["experience"] });
      setIsOpen(false);
      form.reset();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ExperienceFormData }) =>
      experienceApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["experience"] });
      setIsOpen(false);
      setEditingExperience(null);
      form.reset();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => experienceApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["experience"] });
    },
  });

  const onSubmit = (data: ExperienceFormData) => {
    if (editingExperience) {
      updateMutation.mutate({ id: editingExperience.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (experience: Experience) => {
    setEditingExperience(experience);
    form.reset({
      company: experience.company,
      role: experience.role,
      startDate: experience.startDate.split("T")[0],
      endDate: experience.endDate?.split("T")[0] || "",
      description: experience.description,
      current: experience.current || false,
    });
    setIsOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this experience?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setEditingExperience(null);
      form.reset();
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen">
      <AdminHeader
        title="Experience"
        description="Manage your work history timeline"
      />

      <div className="p-6 space-y-6">
        {/* Add Button */}
        <div className="flex justify-end">
          <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                <Plus className="mr-2 h-4 w-4" />
                Add Experience
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-700">
              <DialogHeader>
                <DialogTitle className="text-white">
                  {editingExperience ? "Edit Experience" : "Add New Experience"}
                </DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-300">
                          Company
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Bangladesh Army"
                            className="border-slate-700 bg-slate-800 text-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-300">Role</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Corporal"
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
                      name="startDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-300">
                            Start Date
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="date"
                              className="border-slate-700 bg-slate-800 text-white"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-300">
                            End Date
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="date"
                              disabled={form.watch("current")}
                              className="border-slate-700 bg-slate-800 text-white disabled:opacity-50"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="current"
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
                          Currently Working Here
                        </FormLabel>
                      </FormItem>
                    )}
                  />
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
                            rows={4}
                            placeholder="Describe your responsibilities and achievements..."
                            className="w-full rounded-md border border-slate-700 bg-slate-800 p-3 text-white"
                          />
                        </FormControl>
                        <FormMessage />
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
                      : editingExperience
                      ? "Update Experience"
                      : "Add Experience"}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Timeline */}
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
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-800" />

            <div className="space-y-6">
              {data?.map((experience) => (
                <div key={experience.id} className="relative pl-16">
                  {/* Timeline dot */}
                  <div className="absolute left-6 top-6 h-4 w-4 rounded-full border-4 border-slate-950 bg-indigo-500" />

                  <Card className="border-slate-800 bg-slate-900/50">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-white">
                            {experience.role}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Briefcase className="h-4 w-4 text-indigo-400" />
                            <span className="text-indigo-400">
                              {experience.company}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-1 text-sm text-slate-500">
                            <Calendar className="h-3 w-3" />
                            {formatDate(experience.startDate)} —{" "}
                            {experience.current
                              ? "Present"
                              : experience.endDate
                              ? formatDate(experience.endDate)
                              : ""}
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(experience)}
                            className="h-8 w-8 text-slate-400 hover:text-white"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(experience.id)}
                            className="h-8 w-8 text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="mt-4 text-slate-300 whitespace-pre-line">
                        {experience.description}
                      </p>
                      {experience.current && (
                        <span className="mt-3 inline-block rounded-full bg-green-500/20 px-3 py-1 text-xs font-medium text-green-400">
                          Currently Working
                        </span>
                      )}
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        )}

        {!isLoading && (!data || data.length === 0) && (
          <Card className="border-slate-800 bg-slate-900/50">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Briefcase className="h-12 w-12 text-slate-600" />
              <p className="mt-4 text-lg text-slate-400">
                No experience added yet
              </p>
              <p className="text-sm text-slate-500">
                Click &quot;Add Experience&quot; to build your timeline
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
