import 'reflect-metadata';
import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { AppDataSource } from './config/database';
import { seedDatabase } from './seeders/seed';
import { errorHandler } from './middleware/errorHandler';

import authRoutes from './routes/auth.routes';
import studentRoutes from './routes/student.routes';
import adminRoutes from './routes/admin.routes';
import hostelRoutes from './routes/hostel.routes';
import announcementRoutes from './routes/announcement.routes';
import eligibilityRoutes from './routes/eligibility.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ── CORS Configuration ────────────────────────────────────────────────────────
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow localhost or no origin (e.g., Postman / curl)
      if (!origin || origin.includes('localhost') || origin.includes('127.0.0.1')) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive for local dev
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// ── Body Parser ───────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Health Check ──────────────────────────────────────────────────────────────
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'OK',
    service: 'Sindh University Dormitory Management System Backend (Node.js + Express)',
    timestamp: new Date(),
  });
});

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/hostels', hostelRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/eligibility', eligibilityRoutes);

// ── Global Error Handler ──────────────────────────────────────────────────────
app.use(errorHandler);

// ── Database Initialization & Server Startup ──────────────────────────────────
AppDataSource.initialize()
  .then(async () => {
    console.log('✅ Database connected via TypeORM (MySQL)');

    // Seed initial demo & admin data
    try {
      await seedDatabase();
    } catch (seedErr) {
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

export default app;
