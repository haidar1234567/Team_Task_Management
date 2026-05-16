"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = void 0;
const Task_1 = require("../models/Task");
const Project_1 = require("../models/Project");
// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = async (req, res) => {
    try {
        let taskQuery = {};
        let projectQuery = {};
        if (req.user?.role !== 'Admin') {
            const userProjects = await Project_1.Project.find({ members: req.user?._id }).select('_id');
            const projectIds = userProjects.map(p => p._id);
            taskQuery.project = { $in: projectIds };
            projectQuery.members = req.user?._id;
        }
        const totalProjects = await Project_1.Project.countDocuments(projectQuery);
        const totalTasks = await Task_1.Task.countDocuments(taskQuery);
        const completedTasks = await Task_1.Task.countDocuments({ ...taskQuery, status: 'Done' });
        const pendingTasks = await Task_1.Task.countDocuments({ ...taskQuery, status: 'To Do' });
        const inProgressTasks = await Task_1.Task.countDocuments({ ...taskQuery, status: 'In Progress' });
        const overdueTasks = await Task_1.Task.countDocuments({
            ...taskQuery,
            status: { $ne: 'Done' },
            dueDate: { $lt: new Date() }
        });
        const tasksByPriority = await Task_1.Task.aggregate([
            { $match: taskQuery },
            { $group: { _id: '$priority', count: { $sum: 1 } } }
        ]);
        const tasksByStatus = await Task_1.Task.aggregate([
            { $match: taskQuery },
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);
        res.json({
            success: true,
            message: 'Stats fetched',
            data: {
                totalProjects,
                totalTasks,
                completedTasks,
                pendingTasks,
                inProgressTasks,
                overdueTasks,
                tasksByPriority: tasksByPriority.map(t => ({ name: t._id, value: t.count })),
                tasksByStatus: tasksByStatus.map(t => ({ name: t._id, value: t.count })),
            }
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getDashboardStats = getDashboardStats;
