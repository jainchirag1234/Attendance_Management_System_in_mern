const express = require("express");
const router = express.Router();

const {
  getPolicies,
  getPolicyById,
  createPolicy,
  updatePolicy,
  deletePolicy,
} = require("../controllers/policyController");

router.get("/", getPolicies); // GET all policies
router.get("/:id", getPolicyById); // GET single policy
router.post("/", createPolicy); // CREATE policy
router.put("/:id", updatePolicy); // UPDATE policy
router.delete("/:id", deletePolicy); // DELETE policy

module.exports = router;
