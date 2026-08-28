"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = require("./config/database");
const seed_1 = require("./seeders/seed");
const errorHandler_1 = require("./middleware/errorHandler");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const student_routes_1 = __importDefault(require("./routes/student.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const hostel_routes_1 = __importDefault(require("./routes/hostel.routes"));
const announcement_routes_1 = __importDefault(require("./routes/announcement.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// ── CORS Configuration ────────────────────────────────────────────────────────
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // Allow localhost or no origin (e.g., Postman / curl)
        if (!origin || origin.includes('localhost') || origin.includes('127.0.0.1')) {
            callback(null, true);
        }
        else {
            callback(null, true); // Permissive for local dev
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));
// ── Body Parser ───────────────────────────────────────────────────────────────
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// ── Health Check ──────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        service: 'Sindh University Dormitory Management System Backend (Node.js + Express)',
        timestamp: new Date(),
    });
});
// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/auth', auth_routes_1.default);
app.use('/api/students', student_routes_1.default);
app.use('/api/admin', admin_routes_1.default);
app.use('/api/hostels', hostel_routes_1.default);
app.use('/api/announcements', announcement_routes_1.default);
// ── Global Error Handler ──────────────────────────────────────────────────────
app.use(errorHandler_1.errorHandler);
// ── Database Initialization & Server Startup ──────────────────────────────────
database_1.AppDataSource.initialize()
    .then(async () => {
    console.log('✅ Database connected via TypeORM (MySQL)');
    // Seed initial demo & admin data
    try {
        await (0, seed_1.seedDatabase)();
    }
    catch (seedErr) {
        console.warn('⚠️ Seeding notice:', seedErr);
    }
    app.listen(PORT, () => {
        console.log(`=======================================================`);
        console.log(`🚀 Sindh Dormitory Node Backend running on port ${PORT}`);
        console.log(`🔗 API Base: http://localhost:${PORT}/api`);
        console.log(`=======================================================`);
    });
})
    .catch((error) => {
    console.error('❌ Database connection error:', error);
});
exports.default = app;
//# sourceMappingURL=app.js.map