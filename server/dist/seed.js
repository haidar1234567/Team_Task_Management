"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./db"));
const User_1 = require("./models/User");
const Project_1 = require("./models/Project");
const Task_1 = require("./models/Task");
dotenv_1.default.config();
(0, db_1.default)();
const importData = async () => {
    try {
        await User_1.User.deleteMany();
        await Project_1.Project.deleteMany();
        await Task_1.Task.deleteMany();
        const createdUsers = await User_1.User.insertMany([
            {
                name: 'Admin User',
                email: 'admin@test.com',
                password: 'password123',
                role: 'Admin',
            },
            {
                name: 'Member User',
                email: 'member@test.com',
                password: 'password123',
                role: 'Member',
            },
        ]);
        const adminUser = createdUsers[0]._id;
        const memberUser = createdUsers[1]._id;
        const createdProjects = await Project_1.Project.insertMany([
            {
                title: 'Project Alpha',
                description: 'First test project',
                createdBy: adminUser,
                members: [adminUser, memberUser],
            },
            {
                title: 'Project Beta',
                description: 'Second test project',
                createdBy: adminUser,
                members: [adminUser], // Member is not part of Beta
            },
        ]);
        await Task_1.Task.insertMany([
            {
                title: 'Task 1 for Alpha',
                description: 'Do something',
                status: 'To Do',
                priority: 'High',
                dueDate: new Date(Date.now() + 86400000), // tomorrow
                assignedTo: memberUser,
                project: createdProjects[0]._id,
                createdBy: adminUser,
            },
            {
                title: 'Task 2 for Beta',
                description: 'Admin only task',
                status: 'In Progress',
                priority: 'Medium',
                dueDate: new Date(Date.now() + 86400000 * 2), // 2 days from now
                assignedTo: adminUser,
                project: createdProjects[1]._id,
                createdBy: adminUser,
            },
        ]);
        console.log('Data Imported!');
        process.exit();
    }
    catch (error) {
        console.error(`Error with data import: ${error}`);
        process.exit(1);
    }
};
const destroyData = async () => {
    try {
        await User_1.User.deleteMany();
        await Project_1.Project.deleteMany();
        await Task_1.Task.deleteMany();
        console.log('Data Destroyed!');
        process.exit();
    }
    catch (error) {
        console.error(`Error with data destruction: ${error}`);
        process.exit(1);
    }
};
if (process.argv[2] === '-d') {
    destroyData();
}
else {
    importData();
}
