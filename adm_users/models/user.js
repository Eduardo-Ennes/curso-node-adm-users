var Knex = require("../database/Connection")
var bcrypt = require('bcrypt')

class User{

    async new(name, email, password){
        try{
            var hash = await bcrypt.hash(password, 10)
            var result = await Knex.insert({name: name, email: email, password: hash, role:0}).table("users")
            return {status: true}
        }catch(err){
            console.log(err)
            return {status: false}
        }
    }


    async findAll(){
        try{
            var result = await Knex.select(['id', 'name', 'email', 'role']).table('users')
            return result
        }
        catch(error){
            console.log(error)
            return []
        }
        
    }


    async findById(id){
        try{
            var result = await Knex.select(['id', 'name', 'email', 'role']).where({id: id}).table('users')
            if(result.length > 0){
                return result[0] //Como os ids são unicos, aqui coloca [0] para que nos retorne o objeto direto, fora de um array
            }
            else{
                return undefined
            }
        }
        catch(error){
            console.log(error)
            return []
        }
    }


    async findByEmail(email){
        try{
            var result = await Knex.select(['id', 'name', 'email', 'password', 'role']).where({email: email}).table('users')
            if(result.length > 0){
                return {status: true, result: result[0]} //Como os ids são unicos, aqui coloca [0] para que nos retorne o objeto direto, fora de um array
            }
            else{
                return {status: false}
            }
        }
        catch(error){
            console.log('DEU MERDA!----------------------------------')
            console.log(error)
            return 
        }
    }


    async findEmail(email){
        try{
            var result = await Knex.select().from('users').where({email: email})
            if(result.length > 0){
                return true
            }
            else{
                return false
            }
        }catch(err){
            console.log(err)
            return false
        }
    }


    async update(id, name, email, role){
        var user = await this.findById(id)
        if(user != undefined){
            var editUser = {}
            if(email != undefined){
                if(email != user.email){
                    var result = await this.findEmail(email)
                    if(result == false){
                        editUser.email = email
                    }
                    else{
                        return {status: false, err: 'E-mail já cadastrado.'}
                    }
                }
            }
            if(name != undefined){
                editUser.name = name 
            }
            if (role != undefined){
                editUser.role = role 
            }
            try{
                await Knex.update(editUser).where({id: id}).table('users')
                return {status: true, err: 'Informações atualizadas com sucesso.'}
            }
            catch(err){
                return {status: false, err: 'Não foi possivel atualizar os dados de usário'}
            }
        }
        else{
            return {status: false, err: 'Usuário não encontrado.'}
        }
    }


    async delete(id){
        var result = await this.findById(id)
        if(result != undefined){
            try{
                await Knex.delete().where({id: id}).table('users')
                return {status: true}
            }catch(err){
                return {status: false}
            }
        }
        else{
            return {status: false}
        }
    }
}


module.exports = new User()  