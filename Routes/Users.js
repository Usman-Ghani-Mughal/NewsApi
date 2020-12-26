const router = require('express').Router();
const UserModel = require('../Models/UserModel');
const {registerValidation, loginValidation} = require('../Validation/validation');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); 
const verifyToken = require('../Validation/verifyToken');
// const dotenv = require('dotenv');
// dotenv.config();

// Register Route
router.post('/register', verifyToken , async (req, res) => {
    // ----------------  Validate data -------------------
    const {error} = registerValidation(req.body);
    if (error) return res.status(400).json({message: error.details[0].message});
    
    // ----------------- Check if user already in DB ------------------
    /*
        const eamilexists = await  UserModel.findOne({email: req.body.email});
        if (eamilexists) return res.status(400).send('Email already exists);
     */

    // ----------------- Hash the password ------------------
     const salt = await bcrypt.genSalt(parseInt(process.env.salt_number, 10));
     const hashpassword = await bcrypt.hash(req.body.password, salt);
     req.body.password = hashpassword;

    // ----------------- Create new user ------------------
    /* 
    const user = new UserModel({
        name: req.body.name,
          // and so on.
    });
    */
    
    // ------------------- Store User ----------------------
    try {
        // save user into the data base
        // const savedUser = await UserModel.save();
        /**
         * if(!savedUser) res.satus(400).send("some error")
         */
        res.status(200).json({
            success: 1
        });

    } catch (error) {
        res.status(400).json({
            success: 0,
            description: 'There is some error'
        });
    }
    res.status(200).json({
        success: 1,
        data: req.body
    });


});

// Login Route
router.post('/login', async  (req, res) => {
    
    // ----------------  Validate data -------------------
    const {error} = loginValidation(req.body);
    if (error) return res.status(400).json({message: error.details[0].message})


    // ----------------- Check if email exists  ------------------
    /*
        const user = await  UserModel.findOne({email: req.body.email});
        if (!user) return res.status(400).send('Invalid Email or password');

     */
    // ----------------- Check if password matched  ------------------
    /**
     * const validpass = await bcrypt.compare(req.body.password, user.password);
     * if (!validpass) return res.status(400).send('Invalid Email or password');
     */

    res.status(200).json(
        {
            success:1,
            data: req.body
        }
    );


});

module.exports = router;