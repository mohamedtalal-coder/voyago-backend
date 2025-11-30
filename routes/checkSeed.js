const router = require("express").Router();
const mongoose = require("mongoose");

router.get("/", async (req, res) => {
  try {
    const db = mongoose.connection.db;

    const tourPackagesCollection = db.collection('tourPackages');
    const servicesCollection = db.collection('services');

    const tourPackagesCount = await tourPackagesCollection.countDocuments();
    const servicesCount = await servicesCollection.countDocuments();

    const tourPackages = await tourPackagesCollection.find().limit(5).toArray();
    const services = await servicesCollection.find().limit(5).toArray();

    res.json({
      counts: {
        tourPackages: tourPackagesCount,
        services: servicesCount
      },
      samples: {
        tourPackages,
        services
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
