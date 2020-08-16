const express = require("express");

const router = express.Router();
const User = require("./User");
const bcrypt = require("bcryptjs");
const adminAuth = require("../middlewares/adminAuth");



router.get("/admin/users", adminAuth,  (req, res) =>{
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

router.get("/login", (req, res) =>{
    res.render("admin/users/login");
});
router.post("/authenticate", (req, res) =>{
    var email = req.body.email;
    var password = req.body.password;

    User.findOne({where: {email: email}}).then(user =>{
        if(user != undefined){ //se existir usuario com esse email
            // validar senha
            var correct = bcrypt.compareSync(password, user.password);

            if(correct){
                req.session.user = {
                    id: user.id,
                    user: user.email
                }
                res.redirect("/admin/articles");
            }else{
            res.redirect("/login");

            }
        }else{
            res.redirect("/login");

        }
    });
});
router.get("/logout", (req, res) =>{
    req.session.user = undefined;
    res.redirect("/login");
})


module.exports = router;
