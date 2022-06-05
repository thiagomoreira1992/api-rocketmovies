const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class MovieNotesController {

    async create(req, res) {
        const { title, description, rating, tags } = req.body;
        const { user_id } = req.params;

        const user = await knex("users").where({ id: user_id }).first();
        if (!user) throw new AppError("Usuário invalido");

        const note_id = await knex("movie_notes").insert({
            title,
            description,
            rating,
            user_id
        })

        const tagsInsert = tags.map(name => {
            return {
                note_id,
                user_id,
                name
            }
        })

        await knex("movie_tags").insert(tagsInsert);

        return res.json();
    }

    async show(req, res) {
        const { id } = req.params;

        const movieNote = await knex("movie_notes").where({ id }).first();

        const movie_tags = await knex("movie_tags").where({ note_id: id }).orderBy("name");

        return res.json({
            ...movieNote,
            movie_tags
        });
    }

    async delete(req, res) {
        const { id } = req.params;

        const note = await knex("movie_notes").where({ id }).first();
        if (!note) throw new AppError("Anotação de filmes não disponível!");

        await knex("movie_notes").where({ id }).delete();

        res.json();
    }

    async index(req, res) {
        const { user_id, title, tags } = req.query;
        console.log(user_id, " - ", title, " - ", tags);

        if(!user_id || "" || undefined) throw new AppError("O usuário deve ser informado!")

        let movieNotes;

        if (tags) {
            const movieTags = tags.split(',').map(tag => tag.trim());

            movieNotes = await knex("movie_tags")
                .select([
                    "movie_notes.id",
                    "movie_notes.title",
                    "movie_notes.user_id"
                ])
                .where("movie_notes.user_id", user_id)
                .whereLike("movie_notes.title", `%${title}%`)
                .whereIn("name", movieTags)
                .innerJoin("movie_notes", "movie_notes.id", "movie_tags.note_id")
                .orderBy("movie_notes.title");
        }else{
            movieNotes = await knex("movie_notes")
                .where({user_id})
                .whereLike("title", `%${title}%`)
                .orderBy("title");
        }

        const userTags = await knex("movie_tags").where({user_id});
        const moviesWithTags = movieNotes.map(movie => {
            const moviesTags = userTags.filter(tag => tag.note_id === movie.id) 
        
            return{
                ...movie,
                tags: moviesTags
            }
        })
        console.log(movieNotes)
        return res.json(moviesWithTags);    
        
    }
}

module.exports = MovieNotesController;