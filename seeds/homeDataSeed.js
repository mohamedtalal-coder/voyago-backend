const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

// Load env vars
dotenv.config({ path: path.join(__dirname, "../.env") });

const {
  Offer,
  PromoCode,
  PopularPackage,
  TransportService,
  Hero,
  HomeStat,
} = require("../models/HomeData");

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/voyago";

// ============ SEED DATA ============

// Special Offers Data
const offersData = [
  {
    key: "group",
    icon: "FiUsers",
    titleKey: "home:offer_groups_title",
    descriptionKey: "home:offer_groups_desc",
    discount: "25%",
    type: "automatic",
    badge: "home:offer_automatic",
    order: 1,
    isActive: true,
  },
  {
    key: "early",
    icon: "FiGift",
    titleKey: "home:offer_early_title",
    descriptionKey: "home:offer_early_desc",
    discount: "15%",
    type: "automatic",
    badge: "home:offer_automatic",
    order: 2,
    isActive: true,
  },
  {
    key: "bundle",
    icon: "FiPercent",
    titleKey: "home:offer_package_title",
    descriptionKey: "home:offer_package_desc",
    discount: "20%",
    type: "code",
    code: "BUNDLE20",
    order: 3,
    isActive: true,
  },
];

// Promo Codes Data
const promoCodesData = [
  {
    code: "WELCOME10",
    discount: "10%",
    descriptionKey: "home:promo_welcome",
    isActive: true,
  },
  {
    code: "FAMILY15",
    discount: "15%",
    descriptionKey: "home:promo_family",
    isActive: true,
  },
  {
    code: "VOYAGO30",
    discount: "30%",
    descriptionKey: "home:promo_vip",
    isActive: true,
  },
  {
    code: "BUNDLE20",
    discount: "20%",
    descriptionKey: "home:promo_bundle",
    isActive: true,
  },
  {
    code: "SUMMER25",
    discount: "25%",
    descriptionKey: "home:promo_summer",
    isActive: true,
  },
];

// Popular Packages Data (Service packages on home page)
const popularPackagesData = [
  {
    key: "package1",
    slug: "bike-rickshaw",
    serviceType: "city",
    categoryKey: "home:category_bike_rickshaw",
    titleKey: "home:package1_title",
    price: "10",
    unit: "/day",
    image: "/images/home/explore-img1.png",
    features: [
      { textKey: "home:f1_bike_day", icon: "FaCheck" },
      { textKey: "home:f2_city_app", icon: "FaMobileAlt" },
      { textKey: "home:f3_discount", icon: "FaTag" },
      { textKey: "home:f4_support", icon: "FaCheck" },
    ],
    order: 1,
    isActive: true,
  },
  {
    key: "package2",
    slug: "guided-tours",
    serviceType: "bike",
    categoryKey: "home:category_bike_tours",
    titleKey: "home:package2_title",
    price: "30",
    unit: "/day",
    image: "/images/home/explore-img2.png",
    features: [
      { textKey: "home:f1_mountain_bike", icon: "FaCheck" },
      { textKey: "home:f2_guide", icon: "FaCheck" },
      { textKey: "home:f3_water", icon: "FaCheck" },
      { textKey: "home:f4_support", icon: "FaCheck" },
    ],
    order: 2,
    isActive: true,
  },
  {
    key: "package3",
    slug: "transportation",
    serviceType: "coach",
    categoryKey: "home:category_bus_trips",
    titleKey: "home:package3_title",
    price: "45",
    unit: "/day",
    image: "/images/home/explore-img3.png",
    features: [
      { textKey: "home:f1_park_ticket", icon: "FaTicketAlt" },
      { textKey: "home:f2_return_bus", icon: "FaBus" },
      { textKey: "home:f3_companion", icon: "FaCheck" },
      { textKey: "home:f4_support", icon: "FaCheck" },
    ],
    order: 3,
    isActive: true,
  },
  {
    key: "package4",
    slug: "luxury-cars",
    serviceType: "sedan",
    categoryKey: "home:category_transfer",
    titleKey: "home:package4_title",
    price: "10",
    unit: "/day",
    image: "/images/home/transport-img3.png",
    features: [
      { textKey: "home:f1_personal_driver", icon: "FaCar" },
      { textKey: "home:f2_wherever_you_want", icon: "FaMapMarkerAlt" },
      { textKey: "home:f3_best_price", icon: "FaTag" },
      { textKey: "home:f4_support", icon: "FaCheck" },
    ],
    order: 4,
    isActive: true,
  },
];

// Transport Services Data
const transportServicesData = [
  {
    key: "bike_rental",
    slug: "bike-rickshaw",
    titleKey: "home:service1_title",
    descriptionKey: "home:service1_description",
    image: "/images/home/transport-img1.png",
    order: 1,
    isActive: true,
  },
  {
    key: "guided_tour",
    slug: "guided-tours",
    titleKey: "home:service2_title",
    descriptionKey: "home:service2_description",
    image: "/images/home/transport-img2.png",
    order: 2,
    isActive: true,
  },
  {
    key: "taxi_ncc",
    slug: "transportation",
    titleKey: "home:service3_title",
    descriptionKey: "home:service3_description",
    image: "/images/home/transport-img3.png",
    order: 3,
    isActive: true,
  },
  {
    key: "bus_package",
    slug: "luxury-cars",
    titleKey: "home:service4_title",
    descriptionKey: "home:service4_description",
    image: "/images/home/transport-img4.png",
    order: 4,
    isActive: true,
  },
];

// Hero Section Data
const heroData = {
  titleKey: "home:heroTitle",
  subtitleKey: "home:heroSubtitle",
  backgrounds: [
    "/images/home/Home-Background-1.png",
    "/images/home/Home-Background-2.png",
  ],
  isActive: true,
};

// Home Stats Data
const homeStatsData = [
  {
    key: "stat1",
    value: "20+",
    labelKey: "home:stat1_label",
    order: 1,
  },
  {
    key: "stat2",
    value: "100+",
    labelKey: "home:stat2_label",
    order: 2,
  },
  {
    key: "stat3",
    value: "15+",
    labelKey: "home:stat3_label",
    order: 3,
  },
  {
    key: "stat4",
    value: "10+",
    labelKey: "home:stat4_label",
    order: 4,
  },
];

// ============ SEED FUNCTIONS ============

const seedOffers = async () => {
  try {
    await Offer.deleteMany({});
    const result = await Offer.insertMany(offersData);
    console.log(`✅ Seeded ${result.length} offers`);
    return result;
  } catch (error) {
    console.error("❌ Error seeding offers:", error.message);
    throw error;
  }
};

const seedPromoCodes = async () => {
  try {
    await PromoCode.deleteMany({});
    const result = await PromoCode.insertMany(promoCodesData);
    console.log(`✅ Seeded ${result.length} promo codes`);
    return result;
  } catch (error) {
    console.error("❌ Error seeding promo codes:", error.message);
    throw error;
  }
};

const seedPopularPackages = async () => {
  try {
    await PopularPackage.deleteMany({});
    const result = await PopularPackage.insertMany(popularPackagesData);
    console.log(`✅ Seeded ${result.length} popular packages`);
    return result;
  } catch (error) {
    console.error("❌ Error seeding popular packages:", error.message);
    throw error;
  }
};

const seedTransportServices = async () => {
  try {
    await TransportService.deleteMany({});
    const result = await TransportService.insertMany(transportServicesData);
    console.log(`✅ Seeded ${result.length} transport services`);
    return result;
  } catch (error) {
    console.error("❌ Error seeding transport services:", error.message);
    throw error;
  }
};

const seedHero = async () => {
  try {
    await Hero.deleteMany({});
    const result = await Hero.create(heroData);
    console.log(`✅ Seeded hero section`);
    return result;
  } catch (error) {
    console.error("❌ Error seeding hero:", error.message);
    throw error;
  }
};

const seedHomeStats = async () => {
  try {
    await HomeStat.deleteMany({});
    const result = await HomeStat.insertMany(homeStatsData);
    console.log(`✅ Seeded ${result.length} home stats`);
    return result;
  } catch (error) {
    console.error("❌ Error seeding home stats:", error.message);
    throw error;
  }
};

// Main seed function
const seedAll = async () => {
  try {
    console.log("\n🌱 Starting Home Data Seed...\n");
    console.log(`📦 Connecting to MongoDB: ${MONGO_URI}\n`);

    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB\n");

    await seedOffers();
    await seedPromoCodes();
    await seedPopularPackages();
    await seedTransportServices();
    await seedHero();
    await seedHomeStats();

    console.log("\n🎉 All home data seeded successfully!\n");

    // Display summary
    const summary = {
      offers: await Offer.countDocuments(),
      promoCodes: await PromoCode.countDocuments(),
      popularPackages: await PopularPackage.countDocuments(),
      transportServices: await TransportService.countDocuments(),
      hero: await Hero.countDocuments(),
      homeStats: await HomeStat.countDocuments(),
    };

    console.log("📊 Database Summary:");
    console.log("------------------------");
    Object.entries(summary).forEach(([key, count]) => {
      console.log(`   ${key}: ${count}`);
    });
    console.log("------------------------\n");

  } catch (error) {
    console.error("❌ Seed failed:", error.message);
  } finally {
    await mongoose.connection.close();
    console.log("👋 Disconnected from MongoDB\n");
    process.exit(0);
  }
};

// Run seed
seedAll();
