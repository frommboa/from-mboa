import RechargeRequest from '../models/RechargeRequest.js';
import Portfolio from '../models/Portfolio.js';
import User from '../models/User.js';
import KYCDocument from '../models/KYCDocument.js';
import sequelize from '../database/connection.js';

// Admin validates recharge
export const validateRecharge = async (req, res) => {
  try {
    const { rechargeId } = req.params;
    const { action, rejection_reason } = req.body;

    const recharge = await RechargeRequest.findByPk(rechargeId);
    if (!recharge) {
      return res.status(404).json({ success: false, message: 'Demande introuvable' });
    }

    if (action === 'approve') {
      // Update portfolio balance
      const portfolio = await Portfolio.findOne({
        where: { user_id: recharge.user_id },
      });

      await portfolio.increment('balance', { by: recharge.amount });
      await portfolio.increment('total_deposits', { by: recharge.amount });

      // Update recharge request
      recharge.status = 'approved';
      recharge.verified_at = new Date();
      recharge.verified_by = req.user.id;
      await recharge.save();

      res.json({
        success: true,
        message: 'Recharge approuvée avec succès',
        recharge,
      });
    } else if (action === 'reject') {
      recharge.status = 'rejected';
      recharge.rejection_reason = rejection_reason;
      recharge.verified_at = new Date();
      recharge.verified_by = req.user.id;
      await recharge.save();

      res.json({
        success: true,
        message: 'Recharge rejetée',
        recharge,
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get pending vendors for KYC validation
export const getPendingVendors = async (req, res) => {
  try {
    const pendingVendors = await KYCDocument.findAll({
      where: { status: 'pending' },
      include: {
        model: User,
        attributes: ['id', 'email', 'full_name', 'phone_number'],
      },
      order: [['created_at', 'ASC']],
    });

    res.json({ success: true, vendors: pendingVendors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin validates vendor KYC
export const validateVendor = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const { action, rejection_reason } = req.body;

    const kyc = await KYCDocument.findByPk(vendorId);
    if (!kyc) {
      return res.status(404).json({ success: false, message: 'KYC introuvable' });
    }

    if (action === 'approve') {
      const user = await User.findByPk(kyc.user_id);
      user.is_vendor = true;
      user.role = 'vendor';
      user.vendor_approved_at = new Date();
      await user.save();

      kyc.status = 'approved';
      kyc.verified_at = new Date();
      kyc.verified_by = req.user.id;
      await kyc.save();

      res.json({
        success: true,
        message: 'Vendeur approuvé avec succès',
        kyc,
      });
    } else if (action === 'reject') {
      kyc.status = 'rejected';
      kyc.rejection_reason = rejection_reason;
      kyc.verified_at = new Date();
      kyc.verified_by = req.user.id;
      await kyc.save();

      res.json({
        success: true,
        message: 'Candidature vendeur rejetée',
        kyc,
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get analytics
export const getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalVendors = await User.count({ where: { is_vendor: true } });
    const totalRecharges = await RechargeRequest.sum('amount', {
      where: { status: 'approved' },
    });

    res.json({
      success: true,
      analytics: {
        totalUsers,
        totalVendors,
        totalRecharges,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Export reports
export const exportReports = async (req, res) => {
  try {
    const { startDate, endDate, reportType } = req.query;

    // Implementation for CSV/PDF export
    res.json({
      success: true,
      message: 'Rapport généré',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
