const express=require('express');
const cors=require('cors');
const mongoose = require('mongoose');
const User=require('./models/User');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const cookieParser=require('cookie-parser');
const dotenv=require('dotenv').config();

const app=express();

app.use(cors({
    credentials:true,
    origin:'http://127.0.0.1:5173'
}));
app.use(express.json());
app.use(cookieParser());

const secret='fepviuewvhpiuwvhn8er98yre8';
// app.get('/register',(req,res)=>{
//     res.json('test ok');
// })

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
})();

app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    
    try {
      const salt = await bcrypt.genSalt();
      const passwordHash = await bcrypt.hash(password, salt);
  
      const newUser = new User({
        name,
        email,
        password: passwordHash
      });
  
      const savedUser = await newUser.save();
      
      res.json(savedUser);
    } catch (error) {
      console.error('Registration error:', error.message);
      res.status(500).json({ message: 'Registration failed' });
    }
  });

  app.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      const userDoc = await User.findOne({ email });
  
      if (!userDoc) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      const passOk = await bcrypt.compare(password, userDoc.password);
  
      if (!passOk) {
        return res.status(401).json({ error: 'Incorrect password' });
      }
  
      const token = jwt.sign(
        {
          email: userDoc.email,
          id: userDoc._id,
          name:userDoc.name
        },
        secret
      );
  
      res.cookie('token', token, {
        httpOnly: true,
        secure: true,
      }).json(userDoc);
    } catch (error) {
      console.error('Login error:', error.message);
      res.status(500).json({ error: 'Login failed' });
    }
  });
  
  app.get('/profile',async(req,res)=>{
    const {token}=req.cookies;
    if(token){
      const verified=jwt.verify(token,secret,{},async (err,user)=>{
        if(err){
          throw err
        }
        const userDoc=await User.findById(user.id)
        res.json(userDoc);
      })
    }
  })

  app.post('/logout',(req,res)=>{
    res.cookie('token','').json(true);
  })

port=3002;

app.listen(port,(req,res)=>{
    console.log(`server is running on port ${port}`)
})
