const express = require('express')
const authMiddleware = require("../Middleware/authMiddleware");
const { addLeaves,getLeaves,getAdminleave,getLeavesDetails,leaveStatus} = require('../Controller/LeavesController');


const router = express.Router();

router.get('/', authMiddleware, getAdminleave);
router.post('/add', authMiddleware,addLeaves);
router.get("/:id", authMiddleware, getLeaves);
router.put("/:id", authMiddleware, leaveStatus);
router.get("/detail/:id", authMiddleware, getLeavesDetails);
// router.put("/:id", authMiddleware, updateEmployee);
// router.delete("/:id", authMiddleware, deleteDepartment);



module.exports = router;
