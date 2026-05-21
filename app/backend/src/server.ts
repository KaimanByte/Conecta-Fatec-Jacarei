import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize, { connectWithRetry } from './models/index.js';
import { auth } from './middleware/auth.js';
import { seedDatabase } from './config/seed.js';

// Import Routes
import authRoutes from './routes/authRoutes.js';
import nodeRoutes from './routes/nodeRoutes.js';
import inquiryRoutes from './routes/inquiryRoutes.js';
import logRoutes from './routes/logRoutes.js';
import { initMailer } from './utils/mailer.js';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// ─── Health ──────────────────────────────────────────────────────────────────
app.get('/health', (_req: Request, res: Response) =>
  res.json({ status: 'OK', message: 'Backend Chatbot Acadêmico rodando!' })
);

// ─── Routes Registration ──────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api', nodeRoutes);    // Mounts /chat/... and /admin/nodes...
app.use('/api', inquiryRoutes); // Mounts /inquiries and /admin/inquiries...
app.use('/api', logRoutes);     // Mounts /logs and /admin/logs...
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ─── Test routes ──────────────────────────────────────────────────────────────
app.get('/test/auth', auth, (req: Request, res: Response) => {
  res.json({ message: 'Auth OK', user: req.user });
});

// ─── Root ─────────────────────────────────────────────────────────────────────
app.get('/', (_req: Request, res: Response) =>
  res.send('Chatbot Acadêmico — Backend OK Modularizado. Porta: ' + PORT)
);

// ─── Sync & Seed ─────────────────────────────────────────────────────────────
async function startServer() {
  try {
    await connectWithRetry();
    await sequelize.sync({ force: false });
    console.log('📦 Database synced');
    await initMailer();
    await seedDatabase();

    app.listen(PORT, () => console.log(`🚀 Server em http://localhost:${PORT}`));
  } catch (err) {
    console.error('❌ Falha ao iniciar servidor:', err);
    process.exit(1);
  }
}

startServer();

export default app;

