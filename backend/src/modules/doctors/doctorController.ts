import { Response } from 'express';
import { AuthRequest } from '../../middlewares/authMiddleware';
import { Doctor } from '../../database/models/Doctor';
import { Op } from 'sequelize';

export const getDoctors = async (req: AuthRequest, res: Response) => {
  try {
    const tenantId = req.tenant?.id;
    const { search, phone } = req.query;

    const whereClause: any = { tenant_id: tenantId };
    
    if (phone) {
      whereClause.phone = phone;
    } else if (search) {
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { phone: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const doctors = await Doctor.findAll({
      where: whereClause,
      order: [['created_at', 'DESC']]
    });

    res.json({ success: true, data: doctors });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createDoctor = async (req: AuthRequest, res: Response) => {
  try {
    const tenantId = req.tenant?.id;
    const { name, phone, reg_no, commission_percent, address, speciality, qualification } = req.body;

    // Check if phone already exists in tenant
    const existing = await Doctor.findOne({ where: { tenant_id: tenantId, phone } });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Doctor with this phone number already exists' });
    }

    const doctor = await Doctor.create({
      tenant_id: tenantId,
      name,
      phone,
      reg_no,
      commission_percent: commission_percent || 0,
      address,
      speciality,
      qualification
    });

    res.status(201).json({ success: true, data: doctor });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateDoctor = async (req: AuthRequest, res: Response) => {
  try {
    const tenantId = req.tenant?.id;
    const { id } = req.params;
    const { name, phone, reg_no, commission_percent, address, speciality, qualification } = req.body;

    const doctor = await Doctor.findOne({ where: { id, tenant_id: tenantId } });
    
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    await doctor.update({
      name, phone, reg_no, commission_percent, address, speciality, qualification
    });

    res.json({ success: true, data: doctor });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteDoctor = async (req: AuthRequest, res: Response) => {
  try {
    const tenantId = req.tenant?.id;
    const { id } = req.params;

    const doctor = await Doctor.findOne({ where: { id, tenant_id: tenantId } });
    
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    await doctor.destroy();

    res.json({ success: true, message: 'Doctor deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
