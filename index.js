const express=require("express");
const session=require('express-session');
const passport=require('passport');
const crypto=require('crypto')
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');
const cookieParser=require('cookie-parser')
const app=express();
const mongoose=require('mongoose');
const cors=require('cors')
const path=require('path')
const productRouter=require('./routes/ProductsRoutes');
const categoriesRouter=require('./routes/CategoriesRoutes');
const languagesRouter=require('./routes/LanguagesRoutes');
const userRouter=require('./routes/UserRoutes');
const authRouter=require('./routes/AuthRoutes');
const cartRouter=require('./routes/CartRoutes');
const ordersRouter = require('./routes/OrderRoutes');
const UserModel = require("./model/UserModel");
const { isAuth, sanitizeUser, cookieExtractor } = require("./services/common");
const SECRET_KEY='SECRET_KEY'
require('dotenv').config();
var opts = {}
opts.secretOrKey = process.env.SECRET_KEY;
opts.jwtFromRequest = cookieExtractor;




//passport strategies
app.use(session({
    secret: 'keyboard cat',
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    
  }));
  app.use(passport.authenticate('session'));
  app.use(cookieParser())
//middleware
app.use(express.json());
app.use(express.static(path.resolve(__dirname,'build')))
app.use(cors({
    exposedHeaders:['X-Total-Count']
}))
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "frame-src https://*.stripe.com http://localhost:3000");
  next();
});



app.use('/products',isAuth(),productRouter.router)
app.use('/category',isAuth(),categoriesRouter.router)
app.use('/language',isAuth(),languagesRouter.router)
app.use('/users',isAuth(),userRouter.router);
app.use('/auth',authRouter.router);
app.use('/cart',isAuth(),cartRouter.router);
app.use('/orders',isAuth(), ordersRouter.router)


 

  passport.use('local',new LocalStrategy(

    {usernameField:'email'},
   async function(email, password, done) {
        try {
            const user=await UserModel.findOne({email:email}).exec();
    
          
            if (!user) {
              done(null,false,{message:'user not found'})
              
          }
           
            crypto.pbkdf2(password, user.salt, 310000, 32, 'sha256',async function(err, hashedPassword) {

              if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
                
               return done(null,false,{message:'invalid credentials'})
                
             }
             const token = jwt.sign(sanitizeUser(user),SECRET_KEY);
             done(null,{id:user.id,role:user.role})
            });
          
          
          
        } catch (error) {
            
          done(error)
        }
       
    }
  ));
  passport.use('jwt',new JwtStrategy(opts,async function(jwt_payload, done) {
  
       
    try {
      const user=await UserModel.findById( jwt_payload.id);
      if (user) {
        return done(null, sanitizeUser(user));
    } else {
        return done(null, false);
        // or you could create a new account
    }
    } catch (err) {
      
        return done(err, false);
    
    }
    
   
      
    
}));
//this will create session variable req.user being called from callback
  passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
      return cb(null,{id:user.id,email:user.email,name:user.name,role:user.role});
    });
  });
  //this change create session variable req.user being called from authorized request
  passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
      return cb(null, user);
    });
  });
mongoose.connect(process.env.MONGO_URL).then(()=>{

    console.log('connection Successfull with database')
    }).catch((err)=>{
        console.log(err)
        })

        
// This is your test secret API key.
app.use(express.static("public"));
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);




app.post("/create-payment-intent", async (req, res) => {
  const { totalAmount } = req.body;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalAmount*100, // for decimal compensation
    currency: "inr",
    automatic_payment_methods: {
      enabled: true,
    },

  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

// Webhook

// TODO: we will capture actual order after deploying out server live on public URL

const endpointSecret = "whsec_0e1456a83b60b01b3133d4dbe06afa98f384c2837645c364ee0d5382f6fa3ca2";

app.post('/webhook', express.raw({type: 'application/json'}), (request, response) => {
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntentSucceeded = event.data.object;
      console.log({paymentIntentSucceeded})
      // Then define and call a function to handle the event payment_intent.succeeded
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
});










app.listen(process.env.PORT,()=>{
    console.log(`server started on ${process.env.PORT}...`)
})
