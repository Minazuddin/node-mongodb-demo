const mongoose = require("mongoose");

const DrivingLicenseSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  dob: {
    type: Date,
  },
  validFrom: {
    type: Date,
  },
  validTill: {
    type: Date,
  },
  isExpired: {
    type: Boolean,
  },
  files: [{
    fieldname: String,
    originalname: String,
    encoding: String,
    mimetype: String,
    filename: String,
    size: Number,
  }],
});

module.exports = mongoose.model("DrivingLicense", DrivingLicenseSchema);
