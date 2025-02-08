import express from 'express';

const viewsRouter = express.Router();

// Ruta raiz
viewsRouter.get('/', (req, res) => {
    res.render('home');
});

viewsRouter.get('/realtimeproducts', (req, res) => {
    res.render('realtimeproducts');
});

export default viewsRouter;