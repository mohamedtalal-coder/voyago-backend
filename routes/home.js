const router = require("express").Router();
const {
  getOffers,
  getPromoCodes,
  validatePromoCode,
  getPopularPackages,
  getTransportServices,
  getHero,
  getHomeStats,
  getAllHomeData,
} = require("../controllers/homeController");

// @route   GET /api/home
// @desc    Get all home page data
router.get("/", getAllHomeData);

// @route   GET /api/home/offers
// @desc    Get special offers
router.get("/offers", getOffers);

// @route   GET /api/home/promo-codes
// @desc    Get promo codes
router.get("/promo-codes", getPromoCodes);

// @route   POST /api/home/promo-codes/validate
// @desc    Validate a promo code
router.post("/promo-codes/validate", validatePromoCode);

// @route   GET /api/home/popular-packages
// @desc    Get popular packages
router.get("/popular-packages", getPopularPackages);

// @route   GET /api/home/transport-services
// @desc    Get transport services
router.get("/transport-services", getTransportServices);

// @route   GET /api/home/hero
// @desc    Get hero section data
router.get("/hero", getHero);

// @route   GET /api/home/stats
// @desc    Get home stats
router.get("/stats", getHomeStats);

module.exports = router;
