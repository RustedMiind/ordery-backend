const { Router } = require("express");
const orderController = require("../controllers/orderController");
const { userAuth, adminAuth } = require("../middlewares/authMiddlewares");
// const { adminAuth } = require("../middlewares/authMiddlewares");

const router = Router();

router.post("/create/new", userAuth, orderController.createNewOrder);
router.get("/", adminAuth, orderController.getAll);
router.get("/byphone/:phone", adminAuth, orderController.getUserOrdersbyNumber);
router.get("/user/:id", adminAuth, orderController.getUserOrders);
router.get("/new", adminAuth, orderController.getNewOrders);
router.get("/confirm/:id", adminAuth, orderController.confirmOrder);
module.exports = router;
