var express = require('express');
var exphbs = require('express-handlebars')
var mongoose = require('mongoose')
var bodyParser = require('body-parser')
var methodOverride = require('method-override')
var passport = require('passport')
const session = require('express-session');
var flash = require('connect-flash')

var PORT = process.env.PORT || 3000;

var app = express();


require('./models')

var ideasRouter = require('./routes/ideasRoutes')
var userRoutes = require('./routes/userRoutes')

//passport config
require('./Authentication/passport')(passport)



app.engine('handlebars', exphbs({
    defaultLayout:'main'
}));
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

//method override middleware
app.use(methodOverride('_method'))

//express session middleware
app.use(session({
    secret:'secret',
    resave:true,
    saveUninitialized:true
}))

// Passport Middleware
app.use(passport.initialize())
app.use(passport.session())

app.use(flash())

//Global variables
app.use((req,res,next)=>{
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    res.locals.user = req.user || null
    next()
})

app.use('/ideas',ideasRouter)
app.use('/users',userRoutes)

app.get('/',(req,res)=>{
    var title = "Welcome"
    res.render("index",{
        title
    })
})

app.get('/about',(req,res)=>{
    var title = "About us!"
    res.render('about',{
        title
    })
})

const MONGODB_URI =
  'mongodb+srv://cdevender:mongodb123%40@dev-af6ys.mongodb.net/videoIdeaApp?retryWrites=true&w=majority';
mongoose.connect( MONGODB_URI, { useNewUrlParser: true }
  ).then(result => {
    console.log(`Connected with database!`)
  }).catch(err => {
    console.log(err);
})

app.listen(PORT,()=>{
    console.log(`Server started at ${PORT}`)
})