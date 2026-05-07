import Task from "../models/Task.js";
import Project from "../models/Project.js";
import User from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

function canManageProject(user, project) {
  if (user.role === "admin" || user.role === "manager") return true;
  return project.owner.toString() === user._id.toString();
}

function canAccessProject(user, project) {
  if (user.role === "admin" || user.role === "manager") return true;
  if (project.owner.toString() === user._id.toString()) return true;
  return project.members.some((m) => m.toString() === user._id.toString());
}

function isProjectMember(userId, project) {
  const id = userId?.toString();
  if (!id) return false;
  return (
    project.owner.toString() === id ||
    project.members.some((m) => m.toString() === id)
  );
}

async function assertAssignableUser(assignee, project) {
  if (assignee === undefined || assignee === null || assignee === "") return;
  const user = await User.findById(assignee).select("_id isActive");
  if (!user || !user.isActive) {
    throw ApiError.badRequest("Assignee is invalid or inactive");
  }
  if (!isProjectMember(user._id, project)) {
    throw ApiError.badRequest("Assignee must be a member of the task project");
  }
}

export const listTasks = asyncHandler(async (req, res) => {
  const { status, priority, project, assignee, search } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (project) filter.project = project;
  if (assignee === "me") filter.assignee = req.user._id;
  else if (assignee) filter.assignee = assignee;
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  if (req.user.role === "member") {
    const accessibleProjects = await Project.find({
      $or: [{ owner: req.user._id }, { members: req.user._id }],
    }).select("_id");
    const accessibleIds = accessibleProjects.map((p) => p._id);
    if (filter.project) {
      const canViewRequestedProject = accessibleIds.some(
        (id) => id.toString() === filter.project.toString()
      );
      if (!canViewRequestedProject) {
        throw ApiError.forbidden("You do not have access to this project");
      }
    } else {
      filter.project = { $in: accessibleIds };
    }
  }

  const tasks = await Task.find(filter)
    .populate("assignee", "name email avatarUrl")
    .populate("createdBy", "name email avatarUrl")
    .populate("project", "name color status")
    .sort({ order: 1, updatedAt: -1 });

  res.json({ success: true, data: { tasks } });
});

export const getTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id)
    .populate("assignee", "name email avatarUrl")
    .populate("createdBy", "name email avatarUrl")
    .populate("project", "name color status owner members");
  if (!task) throw ApiError.notFound("Task not found");
  if (!canAccessProject(req.user, task.project)) {
    throw ApiError.forbidden("You do not have access to this task");
  }
  res.json({ success: true, data: { task } });
});

export const createTask = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.body.project);
  if (!project) throw ApiError.notFound("Project not found");
  if (!canAccessProject(req.user, project)) {
    throw ApiError.forbidden("You do not have access to this project");
  }
  await assertAssignableUser(req.body.assignee, project);
  const task = await Task.create({ ...req.body, createdBy: req.user._id });
  const populated = await Task.findById(task._id)
    .populate("assignee", "name email avatarUrl")
    .populate("createdBy", "name email avatarUrl")
    .populate("project", "name color status");
  res.status(201).json({ success: true, data: { task: populated } });
});

export const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id).populate("project", "owner members");
  if (!task) throw ApiError.notFound("Task not found");
  if (!canAccessProject(req.user, task.project)) {
    throw ApiError.forbidden("You do not have access to this task");
  }

  // Members can only update tasks they're assigned to
  if (
    req.user.role === "member" &&
    task.project.owner.toString() !== req.user._id.toString() &&
    task.assignee?.toString() !== req.user._id.toString()
  ) {
    throw ApiError.forbidden("You can only update tasks assigned to you");
  }

  await assertAssignableUser(req.body.assignee, task.project);
  Object.assign(task, req.body);
  await task.save();
  const populated = await Task.findById(task._id)
    .populate("assignee", "name email avatarUrl")
    .populate("createdBy", "name email avatarUrl")
    .populate("project", "name color status");
  res.json({ success: true, data: { task: populated } });
});

export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id).populate("project", "owner members");
  if (!task) throw ApiError.notFound("Task not found");
  if (!canManageProject(req.user, task.project)) {
    throw ApiError.forbidden("Only managers, admin, or project owner can delete tasks");
  }
  await task.deleteOne();
  res.json({ success: true, message: "Task deleted" });
});
