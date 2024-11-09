class HomeController{

    async index(req, res){
        res.send("Olá, mundo!");
    }

    async validate(req, res){
        res.send('Acesso permitido')
    }

}

module.exports = new HomeController();