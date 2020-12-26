const router = require('express').Router();
const UserModel = require('../Models/UserModel');
const {registerValidation, loginValidation} = require('../Validation/validation');
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
                description: error.details[0].message
            });
        }
        // ----------------- Check if Email already in DB ------------------
        const eamilexists = await  UserModel.findOne({email: req.body.email});
        if (eamilexists){
            return res.status(400).json({
                success: 0,
                description: "Email Already exsist"
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

                // ----------------- Create new App ------------------ 
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
                        description: savedapp,
                        from: "ok"
                    });
                }
                else{
                    return res.status(400).json({
                        success: 0,
                        description: saveduser,
                        from: "Not ok"
                    });
                }

            }
            else
            {
              return  res.status(400).json({
                        success: 0,
                        description: "Invalid User interests",
                    });
            }
        }
        else
        {
           return res.status(400).json({
                success: 0,
                description: "Request Body must have userinterests",
            });
        }
    } catch (err) {

        res.status(400).json({
            success: 0,
            description: err,
            from: "error"
        });
        
    }

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