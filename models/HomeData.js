const mongoose = require("mongoose");

// Schema for Special Offers (automatic discounts)
const offerSchema = mongoose.Schema({
  key: { type: String, required: true, unique: true },
  icon: { type: String, required: true },
  titleKey: { type: String, required: true },
  descriptionKey: { type: String, required: true },
  discount: { type: String, required: true },
  type: { type: String, enum: ['automatic', 'code'], required: true },
  badge: { type: String },
  code: { type: String },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Schema for Promo Codes
const promoCodeSchema = mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discount: { type: String, required: true },
  descriptionKey: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  expiresAt: { type: Date },
  usageLimit: { type: Number },
  usedCount: { type: Number, default: 0 },
}, { timestamps: true });

// Schema for Popular Packages (service packages on home page)
const popularPackageSchema = mongoose.Schema({
  key: { type: String, required: true, unique: true },
  slug: { type: String, required: true },
  serviceType: { type: String, required: true },
  categoryKey: { type: String, required: true },
  titleKey: { type: String, required: true },
  price: { type: String, required: true },
  unit: { type: String, default: '/day' },
  image: { type: String, required: true },
  features: [{
    textKey: { type: String, required: true },
    icon: { type: String, required: true },
  }],
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Schema for Transport Services (home page services grid)
const transportServiceSchema = mongoose.Schema({
  key: { type: String, required: true, unique: true },
  slug: { type: String, required: true },
  titleKey: { type: String, required: true },
  descriptionKey: { type: String, required: true },
  image: { type: String, required: true },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Schema for Hero Section
const heroSchema = mongoose.Schema({
  titleKey: { type: String, required: true },
  subtitleKey: { type: String, required: true },
  backgrounds: [{ type: String }],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Schema for Stats (displayed on home page)
const homeStatSchema = mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: { type: String, required: true },
  labelKey: { type: String, required: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

const Offer = mongoose.model("Offer", offerSchema, "offers");
const PromoCode = mongoose.model("PromoCode", promoCodeSchema, "promoCodes");
const PopularPackage = mongoose.model("PopularPackage", popularPackageSchema, "popularPackages");
const TransportService = mongoose.model("TransportService", transportServiceSchema, "transportServices");
const Hero = mongoose.model("Hero", heroSchema, "hero");
const HomeStat = mongoose.model("HomeStat", homeStatSchema, "homeStats");

module.exports = {
  Offer,
  PromoCode,
  PopularPackage,
  TransportService,
  Hero,
  HomeStat,
};
