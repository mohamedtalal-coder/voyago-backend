const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  generateToken,
} = require("../controllers/authController");
const passport = require("passport"); 

// Frontend URL for redirects
const FRONTEND_URL = process.env.FRONTEND_URL || "https://voyago-black.vercel.app";

// Google OAuth Routes
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  (req, res, next) => {
    passport.authenticate("google", {
      failureRedirect: `${FRONTEND_URL}/auth/callback?error=true`,
      session: false,
    }, (err, user, info) => {
      if (err) {
        console.error("Google OAuth Error:", err);
        return res.redirect(`${FRONTEND_URL}/auth/callback?error=true&message=${encodeURIComponent(err.message)}`);
      }
      if (!user) {
        console.error("Google OAuth: No user returned", info);
        return res.redirect(`${FRONTEND_URL}/auth/callback?error=true&message=authentication_failed`);
      }
      
      // Generate JWT to send back to client
      const token = generateToken(user._id);
      const avatar = user.avatar ? encodeURIComponent(user.avatar) : '';
      const isAdmin = user.isAdmin ? 'true' : 'false';

      res.redirect(
        `${FRONTEND_URL}/auth/callback?token=${token}&name=${encodeURIComponent(user.name)}&email=${encodeURIComponent(user.email)}&avatar=${avatar}&isAdmin=${isAdmin}&_id=${user._id}`
      );
    })(req, res, next);
  }
);

// Define the routes for registration and login
// These endpoints will be accessed at /api/auth/register and /api/auth/login
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);

module.exports = router;
