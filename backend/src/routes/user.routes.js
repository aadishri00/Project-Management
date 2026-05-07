import { Router } from "express";
import {
  listUsers,
  getUser,
  updateUserRole,
  setUserActive,
  deleteUser,
} from "../controllers/user.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/rbac.js";
import { validate } from "../middleware/validate.js";
import {
  idParamRule,
  listUserQueryRules,
  setActiveRules,
  updateRoleRules,
} from "../validators/user.validator.js";

const router = Router();

router.use(requireAuth);

// All authenticated users can view team list (for assignee/member pickers)
router.get("/", listUserQueryRules, validate, listUsers);
router.get("/:id", idParamRule, validate, getUser);

// Admin only mutations
router.patch("/:id/role", requireRole("admin"), updateRoleRules, validate, updateUserRole);
router.patch("/:id/active", requireRole("admin"), setActiveRules, validate, setUserActive);
router.delete("/:id", requireRole("admin"), idParamRule, validate, deleteUser);

export default router;
