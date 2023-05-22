const mongoose = require("mongoose");
const { Schema } = mongoose;

const widgetSchema = new Schema(
  {
    //   name: { type: String, required: true },
    type: { type: String, required: true },
    dashboardId: { type: Schema.Types.ObjectId, ref: "Dashboard" },
    createdBy: { type: Schema.Types.ObjectId, required: true },
    isDelete: { type: Boolean, default: false },
    position: {
      x: Number,
      y: Number,
    },
    size: {
      height: Number,
      width: Number,
    },
    config: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

const widgetModel = mongoose.model("Widget", widgetSchema);

module.exports = widgetModel;
