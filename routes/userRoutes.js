const { Router } = require("express");
const userController = require("../controllers/userController");
const { userAuth, adminAuth } = require("../middlewares/authMiddlewares");

const router = Router();

router.post("/login", userController.login);
router.post("/forcelogin", userController.forcelogin);
router.get("/logout", userController.logout);
router.get("/checkuser", userController.checkuser);
router.post("/user/new", userController.register);
router.get("/users", adminAuth, userController.getall);

module.exports = router;
