import { body, param, query } from "express-validator";

const isObjectId = (v) => /^[0-9a-fA-F]{24}$/.test(v);

export const idParamRule = [
  param("id").custom(isObjectId).withMessage("Invalid user id"),
];

export const listUserQueryRules = [
  query("search").optional().isString().trim().isLength({ max: 120 }),
  query("role").optional().isIn(["admin", "manager", "member"]).withMessage("Invalid role"),
];

export const updateRoleRules = [
  ...idParamRule,
  body("role").isIn(["admin", "manager", "member"]).withMessage("Invalid role"),
];

export const setActiveRules = [
  ...idParamRule,
  body("isActive").isBoolean().withMessage("isActive must be a boolean").toBoolean(),
];
