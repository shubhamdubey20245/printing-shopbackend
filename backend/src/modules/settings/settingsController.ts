import { Response } from 'express';
import { AuthRequest } from '../../middlewares/authMiddleware';
const db = require('../../database/models');
const { TenantSetting } = db;

export const getStoreProfile = async (req: AuthRequest, res: Response) => {
  try {
    const tenantId = req.tenant?.id;

    const settings = await TenantSetting.findAll({
      where: { tenant_id: tenantId }
    });

    const profile: Record<string, string> = {};
    settings.forEach((s: any) => {
      profile[s.key] = s.value;
    });

    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};

export const updateStoreProfile = async (req: AuthRequest, res: Response) => {
  try {
    const tenantId = req.tenant?.id;
    const profileData = req.body; // Expects a flat object of key-value pairs

    if (!profileData || typeof profileData !== 'object') {
      return res.status(400).json({ success: false, message: 'Invalid payload' });
    }

    // Update or create each key
    const keys = Object.keys(profileData);
    for (const key of keys) {
      const value = profileData[key];
      if (value !== undefined && value !== null) {
        const existing = await TenantSetting.findOne({
          where: { tenant_id: tenantId, key }
        });

        if (existing) {
          await existing.update({ value: String(value) });
        } else {
          await TenantSetting.create({
            tenant_id: tenantId,
            key,
            value: String(value),
            type: 'STRING'
          });
        }
      }
    }

    res.status(200).json({ success: true, message: 'Store profile updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};
