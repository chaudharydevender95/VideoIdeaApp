var mongoose = require('mongoose')
const Idea = mongoose.model('ideas')

module.exports.addNewIdea = (idea)=>{
    return new Promise((resolve,reject)=>{
        var newIdea = new Idea(idea)
        newIdea.save()
        .then(idea=>{
            resolve(idea)
        })
        .catch(err=>{
            reject(err)
        })
    })
}

module.exports.getAllIdeas = (user)=>{
    return new Promise((resolve,reject)=>{
        Idea.find({user},(err,ideas)=>{
            if(!err) resolve(ideas)
            else reject(err)
        })
    })
}

module.exports.getIdeaById = (id)=>{
    return new Promise((resolve,reject)=>{
        Idea.findOne({_id:id})
        .then(idea=>{
            resolve(idea)
        })
        .catch(err=>{
            reject(err)
        })
    }) 
}

module.exports.removeIdea = (id)=>{
    return new Promise((resolve,reject)=>{
        Idea.deleteOne({_id:id},(err,idea)=>{
            if(!err) resolve(true)
            else reject(false)
        })
    })
}