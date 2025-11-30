const dotenv = require("dotenv").config();
const express = require("express");
const app = express();
const connectDB = require("./config/db");
const cors = require("cors");
const path = require("path");
const passport = require("passport");
const session = require("express-session");
const configurePassport = require("./config/Passport");

const tourPackageRoutes = require('./routes/tourPackages');
const serviceRoutes = require('./routes/services');
const reviewRoutes = require('./routes/reviews');
const contactRoutes = require('./routes/contact');
const statsRoutes = require('./routes/stats');
const adminRoutes = require('./routes/admin');
const authRoutes = require("./routes/auth");
const checkSeedRoute = require('./routes/checkSeed');
const homeRoutes = require('./routes/home');
const uploadRoutes = require('./routes/upload');

app.use('/api/check-seed', checkSeedRoute);

connectDB();

configurePassport();





app.use(cors());

// Increase body size limit for base64 image uploads
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));



app.use(
  session({
secret: process.env.JWT_SECRET,
resave: false,
saveUninitialized: false,
}))

app.use(passport.initialize());
app.use(passport.session());

// Handle Chrome DevTools request (suppress CSP warning)
app.get('/.well-known/appspecific/com.chrome.devtools.json', (req, res) => {
  res.status(204).end();
});

app.use('/api/tourPackages', tourPackageRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/check-seed', checkSeedRoute);
app.use('/api/home', homeRoutes);
app.use('/api/upload', uploadRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server is running on port ${
      process.env.NODE_ENV || "development"
    } mode on port ${PORT}`
  );
  console.log(
    "---------------------------------------------------------------------------------------"
  );
});
