// Import models
const User = require('./User');
const Product = require('./Product');

// Define associations
const defineAssociations = () => {
  // User-Product associations (if needed)
  // User.hasMany(Product, { foreignKey: 'created_by', as: 'createdProducts' });
  // Product.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
};

// Initialize associations
defineAssociations();

module.exports = {
  User,
  Product,
  defineAssociations
};
