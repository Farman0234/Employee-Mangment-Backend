const express = require('express')
const { login,verify } = require('../Controller/authController');
const verifyuser  = require("../Middleware/authMiddleware");

const router = express.Router();

router.post('/login', login )

router.get('/verify', verifyuser, verify)

module.exports=router;


