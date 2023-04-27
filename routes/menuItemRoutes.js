const { Router } = require("express");
const MenuItemController = require("../controllers/MenuItemController");

const router = Router();

router.get("/menu", MenuItemController.getMenu);
router.get("/menu/:id", MenuItemController.getMenuItem);
router.post("/menu/newitem", MenuItemController.addMenuItem);

module.exports = router;
