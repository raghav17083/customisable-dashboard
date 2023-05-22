const router = require("express").Router();
const dashboardController = require("../controllers/dashboard.controller");
const authController = require("../controllers/auth.controller");

router
  .route("/createDashboard")
  .post(
    authController.checkLogin,
    dashboardController.checkAdmin,
    dashboardController.addDashboard
  );

router
  .route("/:dashboardId")
  .get(authController.checkLogin, dashboardController.viewDashboard)
  .delete(
    authController.checkLogin,
    dashboardController.checkAdmin,
    dashboardController.deleteDashboard
  );
router
  .route("/:dashboardId/addCollaborators")
  .post(
    authController.checkLogin,
    dashboardController.checkAdmin,
    dashboardController.addCollaborators
  );

module.exports = router;
