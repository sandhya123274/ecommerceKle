const express = require('express');
const app = express();
const mongoose = require('mongoose');
const {User} = require('./models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const morgan = require('morgan')

mongoose.connect('mongodb://127.0.0.1:27017/ecommerceKle')
.then(()=>{
    console.log("DB is connected");
}).catch(()=>{
    console.log("DB is not connected")
})
app.use(cors());
app.use(morgan("dev"));
//for form method we use middleware
app.use(express.json())

//task1-> route for register
app.post('/register',async(req,res)=>{
    const {email,password,name} = req.body;
    if(!email ||!password ||!name){
        res.status(400).json({message:"Some field are missing"})
    }

    // to check user is register or not
    const isUserAlreadyExist = await User.findOne({email});

    if(isUserAlreadyExist){
        res.status(400).json({message:"User Already have an Account"})
        return;
        
    }else{
        //hashing password
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password,salt);

        //generate just token
        const token = jwt.sign(email,"supersecrete");
        await User.create({
             name:name,
             email:email,
             password:hashedpassword,
             token:token
        });
        return res.status(201).json({message:"User created Successfully"});
    }
});
//task 2-> route for login
app.post('/login',async(req,res)=>{
    const {email,password} = req.body;

    const user = await User.findOne({email:email});
    if(user){
        //if user exit
        const isPasswordMatched = bcrypt.compareSync(password,user.password);
        if(isPasswordMatched === true){
            res.status(200).json({
                name: user.name,
                token: user.token,
                email:user.email
            });
            res.status(400).json({mesage:"password Not Matched"});
        }
    }else{
        res.status(400).json({message:"User is not registered.Please Register"})
    }
 })





let PORT = 8080;
app.listen(PORT,()=>{
    console.log(`server is connected to ${PORT}`);
})