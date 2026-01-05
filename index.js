const express = require("express")
const cors = require("cors")
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const CreateAdmin = require("./Script/admin")
const authRoutes = require("./Routes/authRoutes")
const depRoutes = require("./Routes/departmentsRoutes")
const EmployeeRoutes = require("./Routes/EmployeeRoutes")
const Salary = require("./Routes/SalaryRoutes")
const Leaves = require("./Routes/LeaveRoute")
const Settings = require("./Routes/settingRoutes")
const dashboard = require("./Routes/dashboardRoute")


require("./Configuration/dbConfig");

app.use(cors({
    origin: "https://employee-mangment-system-frontend-z.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));


app.options("/*", cors());

app.use(express.json());

const path = require('path');

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'Controller', 'public', 'uploads')));



CreateAdmin();



app.use("/api/auth", authRoutes)
app.use("/api/department", depRoutes)
app.use("/api/employee", EmployeeRoutes)
app.use("/api/salary", Salary)
app.use("/api/leaves", Leaves)
app.use("/api/setting", Settings)
app.use("/api/dashboard", dashboard)


const port = process.env.PORT || 5699;

app.listen(port, () => {
    console.log(`Your Server is Running on ${port}`)
});

module.exports = app;