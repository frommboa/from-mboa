import Product from '../models/Product.js';
import ProductCategory from '../models/ProductCategory.js';
import User from '../models/User.js';
import Rating from '../models/Rating.js';
import { Op } from 'sequelize';

export const getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 20, category, is_free } = req.query;
    const offset = (page - 1) * limit;

    const where = { status: 'approved' };
    if (is_free === 'true') where.is_free = true;
    if (category) where.category_id = category;

    const { count, rows } = await Product.findAndCountAll({
      where,
      include: [
        { model: User, foreignKey: 'vendor_id', as: 'vendor', attributes: ['id', 'full_name'] },
        { model: ProductCategory, foreignKey: 'category_id', as: 'category' },
      ],
      limit: parseInt(limit),
      offset,
      order: [['created_at', 'DESC']],
    });

    res.json({
      success: true,
      products: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findByPk(productId, {
      include: [
        { model: User, foreignKey: 'vendor_id', as: 'vendor', attributes: ['id', 'full_name', 'profile_picture_url'] },
        { model: ProductCategory, foreignKey: 'category_id', as: 'category' },
      ],
    });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Produit introuvable' });
    }

    // Get ratings
    const ratings = await Rating.findAll({
      where: { product_id: productId },
    });

    const averageRating = ratings.length > 0
      ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(2)
      : 0;

    res.json({
      success: true,
      product: {
        ...product.dataValues,
        averageRating,
        totalRatings: ratings.length,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const searchProducts = async (req, res) => {
  try {
    const { q, category, min_price, max_price } = req.query;

    const where = { status: 'approved' };
    if (q) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${q}%` } },
        { description: { [Op.iLike]: `%${q}%` } },
      ];
    }
    if (category) where.category_id = category;
    if (min_price) where.price = { [Op.gte]: min_price };
    if (max_price) where.price = { [Op.lte]: max_price };

    const products = await Product.findAll({
      where,
      include: [
        { model: User, foreignKey: 'vendor_id', as: 'vendor', attributes: ['id', 'full_name'] },
        { model: ProductCategory, foreignKey: 'category_id', as: 'category' },
      ],
      limit: 50,
    });

    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await ProductCategory.findAll({
      order: [['name', 'ASC']],
    });

    res.json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
