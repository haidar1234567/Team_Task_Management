import { Response } from 'express';
import { Task } from '../models/Task';
import { Project } from '../models/Project';
import { AuthRequest } from '../middleware/auth';

// @desc    Get all tasks (with pagination, filtering)
// @route   GET /api/tasks
// @access  Private
export const getTasks = async (req: AuthRequest, res: Response) => {
  try {
    const { projectId, status, priority, limit = 50, page = 1 } = req.query;
    
    const query: any = {};
    if (projectId) query.project = projectId;
    if (status) query.status = status;
    if (priority) query.priority = priority;

    if (req.user?.role !== 'Admin') {
      // Members only see tasks in projects they belong to
      const userProjects = await Project.find({ members: req.user?._id }).select('_id');
      const projectIds = userProjects.map(p => p._id);
      query.project = { $in: projectIds };
    }

    const tasks = await Task.find(query)
      .populate('assignedTo', 'name email')
      .populate('project', 'title')
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .sort({ createdAt: -1 });

    const total = await Task.countDocuments(query);

    res.json({ 
      success: true, 
      message: 'Tasks fetched', 
      data: { tasks, total, page: Number(page), pages: Math.ceil(total / Number(limit)) }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get task by ID
// @route   GET /api/tasks/:id
// @access  Private
export const getTaskById = async (req: AuthRequest, res: Response) => {
  try {
    const task = await Task.findById(req.params.id).populate('assignedTo', 'name email').populate('project', 'title');
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    res.json({ success: true, message: 'Task fetched', data: task });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private/Admin
export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, status, priority, dueDate, assignedTo, project } = req.body;
    
    const proj = await Project.findById(project);
    if (!proj) return res.status(404).json({ success: false, message: 'Project not found' });

    if (assignedTo && !proj.members.includes(assignedTo)) {
      return res.status(400).json({ success: false, message: 'Assigned user is not a member of the project' });
    }

    const task = new Task({
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
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private/Admin
export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    const { title, description, status, priority, dueDate, assignedTo } = req.body;

    if (assignedTo) {
      const proj = await Project.findById(task.project);
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
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private/Admin
export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    await task.deleteOne();
    res.json({ success: true, message: 'Task removed', data: {} });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update task status
// @route   PATCH /api/tasks/:id/status
// @access  Private
export const updateTaskStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    // Ensure member is assigned to task or is admin
    if (req.user?.role !== 'Admin' && task.assignedTo?.toString() !== req.user?._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this task' });
    }

    task.status = status;
    const updatedTask = await task.save();
    res.json({ success: true, message: 'Task status updated', data: updatedTask });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
