const mongoose = require("mongoose");
const { Schema } = mongoose;

const dashboardSchema = new Schema(
  {
    name: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    widgets: [{ type: Schema.Types.ObjectId, ref: "Widget" }],
    isDeleted: { type: Boolean, default: false },
    collaborators: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const dashboardModel = mongoose.model("Dashboard", dashboardSchema);

module.exports = dashboardModel;
