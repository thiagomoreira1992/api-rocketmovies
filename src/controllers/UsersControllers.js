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

        const user = await knex("users").where({ id }).first();
        if (user.length === 0) {
            throw new AppError('Usuário não existe')
        }

        if(email){            
            const emailExists = await knex("users").where({email}).first();
    
            if (emailExists && emailExists.id !== user.id) {
                console.log(emailExists);
                console.log("nao passou");
                throw new AppError('E-mail informado já está em uso');
            }
        }

        user.name = name ?? user.name;

        
        res.json();
    }
}

module.exports = UserController;