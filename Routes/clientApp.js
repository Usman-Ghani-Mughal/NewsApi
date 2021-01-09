const router = require('express').Router();
const AppModel = require('../Models/AppModel');
const {appLoginValidation, appRegisterValidation} = require('../Validation/validation');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const verifyToken = require('../Validation/verifyToken');

// For today date.
var dateTime = require('node-datetime');
var dt = dateTime.create();
var today_date = dt.format('Y-m-d');

// const dotenv = require('dotenv');
// dotenv.config();

// Register Route
router.post('/register', async (req, res) => {
    // ----------------  Validate data -------------------
    const {error} = appRegisterValidation(req.body);
    if (error) return res.status(400).json({message: error.details[0].message});
    
    // ----------------- Check if App already in DB ------------------
    const eamilexists = await  AppModel.findOne({email: req.body.email});
    if (eamilexists) return res.status(400).send('Email already exists');

    // ----------------- Hash the password ------------------
     const salt = await bcrypt.genSalt(parseInt(process.env.salt_number, 10));
     const hashpassword = await bcrypt.hash(req.body.password, salt);
     req.body.password = hashpassword;
    // ----------------- Create new App ------------------ 
    const App = new AppModel({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        date: today_date,
        status: "UnBlocked",
        statusreason: "Good",
        token: "No token Yet"
    });
    
    
    // ------------------- Store APP ----------------------
    try {
        // save App into the data base
        const savedapp = await App.save();
        if(savedapp)
        {
            res.status(200).json({
                success: 1,
                description: savedapp
            });
        }
        else
        {
            res.status(400).json({
                success: 0,
                description: savedapp
            });
        }
    } catch (err) {
        res.status(400).json({
            success: 0,
            description: err
        });
    }
});

// Login Route
router.post('/login', async  (req, res) => {
    
    // ----------------  Validate data -------------------
    const {error} = appLoginValidation(req.body);
    if (error) return res.status(400).json({message: error.details[0].message})


    // ----------------- Check if email exists  ------------------
    const app = await  AppModel.findOne({email: req.body.email});
    if (!app) return res.status(400).send('Invalid Email or Password');

     
    // ----------------- Check if password matched  ------------------
    const validpass = await bcrypt.compare(req.body.password, app.password);
    if (!validpass) return res.status(400).send('Invalid Email or Password');
     
    // Here 1 will be app._id
    const token = jwt.sign({_id: app._id}, process.env.secret_key);
    res.header('auth-token', token).status(200).json({
        success:1,
        token: token,
        data: req.body
    });
});

module.exports = router;