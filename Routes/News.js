const router = require('express').Router();
const verifyToken = require('../Validation/verifyToken');
const {userInterestValidation} = require('../Validation/validation');

const NewsModel =  require('../Models/NewsModel');
const CoronaModel =  require('../Models/CoronaModel');

const { date, string } = require('@hapi/joi');
var dateTime = require('node-datetime');
// Get today date.
var dt = dateTime.create();
var today_date = dt.format('Y-m-d');


// Get recommended news
router.get('/recomendedNews', verifyToken, async(req, res) => {
    try {
        // check if req have userinterests or not
        var query_parameter =  req.query;
        if(query_parameter.userinterests)
        {
            var user_interests = query_parameter.userinterests;
            console.log("Orignal_user Interest : ",user_interests)
            user_interests = user_interests.split(",");
            console.log("operated user interst : ", user_interests)
            console.log(user_interests[0])
            console.log(user_interests[1])
            console.log(user_interests[2])
            if(userInterestValidation(user_interests))
            {
                
                // Make query
                var query = {
                                $or:[
                                        {Label:user_interests[0]},
                                        {Label:user_interests[1]},
                                        {Label:user_interests[2]}
                                    ],
                                Date : today_date
                            }
                // Date : today_date
                // applay query
                const result =  await NewsModel.find(query);
                if(result)
                {
                    res.status(200).json({
                        success: 1,
                        totalNews: result.length,
                        reason: "",
                        NewsArray: result,
                        
                    });
                }
                else
                {
                    res.status(400).json({
                        success: 0,
                        totalNews: 0,
                        reason: "Interestes Does not matched",
                        NewsArray: result
                    });
                }
            }
            else
            {
                res.status(400).json({
                    success: 0,
                    totalNews: 0,
                    reason: "Invalid User interests",
                    NewsArray: []
                });
            }
        }
        else
        {
            res.status(400).json({
                success: 0,
                totalNews: 0,
                reason: "Request parameters must have userinterests",
                NewsArray: []
            });
        }
    } catch (err) {
        res.status(400).json({
            success: 0,
            totalNews: 0,
            reason: err,
            NewsArray: []
        });
    }
    
});


// Get latest news
router.get('/latestnews', verifyToken, async(req, res) => {
    try {
         const result =  await NewsModel.find({Date : today_date});
         if(result)
         {
             res.status(200).json({
                 success: 1,
                 totalNews: result.length,
                 reason: "",
                 NewsArray: result,
 
             });
         }
         else
         {
             res.status(400).json({
                 success: 0,
                 totalNews: 0,
                 reason: "No News Avaliable yet",
                 NewsArray: [],
             });
         }
    } catch (err) {
        res.status(400).json({
              success: 0,
             totalNews: 0,
             reason: "Some Error",
             NewsArray: [],
        });
    } 
 });

// Get Pakistan news
 router.get('/pakistan', verifyToken, async(req, res) => {
    try {

        // Make query
        var query = {
            $or:[
                    {Label:"PAKISTAN"},
                ],
            Date : today_date
        }
        
         const result =  await NewsModel.find(query);
         if(result)
         {
             res.status(200).json({
                 success: 1,
                 totalNews: result.length,
                 reason: "",
                 NewsArray: result,
 
             });
         }
         else
         {
             res.status(400).json({
                 success: 0,
                 totalNews: 0,
                 reason: "No News Avaliable yet",
                 NewsArray: [],
             });
         }
    } catch (err) {
        res.status(400).json({
              success: 0,
             totalNews: 0,
             reason: "Some Error",
             NewsArray: [],
        });
    } 
 });


// get world news
 router.get('/world', verifyToken, async(req, res) => {
    try {

        // Make query
        var query = {
            $or:[
                    {Label:"WORLD"},
                ],
            Date : today_date
        }
        
         const result =  await NewsModel.find(query);
         if(result)
         {
             res.status(200).json({
                 success: 1,
                 totalNews: result.length,
                 reason: "",
                 NewsArray: result,
 
             });
         }
         else
         {
             res.status(400).json({
                 success: 0,
                 totalNews: 0,
                 reason: "No News Avaliable yet",
                 NewsArray: [],
             });
         }
    } catch (err) {
        res.status(400).json({
              success: 0,
             totalNews: 0,
             reason: "Some Error",
             NewsArray: [],
        });
    } 
 });


 // get technology news
 router.get('/technology', verifyToken, async(req, res) => {
    try {

        // Make query
        var query = {
            $or:[
                    {Label:"TECHNOLOGY"},
                ],
            Date : today_date
        }
        
         const result =  await NewsModel.find(query);
         if(result)
         {
             res.status(200).json({
                 success: 1,
                 totalNews: result.length,
                 reason: "",
                 NewsArray: result,
 
             });
         }
         else
         {
             res.status(400).json({
                 success: 0,
                 totalNews: 0,
                 reason: "No News Avaliable yet",
                 NewsArray: [],
             });
         }
    } catch (err) {
        res.status(400).json({
              success: 0,
             totalNews: 0,
             reason: "Some Error",
             NewsArray: [],
        });
    } 
 });


 // get sports news
 router.get('/sports', verifyToken, async(req, res) => {
    try {

        // Make query
        var query = {
            $or:[
                    {Label:"SPORTS"},
                ],
            Date : today_date
        }
        
         const result =  await NewsModel.find(query);
         if(result)
         {
             res.status(200).json({
                 success: 1,
                 totalNews: result.length,
                 reason: "",
                 NewsArray: result,
 
             });
         }
         else
         {
             res.status(400).json({
                 success: 0,
                 totalNews: 0,
                 reason: "No News Avaliable yet",
                 NewsArray: [],
             });
         }
    } catch (err) {
        res.status(400).json({
              success: 0,
             totalNews: 0,
             reason: "Some Error",
             NewsArray: [],
        });
    } 
 });


 // get Business news
 router.get('/business', verifyToken, async(req, res) => {
    try {

        // Make query
        var query = {
            $or:[
                    {Label:"BUSINESS"},
                ],
            Date : today_date
        }
        
         const result =  await NewsModel.find(query);
         if(result)
         {
             res.status(200).json({
                 success: 1,
                 totalNews: result.length,
                 reason: "",
                 NewsArray: result,
 
             });
         }
         else
         {
             res.status(400).json({
                 success: 0,
                 totalNews: 0,
                 reason: "No News Avaliable yet",
                 NewsArray: [],
             });
         }
    } catch (err) {
        res.status(400).json({
              success: 0,
             totalNews: 0,
             reason: "Some Error",
             NewsArray: [],
        });
    } 
 });


// Get Corna updates news
router.get('/corona', verifyToken, async(req, res) => {
    try {
         const result =  await CoronaModel.find({Date : today_date});
         if(result)
         {
             res.status(200).json({
                 success: 1,
                 totalNews: result.length,
                 reason: "",
                 covidData: result,
 
             });
         }
         else
         {
             res.status(400).json({
                 success: 0,
                 totalNews: 0,
                 reason: "No News Avaliable yet",
                 covidData: {},
             });
         }
    } catch (err) {
        res.status(400).json({
              success: 0,
             totalNews: 0,
             reason: "Some Error",
             covidData: {},
        });
    } 
 });


module.exports = router;




// router.get('/recomendedNews', verifyToken ,(req, res) => {
//     res.json(
//         {
//             news: {
//                 news: "skjhdfja",
//                 link: "askjdhfkja",
//                 user: req.user
//             }
//         }
//     );
// });