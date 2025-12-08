require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 3007;

mongoose.connect(process.env.MONGODB_URI ||'mongodb+srv://mrsproudd:mrsproudd@cluster0.ad7fs0q.mongodb.net/recipemanagementsystem?appName=Cluster0');
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));

app.use(express.json());

const passport = require('./config/passport');
app.use(passport.initialize());

const routes = {
    auth: [
        'GET /dishdash/auth/google',
        'GET /dishdash/auth/google/callback',
        'GET /dishdash/auth/failure',
        'GET /dishdash/auth/verify'
    ],
    ingredients: [
        'GET /dishdash/ingredients',
        'GET /dishdash/ingredients/category/:category',
        'GET /dishdash/ingredients/:productId',
        'GET /dishdash/ingredients/name/:name',
        'POST /dishdash/ingredient',
        'PUT /dishdash/ingredient/:productId',
        'DELETE /dishdash/ingredient/:productId',
        'PATCH /dishdash/ingredient/:productId/restore'
    ],
    recipes: [
        'GET /dishdash/recipes',
        'GET /dishdash/recipes/category/:category',
        'GET /dishdash/recipes/name/:name',
        'GET /dishdash/recipes/:id',
        'POST /dishdash/recipe',
        'PUT /dishdash/recipe/:id',
        'DELETE /dishdash/recipe/:id',
        'DELETE /dishdash/recipe/:id/force',
        'PATCH /dishdash/recipe/:id/restore'
    ]
};
app.get('/dishdash', (req, res) => {
    res.json({
        message: 'DishDash API',
        routes: routes
    });
});

const authRoutes = require('./routes/authRoutes');
app.use('/dishdash', authRoutes);

const ingredientRoutes = require('./routes/ingredientRoutes');
app.use('/dishdash', ingredientRoutes);
const recipeRoutes = require('./routes/recipeRoutes');
app.use('/dishdash', recipeRoutes);


app.listen(port, () => console.log(`Server is running on port ${port}`));
