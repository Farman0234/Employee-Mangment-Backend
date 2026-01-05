const express = require('express')
const authMiddleware = require("../Middleware/authMiddleware");
const { addEmployee,uploads,getEmployee,getOneEmployee,updateEmployee,fetechEmployeeDepartment} = require('../Controller/employeeController');


const router = express.Router();

router.get('/', authMiddleware, getEmployee);
router.post('/add', authMiddleware, uploads.single("profileImage"),addEmployee);
router.get("/:id", authMiddleware, getOneEmployee);
router.put("/:id", authMiddleware, updateEmployee);
router.get("/department/:id", authMiddleware, fetechEmployeeDepartment);



module.exports = router;
