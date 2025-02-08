import express from 'express';

const viewsRouter = express.Router();

// Ruta raiz
viewsRouter.get('/', (req, res) => {
    res.render('home');
});

export default viewsRouter;