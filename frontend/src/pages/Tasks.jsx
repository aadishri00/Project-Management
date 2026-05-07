import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Plus, Search, AlertTriangle, CheckSquare, Trash2, CalendarDays, FolderKanban } from "lucide-react";

import PageHeader from "../components/layout/PageHeader.jsx";
import Button from "../components/ui/Button.jsx";
import Input from "../components/ui/Input.jsx";
import Select from "../components/ui/Select.jsx";
import Modal from "../components/ui/Modal.jsx";
import Skeleton from "../components/ui/Skeleton.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import Avatar from "../components/ui/Avatar.jsx";
import { Card } from "../components/ui/Card.jsx";
import { StatusPill, PriorityPill } from "../components/ui/StatusBadge.jsx";
import RoleGate from "../components/auth/RoleGate.jsx";
import TaskForm from "../components/tasks/TaskForm.jsx";

import { tasksApi } from "../api/tasks.api.js";
import { projectsApi } from "../api/projects.api.js";
import { getApiError } from "../api/client.js";
import { fmtDate } from "../utils/format.js";

export default function Tasks() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [project, setProject] = useState("");
  const [assignee, setAssignee] = useState("");
  const [modal, setModal] = useState({ open: false, task: null });

  const { data: tasks = [], isLoading, isError, refetch } = useQuery({
    queryKey: ["tasks", { status, priority, project, assignee }],
    queryFn: () =>
      tasksApi.list({
        status: status || undefined,
        priority: priority || undefined,
        project: project || undefined,
        assignee: assignee || undefined,
      }),
  });

  const { data: projects = [] } = useQuery({
    queryKey: ["projects-light"],
    queryFn: () => projectsApi.list(),
  });

  const filtered = useMemo(() => {
    if (!search) return tasks;
    const q = search.toLowerCase();
    return tasks.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        (t.description || "").toLowerCase().includes(q)
    );
  }, [tasks, search]);

  const createMut = useMutation({
    mutationFn: tasksApi.create,
    onSuccess: () => {
      toast.success("Task created");
      qc.invalidateQueries({ queryKey: ["tasks"] });
      qc.invalidateQueries({ queryKey: ["dashboard-stats"] });
      setModal({ open: false, task: null });
    },
    onError: (err) => toast.error(getApiError(err)),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, payload }) => tasksApi.update(id, payload),
    onSuccess: () => {
      toast.success("Task updated");
      qc.invalidateQueries({ queryKey: ["tasks"] });
      qc.invalidateQueries({ queryKey: ["dashboard-stats"] });
      setModal({ open: false, task: null });
    },
    onError: (err) => toast.error(getApiError(err)),
  });

  const deleteMut = useMutation({
    mutationFn: tasksApi.remove,
    onSuccess: () => {
      toast.success("Task deleted");
      qc.invalidateQueries({ queryKey: ["tasks"] });
      qc.invalidateQueries({ queryKey: ["dashboard-stats"] });
      setModal({ open: false, task: null });
    },
    onError: (err) => toast.error(getApiError(err)),
  });

  return (
    <div>
      <PageHeader
        title="Tasks"
        description="Track every task across all your projects."
        actions={
          <Button
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={() => setModal({ open: true, task: null })}
          >
            New task
          </Button>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
        <div className="col-span-2 sm:col-span-3 lg:col-span-1">
          <Input
            placeholder="Search…"
            leftIcon={<Search className="h-4 w-4" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={project} onChange={(e) => setProject(e.target.value)}>
          <option value="">All projects</option>
          {projects.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name}
            </option>
          ))}
        </Select>
        <Select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          options={[
            { value: "", label: "All statuses" },
            { value: "todo", label: "To Do" },
            { value: "in_progress", label: "In Progress" },
            { value: "review", label: "In Review" },
            { value: "done", label: "Done" },
          ]}
        />
        <Select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          options={[
            { value: "", label: "All priorities" },
            { value: "low", label: "Low" },
            { value: "medium", label: "Medium" },
            { value: "high", label: "High" },
            { value: "urgent", label: "Urgent" },
          ]}
        />
        <Select
          value={assignee}
          onChange={(e) => setAssignee(e.target.value)}
          options={[
            { value: "", label: "Anyone" },
            { value: "me", label: "Me" },
          ]}
        />
      </div>

      {isError ? (
        <EmptyState
          icon={AlertTriangle}
          title="Couldn't load tasks"
          description="Please try again."
          action={<Button variant="secondary" onClick={() => refetch()}>Retry</Button>}
        />
      ) : isLoading ? (
        <Card>
          <div className="p-4 space-y-3">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </Card>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={CheckSquare}
          title={tasks.length === 0 ? "No tasks yet" : "No matches"}
          description={
            tasks.length === 0
              ? "Create your first task to start tracking work."
              : "Try clearing the filters."
          }
          action={
            <Button
              leftIcon={<Plus className="h-4 w-4" />}
              onClick={() => setModal({ open: true, task: null })}
            >
              New task
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((task) => (
            <Card
              key={task._id}
              role="button"
              tabIndex={0}
              onClick={() => setModal({ open: true, task })}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setModal({ open: true, task })}
              className="group cursor-pointer overflow-hidden hover:-translate-y-1"
            >
              <div className="h-2" style={{ background: task.project?.color || "#16b8a3" }} />
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="line-clamp-2 font-black text-slate-950 group-hover:text-brand-700">
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                        {task.description}
                      </p>
                    )}
                  </div>
                  <PriorityPill priority={task.priority} />
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  <StatusPill status={task.status} />
                  {task.project && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-100 bg-brand-50 px-2.5 py-0.5 text-xs font-semibold text-brand-700">
                      <FolderKanban className="h-3.5 w-3.5" />
                      {task.project.name}
                    </span>
                  )}
                </div>
                <div className="mt-5 flex items-center justify-between gap-3 border-t border-brand-100 pt-4">
                  <div className="min-w-0">
                    {task.assignee ? (
                      <div className="flex items-center gap-2">
                        <Avatar name={task.assignee.name} src={task.assignee.avatarUrl} size="sm" />
                        <span className="truncate text-xs font-semibold text-slate-700">
                          {task.assignee.name}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">Unassigned</span>
                    )}
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {fmtDate(task.dueDate)}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={modal.open}
        onClose={() => setModal({ open: false, task: null })}
        title={modal.task ? "Edit task" : "New task"}
        size="lg"
      >
        <TaskForm
          defaultValues={modal.task}
          submitLabel={modal.task ? "Save changes" : "Create task"}
          onCancel={() => setModal({ open: false, task: null })}
          onSubmit={(values) =>
            modal.task
              ? updateMut.mutateAsync({ id: modal.task._id, payload: values })
              : createMut.mutateAsync(values)
          }
        />
        {modal.task && (
          <RoleGate allow={["admin", "manager"]}>
            <div className="mt-4 pt-4 border-t border-slate-100">
              <Button
                variant="ghost"
                leftIcon={<Trash2 className="h-4 w-4" />}
                onClick={() => {
                  if (window.confirm("Delete this task?")) {
                    deleteMut.mutate(modal.task._id);
                  }
                }}
                className="text-rose-600 hover:bg-rose-50"
              >
                Delete task
              </Button>
            </div>
          </RoleGate>
        )}
      </Modal>
    </div>
  );
}
