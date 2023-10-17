const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  password: {
    type: String,
  },
  drivingLicense: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DrivingLicense",
  },
  aadharCard: {
    fieldname: String,
    originalname: String,
    encoding: String,
    mimetype: String,
    filename: String,
    size: Number,
  },
  panCard: {
    fieldname: String,
    originalname: String,
    encoding: String,
    mimetype: String,
    filename: String,
    size: Number,
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: [Number],
    city: String,
  },
});

UserSchema.index({ location: "2dsphere" });

UserSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("User", UserSchema);
