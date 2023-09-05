const jwt = require('jsonwebtoken');
const User = require('../../models/user/user');
const config = require('../../config/config');
const bcrypt = require('bcrypt');

async function loginUser(req, res) {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User tidak ditemukan" });
        }

        const passwordBenar = await bcrypt.compare(password, user.password);

        if (!passwordBenar) {
            return res.status(401).json({ message: "Password salah" });
        }

        const token = jwt.sign({ userId: user._id }, config.jwtSecret);

        res.status(200).json({ token , role: user.role });
    } catch (error) {
        res.status(500).json({ error });
    }
}

module.exports = {
    loginUser
};
