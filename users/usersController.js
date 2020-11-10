const express = require('express');
const router = express.Router();
const User = require('./User')
const bcrypt = require('bcryptjs');
const Swal = require('sweetalert2')

//Middlewares
const adminAuth = require('../middlewares/adminAuth');

router.get('/admin/users', adminAuth, (req, res) => {
    User.findAll().then((users) => {
        res.render('admin/users/index', {users:users})
    })
})

router.get('/admin/users/create', adminAuth, (req, res) => {
    res.render('admin/users/create')
})

router.post('/admin/users/create', adminAuth, (req, res) => {
    var username = req.body.username
    var email = req.body.email;
    var password = req.body.password;

    //do not allow account creation with the same email
    User.findOne({
        where: {email: email}
    }).then(user => {
        if(user == undefined){
            
            //hash
            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(password, salt)

            User.create({
                email: email,
                username: username,
                password: hash
            }).then(() => {
                res.redirect('/')
            }).catch(err => {
                res.redirect('/')
            })

        } else {
            res.render('admin/users/create')
        }
    })

})

router.get('/login', (req, res) => {
    res.render('admin/users/login')
})

router.post('/authenticate', (req, res) => {
    var email = req.body.email
    var password = req.body.password

    User.findOne({where: {email: email}}).then(user => {
        if(user != undefined) { //If a user exists
            //validate password (compare with bscrypt hash)
            var correct = bcrypt.compareSync(password, user.password)

            if(correct) {
                //session user
                req.session.user = {
                    id: user.id,
                    email: user.email
                }
                res.redirect('/admin/articles')
            } else {
                res.redirect('/login')
            }


        } else { //If the user does not exist
            res.redirect('/login')
        }
    })
})

router.get('/logout', (req, res) => {
    req.session.user = undefined
    res.redirect('/login')
})

module.exports = router;