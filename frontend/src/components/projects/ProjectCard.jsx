import { Link } from "react-router-dom";
import { Calendar, CheckSquare, ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "../ui/Card.jsx";
import { StatusPill, PriorityPill } from "../ui/StatusBadge.jsx";
import { AvatarGroup } from "../ui/Avatar.jsx";
import { fmtDate } from "../../utils/format.js";

export default function ProjectCard({ project }) {
  const dueSoon =
    project.dueDate &&
    new Date(project.dueDate) - new Date() < 1000 * 60 * 60 * 24 * 7 &&
    project.status !== "completed";

  return (
    <Link to={`/projects/${project._id}`} className="block group">
      <Card className="relative h-full overflow-hidden transition hover:shadow-card group-hover:-translate-y-0.5">
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-10" style={{ background: project.color }} />
        <div className="h-2" style={{ background: project.color }} />
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="font-black text-slate-950 truncate group-hover:text-brand-700 transition">
                {project.name}
              </h3>
              {project.description && (
                <p className="mt-1 text-sm text-slate-500 line-clamp-2">
                  {project.description}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <PriorityPill priority={project.priority} />
              <ArrowUpRight className="h-4 w-4 text-slate-300 transition group-hover:text-brand-600" />
            </div>
          </div>

          <div className="mt-5 flex items-center gap-2 flex-wrap">
            <StatusPill status={project.status} />
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600">
              <CheckSquare className="h-3.5 w-3.5" />
              {project.taskCount || 0} tasks
            </span>
            {project.dueDate && (
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                  dueSoon ? "text-rose-600 font-medium" : "text-slate-500"
                }`}
              >
                <Calendar className="h-3.5 w-3.5" />
                {fmtDate(project.dueDate, "MMM d")}
              </span>
            )}
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-brand-100 pt-4">
            <AvatarGroup users={project.members || []} max={4} />
            <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
              Owner: {project.owner?.name?.split(" ")[0] || "Team"}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
