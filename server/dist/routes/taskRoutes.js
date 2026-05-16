"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const taskController_1 = require("../controllers/taskController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.route('/')
    .get(auth_1.protect, taskController_1.getTasks)
    .post(auth_1.protect, auth_1.admin, taskController_1.createTask);
router.route('/:id')
    .get(auth_1.protect, taskController_1.getTaskById)
    .put(auth_1.protect, auth_1.admin, taskController_1.updateTask)
    .delete(auth_1.protect, auth_1.admin, taskController_1.deleteTask);
router.route('/:id/status')
    .patch(auth_1.protect, taskController_1.updateTaskStatus);
exports.default = router;
