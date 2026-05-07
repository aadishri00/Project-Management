import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  BadgeCheck,
  BriefcaseBusiness,
  CalendarDays,
  ImagePlus,
  KeyRound,
  Mail,
  ShieldCheck,
  Trash2,
  UserRound,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card.jsx";
import Input from "../components/ui/Input.jsx";
import Button from "../components/ui/Button.jsx";
import Avatar from "../components/ui/Avatar.jsx";
import { RolePill } from "../components/ui/StatusBadge.jsx";

import { authApi } from "../api/auth.api.js";
import { getApiError } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(80),
  email: z.string().email("Enter a valid email").max(120),
  title: z.string().max(80).optional().or(z.literal("")),
  avatarUrl: z.string().max(1_500_000, "Avatar image is too large").optional().or(z.literal("")),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export default function Profile() {
  const { user, setUser } = useAuth();
  const qc = useQueryClient();

  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      title: user?.title || "",
      avatarUrl: user?.avatarUrl || "",
    },
  });

  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  const updateMut = useMutation({
    mutationFn: authApi.updateProfile,
    onSuccess: ({ user: u }) => {
      toast.success("Profile updated");
      setUser(u);
      qc.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (err) => toast.error(getApiError(err)),
  });

  const passwordMut = useMutation({
    mutationFn: authApi.changePassword,
    onSuccess: () => {
      toast.success("Password updated");
      passwordForm.reset();
    },
    onError: (err) => toast.error(getApiError(err)),
  });

  const watchedAvatar = profileForm.watch("avatarUrl");
  const watchedName = profileForm.watch("name");
  const joined = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Recently";

  const onAvatarUpload = (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }
    if (file.size > 1_000_000) {
      toast.error("Avatar image must be under 1 MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const avatarUrl = reader.result || "";
      profileForm.setValue("avatarUrl", avatarUrl, {
        shouldDirty: true,
        shouldValidate: true,
      });
      setUser((prev) => (prev ? { ...prev, avatarUrl } : prev));
    };
    reader.onerror = () => toast.error("Could not read image");
    reader.readAsDataURL(file);
  };

  const removeAvatar = () => {
    profileForm.setValue("avatarUrl", "", {
      shouldDirty: true,
      shouldValidate: true,
    });
    setUser((prev) => (prev ? { ...prev, avatarUrl: "" } : prev));
  };

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[2rem] bg-slate-950 p-6 text-white shadow-[0_24px_70px_-35px_rgba(0,0,0,0.75)] sm:p-8">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-500/25 blur-2xl" />
        <div className="absolute bottom-0 left-0 h-28 w-full bg-gradient-to-r from-brand-500/20 to-transparent" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="relative">
              <Avatar
                name={watchedName || user?.name}
                src={watchedAvatar || user?.avatarUrl}
                size="lg"
                className="h-28 w-28 border-4 border-white/20 text-4xl shadow-2xl"
              />
              <span className="absolute bottom-2 right-1 grid h-8 w-8 place-items-center rounded-full bg-brand-400 text-slate-950 ring-4 ring-slate-950">
                <BadgeCheck className="h-4 w-4" />
              </span>
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-[0.22em] text-brand-300">
                Profile setup
              </p>
              <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">
                {watchedName || user?.name}
              </h1>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-slate-200">
                  <Mail className="h-4 w-4" />
                  {user?.email}
                </span>
                <RolePill role={user?.role} />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
              <CalendarDays className="h-5 w-5 text-brand-300" />
              <p className="mt-3 text-xs text-slate-400">Joined</p>
              <p className="text-sm font-bold">{joined}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
              <ShieldCheck className="h-5 w-5 text-brand-300" />
              <p className="mt-3 text-xs text-slate-400">Access</p>
              <p className="text-sm font-bold capitalize">{user?.role}</p>
            </div>
            <div className="col-span-2 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur sm:col-span-1">
              <BriefcaseBusiness className="h-5 w-5 text-brand-300" />
              <p className="mt-3 text-xs text-slate-400">Title</p>
              <p className="truncate text-sm font-bold">{user?.title || "Not set"}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[0.78fr_1.22fr]">
        <div className="space-y-6">
          <Card className="overflow-hidden">
            <div className="h-28 bg-gradient-to-br from-brand-500 via-brand-400 to-emerald-300" />
            <CardContent className="-mt-12 p-6">
              <div className="flex flex-col items-center text-center">
                <Avatar
                  name={watchedName || user?.name}
                  src={watchedAvatar || user?.avatarUrl}
                  size="lg"
                  className="h-24 w-24 border-4 border-white text-3xl shadow-xl"
                />
                <h2 className="mt-4 text-xl font-black text-slate-950">{user?.name}</h2>
                <p className="text-sm text-slate-500">{user?.email}</p>
                <div className="mt-4">
                  <RolePill role={user?.role} />
                </div>
                <p className="mt-4 max-w-xs text-sm leading-6 text-slate-500">
                  Keep your account details current so project ownership, task assignments, and team visibility stay clear.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-1">
            <Card>
              <CardContent className="flex items-start gap-4 p-5">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-50 text-brand-700">
                  <UserRound className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-slate-950">Identity</p>
                  <p className="mt-1 text-sm text-slate-500">Name, avatar, title, and visible profile details.</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-start gap-4 p-5">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-rose-50 text-rose-700">
                  <KeyRound className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-slate-950">Security</p>
                  <p className="mt-1 text-sm text-slate-500">Use a strong password and update it when needed.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-6">
          <form
            onSubmit={profileForm.handleSubmit((v) => updateMut.mutateAsync(v))}
            className="grid grid-cols-1 gap-6 2xl:grid-cols-[1.35fr_0.9fr]"
            noValidate
          >
            <Card className="overflow-hidden">
              <CardHeader className="bg-white/70">
                <div className="flex items-start gap-4">
                  <div className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-50 text-brand-700">
                    <UserRound className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle>Identity details</CardTitle>
                    <p className="mt-1 text-sm text-slate-500">
                      Name, role display, job title, and avatar used across team views.
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input
                    label="Full name"
                    error={profileForm.formState.errors.name?.message}
                    {...profileForm.register("name")}
                  />
                  <Input
                    label="Title"
                    placeholder="e.g. Project Lead"
                    error={profileForm.formState.errors.title?.message}
                    {...profileForm.register("title")}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Profile image
                  </label>
                  <div className="rounded-2xl border border-brand-100 bg-brand-50/40 p-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-[auto_1fr] md:items-center">
                      <Avatar
                        name={watchedName || user?.name}
                        src={watchedAvatar || user?.avatarUrl}
                        size="lg"
                        className="h-20 w-20 text-2xl"
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-900">
                          Upload a new avatar
                        </p>
                        <p className="mt-1 max-w-md text-sm leading-6 text-slate-500">
                          Use a square PNG, JPG, WEBP, or GIF image. Keep it under 1 MB for fast loading.
                        </p>
                        {profileForm.formState.errors.avatarUrl?.message && (
                          <p className="mt-1.5 text-xs text-rose-600">
                            {profileForm.formState.errors.avatarUrl.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                      <label className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 text-sm font-semibold text-white transition hover:bg-brand-700">
                        <ImagePlus className="h-4 w-4" />
                        Upload image
                        <input
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={onAvatarUpload}
                        />
                      </label>
                      {(watchedAvatar || user?.avatarUrl) && (
                        <button
                          type="button"
                          onClick={removeAvatar}
                          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-rose-200 bg-white px-4 text-sm font-semibold text-rose-700 transition hover:bg-rose-50"
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-br from-brand-50 to-white">
                <div className="flex items-start gap-4">
                  <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-brand-700 shadow-soft">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <CardTitle>Login email</CardTitle>
                    <p className="mt-1 text-sm text-slate-500">
                      Update the email used for sign in and notifications.
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  label="Email address"
                  type="email"
                  autoComplete="email"
                  error={profileForm.formState.errors.email?.message}
                  {...profileForm.register("email")}
                />
                <div className="rounded-2xl border border-brand-100 bg-brand-50/70 p-4 text-sm text-brand-900">
                  Changing this email affects your next login. Use an address you can access.
                </div>
                <Button
                  type="submit"
                  loading={profileForm.formState.isSubmitting || updateMut.isPending}
                  className="w-full"
                >
                  Save account
                </Button>
              </CardContent>
            </Card>
          </form>

          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-slate-950 to-brand-900 text-white">
              <div>
                <CardTitle className="text-white">Security settings</CardTitle>
                <p className="mt-1 text-sm text-white/65">
                  Change your password without affecting your current profile data.
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={passwordForm.handleSubmit((v) =>
                  passwordMut.mutateAsync({
                    currentPassword: v.currentPassword,
                    newPassword: v.newPassword,
                  })
                )}
                className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_1fr_1fr_auto] xl:items-start"
                noValidate
              >
                <Input
                  label="Current password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Enter current password"
                  error={passwordForm.formState.errors.currentPassword?.message}
                  {...passwordForm.register("currentPassword")}
                />
                <Input
                  label="New password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Enter new password"
                  error={passwordForm.formState.errors.newPassword?.message}
                  {...passwordForm.register("newPassword")}
                />
                <Input
                  label="Confirm password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Re-enter password"
                  error={passwordForm.formState.errors.confirmPassword?.message}
                  {...passwordForm.register("confirmPassword")}
                />
                <div className="flex flex-col gap-2 xl:min-w-48 xl:pt-7">
                  <Button type="submit" loading={passwordMut.isPending}>
                    Update password
                  </Button>
                  <p className="text-center text-xs text-slate-500 xl:text-left">
                    Minimum 6 characters. Use a unique password.
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
