const mongoose = require('mongoose');

// Import all models
const User = require('./models/User');
const TiffinVendor = require('./models/TiffinVendor');
const TiffinReview = require('./models/TiffinReview');
const MarketplaceItem = require('./models/MarketplaceItem');
const StudyMaterial = require('./models/StudyMaterial');
const HousingReview = require('./models/HousingReview');

mongoose.connect('mongodb://localhost:27017/dayscholar-os');

const seedData = async () => {
  try {
    console.log('Clearing existing data...');
    await Promise.all([
      TiffinVendor.deleteMany(),
      TiffinReview.deleteMany(),
      MarketplaceItem.deleteMany(),
      StudyMaterial.deleteMany(),
      HousingReview.deleteMany()
    ]);

    // 1. Create a dummy user to act as the owner of these records
    let user = await User.findOne({ email: 'seed_admin@college.edu.in' });
    if (!user) {
      user = await User.create({
        email: 'seed_admin@college.edu.in',
        password: 'password123',
        isVerified: true,
        role: 'admin'
      });
      console.log('Dummy user created.');
    } else {
      if (user.role !== 'admin') {
        user.role = 'admin';
        await user.save();
        console.log('Updated existing dummy user to admin role.');
      }
    }
    const userId = user._id;

    // 2. Seed 15 Tiffin Vendors
    console.log('Seeding Tiffin Vendors...');
    const vendorNames = [
      "Annapurna Tiffins", "Student Bite", "Ghar Ka Khana", "Healthy Meals", "Spicy Route", 
      "Campus Cravings", "Mom's Magic", "The Lunchbox", "Daily Delight", "Tasty Treats", 
      "Quick Bites", "NutriMeal", "Savory Spice", "Local Flavors", "Midnight Munchies"
    ];
    
    const vendorDocs = await TiffinVendor.insertMany(
      vendorNames.map((name, i) => ({
        name,
        location: `Street ${i + 1}, Near North Gate`,
        daily_menu: `Dal, Rice, 3 Rotis, Sabzi (Type ${i % 3 + 1})`
      }))
    );

    // 3. Seed Tiffin Reviews (1 valid review per vendor to respect compound index)
    console.log('Seeding Tiffin Reviews...');
    const validReviews = vendorDocs.map(vendor => ({
      vendor_id: vendor._id,
      reviewer_id: userId,
      rating: Math.floor(Math.random() * 2) + 4, // Random 4 or 5 star
    }));
    await TiffinReview.insertMany(validReviews);

    // 4. Seed 10 Marketplace Listings
    console.log('Seeding Marketplace Items...');
    const categories = ['Electronics', 'Books', 'Furniture', 'Stationery', 'Misc'];
    const marketplaceItems = [];
    for (let i = 0; i < 10; i++) {
      marketplaceItems.push({
        category: categories[i % categories.length],
        price: (i + 1) * 150,
        // Description avoids UPI and Phone patterns as dictated by Phase 3 hook
        description: `Barely used ${categories[i % categories.length]} item. Condition is great. DM on Discord for details.`,
        seller_id: userId
      });
    }
    await MarketplaceItem.insertMany(marketplaceItems);

    // 5. Seed 8 Study Materials
    console.log('Seeding Study Materials...');
    const subjects = [
      'Data Structures', 'Operating Systems', 'Computer Networks', 'Database Systems', 
      'Algorithms', 'Software Engineering', 'Machine Learning', 'Computer Architecture'
    ];
    const studyMaterials = [];
    for (let i = 0; i < 8; i++) {
      studyMaterials.push({
        title: `${subjects[i]} Final Notes`,
        subject_tag: subjects[i],
        file_url: `/uploads/seed-${i}.pdf`,
        // Hash must be unique for each material
        fileHash: `seedhash1234567890abcdef${i}`, 
        uploader_id: userId,
        upvotes: Math.floor(Math.random() * 50)
      });
    }
    await StudyMaterial.insertMany(studyMaterials);

    // 6. Seed 5 Housing Reviews
    console.log('Seeding Housing Reviews...');
    const housingReviews = [];
    for (let i = 0; i < 5; i++) {
      housingReviews.push({
        location: `Sector ${10 + i}, Near South Gate`,
        wifi_speed: Math.floor(Math.random() * 5) + 1,
        landlord_interference: Math.floor(Math.random() * 5) + 1,
        hidden_charges: i % 2 === 0,
        reviewer_id: userId
      });
    }
    await HousingReview.insertMany(housingReviews);

    console.log('✅ All dummy data seeded successfully!');
    process.exit();
  } catch (err) {
    console.error('❌ Error seeding data:', err);
    process.exit(1);
  }
};

seedData();
