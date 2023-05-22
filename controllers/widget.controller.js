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
const getAllWidgets = async (req, res, next) => {
  const { dashboardId } = req.params;
  const dashboardWidgets = await Widget.find({
    dashboardId,
    isDeleted: false,
  }).lean();
  res.status(200).json({ data: dashboardWidgets });
};

const deleteWidget = async (req, res, next) => {
  const user = req.user;
  if (user.role !== "admin") {
    return next(new ApiError({ message: "cannot delete widget", status: 500 }));
  }
  const { dashboardId, widgetId } = req.params;
  await Promise.all([
    Widget.updateOne({ _id: widgetId }, { $set: { isDeleted: true } }),
    Dashboard.updateOne({ _id: dashboardId }, { $pull: { widgets: widgetId } }),
  ]);
  return res.status(200).json({ message: "widget deleted successfully" });
};

const getWidget = async (req, res, next) => {
  const { dashboardId, widgetId } = req.params;
  const widget = await Widget.findOne({ _id: widgetId, isDeleted: false });
  res.status(200).json({ data: widget });
};

const updateWidget = async (req, res, next) => {
  const user = req.user;
  if (user.role !== "admin") {
    return next(new ApiError({ message: "cannot delete widget", status: 500 }));
  }
  const { dashboardId, widgetId } = req.params;
  const { updateType } = req.body;
  let updateWidgetObject;
  if (updateType === "config") {
    const { config } = req.body;
    updateWidgetObject = await Widget.findByIdAndUpdate(
      widgetId,
      {
        $set: { config },
      },
      { new: true }
    );
  }
  //like position, size etc
  if (updateType === "metadata") {
    const { metadata } = req.body;
    updateWidgetObject = await Widget.findByIdAndUpdate(
      widgetId,
      {
        $set: { ...metadata },
      },
      { new: true }
    );
  }
  return res
    .status(201)
    .json({ data: updateWidgetObject, message: "widget updated" });
};

module.exports = {
  addWidget,
  deleteWidget,
  updateWidget,
  getAllWidgets,
  getWidget,
};
