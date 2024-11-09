var Knex = require("../database/Connection")
var User = require('./user')
var bcrypt = require('bcrypt')

class PasswordToken{

    async genereted(email){
        var user = await User.findByEmail(email)
        if(user.status != false){
            var resultToken = await this.findByUser_id(user.result.id)
            if(resultToken){
                return {status: false, err: 'Você já gerou um token.'}
            }
            else{
                try{
                    var tokenger = Date.now()
                    await Knex.insert({
                        user_id: user.result.id,
                        token: tokenger,
                        used: 0
                    }).table('passwordtoken')
                    return {status: true, certo: 'Token gerado com sucesso.'}
                }
                catch(err){
                    return {status: false, err: 'Houve um error no servidor ao gerar o token, tente novamente.'}
                }
            }
        }
        else{
            return {status: false, err: 'Email não encontrado'}
        }
    }


    async validate(token){
        try{
            var result = await Knex.select().where({token: token}).table('passwordtoken')
            if(result.length > 0){
                var tk = result[0]
                if(tk.used == 1){
                    return {status: false, err: 'Este token já foi usado.'}
                }
                else{
                    return {status: true, token: tk}
                }
            }
            else{
                return {status: false, err: 'Token não encontrado.'}
            }
        }
        catch(err){
            return {status: false}
        }
    }


    async changePassword(newPassword, id, token){
        var hash = await bcrypt.hash(newPassword, 10)
        try{
            await Knex.update({password: hash}).where({id: id}).table('users')
            await this.setUsed(token)
            await this.setNewToken(id)
            return {status: true, certo: 'Senha alterada com sucesso'}
        }
        catch(err){
            return {status: false, err: 'Houve um error so servior.'}
        }
    }


    async setUsed(token){
        try{
            await Knex.update({used: 1}).where({token: token}).table('passwordtoken')
            return true
        }
        catch(err){
            return false
        }
    }


    async setNewToken(id){
        try{
            var newToken = Date.now()
            await Knex.update({token: newToken, used: 0}).where({user_id: id}).table('passwordtoken')
            return true
        }
        catch(err){
            return false
        }
    }


    async findByUser_id(id){
        try{
            var result = await Knex.select().from('passwordtoken').where({user_id: id})
                if(result.length > 0){
                    return true
                }
                else{
                    return false
                }
        }
        catch(err){
            return false
        }
    }


};


module.exports = new PasswordToken();