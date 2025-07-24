const bcrypt = require('bcryptjs');
const { User, Product } = require('../models');

// Seed Users
const seedUsers = async () => {
  try {
    const existingUsers = await User.count();
    if (existingUsers > 0) {
      console.log('🔄 Users already exist, skipping user seeding.');
      return;
    }

    const defaultUsers = [
      {
        username: 'admin',
        email: 'admin@example.com',
        password: await bcrypt.hash('admin123', 10),
        firstName: 'Admin',
        lastName: 'User',
        avatar: 'https://i.pravatar.cc/150?img=1',
        role: 'admin'
      },
      {
        username: 'john.doe',
        email: 'john.doe@example.com',
        password: await bcrypt.hash('password123', 10),
        firstName: 'John',
        lastName: 'Doe',
        avatar: 'https://i.pravatar.cc/150?img=2',
        role: 'user'
      },
      {
        username: 'jane.smith',
        email: 'jane.smith@example.com',
        password: await bcrypt.hash('password123', 10),
        firstName: 'Jane',
        lastName: 'Smith',
        avatar: 'https://i.pravatar.cc/150?img=3',
        role: 'user'
      }
    ];

    await User.bulkCreate(defaultUsers);
    console.log('✅ Users seeded successfully.');
  } catch (error) {
    console.error('❌ Error seeding users:', error.message);
  }
};

// Seed Products
const seedProducts = async () => {
  try {
    const existingProducts = await Product.count();
    if (existingProducts > 0) {
      console.log('🔄 Products already exist, skipping product seeding.');
      return;
    }

    const defaultProducts = [
      {
        name: 'MacBook Pro 16"',
        description: 'Apple MacBook Pro 16-inch with M2 Pro chip',
        price: 89999.00,
        category: 'Electronics',
        brand: 'Apple',
        image: 'https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/mbp16-spacegray-select-202301?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1671304673229',
        stock: 15,
        rating: 4.8,
        featured: true
      },
      {
        name: 'iPhone 15 Pro',
        description: 'Latest iPhone with A17 Pro chip and titanium design',
        price: 45999.00,
        category: 'Electronics',
        brand: 'Apple',
        image: 'https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-1inch-naturaltitanium?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1692895615329',
        stock: 25,
        rating: 4.9,
        featured: true
      },
      {
        name: 'Samsung Galaxy S24 Ultra',
        description: 'Premium Android smartphone with S Pen',
        price: 42999.00,
        category: 'Electronics',
        brand: 'Samsung',
        image: 'https://images.samsung.com/is/image/samsung/p6pim/th/2401/gallery/th-galaxy-s24-ultra-s928-sm-s928bztqthl-thumb-539573043',
        stock: 20,
        rating: 4.7,
        featured: true
      },
      {
        name: 'Sony WH-1000XM5',
        description: 'Premium noise-canceling wireless headphones',
        price: 12999.00,
        category: 'Audio',
        brand: 'Sony',
        image: 'https://www.sony.co.th/image/5d02da5df552836db894cead8a68f5f3?fmt=pjpeg&wid=330&bgcolor=FFFFFF&bgc=FFFFFF',
        stock: 30,
        rating: 4.6,
        featured: false
      },
      {
        name: 'Dell XPS 13',
        description: 'Ultra-portable laptop with stunning display',
        price: 35999.00,
        category: 'Electronics',
        brand: 'Dell',
        image: 'https://i.dell.com/is/image/DellContent/content/dam/ss2/products/laptops/xps/13-9320/media-gallery/black/laptop-xps-13-9320-black-gallery-1.psd?fmt=pjpg&pscan=auto&scl=1&wid=3491&hei=2179&qlt=100,1&resMode=sharp2&size=3491,2179&chrss=full&imwidth=5000',
        stock: 12,
        rating: 4.5,
        featured: false
      },
      // Add more products...
      {
        name: 'Nike Air Max 270',
        description: 'Comfortable running shoes with Max Air cushioning',
        price: 4999.00,
        category: 'Fashion',
        brand: 'Nike',
        image: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/awjogtdnqxniqqk0wpgf/air-max-270-mens-shoes-KkLcGR.png',
        stock: 50,
        rating: 4.4,
        featured: false
      },
      {
        name: 'Adidas Ultraboost 22',
        description: 'Premium running shoes with Boost technology',
        price: 6999.00,
        category: 'Fashion',
        brand: 'Adidas',
        image: 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/fbaf991a78bc4896a3e9ad7800abcec6_9366/Ultraboost_22_Shoes_Black_GZ0127_01_standard.jpg',
        stock: 40,
        rating: 4.3,
        featured: false
      },
      {
        name: 'IKEA Poäng Chair',
        description: 'Comfortable armchair with bentwood frame',
        price: 2999.00,
        category: 'Furniture',
        brand: 'IKEA',
        image: 'https://www.ikea.com/th/en/images/products/poaeng-armchair-birch-veneer-hillared-anthracite__0727320_pe735593_s5.jpg',
        stock: 25,
        rating: 4.2,
        featured: false
      }
    ];

    await Product.bulkCreate(defaultProducts);
    console.log('✅ Products seeded successfully.');
  } catch (error) {
    console.error('❌ Error seeding products:', error.message);
  }
};

// Run all seeders
const runSeeders = async () => {
  console.log('🌱 Starting database seeding...');
  await seedUsers();
  await seedProducts();
  console.log('🌱 Database seeding completed!');
};

module.exports = {
  seedUsers,
  seedProducts,
  runSeeders
};
