const express = require('express')
const authMiddleware = require("../Middleware/authMiddleware");
const { changePassword, } = require('../Controller/ChangePassword');


const router = express.Router();


router.put('/change-password', authMiddleware, changePassword);




module.exports = router;
