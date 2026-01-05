const express = require('express')
const authMiddleware = require("../Middleware/authMiddleware");

const { getSummary} = require('../Controller/dashboardController')

const router = express.Router();

router.get('/summary', authMiddleware,getSummary);




module.exports = router;
