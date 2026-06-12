import Rating from '../models/Rating.js';
import User from '../models/User.js';
import Product from '../models/Product.js';

export const rateVendor = async (req, res) => {
  try {
    const { ratee_id, rating, comment } = req.body;

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'La note doit être entre 1 et 5',
      });
    }

    const existingRating = await Rating.findOne({
      where: {
        rater_id: req.user.id,
        ratee_id,
      },
    });

    if (existingRating) {
      await existingRating.update({ rating, comment });
      return res.json({ success: true, message: 'Avis mis à jour', rating: existingRating });
    }

    const newRating = await Rating.create({
      rater_id: req.user.id,
      ratee_id,
      rating,
      comment,
    });

    res.status(201).json({ success: true, message: 'Avis créé', rating: newRating });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const rateProduct = async (req, res) => {
  try {
    const { product_id, rating, comment } = req.body;

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'La note doit être entre 1 et 5',
      });
    }

    const product = await Product.findByPk(product_id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Produit introuvable' });
    }

    const newRating = await Rating.create({
      rater_id: req.user.id,
      ratee_id: product.vendor_id,
      product_id,
      rating,
      comment,
    });

    res.status(201).json({ success: true, message: 'Avis créé', rating: newRating });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getVendorRatings = async (req, res) => {
  try {
    const { vendorId } = req.params;

    const ratings = await Rating.findAll({
      where: { ratee_id: vendorId },
      include: {
        model: User,
        foreignKey: 'rater_id',
        as: 'rater',
        attributes: ['id', 'full_name', 'profile_picture_url'],
      },
      order: [['created_at', 'DESC']],
    });

    // Calculate average rating
    const averageRating = ratings.length > 0
      ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(2)
      : 0;

    res.json({
      success: true,
      ratings,
      averageRating,
      totalRatings: ratings.length,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProductRatings = async (req, res) => {
  try {
    const { productId } = req.params;

    const ratings = await Rating.findAll({
      where: { product_id: productId },
      include: {
        model: User,
        foreignKey: 'rater_id',
        as: 'rater',
        attributes: ['id', 'full_name', 'profile_picture_url'],
      },
      order: [['created_at', 'DESC']],
    });

    const averageRating = ratings.length > 0
      ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(2)
      : 0;

    res.json({
      success: true,
      ratings,
      averageRating,
      totalRatings: ratings.length,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
