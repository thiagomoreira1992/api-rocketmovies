const knex = require('../database/knex');

class MoviesTagsController{
    async index(req, res){
        const { user_id } = req.query;

        const tags = await knex("movie_tags")
            .where({user_id})

        return res.json(tags);
    }
}


module.exports = MoviesTagsController;