import { useState } from "react";
import { Plus } from "lucide-react";
import TaskCard from "./TaskCard.jsx";
import { STATUS_LABEL, STATUS_COLORS } from "../../utils/format.js";
import { cn } from "../../utils/cn.js";

const COLUMNS = ["todo", "in_progress", "review", "done"];
const COLUMN_STYLES = {
  todo: "from-slate-100 to-white",
  in_progress: "from-cyan-50 to-white",
  review: "from-amber-50 to-white",
  done: "from-emerald-50 to-white",
};

export default function TaskBoard({
  tasks = [],
  onTaskClick,
  onStatusChange,
  onAddTask,
  canEdit = true,
}) {
  const [dragOver, setDragOver] = useState(null);

  const grouped = COLUMNS.reduce((acc, status) => {
    acc[status] = tasks.filter((t) => t.status === status);
    return acc;
  }, {});

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {COLUMNS.map((status) => {
        const cfg = STATUS_COLORS[status];
        const list = grouped[status];
        return (
          <div
            key={status}
            onDragOver={(e) => {
              if (!canEdit) return;
              e.preventDefault();
              setDragOver(status);
            }}
            onDragLeave={() => setDragOver(null)}
            onDrop={(e) => {
              if (!canEdit) return;
              e.preventDefault();
              const id = e.dataTransfer.getData("text/task-id");
              const fromStatus = e.dataTransfer.getData("text/from-status");
              setDragOver(null);
              if (id && fromStatus !== status) onStatusChange?.(id, status);
            }}
            className={cn(
              `rounded-[1.75rem] border bg-gradient-to-b ${COLUMN_STYLES[status]} p-3 flex flex-col min-h-[360px] transition shadow-soft`,
              dragOver === status
                ? "border-brand-400 bg-brand-50/60"
                : "border-brand-100"
            )}
          >
            <div className="mb-3 flex items-center justify-between rounded-2xl bg-white/80 px-3 py-3 shadow-soft">
              <div className="flex items-center gap-2">
                <span className={cn("h-3 w-3 rounded-full ring-4 ring-white", cfg.dot)} />
                <h3 className="text-sm font-black text-slate-800">
                  {STATUS_LABEL[status]}
                </h3>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-500">
                  {list.length}
                </span>
              </div>
              {onAddTask && canEdit && (
                <button
                  onClick={() => onAddTask(status)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-white hover:text-brand-700 transition"
                  aria-label="Add task"
                >
                  <Plus className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="flex-1 space-y-3">
              {list.length === 0 ? (
                <div className="grid min-h-40 place-items-center rounded-2xl border border-dashed border-brand-100 bg-white/60 p-6 text-center text-xs font-semibold text-slate-400">
                  Drop tasks here
                </div>
              ) : (
                list.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onClick={() => onTaskClick?.(task)}
                    draggable={canEdit}
                    onDragStart={(e) => {
                      e.dataTransfer.setData("text/task-id", task._id);
                      e.dataTransfer.setData("text/from-status", task.status);
                    }}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
