const mongoose=require('mongoose');
const express=require('express');
const router=express.Router();
const Story=mongoose.model('stories');
const {ensureAuthenticated,ensureGuest}=require('../helpers/auth');
//index
router.get('/',ensureGuest,(req,res)=>{
    res.render('index/welcome');
});
//dashboard
router.get('/dashboard',ensureAuthenticated,(req,res)=>{
    Story.find({user:req.user})
    .then(stories=>{
        res.render('index/dashboard',{stories:stories});
    });
});
//about
router.get('/about',(req,res)=>{
    res.render('index/about');
});
module.exports=router;
