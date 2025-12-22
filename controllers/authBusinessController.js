const jwt = require('jsonwebtoken');

exports.googleCallback = (req, res) => {
    const token = jwt.sign(
        { 
            id: req.user._id,
            email: req.user.email,
            name: req.user.name
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );

    res.json({
        success: true,
        message: 'Login successful',
        token: token,
        user: {
            id: req.user._id,
            email: req.user.email,
            name: req.user.name,
            picture: req.user.picture
        }
    });
};

exports.authFailure = (req, res) => {
    res.status(401).json({
        success: false,
        message: 'Authentication failed'
    });
};

exports.verifyToken = (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.json({ 
            valid: true,
            user: decoded
        });
    } catch (error) {
        res.status(401).json({ 
            valid: false,
            message: 'Invalid token'
        });
    }
};
