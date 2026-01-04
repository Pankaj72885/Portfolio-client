"use client";

import { AdminHeader } from "@/components/admin/admin-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { profileApi } from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Save, User } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  designation: z.string().min(1, "Designation is required"),
  bio: z.string().min(10, "Bio must be at least 10 characters"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  resumeUrl: z.string().url().optional().or(z.literal("")),
  photoUrl: z.string().url().optional().or(z.literal("")),
  github: z.string().optional(),
  linkedin: z.string().optional(),
  twitter: z.string().optional(),
  facebook: z.string().optional(),
  youtube: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface Profile {
  id: string;
  name: string;
  designation: string;
  bio: string;
  email: string;
  phone?: string;
  resumeUrl?: string;
  photoUrl?: string;
  socialLinks?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    youtube?: string;
  };
}

export default function ProfilePage() {
  const queryClient = useQueryClient();

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      designation: "",
      bio: "",
      email: "",
      phone: "",
      resumeUrl: "",
      photoUrl: "",
      github: "",
      linkedin: "",
      twitter: "",
      facebook: "",
      youtube: "",
    },
  });

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      try {
        const response = await profileApi.get();
        return response.data.profile as Profile;
      } catch {
        return null;
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: ProfileFormData) => {
      const payload = {
        name: data.name,
        designation: data.designation,
        bio: data.bio,
        email: data.email,
        phone: data.phone,
        resumeUrl: data.resumeUrl,
        photoUrl: data.photoUrl,
        socialLinks: {
          github: data.github,
          linkedin: data.linkedin,
          twitter: data.twitter,
          facebook: data.facebook,
          youtube: data.youtube,
        },
      };
      return profile ? profileApi.update(payload) : profileApi.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        name: profile.name,
        designation: profile.designation,
        bio: profile.bio,
        email: profile.email,
        phone: profile.phone || "",
        resumeUrl: profile.resumeUrl || "",
        photoUrl: profile.photoUrl || "",
        github: profile.socialLinks?.github || "",
        linkedin: profile.socialLinks?.linkedin || "",
        twitter: profile.socialLinks?.twitter || "",
        facebook: profile.socialLinks?.facebook || "",
        youtube: profile.socialLinks?.youtube || "",
      });
    }
  }, [profile, form]);

  const onSubmit = (data: ProfileFormData) => {
    updateMutation.mutate(data);
  };

  return (
    <div className="min-h-screen">
      <AdminHeader
        title="Profile"
        description="Manage your portfolio profile information"
      />

      <div className="p-6">
        {isLoading ? (
          <Card className="border-slate-800 bg-slate-900/50">
            <CardContent className="p-6 space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-10 w-full bg-slate-800" />
              ))}
            </CardContent>
          </Card>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Info */}
              <Card className="border-slate-800 bg-slate-900/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <User className="h-5 w-5 text-indigo-400" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-300">
                          Full Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Pankaj Bepari"
                            className="border-slate-700 bg-slate-800 text-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="designation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-300">
                          Designation
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Full Stack Developer"
                            className="border-slate-700 bg-slate-800 text-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-300">Email</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            placeholder="pankaj@example.com"
                            className="border-slate-700 bg-slate-800 text-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-300">Phone</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="+880 1XXX-XXXXXX"
                            className="border-slate-700 bg-slate-800 text-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="md:col-span-2">
                    <FormField
                      control={form.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-300">Bio</FormLabel>
                          <FormControl>
                            <textarea
                              {...field}
                              rows={4}
                              placeholder="Tell your story..."
                              className="w-full rounded-md border border-slate-700 bg-slate-800 p-3 text-white placeholder:text-slate-500"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="photoUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-300">
                          Photo URL
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
                    name="resumeUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-300">
                          Resume URL
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="https://drive.google.com/..."
                            className="border-slate-700 bg-slate-800 text-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Social Links */}
              <Card className="border-slate-800 bg-slate-900/50">
                <CardHeader>
                  <CardTitle className="text-white">Social Links</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="github"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-300">GitHub</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="https://github.com/username"
                            className="border-slate-700 bg-slate-800 text-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="linkedin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-300">
                          LinkedIn
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="https://linkedin.com/in/username"
                            className="border-slate-700 bg-slate-800 text-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="twitter"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-300">
                          Twitter
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="https://twitter.com/username"
                            className="border-slate-700 bg-slate-800 text-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="youtube"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-300">
                          YouTube
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="https://youtube.com/@channel"
                            className="border-slate-700 bg-slate-800 text-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Save Button */}
              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700"
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Profile
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </div>
    </div>
  );
}
