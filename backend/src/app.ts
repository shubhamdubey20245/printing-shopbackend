import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './modules/auth/authRoutes';
import customerRoutes from './modules/customers/customerRoutes';
import medicineRoutes from './modules/medicines/medicineRoutes';
import billingRoutes from './modules/billing/billingRoutes';
import categoryRoutes from './modules/categories/categoryRoutes';
import supplierRoutes from './modules/suppliers/supplierRoutes';
import purchaseRoutes from './modules/purchases/purchaseRoutes';
import dashboardRoutes from './modules/dashboard/dashboardRoutes';
import reportRoutes from './modules/reports/reportRoutes';
import settingsRoutes from './modules/settings/settingsRoutes';
import analyticsRoutes from './modules/analytics/analyticsRoutes';
import inventoryRoutes from './modules/inventory/inventoryRoutes';
import doctorRoutes from './modules/doctors/doctorRoutes';

const app = express();

app.use(helmet());
app.use(cors({
  origin: [
    'https://mediflow11.netlify.app',
    'http://localhost:5173',
    'http://localhost:3000'
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/doctors', doctorRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'MediFlow API is running' });
});

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('GLOBAL ERROR CAUGHT BY EXPRESS:', err);
  require('fs').writeFileSync('global-error.log', JSON.stringify({
    message: err.message,
    stack: err.stack,
    name: err.name
  }, null, 2));
  res.status(500).json({ message: err.message || 'Internal server error from global handler' });
});

export default app;