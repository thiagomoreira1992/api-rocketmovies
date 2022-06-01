const knex = require('../database/knex');
const { hash } = require('bcryptjs')
const AppError = require('../utils/AppError');

class UserController {
    async create(req, res) {
        const { name, email, password, avatar } = req.body;

        const emailExists = await knex("users").where({ email });
        if (emailExists.length > 0) {
            throw new AppError('Este email já existe!')
        }

        const hashedPassword = await hash(password, 8);

        await knex('users').insert({
            name,
            email,
            password: hashedPassword,
            avatar
        })
        return res.json()
    }

    async update(req, res) {
        const { name, email, password, old_password, avatar } = req.body;
        const { id } = req.params;

        const idHadUser = await knex("users").where({ id }).first();
        if (idHadUser.length === 0) {
            throw new AppError('Usuário não existe')
        }

        const emailExists = await knex("users").where({ email }).first();

        console.log(emailExists)
        if (emailExists.length > 0 && emailExists.id !== idHadUser.id) {
            console.log(emailExists.id);
            console.log(idHadUser.id);
            throw new AppError('E-mail informado já está em uso');
        }


        console.log(emailExists[0].id);
        console.log(idHadUser.id);
        res.json();
    }
}

module.exports = UserController;