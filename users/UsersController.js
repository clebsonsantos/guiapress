const express = require("express");

const router = express.Router();
const User = require("./User");
const bcrypt = require("bcryptjs");


router.get("/admin/users", (req, res) =>{
    User.findAll().then(users=>{
        res.render("admin/users/index", {users: users});
    })
});
router.get("/admin/users/create", (req, res) =>{
    res.render("admin/users/create")
});


router.post("/users/create", (req, res) =>{
    var email = req.body.email;
    var password = req.body.password;

    User.findOne({where:{email: email}}).then(user =>{

        // verificar se já existe um usuario cadastrado no sistema
        if(user == undefined){ // caso não exista: 

                    // gerar salt com bcryptjs
            var salt = bcrypt.genSaltSync(10);
            // usar o salt pára gerar o hash da senha
            var hash = bcrypt.hashSync(password, salt);

            User.create({
                email: email,
                password: hash
            }).then(()=>{
                res.redirect("/")
            }).catch((err) =>{
                res.redirect("/")
            })
        
        }else{ // se existir será redirecionado para fazer o cadastro
            res.redirect("/admin/users/create");
        }
    })
 
});



module.exports = router;
