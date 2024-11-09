var User = require('../models/user')
var jwt = require('jsonwebtoken')
var bcrypt = require('bcrypt')
var PasswordToken = require('../models/passwordtoken')

var secret = 'rggfav1d651F5W1E65F1EQ65V19QE4V98ER1V56Q1ER984VQ981D7TQ98R4GAF561F3V56a4987t89y4g51'

class UserController{

    async index(req, res){
        var results = await User.findAll()
        res.json(results)
    }


    async findUser(req, res){
        var id = req.params.id
        var user = await User.findById(id)
        if(user == undefined){
            res.status(404)
            res.json({error: 'Usuário não encontrado!'})
        }
        else{
            res.status(200)
            res.json(user)
        }
    }


    async create(req, res){
        var name = req.body.name
        var email = req.body.email
        var password = req.body.password
        if(name != undefined && email != undefined && password != undefined && 
            name != '' && email != '' && password != '' &&
            name != ' ' && email != ' ' && password != ' '){
            var emailExist = await User.findEmail(email)
            if(emailExist){
                res.status(406)
                res.send('Este email já está em uso.')
            }
            else{
                var result = await User.new(name, email, password)
                if(result.status){
                    res.status(200)
                    res.send('Usuário cadastrado com sucesso.')
                }
                else{
                    res.status(406)
                    res.send('Houve um erro no servidor.')
                }
            }
        }
        else{
            res.status(400)
            res.send('Os campos devem ser obrigatoriamente preenchidos.')
        }
             
    }


    async update(req, res){
        var {id, name, email, role} = req.body
        var result = await User.update(id, name, email, role)
        if(result.status != false){
            if(result.status){
                res.status(200)
                res.send('Informações atualizadas com sucesso')
            }
            else{
                res.status(406)
                res.send(result.err)
            }
        }
        else{
            res.status(406)
            res.send('Ocorreu um erro no servidor.')
        }       
    }


    async delete(req, res){
        var id = req.params.id
        console.log('id user: ' + id)
        if(isNaN(id)){
            res.status(406)
            res.send('Não é um número')
        }
        else{
            var result = await User.delete(id)
            if(result.status != false){
                res.status(200)
                res.send('Usuário deletado com sucesso.')
            }
            else{
                res.status(406)
                res.send('Houve um erro ao deletar o usuário.')
            }
        }
    }


    async recoverPassword(req, res){
        var email = req.body.email
        var result = await PasswordToken.genereted(email)
        if(result.status != false){
            res.status(200)
            res.send(result.certo)
        }
        else{
            res.status(406)
            res.send(result.err)
        }
    }


    async changePassword(req, res){
        var token = req.body.token
        var password = req.body.password
        var isToken = await PasswordToken.validate(token)
        if(isToken.status){
            var result = await PasswordToken.changePassword(password, isToken.token.user_id, isToken.token.token)
            if(result.status == true){
                res.status(200)
                res.send(result)
            }
            else{
                res.status(406)
                res.send(result)
            }
        }
        else{
            res.status(406)
            res.send(result)
        }
    }


    async login(req, res){
        var {email, password} = req.body

        if(email != undefined && password!= undefined && email!= '' && password != '' && email!= ' ' && password != ' '){
            var user = await User.findByEmail(email)
            if(user.status){
                var result = await bcrypt.compare(password, user.result.password)
                if(result == true){
                    res.status(200)
                    var token = jwt.sign({name: user.result.name, email: user.result.email, role: user.result.role}, secret)
                    res.send(token)
                }
                else{
                    res.status(406)
                    res.send('Password inválido')
                }
            }
            else{
                res.status(406)
                res.send('E-mail inválido.')
            }
        }
        else{
            res.status(406)
            res.send('Os campos devem ser obrigatoriamente preenchidos')
        }
    }
}


module.exports = new UserController();