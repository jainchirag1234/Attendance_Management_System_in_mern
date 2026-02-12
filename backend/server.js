const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
// server.js or app.js
const employeeRoutes = require("./routes/employee");
app.use("/api/employee", employeeRoutes);
// Routes
app.use("/api", require("./routes/attendanceSheetRoutes"));
app.use("/api/leaves", require("./routes/leaveRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/policies", require("./routes/policyRoutes"));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
