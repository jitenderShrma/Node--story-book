
const mongoose=require('mongoose');
const express=require('express');
const router=express.Router();
const passport=require('passport');

//auth router
router.get('/google',passport.authenticate('google',{
   scope:['profile','email'] 
}));
//callback
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/dashboard');
    
  });
//verigy
router.get('/verify', (req, res) => {
  if(req.user){
    console.log(req.user);
  } else {
    console.log('Not Auth');
  }
});

// logout
router.get('/logout',(req,res)=>{
  req.logout();
  res.redirect('/');
});
module.exports=router;


