const { Router } = require("express");
const adminController = require("../controllers/adminController");
// const { adminAuth } = require("../middlewares/authMiddlewares");

const router = Router();

router.post("/login", adminController.login);
router.post("/register", adminController.register);
router.get("/check", adminController.checkadmin);

module.exports = router;
