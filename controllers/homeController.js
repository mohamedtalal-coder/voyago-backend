const {
  Offer,
  PromoCode,
  PopularPackage,
  TransportService,
  Hero,
  HomeStat,
} = require("../models/HomeData");

const getOffers = async (req, res) => {
  try {
    const offers = await Offer.find({ isActive: true }).sort({ order: 1 });
    res.json(offers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPromoCodes = async (req, res) => {
  try {
    const promoCodes = await PromoCode.find({ isActive: true });
    res.json(promoCodes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const validatePromoCode = async (req, res) => {
  try {
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({ valid: false, message: "Code is required" });
    }

    const promoCode = await PromoCode.findOne({ 
      code: code.toUpperCase(), 
      isActive: true 
    });

    if (!promoCode) {
      return res.status(404).json({ valid: false, message: "Invalid promo code" });
    }


    if (promoCode.expiresAt && new Date() > promoCode.expiresAt) {
      return res.status(400).json({ valid: false, message: "Promo code has expired" });
    }


    if (promoCode.usageLimit && promoCode.usedCount >= promoCode.usageLimit) {
      return res.status(400).json({ valid: false, message: "Promo code usage limit reached" });
    }

    res.json({
      valid: true,
      code: promoCode.code,
      discount: promoCode.discount,
      descriptionKey: promoCode.descriptionKey,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPopularPackages = async (req, res) => {
  try {
    const packages = await PopularPackage.find({ isActive: true }).sort({ order: 1 });
    res.json(packages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTransportServices = async (req, res) => {
  try {
    const services = await TransportService.find({ isActive: true }).sort({ order: 1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getHero = async (req, res) => {
  try {
    const hero = await Hero.findOne({ isActive: true });
    res.json(hero);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getHomeStats = async (req, res) => {
  try {
    const stats = await HomeStat.find().sort({ order: 1 });
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllHomeData = async (req, res) => {
  try {
    const [offers, promoCodes, popularPackages, transportServices, hero, stats] = await Promise.all([
      Offer.find({ isActive: true }).sort({ order: 1 }),
      PromoCode.find({ isActive: true }),
      PopularPackage.find({ isActive: true }).sort({ order: 1 }),
      TransportService.find({ isActive: true }).sort({ order: 1 }),
      Hero.findOne({ isActive: true }),
      HomeStat.find().sort({ order: 1 }),
    ]);

    res.json({
      offers,
      promoCodes,
      popularPackages,
      transportServices,
      hero,
      stats,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getOffers,
  getPromoCodes,
  validatePromoCode,
  getPopularPackages,
  getTransportServices,
  getHero,
  getHomeStats,
  getAllHomeData,
};
