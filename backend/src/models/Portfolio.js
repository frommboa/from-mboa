import { DataTypes } from 'sequelize';
import sequelize from '../connection.js';
import User from './User.js';

const Portfolio = sequelize.define('Portfolio', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
    references: {
      model: User,
      key: 'id',
    },
  },
  balance: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0.00,
  },
  total_deposits: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0.00,
  },
  total_withdrawals: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0.00,
  },
  total_commissions_earned: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0.00,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'portfolios',
  timestamps: false,
});

User.hasOne(Portfolio, { foreignKey: 'user_id' });
Portfolio.belongsTo(User, { foreignKey: 'user_id' });

export default Portfolio;
