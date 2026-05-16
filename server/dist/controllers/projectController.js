"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeMemberFromProject = exports.addMemberToProject = exports.deleteProject = exports.updateProject = exports.createProject = exports.getProjectById = exports.getProjects = void 0;
const Project_1 = require("../models/Project");
const User_1 = require("../models/User");
// @desc    Get all projects
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res) => {
    try {
        let projects;
        if (req.user?.role === 'Admin') {
            projects = await Project_1.Project.find().populate('createdBy', 'name email').populate('members', 'name email');
        }
        else {
            projects = await Project_1.Project.find({ members: req.user?._id }).populate('createdBy', 'name email').populate('members', 'name email');
        }
        res.json({ success: true, message: 'Projects fetched', data: projects });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getProjects = getProjects;
// @desc    Get project by ID
// @route   GET /api/projects/:id
// @access  Private
const getProjectById = async (req, res) => {
    try {
        const project = await Project_1.Project.findById(req.params.id).populate('createdBy', 'name email').populate('members', 'name email');
        if (!project)
            return res.status(404).json({ success: false, message: 'Project not found' });
        // Check if member or admin
        if (req.user?.role !== 'Admin' && !project.members.some(m => m._id.toString() === req.user?._id.toString())) {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }
        res.json({ success: true, message: 'Project fetched', data: project });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getProjectById = getProjectById;
// @desc    Create a project
// @route   POST /api/projects
// @access  Private/Admin
const createProject = async (req, res) => {
    try {
        const { title, description } = req.body;
        const project = new Project_1.Project({
            title,
            description,
            createdBy: req.user?._id,
            members: [req.user?._id], // admin is inherently a member
        });
        const createdProject = await project.save();
        res.status(201).json({ success: true, message: 'Project created', data: createdProject });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.createProject = createProject;
// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private/Admin
const updateProject = async (req, res) => {
    try {
        const project = await Project_1.Project.findById(req.params.id);
        if (!project)
            return res.status(404).json({ success: false, message: 'Project not found' });
        project.title = req.body.title || project.title;
        project.description = req.body.description || project.description;
        const updatedProject = await project.save();
        res.json({ success: true, message: 'Project updated', data: updatedProject });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.updateProject = updateProject;
// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
const deleteProject = async (req, res) => {
    try {
        const project = await Project_1.Project.findById(req.params.id);
        if (!project)
            return res.status(404).json({ success: false, message: 'Project not found' });
        await project.deleteOne();
        res.json({ success: true, message: 'Project removed', data: {} });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.deleteProject = deleteProject;
// @desc    Add member to project
// @route   POST /api/projects/:id/members
// @access  Private/Admin
const addMemberToProject = async (req, res) => {
    try {
        const { email } = req.body;
        const project = await Project_1.Project.findById(req.params.id);
        if (!project)
            return res.status(404).json({ success: false, message: 'Project not found' });
        const user = await User_1.User.findOne({ email });
        if (!user)
            return res.status(404).json({ success: false, message: 'User not found' });
        if (project.members.includes(user._id)) {
            return res.status(400).json({ success: false, message: 'User is already a member' });
        }
        project.members.push(user._id);
        await project.save();
        res.json({ success: true, message: 'Member added', data: project });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.addMemberToProject = addMemberToProject;
// @desc    Remove member from project
// @route   DELETE /api/projects/:id/members/:userId
// @access  Private/Admin
const removeMemberFromProject = async (req, res) => {
    try {
        const project = await Project_1.Project.findById(req.params.id);
        if (!project)
            return res.status(404).json({ success: false, message: 'Project not found' });
        project.members = project.members.filter(m => m.toString() !== req.params.userId);
        await project.save();
        res.json({ success: true, message: 'Member removed', data: project });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.removeMemberFromProject = removeMemberFromProject;
