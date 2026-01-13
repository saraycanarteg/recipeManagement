const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

exports.register = async (req, res) => {
    try {
        const { email, password, name } = req.body;

        // Validar campos requeridos
        if (!email || !password || !name) {
            return res.status(400).json({ 
                message: 'Email, password, and name are required' 
            });
        }

        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ 
                message: 'User with this email already exists' 
            });
        }

        // Hashear la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Crear el usuario (siempre como client)
        const user = await User.create({
            email,
            password: hashedPassword,
            name,
            role: 'client'
        });

        // Generar token
        const token = jwt.sign(
            { 
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token: token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error registering user', 
            error: error.message 
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validar campos requeridos
        if (!email || !password) {
            return res.status(400).json({ 
                message: 'Email and password are required' 
            });
        }

        // Buscar el usuario
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ 
                message: 'Invalid email or password' 
            });
        }

        // Verificar que el usuario tenga password (no sea cuenta de Google)
        if (!user.password) {
            return res.status(401).json({ 
                message: 'This account uses Google login. Please sign in with Google.' 
            });
        }

        // Verificar la contraseña
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ 
                message: 'Invalid email or password' 
            });
        }

        // Actualizar último login
        user.lastLogin = new Date();
        await user.save();

        // Generar token
        const token = jwt.sign(
            { 
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            message: 'Login successful',
            token: token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role,
                picture: user.picture
            }
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error logging in', 
            error: error.message 
        });
    }
};

exports.googleCallback = (req, res) => {
    const token = jwt.sign(
        { 
            id: req.user._id,
            email: req.user.email,
            name: req.user.name,
            role: req.user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );

    // Obtener URL del frontend desde variables de entorno
    const frontendURL = process.env.FRONTEND_URL || 'https://dishdashfrontend.onrender.com';
    
    // Redirigir al frontend con el token y datos del usuario
    const userData = encodeURIComponent(JSON.stringify({
        id: req.user._id,
        email: req.user.email,
        name: req.user.name,
        role: req.user.role,
        picture: req.user.picture
    }));

    res.redirect(`${frontendURL}/auth/google/callback?token=${token}&user=${userData}`);
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
