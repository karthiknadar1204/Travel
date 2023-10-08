const express=require('express');
const cors=require('cors');
const mongoose = require('mongoose');
const User=require('./models/User');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const cookieParser=require('cookie-parser');
const imageDownloader=require('image-downloader')
const fs = require('fs');
const Place=require('./models/Place')
const Booking=require('./models/Booking')
const multer=require('multer');
const dotenv=require('dotenv').config();

const app=express();

app.use(cors({
    credentials:true,
    origin:'http://127.0.0.1:5173'
}));
app.use(express.json());
// app.use('/uploads', express.static(__dirname + '/uploads'));
app.use("/uploads", express.static("uploads"));
app.use(cookieParser());

const secret='fepviuewvhpiuwvhn8er98yre8';

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

const getUserDataFromToken=(req)=>{
  return new Promise((resolve,reject)=>{
    jwt.verify(req.cookies.token, secret, {},async(err,userData)=>{
      if(err){
        throw err;
      }
      resolve(userData)
    })
  })
}

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

  // app.post('/upload-by-link', async (req, res) => {
  //   const { link } = req.body;
  //   const timestamp = Date.now(); // Get the current timestamp
  //   const newName = timestamp + '.png'; // Create a unique image file name with the '.jpg' extension
  //   const uploadDir = __dirname + '/uploads/';
  
  //   if (!fs.existsSync(uploadDir)) {
  //     fs.mkdirSync(uploadDir);
  //   }
  
  //   try {
  //     await imageDownloader.image({
  //       url: link,
  //       dest: uploadDir + newName,
  //     });
  
  //     res.json(__dirname + '/uploads/' + newName);
  //   } catch (error) {
  //     console.error('Image download error:', error);
  //     res.status(500).json({ error: 'Image download failed' });
  //   }
  // });

  app.post('/upload-by-link', async (req, res) => {
    const { link } = req.body;
    const timestamp = Date.now(); // Get the current timestamp
    const newName = timestamp + '.png'; // Create a unique image file name with the '.png' extension
    const uploadDir = __dirname + '/uploads/';
  
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
  
    try {
      await imageDownloader.image({
        url: link,
        dest: uploadDir + newName,
      });
  
      // Send the correct relative path to the client
      res.json('/uploads/' + newName);
    } catch (error) {
      console.error('Image download error:', error);
      res.status(500).json({ error: 'Image download failed' });
    }
  });
  

  const photosMiddleware = multer({ dest: 'uploads' });
  app.post('/upload', photosMiddleware.array('photos', 100), (req, res) => {

    const uploadedFiles=[];
    for(let i=0;i<req.files.length;i++){
      const {path,originalname}=req.files[i];
      const parts=originalname.split('.');
      const ext=parts[parts.length-1];
      const newPath=path+'.'+ext;
      fs.renameSync(path,newPath)
      uploadedFiles.push(newPath.replace('uploads/',''))
    }
    res.json(uploadedFiles);
  });

  app.post('/places', async (req, res) => {
    const { token } = req.cookies;
    const {
      title,
      address,
      addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      price
    } = req.body;
  
    try {
      const verified = jwt.verify(token, secret, {});
      
      // Convert check-in and check-out times to numbers
      const checkInTime = parseFloat(checkIn);
      const checkOutTime = parseFloat(checkOut);
  
      const placeDoc = await Place.create({
        owner: verified.id,
        title,
        address,
        photos:addedPhotos,
        description,
        perks,
        extraInfo,
        checkIn: checkInTime,
        checkOut: checkOutTime,
        maxGuests,
        price
      });
  
      res.json(placeDoc); // Send the created place document as the response
    } catch (error) {
      console.error('Error creating place:', error);
      res.status(500).json({ error: 'Place creation failed' });
    }
  });

  app.get('/user-places',(req,res)=>{
    const { token } = req.cookies;
    const verified = jwt.verify(token, secret, {},async(err,userData)=>{
      const {id}=userData;
      res.json(await Place.find({owner:id}))
    })
  })
  
  app.get('/places/:id',async(req,res)=>{
    const {id}=req.params;
    res.json(await Place.findById(id))
  })
  
  app.put('/places',async(req,res)=>{
    const { token } = req.cookies;
    const {
      id,
      title,
      address,
      addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      price
    } = req.body;
    
    const verified = jwt.verify(token, secret, {},async(err,userData)=>{
      if(err){
        throw err
      }
      const placeDoc=await Place.findById(id);
      // console.log(userData.id);
      // console.log(placeDoc.owner);
      if(userData.id===placeDoc.owner.toString()){
        placeDoc.set({
          title,
          address,
          photos:addedPhotos,
          description,
          perks,
          extraInfo,
          checkIn,
          checkOut,
          maxGuests,
          price
        })
        await placeDoc.save();
        res.json('okie dokie')
      }
    })

  })

  app.get('/places',async(req,res)=>{
    res.json(await Place.find());
  })

  app.post('/bookings', async (req, res) => {
    const userData=await getUserDataFromToken(req);
    const { place, checkIn, checkOut, numberOfGuests, name, phone, price } = req.body;

    try {
        const booking = await Booking.create({
            place,
            checkIn,
            checkOut,
            numberOfGuests,
            name,
            phone,
            price,
            user:userData.id
        });

        res.json(booking);
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/bookings',async(req,res)=>{
  const userData=await getUserDataFromToken(req);
  res.json(await Booking.find({user:userData.id}).populate('place'))

})

port=3002;

app.listen(port,(req,res)=>{
    console.log(`server is running on port ${port}`)
})
