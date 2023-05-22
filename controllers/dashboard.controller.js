const Dashboard = require("../models/dashboard.model");
const ApiError = require("../ApiError");
const User = require("../models/user.model");

const checkAdmin = async (req, res, next) => {
  if (req.user?.role === "admin") {
    return next();
  }
  return next(new ApiError({ message: "no permission", status: 500 }));
};

const addDashboard = async (req, res, next) => {
  const { name } = req.body;
  const { user } = req;
  console.log({ user });
  const dashboardData = {
    name,
    createdBy: user._id,
    collaborators: [user._id],
  };
  const dashboardCreated = await Dashboard.create(dashboardData);
  res
    .status(201)
    .send({ message: "created succesfully", data: dashboardCreated });
};

const viewDashboard = async (req, res, next) => {
  const { dashboardId } = req.params;
  const dashboard = await Dashboard.findOne({ _id: dashboardId }).lean();
  if (!dashbaord || dashboard.isDeleted) {
    return next(
      new ApiError({ message: "dashboard does not exist", status: 500 })
    );
  }
  return res.status(200).json(dashboard);
};

const deleteDashboard = async (req, res, next) => {
  const { dashboardId } = req.params;
  if (req.user.role !== "admin") {
    return next(
      new ApiError({ message: "no permission to delete", status: 403 })
    );
  }
  await Dashboard.updateOne(
    { _id: dashboardId },
    { $set: { isDeleted: true } }
  );
  res.status(200).json({ message: "deleted" });
};

const addCollaborators = async (req, res, next) => {
  const { user } = req.user;
  if (user.role !== "admin") {
    return next(
      new ApiError({ message: "non admin cannot collaborate", status: 403 })
    );
  }
  const { dashboardId } = req.params;
  const { emails } = req.body;
  const userIds = await Promise.all(
    emails.map(async (email) => {
      const user = await User.findOne({ email });
      return user._id;
    })
  );
  const dashboard = await Dashboard.findOne({ _id: dashboardId }).lean();
  const updatedUserId = [...userIds, ...dashboard.collaborators];
  const updateDashboard = await Dashboard.findByIdAndUpdate(
    {
      _id: dashboardId,
    },
    {
      $set: {
        collaborators: updatedUserId,
      },
    }
  );
  return res.status(200).json({ updateDashboard });
};

module.exports = {
  addDashboard,
  checkAdmin,
  viewDashboard,
  addCollaborators,
  deleteDashboard,
};
