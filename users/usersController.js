const express = require('express');
const router = express.Router();
const User = require('./User')
const bcrypt = require('bcryptjs');
const Swal = require('sweetalert2')


router.get('/admin/users', (req, res) => {
    User.findAll().then((users) => {
        res.render('admin/users/index', {users:users})
    })
})

router.get('/admin/users/create', (req, res) => {
    res.render('admin/users/create')
})

router.post('/admin/users/create', (req, res) => {
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


module.exports = router;