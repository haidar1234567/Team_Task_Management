import { Response } from 'express';
import { Task } from '../models/Task';
import { Project } from '../models/Project';
import { AuthRequest } from '../middleware/auth';

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private
export const getDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    let taskQuery: any = {};
    let projectQuery: any = {};

    if (req.user?.role !== 'Admin') {
      const userProjects = await Project.find({ members: req.user?._id }).select('_id');
      const projectIds = userProjects.map(p => p._id);
      taskQuery.project = { $in: projectIds };
      projectQuery.members = req.user?._id;
    }

    const totalProjects = await Project.countDocuments(projectQuery);
    const totalTasks = await Task.countDocuments(taskQuery);
    const completedTasks = await Task.countDocuments({ ...taskQuery, status: 'Done' });
    const pendingTasks = await Task.countDocuments({ ...taskQuery, status: 'To Do' });
    const inProgressTasks = await Task.countDocuments({ ...taskQuery, status: 'In Progress' });
    const overdueTasks = await Task.countDocuments({ 
      ...taskQuery, 
      status: { $ne: 'Done' }, 
      dueDate: { $lt: new Date() } 
    });

    const tasksByPriority = await Task.aggregate([
      { $match: taskQuery },
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);

    const tasksByStatus = await Task.aggregate([
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
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
