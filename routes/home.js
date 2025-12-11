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

router.get("/", getAllHomeData);
router.get("/offers", getOffers);
router.get("/promo-codes", getPromoCodes);
router.post("/promo-codes/validate", validatePromoCode);
router.get("/popular-packages", getPopularPackages);
router.get("/transport-services", getTransportServices);
router.get("/hero", getHero);
router.get("/stats", getHomeStats);

module.exports = router;
