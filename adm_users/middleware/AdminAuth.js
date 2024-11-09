var jwt = require('jsonwebtoken')
var secret = 'rggfav1d651F5W1E65F1EQ65V19QE4V98ER1V56Q1ER984VQ981D7TQ98R4GAF561F3V56a4987t89y4g51'

module.exports = function (req, res, next){
    const authToken = req.headers['authorization']

    if(authToken != undefined){
        const bearer = authToken.split(' ')
        var token = bearer[1]
        try{
            var decoded = jwt.verify(token, secret)
            next()
        }   
        catch(err){
            res.status(403)
            res.send('Você não está autorizado há acessar está página.')
            return;
        }
    }
    else{
        res.status(403)
        res.send('Você não está autorizado há acessar está página.')
        return;
    }
}