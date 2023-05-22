const Dashboard = require("../models/dashboard.model");
const Widget = require("../models/widget.model");
const User = require("../models/user.model");
const ApiError = require("../ApiError");

const WIDGET_TYPES = ["graph", "pie", "table"];

const addWidget = async (req, res, next) => {
  const { dashboardId } = req.params;
  const user = req.user;
  if (user.role !== "admin") {
    return next(new ApiError({ message: "cannot create widget", status: 500 }));
  }
  const { type, position, size, datasource } = req.body;
  const widgetBody = {
    type,
    dashboardId,
    position,
    size,
    config: {
      datasource,
    },
    createdBy: user._id,
  };
  const widgetCreated = await Widget.create(widgetBody);
  await Dashboard.updateOne(
    { _id: dashboardId },
    { $push: { widgets: { _id: widgetCreated._id } } }
  );

  return res.status(201).json({ message: "widget added", data: widgetCreated });
};

const deleteWidget = async (req, res, next) => {
  const user = req.user;
  if (user.role !== "admin") {
    return next(new ApiError({ message: "cannot delete widge", status: 500 }));
  }
};


module.exports = {
  addWidget,
};
