const mongoose=require('mongoose');
const express=require('express');
const router=express.Router();
const Story=mongoose.model('stories');
const {ensureAuthenticated,ensureGuest}=require('../helpers/auth');
// index router for story fetch
router.get('/',(req,res)=>{
    Story.find({status:'public'})
    .sort({date:'desc'})
    .populate('user')
    .then(stories=>{
        res.render('stories/index',{stories:stories});
        console.log(stories);
    });
});
// show all the public story from a publiser
router.get('/user/:id',(req,res)=>{
    Story.find({user:req.params.id,status:'public'})
    .populate('user')
    .then(stories=>{
        res.render('stories/index',{
            stories:stories
        });
    });
});
// my stories(public,private,unpublish)
router.get('/my',ensureAuthenticated,(req,res)=>{
    Story.find({user:req.user.id})
    .sort({date:'desc'})
    .populate('user')
    .then(stories=>{
        res.render('stories/index',{
            stories:stories
        });
    });
});
// add story router
router.get('/add',ensureAuthenticated,(req,res)=>{
    res.render('stories/add');
});
// process form for story
router.post('/',(req,res,next)=>{
    if(req.body.allowComments){
        allowComments=true;
    } else {
        allowComments=false;
    }
   
    const newStory={
        title:req.body.title,
        body:req.body.body,
        allowComments:allowComments,
        user:req.user.id,
        status:req.body.status
    }
    Story(newStory).save()
    .then(story=>{
        res.redirect('/stories/my');
    })
});
//stories/show(fro show single story) 
router.get('/show/:id',(req,res)=>{
    Story.findOne({_id:req.params.id})
    .populate('user')
    .populate('comments.commentUser')
    .then(story=>{
       if(story.status=='public'){
           res.render('stories/stories',{story:story});
       } else{
          if(req.user){
              if(req.user.id==story.user._id){
                  res.render('stories/stories',{story:story})
              }else{
                res.redirect('/stories'); 
              }
          }else{
              res.redirect('/stories');
          }
       }
    });
});
//for edit story
router.get('/edit/:id',ensureAuthenticated,(req,res)=>{
    Story.findOne({_id:req.params.id})
    .then(story=>{
        if(story.user!=req.user.id){
            res.redirect('/stories');
        } else{
            res.render('stories/edit',{story:story});
        }
    });
});
// edit story process
router.put('/:id',ensureAuthenticated,(req,res)=>{
    Story.findOne({_id:req.params.id})
    .then(story=>{
        if(req.body.allowComments){
            allowComments=true;
        } else {
            allowComments=false;
        }
        story.title=req.body.title;
        story.body=req.body.body;
        story.status=req.body.status;
        story.allowComments=allowComments;
        story.save(story=>{
            res.redirect('/dashboard');
        });
    });
});
//delete story
router.delete('/:id',ensureAuthenticated,(req,res)=>{
    Story.remove({_id:req.params.id})
    .then(()=>{
        res.redirect('/dashboard');
    });
});
//add comments
router.post('/comment/:id',(req,res)=>{
    Story.findOne({_id:req.params.id})
    .then(story=>{
        const newComment={
            commentBody:req.body.commentBody,
            commentUser:req.user.id
        }
        //push to array
        story.comments.unshift(newComment);
        story.save()
        .then(story=>{
           res.redirect(`/stories/show/${story.id}`);
        })
    })
});
module.exports=router;