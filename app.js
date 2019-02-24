const mongoose=require('mongoose');
const express=require('express');
const passport=require('passport');
const session=require('express-session');
const cookieParser=require('cookie-parser')
const exphbs=require('express-handlebars');
const bodyParser=require('body-parser');
const methodOverride=require('method-override');
const path=require('path');
const keys = require('./config/keys');
//load passport
require('./config/passport')(passport);

//load models
require('./models/Story');
//load helpers
const {truncate,stripTags,formatDate,select,editIcon}=
require('./helpers/hbs');
//initlize Point
const app=express();

//route load
const auth=require('./routes/auth');
const index=require('./routes/index');
const stories=require('./routes/stories');
// connect to db
mongoose.promise=global.promise;
mongoose.connect(keys.mongoURI,{
    useNewUrlParser:true
})
.then(()=>{
    console.log('connect to database...');
})
.catch(error=>{
    console.log(error);
});

// static files
app.use(express.static(path.join(__dirname,'public')));

//handlebars middleware
app.engine('handlebars',exphbs({
    helpers:{
        truncate:truncate,
        stripTags:stripTags,
        formatDate:formatDate,
        select:select,
        editIcon:editIcon
    },
    defaultLayout:'main'
}));
app.set('view engine','handlebars'); 
//bodyparser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//method override
app.use(methodOverride('_method'));
//session middleware
app.use(cookieParser());
app.use(session({
    secret:'secret',
    resave:false,
    saveUninitialized:false
}));
//passport middleware
app.use(passport.initialize());
app.use(passport.session());
//Golble vars
app.use(function(req,res,next){
    res.locals.user=req.user || null;
    
    next();
});

//use Routes
app.use('/auth',auth);
app.use('/',index);
app.use('/stories',stories);

// listen to server
const port= process.env.PORT || 5000;
app.listen(port,()=>{
    console.log('server listen at port '+port);
});