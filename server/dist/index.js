"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./db"));
const error_1 = require("./middleware/error");
// Import routes
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const projectRoutes_1 = __importDefault(require("./routes/projectRoutes"));
const taskRoutes_1 = __importDefault(require("./routes/taskRoutes"));
const dashboardRoutes_1 = __importDefault(require("./routes/dashboardRoutes"));
dotenv_1.default.config();
// Initialize DB
(0, db_1.default)();
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
// Middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL || '*',
    credentials: true
}));
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)('dev'));
// API Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/projects', projectRoutes_1.default);
app.use('/api/tasks', taskRoutes_1.default);
app.use('/api/dashboard', dashboardRoutes_1.default);
// Base route
app.get('/', (req, res) => {
    res.send('Task Manager API is running');
});
// Error Handling
app.use(error_1.notFound);
app.use(error_1.errorHandler);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
exports.default = app;
