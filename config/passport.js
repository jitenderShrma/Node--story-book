const GoogleStrategy=require('passport-google-oauth20').Strategy;
const passport=require('passport');
const mongoose=require('mongoose');
const keys=require('./keys');

//load models
require('../models/User');
const User=mongoose.model('users');
module.exports=function(passport) {
    passport.use(new GoogleStrategy({
        clientID:keys.googleClientID,
        clientSecret:keys.googleClientSecret,
        callbackURL:'/auth/google/callback'
    },(accessToken,refreshToken,profile,done)=>{
        const image=profile.photos[0].value.substring(0,
        profile.photos[0].value.indexOf('?'));
        const newUser={
            googleID:profile.id,
            email:profile.emails[0].value,
            image:image,
            firstName:profile.name.givenName,
            lastName:profile.name.familyName
        }
        
        //for exixting user
        User.findOne({googleID:profile.id})
        .then(user=>{
            if(user){
                done(null,user);
                console.log('user exist already');
            } else {
                User(newUser).save()
                .then(user=>{
                });
                done(null,user);
            }
        })  
    }));
// serialize
    passport.serializeUser((user,done)=>{
        done(null,user);
    });
// deserialize
    passport.deserializeUser((id,done)=>{
        User.findOne(id)
        .then(user=>{
            done(null,user);
        })    
});
}
