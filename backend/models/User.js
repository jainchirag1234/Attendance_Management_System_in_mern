const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      unique: true,

      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["admin", "employee"],
      default: "employee",
    },

    // Employee-specific fields
    position: {
      type: String,
    },
    phone: {
      type: Number,
    },
    department: {
      type: String,
    },

    joining_date: {
      type: Date,
    },

    // ✅ Status field (Active / Inactive)
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true, // createdAt & updatedAt auto
  },
);

module.exports = mongoose.model("User", UserSchema);
