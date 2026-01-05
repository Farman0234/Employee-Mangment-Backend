const express = require('express')
const authMiddleware = require("../Middleware/authMiddleware");
const { addSalary ,getoneSalary} = require('../Controller/SalaryController');


const router = express.Router();

// router.get('/', authMiddleware, getEmployee);
router.post('/add', authMiddleware,addSalary);
router.get("/:id", authMiddleware, getoneSalary);
// router.put("/:id", authMiddleware, updateEmployee);
// router.delete("/:id", authMiddleware, deleteDepartment);



module.exports = router;
