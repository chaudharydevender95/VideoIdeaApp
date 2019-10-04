var express = require('express');
var router = express.Router()
var userServices = require('../services/userServices')

router.get('/signup',(req,res)=>{
    res.render('users/signup')
})

router.post('/signup',(req,res)=>{
    var errors = []
    var name = req.body.name
    var username = req.body.username
    var password = req.body.password
    var password2 = req.body.password2

    if(!username) errors.push({text:'Please enter username'})
    if(!password) errors.push({text:'Please enter password'})
    if(password!=password2) errors.push({text:'Password does not match!'})

    if(errors.length){
        res.render('users/signup',{errors})
    }else{
        var user = {
            name,
            username,
            password
        }
        userServices.addUser(user)
        .then(user=>{
            res.redirect('/users/signin')
        })
        .catch(text=>{
            errors.push({text})
            res.render('users/signup',{errors})
        })
    }
})

router.get('/signin',(req,res)=>{
    res.render('users/signin')
})

router.post('/signin',(req,res,next)=>{
    var errors = []

    var username = req.body.username
    var password = req.body.password

    if(!username) errors.push({text:'Please enter username'})
    if(!password) errors.push({text:'Please enter password'})

    if(errors.length){
        res.render('users/signup',{errors})
    }else{
        userServices.authenticateUser(req,res,next)
    }
})

router.get('/signoff',(req,res)=>{
    req.logOut();
    res.redirect('/users/signin')
})

module.exports = router