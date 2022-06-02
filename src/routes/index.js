const { Router } = require('express');

const userRoutes = require('./users.routes');
const moviesNotesRoutes = require('./movies_notes.routes');
const moviesTagsRoutes = require('./movies_tags.routes')

const routes = Router();

routes.use('/users', userRoutes);
routes.use('/movies', moviesNotesRoutes);

module.exports = routes;