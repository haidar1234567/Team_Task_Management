"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTaskStatus = exports.deleteTask = exports.updateTask = exports.createTask = exports.getTaskById = exports.getTasks = void 0;
const Task_1 = require("../models/Task");
const Project_1 = require("../models/Project");
// @desc    Get all tasks (with pagination, filtering)
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
    try {
        const { projectId, status, priority, limit = 50, page = 1 } = req.query;
        const query = {};
        if (projectId)
            query.project = projectId;
        if (status)
            query.status = status;
        if (priority)
            query.priority = priority;
        if (req.user?.role !== 'Admin') {
            // Members only see tasks in projects they belong to
            const userProjects = await Project_1.Project.find({ members: req.user?._id }).select('_id');
            const projectIds = userProjects.map(p => p._id);
            query.project = { $in: projectIds };
        }
        const tasks = await Task_1.Task.find(query)
            .populate('assignedTo', 'name email')
            .populate('project', 'title')
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit))
            .sort({ createdAt: -1 });
        const total = await Task_1.Task.countDocuments(query);
        res.json({
            success: true,
            message: 'Tasks fetched',
            data: { tasks, total, page: Number(page), pages: Math.ceil(total / Number(limit)) }
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getTasks = getTasks;
// @desc    Get task by ID
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = async (req, res) => {
    try {
        const task = await Task_1.Task.findById(req.params.id).populate('assignedTo', 'name email').populate('project', 'title');
        if (!task)
            return res.status(404).json({ success: false, message: 'Task not found' });
        res.json({ success: true, message: 'Task fetched', data: task });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getTaskById = getTaskById;
// @desc    Create a task
// @route   POST /api/tasks
// @access  Private/Admin
const createTask = async (req, res) => {
    try {
        const { title, description, status, priority, dueDate, assignedTo, project } = req.body;
        const proj = await Project_1.Project.findById(project);
        if (!proj)
            return res.status(404).json({ success: false, message: 'Project not found' });
        if (assignedTo && !proj.members.includes(assignedTo)) {
            return res.status(400).json({ success: false, message: 'Assigned user is not a member of the project' });
        }
        const task = new Task_1.Task({
            title,
            description,
            status,
            priority,
            dueDate,
            assignedTo,
            project,
            createdBy: req.user?._id,
        });
        const createdTask = await task.save();
        res.status(201).json({ success: true, message: 'Task created', data: createdTask });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.createTask = createTask;
// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private/Admin
const updateTask = async (req, res) => {
    try {
        const task = await Task_1.Task.findById(req.params.id);
        if (!task)
            return res.status(404).json({ success: false, message: 'Task not found' });
        const { title, description, status, priority, dueDate, assignedTo } = req.body;
        if (assignedTo) {
            const proj = await Project_1.Project.findById(task.project);
            if (proj && !proj.members.includes(assignedTo)) {
                return res.status(400).json({ success: false, message: 'Assigned user is not a member of the project' });
            }
        }
        task.title = title || task.title;
        task.description = description || task.description;
        task.status = status || task.status;
        task.priority = priority || task.priority;
        task.dueDate = dueDate || task.dueDate;
        task.assignedTo = assignedTo || task.assignedTo;
        const updatedTask = await task.save();
        res.json({ success: true, message: 'Task updated', data: updatedTask });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.updateTask = updateTask;
// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private/Admin
const deleteTask = async (req, res) => {
    try {
        const task = await Task_1.Task.findById(req.params.id);
        if (!task)
            return res.status(404).json({ success: false, message: 'Task not found' });
        await task.deleteOne();
        res.json({ success: true, message: 'Task removed', data: {} });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.deleteTask = deleteTask;
// @desc    Update task status
// @route   PATCH /api/tasks/:id/status
// @access  Private
const updateTaskStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const task = await Task_1.Task.findById(req.params.id);
        if (!task)
            return res.status(404).json({ success: false, message: 'Task not found' });
        // Ensure member is assigned to task or is admin
        if (req.user?.role !== 'Admin' && task.assignedTo?.toString() !== req.user?._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized to update this task' });
        }
        task.status = status;
        const updatedTask = await task.save();
        res.json({ success: true, message: 'Task status updated', data: updatedTask });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.updateTaskStatus = updateTaskStatus;
