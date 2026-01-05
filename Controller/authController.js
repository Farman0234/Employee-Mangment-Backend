const bcrypt = require('bcrypt');
const User = require("../Module/userModule")

const { generateToken } = require('../utils/jwtUtils')

async function login(req, res) {

    try {
        const { email, password } = req.body;

        const existingUser = await User.findOne({ email })
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }
        const isPassword = await bcrypt.compare(password, existingUser.password)
        if (!isPassword) {
            return res.status(401).json({ message: "User not found" });
        }
        const token = generateToken(existingUser)
        res.status(200).json({ message: "Login successfull", token: token, user: existingUser })
    }


    catch (error) {
        console.log(error.message)
        res.status(401).json({ message: "invalid credentials" })
    }
}

const verify = (req, res) => {
    return res.status(200).json({ success: true, user: req.user })
}

module.exports = { login, verify };
