const router = require("express").Router();

const authController = require("../controllers/auth.controller");
const widgetController = require("../controllers/widget.controller");
const dashboardController = require("../controllers/dashboard.controller");

router
  .route("/:dashboardId/addWidget")
  .post(
    authController.checkLogin,
    dashboardController.checkAdmin,
    widgetController.addWidget
  );
router
  .route("/:dashboardId/deleteWidget/:widgetId")
  .delete(
    authController.checkLogin,
    dashboardController.checkAdmin,
    widgetController.deleteWidget
  );
router
  .route("/:dashboardId/getAllWidgets")
  .get(authController.checkLogin, widgetController.getAllWidgets);
router
  .route("/:dashboardId/updateWidget/:widgetId")
  .post(
    authController.checkLogin,
    dashboardController.checkAdmin,
    widgetController.updateWidget
  );
router
  .route("/:dashboardId/getWidget/:widgetId")
  .get(authController.checkLogin, widgetController.getWidget);
module.exports = router;
