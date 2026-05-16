import { Response } from 'express';
import { Project } from '../models/Project';
import { User } from '../models/User';
import { AuthRequest } from '../middleware/auth';

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private
export const getProjects = async (req: AuthRequest, res: Response) => {
  try {
    let projects;
    if (req.user?.role === 'Admin') {
      projects = await Project.find().populate('createdBy', 'name email').populate('members', 'name email');
    } else {
      projects = await Project.find({ members: req.user?._id }).populate('createdBy', 'name email').populate('members', 'name email');
    }
    res.json({ success: true, message: 'Projects fetched', data: projects });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get project by ID
// @route   GET /api/projects/:id
// @access  Private
export const getProjectById = async (req: AuthRequest, res: Response) => {
  try {
    const project = await Project.findById(req.params.id).populate('createdBy', 'name email').populate('members', 'name email');
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    
    // Check if member or admin
    if (req.user?.role !== 'Admin' && !project.members.some(m => m._id.toString() === req.user?._id.toString())) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    res.json({ success: true, message: 'Project fetched', data: project });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a project
// @route   POST /api/projects
// @access  Private/Admin
export const createProject = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description } = req.body;
    const project = new Project({
      title,
      description,
      createdBy: req.user?._id,
      members: [req.user?._id], // admin is inherently a member
    });
    const createdProject = await project.save();
    res.status(201).json({ success: true, message: 'Project created', data: createdProject });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private/Admin
export const updateProject = async (req: AuthRequest, res: Response) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    project.title = req.body.title || project.title;
    project.description = req.body.description || project.description;

    const updatedProject = await project.save();
    res.json({ success: true, message: 'Project updated', data: updatedProject });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
export const deleteProject = async (req: AuthRequest, res: Response) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    await project.deleteOne();
    res.json({ success: true, message: 'Project removed', data: {} });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add member to project
// @route   POST /api/projects/:id/members
// @access  Private/Admin
export const addMemberToProject = async (req: AuthRequest, res: Response) => {
  try {
    const { email } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (project.members.includes(user._id as any)) {
      return res.status(400).json({ success: false, message: 'User is already a member' });
    }

    project.members.push(user._id as any);
    await project.save();
    
    res.json({ success: true, message: 'Member added', data: project });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Remove member from project
// @route   DELETE /api/projects/:id/members/:userId
// @access  Private/Admin
export const removeMemberFromProject = async (req: AuthRequest, res: Response) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    project.members = project.members.filter(m => m.toString() !== req.params.userId);
    await project.save();

    res.json({ success: true, message: 'Member removed', data: project });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
