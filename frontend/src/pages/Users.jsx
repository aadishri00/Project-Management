import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Search, AlertTriangle, Users as UsersIcon, Trash2, Power, ShieldCheck, UserRoundCheck } from "lucide-react";

import PageHeader from "../components/layout/PageHeader.jsx";
import { Card, CardContent } from "../components/ui/Card.jsx";
import Input from "../components/ui/Input.jsx";
import Select from "../components/ui/Select.jsx";
import Button from "../components/ui/Button.jsx";
import Skeleton from "../components/ui/Skeleton.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import Avatar from "../components/ui/Avatar.jsx";
import { RolePill } from "../components/ui/StatusBadge.jsx";

import { usersApi } from "../api/users.api.js";
import { getApiError } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import { fmtRelative } from "../utils/format.js";

export default function UsersPage() {
  const { user: me, hasRole } = useAuth();
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");

  const { data: users = [], isLoading, isError, refetch } = useQuery({
    queryKey: ["users", { role }],
    queryFn: () => usersApi.list({ role: role || undefined }),
  });

  const filtered = useMemo(() => {
    if (!search) return users;
    const q = search.toLowerCase();
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    );
  }, [users, search]);

  const roleMut = useMutation({
    mutationFn: ({ id, role }) => usersApi.updateRole(id, role),
    onSuccess: () => {
      toast.success("Role updated");
      qc.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (err) => toast.error(getApiError(err)),
  });

  const activeMut = useMutation({
    mutationFn: ({ id, isActive }) => usersApi.setActive(id, isActive),
    onSuccess: (_, vars) => {
      toast.success(vars.isActive ? "User activated" : "User deactivated");
      qc.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (err) => toast.error(getApiError(err)),
  });

  const deleteMut = useMutation({
    mutationFn: usersApi.remove,
    onSuccess: () => {
      toast.success("User deleted");
      qc.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (err) => toast.error(getApiError(err)),
  });

  const isAdmin = hasRole("admin");
  const activeCount = filtered.filter((u) => u.isActive).length;

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-950 via-brand-900 to-brand-600 p-6 text-white shadow-card">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-brand-200">Workspace access</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight">Team command board</h1>
            <p className="mt-2 max-w-2xl text-white/70">
              Manage roles, active access, and ownership visibility from one responsive member grid.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
              <UsersIcon className="h-5 w-5 text-brand-200" />
              <p className="mt-2 text-2xl font-black">{filtered.length}</p>
              <p className="text-xs text-white/60">Members</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
              <UserRoundCheck className="h-5 w-5 text-brand-200" />
              <p className="mt-2 text-2xl font-black">{activeCount}</p>
              <p className="text-xs text-white/60">Active</p>
            </div>
            <div className="col-span-2 rounded-2xl bg-white/10 p-4 backdrop-blur sm:col-span-1">
              <ShieldCheck className="h-5 w-5 text-brand-200" />
              <p className="mt-2 text-2xl font-black">{filtered.filter((u) => u.role === "admin").length}</p>
              <p className="text-xs text-white/60">Admins</p>
            </div>
          </div>
        </div>
      </section>

      <Card>
        <CardContent className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-3">
          <div className="sm:col-span-2">
          <Input
            placeholder="Search by name or email…"
            leftIcon={<Search className="h-4 w-4" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          </div>
          <Select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            options={[
              { value: "", label: "All roles" },
              { value: "admin", label: "Admins" },
              { value: "manager", label: "Managers" },
              { value: "member", label: "Members" },
            ]}
          />
        </CardContent>
      </Card>

      {isError ? (
        <EmptyState
          icon={AlertTriangle}
          title="Couldn't load team"
          description="Please try again."
          action={<Button variant="secondary" onClick={() => refetch()}>Retry</Button>}
        />
      ) : isLoading ? (
        <Card className="p-4 space-y-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </Card>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={UsersIcon}
          title="No matching users"
          description="Try adjusting your filters."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((u) => {
            const isMe = u._id === me._id;
            return (
              <Card key={u._id} className="overflow-hidden">
                <div className={`h-2 ${u.isActive ? "bg-brand-500" : "bg-slate-300"}`} />
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <Avatar name={u.name} src={u.avatarUrl} size="lg" className="h-14 w-14 text-lg" />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="truncate font-black text-slate-950">{u.name}</h3>
                        {isMe && <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-brand-700">you</span>}
                      </div>
                      <p className="truncate text-sm text-slate-500">{u.email}</p>
                    </div>
                  </div>
                  <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-2xl bg-slate-50 p-3">
                      <p className="text-xs text-slate-500">Role</p>
                      <div className="mt-1">
                        {isAdmin && !isMe ? (
                          <Select
                            className="h-9 text-xs"
                            value={u.role}
                            onChange={(e) => roleMut.mutate({ id: u._id, role: e.target.value })}
                            options={[
                              { value: "admin", label: "Admin" },
                              { value: "manager", label: "Manager" },
                              { value: "member", label: "Member" },
                            ]}
                          />
                        ) : (
                          <RolePill role={u.role} />
                        )}
                      </div>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-3">
                      <p className="text-xs text-slate-500">Status</p>
                      <p className={`mt-2 inline-flex items-center gap-1.5 text-xs font-bold ${u.isActive ? "text-emerald-700" : "text-slate-500"}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${u.isActive ? "bg-emerald-500" : "bg-slate-400"}`} />
                        {u.isActive ? "Active" : "Inactive"}
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 text-xs text-slate-500">Joined {fmtRelative(u.createdAt)}</p>
                  {isAdmin && !isMe && (
                    <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="flex-1"
                        leftIcon={<Power className="h-3.5 w-3.5" />}
                        onClick={() => activeMut.mutate({ id: u._id, isActive: !u.isActive })}
                      >
                        {u.isActive ? "Deactivate" : "Activate"}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="flex-1 text-rose-600 hover:bg-rose-50"
                        leftIcon={<Trash2 className="h-3.5 w-3.5" />}
                        onClick={() => {
                          if (window.confirm(`Delete ${u.name}?`)) deleteMut.mutate(u._id);
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
