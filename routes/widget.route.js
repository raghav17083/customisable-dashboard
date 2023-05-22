const router = require("express").Router();

const authController = require("../controllers/auth.controller");
const widgetController = require("../controllers/widget.controller");

router
  .route("/:dashboardId/addWidget")
  .post(authController.checkLogin, widgetController.addWidget);
router
  .route("/:dashboardId/deleteWidget/:widgetId")
  .delete(authController.checkLogin, widgetController.deleteWidget);

module.exports = router;
