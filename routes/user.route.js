const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const User = require("../models/user.model.js");
const DrivingLicense = require("../models/drivingLicense.model.js");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "files"));
  },
  filename: (req, file, cb) => {
    let filename = `${file.fieldname}-${Date.now()}.${
      file.mimetype.split("/")[1]
    }`;
    cb(null, filename);
  },
});

const uploadFile = multer({
  storage,
});

const router = express.Router();

router.get("/list", async (req, res) => {
  const {
    minDistance,
    maxDistance,
    latX,
    lngX,
  } = req.query;

  let query = {};

  if (Object.keys(req.query).length > 0) {
    query.location = {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [lngX, latX],
        },
        $maxDistance: Number(maxDistance) * 1000, // 100 kms
        $minDistance: Number(minDistance) * 1000,
      }
    };
  }

  let users;
  try {
    users = await User.find(query);
  } catch (dbErr) {
    const errMsg = "Error while fetching users from db";
    console.error(errMsg, dbErr);
    res.status(500).json({
      success: false,
      message: errMsg,
      error: errMsg,
    });
    return;
  }
  res.status(200).json({
    success: true,
    message: "User list!",
    data: users,
  });
});

router.get("/:id", async (req, res) => {
  const userId = req.params.id;

  let user;
  try {
    user = await User.findById(userId).populate("drivingLicense");
  } catch (dbErr) {
    const errMsg = "Error while fetching user from db";
    console.error(errMsg, dbErr);
    res.status(500).json({
      success: false,
      message: errMsg,
      error: errMsg,
    });
    return;
  }
  if (!user) {
    return res.status(404).json({
      success: true,
      message: "User not found!",
      data: user,
    });
  }
  res.status(200).json({
    success: true,
    message: "User details!",
    data: user,
  });
});

router.post(
  "/create",
  uploadFile.fields([
    {
      name: "aadharCard",
      maxCount: 1,
    },
    {
      name: "panCard",
      maxCount: 1,
    },
  ]),
  async (req, res) => {
    let { username, password, name, validFrom, validTill, isExpired, lat, lng, city } =
      req.body;

    // Create driving license
    let drivingLicenseData = {
      name,
      validFrom,
      validTill,
      isExpired,
      aadharCard: req.files.aadharCard[0],
      panCard: req.files.panCard[0],
    };
    let createdDrivingLicense;
    try {
      createdDrivingLicense = await DrivingLicense.create(drivingLicenseData);
    } catch (dbErr) {
      const errMsg = "Error while creating driving license";
      console.error(dbErr);
      res.status(500).json({
        success: false,
        message: errMsg,
        error: errMsg,
      });
      return;
    }

    // Create user
    let userData = {
      username,
      password,
      drivingLicense: createdDrivingLicense._id,
      location: {
        type: 'Point',
        coordinates: [lng, lat],
        city,
      }
    };
    let createdUser;
    try {
      createdUser = await User.create(userData);
    } catch (dbErr) {
      const errMsg = "Error while creating user";
      console.error(errMsg, dbErr);
      res.status(500).json({
        success: false,
        message: errMsg,
        error: errMsg,
      });
      return;
    }
    res.status(201).json({
      success: true,
      message: "User created!",
      data: createdUser,
    });
  }
);

router.put("/update/:id", async (req, res) => {
  let userId = req.params.id;

  let updatedUser;
  try {
    updatedUser = await User.findByIdAndUpdate(userId, req.body);
  } catch (dbErr) {
    const errMsg = "Error while updating user in db";
    console.error(errMsg, dbErr);
    res.status(500).json({
      success: false,
      message: errMsg,
      error: errMsg,
    });
    return;
  }
  res.status(200).json({
    success: true,
    message: "User updated!",
    data: updatedUser,
  });
});

router.delete("/delete/:id", async (req, res) => {
  let userId = req.params.id;

  let updatedUser;
  try {
    updatedUser = await User.findByIdAndDelete(userId);
  } catch (dbErr) {
    const errMsg = "Error while deleting user in db";
    console.error(errMsg, dbErr);
    res.status(500).json({
      success: false,
      message: errMsg,
      error: errMsg,
    });
    return;
  }
  res.status(200).json({
    success: true,
    message: "User deleted!",
    data: updatedUser,
  });
});

module.exports = router;
