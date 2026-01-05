const User = require("../Module/userModule");
const bcrypt = require("bcrypt");

const changePassword = async (req, res) => {
    try {
        const { userID, oldPassword, newPassword } = req.body;


        const user = await User.findById(userID);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: "User not found"
            });
        }
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                error: "Old password is incorrect"
            });
        }


        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await User.findByIdAndUpdate(
            userID,
            { password: hashedPassword },
            { new: true }
        );


        return res.status(200).json({
            success: true,
            message: "Password changed successfully"
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            error: "Failed to change password"
        });
    }
};

module.exports = { changePassword };
