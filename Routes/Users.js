const router = require('express').Router();
const UserModel = require('../Models/UserModel');

// user reg and login validation
const {registerValidation} = require('../Validation/validation');
const {loginValidation} = require('../Validation/validation');
// user interest validation
const {userInterestValidation} = require('../Validation/validation');

const bcrypt = require('bcryptjs');
const verifyToken = require('../Validation/verifyToken');
//const jwt = require('jsonwebtoken');
// const dotenv = require('dotenv');
// dotenv.config();  

// Register Route
router.post('/register', verifyToken , async (req, res) => {
    try {
        // ----------------  Validate data -------------------
        const {error} = registerValidation(req.body);
        if (error) {
            return res.status(400).json({
                success: 0,
                description: error.details[0].message,
                user_details: {}
            });
        }
        // ----------------- Check if Email or name already in DB ------------------
        const name_email = await  UserModel.findOne({ $or : [ {email: req.body.email}, {name: req.body.name} ] });
        if (name_email){
            return res.status(400).json({
                success: 0,
                description: "Name or email already exists",
                user_details: {}
            });
        }

        // ----------------  Validate user interests -------------------
        var userinterests = req.body.userinterests;
        if(userinterests){
            console.log("Orignal_user Interest : ",userinterests);
            user_interests = userinterests.split(",");
            console.log("operated user interst : ", user_interests);
            console.log(user_interests[0]);
            console.log(user_interests[1]);
            console.log(user_interests[2]);

            if(userInterestValidation(user_interests)){

                // ----------------- Hash the password ------------------
                const salt = await bcrypt.genSalt(parseInt(process.env.salt_number, 10));
                const hashpassword = await bcrypt.hash(req.body.password, salt);
                req.body.password = hashpassword;

                // ----------------- Create new user ------------------ 
                const user = new UserModel({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password,
                    userinterests:req.body.userinterests,
                    status: "UnBlocked",
                    statusreason: "Good",
                });
                // save user into the data base
                const saveduser = await user.save();
                if(saveduser){
                    return res.status(200).json({
                        success: 1,
                        description: "User Saved Successfully!",
                        user_details: saveduser
                    });
                }
                else{
                    return res.status(400).json({
                        success: 0,
                        description: "User Does not Saved Successfully!",
                        user_details: saveduser
                    });
                }
            }
            else
            {
              return  res.status(400).json({
                        success: 0,
                        description: "Invalid User interests",
                        user_details: {}
                    });
            }
        }
        else
        {
           return res.status(400).json({
                success: 0,
                description: "Request Body must have userinterests",
                user_details: {}
            });
        }
    } catch (err) {

        res.status(400).json({
            success: 0,
            description: err,
            user_details: {}
        });
        
    }

});


// Login Route
router.post('/login', verifyToken, async  (req, res) => {
    try {
        // ----------------  Validate data -------------------
        const {error} = loginValidation(req.body);
        if (error){
            return res.status(400).json({
                success: 0,
                description: error.details[0].message,
                user_details: {}
            })
        }

        // ----------------- Check if username matched  ------------------
        const user = await  UserModel.findOne({name: req.body.name});
        if (!user){
            return res.status(400).json({
                success: 0,
                description: "'Invalid name or password'",
                user_details: {}
            });
        } 

        // ----------------- Check if password matched  ------------------
        const validpass = await bcrypt.compare(req.body.password, user.password);

        if (!validpass){
            return res.status(400).json({
                success: 0,
                description: "'Invalid Email or password'",
                user_details: {}
            });
        }
        else{
            // user info is matched
            res.status(200).json({
                    success:1,
                    description: "Successfuly login",
                    user_details: {
                        id : user._id,
                        name: user.name,
                        userinterests: user.userinterests
                    }
                }
            );
        }   
    }catch (err) {
        res.status(400).json({
            success: 0,
            description: err,
            user_details: {des: "Some Error"}
        });
    }

});


// While Login from google first check if user is already register or not?
router.post('/alreadyRegister', verifyToken , async (req, res) => {
    try {
        // ----------------  Validate data -------------------
        const {error} = registerValidation(req.body);
        if (error) {
            return res.status(400).json({
                success: 0,
                description: error.details[0].message,
                user_details: {}
            });
        }
        // ----------------- Check if Email or name already in DB ------------------
        const name_email = await  UserModel.findOne({ $or : [ {email: req.body.email}, {name: req.body.name} ] });
        if (name_email){
            return res.status(200).json({
                success: 0,
                description: "Name or email already exists",
                user_details: {}
            });
        }else{
            res.status(200).json({
                success: 1,
                description: "Name or email  doesnot exists",
                user_details:{}
            });
        }

    } catch (err) {

        res.status(400).json({
            success: -1,
            description: err,
            user_details: {}
        });
        
    }

});


module.exports = router;




// // ----------------- Check if name already in DB ------------------
        // const nameexists = await  UserModel.findOne({name: req.body.name});
        // if (nameexists){
        //     return res.status(400).json({
        //         success: 0,
        //         description: "Name or email already exists",
        //         user_details: {}
        //     });
        // }