var express = require('express');
var router = express.Router()
var {addNewIdea,getAllIdeas,getIdeaById,removeIdea} = require('../services/ideaServices')
var {ensureAuthenticated} = require('../helper/auth')


router.get('/add',ensureAuthenticated,(req,res)=>{
    res.render('ideas/add')
})

router.post('/',(req,res)=>{
    var errors = []
    var successes = []
    var reqBody = req.body
    if(!reqBody.title)  errors.push({text:'Please add Title'})
    if(!reqBody.details)  errors.push({text:'Please some details'})

    if(errors.length){
        res.render('ideas/add',{errors})
    }else{
        addNewIdea(
            {
                title:reqBody.title,
                details:reqBody.details,
                user:req.user.id
            }
        )
        .then(idea=>{
            successes.push({text:`${idea.title} added successfully!`})
            res.redirect('/ideas')
        })
        .catch(err=>{
            errors.push({text:'Some error occurred!'})
            res.render('ideas/add',{errors})
        })
    }
})

router.get('/',ensureAuthenticated,(req,res)=>{
    var errors = []
    var successes = []
    getAllIdeas(req.user.id)
    .then(ideas=>{
        res.render('ideas',{ideas})
    })
    .catch(err=>{
        req.flash('error_msg','Some error occurred !')
        res.redirect('/')
    })
})

router.get('/edit/:id',(req,res)=>{
    var id = req.params.id
    getIdeaById(id)
    .then(idea=>{
        if(idea.user != req.user.id) {
            req.flash('error_msg','Not Authorized !')
            res.redirect('/ideas')
        }
        else res.render('ideas/edit',{idea})
    })
    .catch(err=>{
        req.flash('error_msg','Some error occurred !')
        res.redirect('/ideas')
    })
})

router.put('/:id',(req,res)=>{
    var id = req.params.id

    var errors = []
    var successes = []
    var reqBody = req.body
    if(!reqBody.title)  errors.push({text:'Please add Title'})
    if(!reqBody.details)  errors.push({text:'Please some details'})

    if(errors.length){
        res.render(`ideas/edit/${id}`,{errors})
    }else{
        getIdeaById(id)
        .then(idea=>{
            idea.title = reqBody.title
            idea.details = reqBody.details
            return addNewIdea(idea)
        })
        .then(idea=>{
            req.flash('success_msg','Video Idea updated.')
            res.redirect('/ideas') 
        })
        .catch(err=>{
            req.flash('error_msg','Some error occurred !')
            res.redirect('/ideas')
        })
    }
    
    
})

router.delete('/:id',(req,res)=>{
    var id = req.params.id

    removeIdea(id)
    .then(success=>{
        req.flash('success_msg','Video Idea deleted.')
        res.redirect('/ideas') 
    })
    .catch(err=>{
        req.flash('error_msg','Some error occurred !')
        res.redirect('/ideas')
    })

})

module.exports = router