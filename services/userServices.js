const mongoose = require('mongoose')
const User = mongoose.model('users')
var passport = require('passport')

module.exports.getUserByUsername = (username)=>{
    return new Promise((resolve,reject)=>{
        User.find({username},(err,username)=>{
            if(username) reject('Username already exist!')
            else resolve(false)
        })
    })
}

module.exports.addUser = (user)=>{
    var newUser;
    return new Promise((resolve,reject)=>{
        this.getUserByUsername(user.username)
        .then(success=>{
            newUser = new User(user)
            return newUser.encryptPassword()
        })
        .then(success=>{
            return newUser.save()
        })
        .then(user=>{
            resolve(user)
        })
        .catch(err=>{
            reject(err)
        })
    })
    
}

module.exports.authenticateUser = (req,res,next)=>{
    passport.authenticate('local',{
        successRedirect:'/ideas',
        failureRedirect:'/users/signin'
    })(req,res,next)
}