"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const projectController_1 = require("../controllers/projectController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.route('/')
    .get(auth_1.protect, projectController_1.getProjects)
    .post(auth_1.protect, auth_1.admin, projectController_1.createProject);
router.route('/:id')
    .get(auth_1.protect, projectController_1.getProjectById)
    .put(auth_1.protect, auth_1.admin, projectController_1.updateProject)
    .delete(auth_1.protect, auth_1.admin, projectController_1.deleteProject);
router.route('/:id/members')
    .post(auth_1.protect, auth_1.admin, projectController_1.addMemberToProject);
router.route('/:id/members/:userId')
    .delete(auth_1.protect, auth_1.admin, projectController_1.removeMemberFromProject);
exports.default = router;
