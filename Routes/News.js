const router = require('express').Router();
const verifyToken = require('../Validation/verifyToken');
const {userInterestValidation} = require('../Validation/validation');

const NewsModel =  require('../Models/NewsModel');
const CoronaModel =  require('../Models/CoronaModel');

// const { date, string } = require('@hapi/joi');
var dateTime = require('node-datetime');

// Get today date.
var dt = dateTime.create();
var today_date = dt.format('Y-m-d');
dt.offsetInDays(-1);
var yesterday = dt.format('Y-m-d');



function shuffle(array) {
    var currentIndex = array.length
      , temporaryValue
      , randomIndex
      ;
    var array_length = array.length;

    // While there remain elements to shuffle...
    currentIndex = Math.floor(currentIndex /2);

    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex1 = Math.floor(Math.random() * array_length);
      randomIndex2 = Math.floor(Math.random() * array_length);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[randomIndex1];
      array[randomIndex1] = array[randomIndex2];
      array[randomIndex2] = temporaryValue;
    }

    return array;
  }


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

                                $and : [
                                            { $or: [
                                                    {Label:user_interests[0]},
                                                    {Label:user_interests[1]},
                                                    {Label:user_interests[2]}
                                                ]
                                            },

                                            { $or: [
                                                    {Date : today_date},
                                                    {Date : yesterday}
                                                ]
                                            }
                                        ]
                            
                            }


                // Date : today_date
                // applay query
                var result =  await NewsModel.find(query);
                if(result)
                {
                    result = shuffle(result);
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

        // Make query
        var query = {

            $or : [
                    {Date : today_date},      
                  ]
        
                }

         var result =  await NewsModel.find(query);
         if(result)
         {
             result = shuffle(result);
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

            $and : [
                        { $or: [
                                {Label:"PAKISTAN"},
                               ]
                        },

                        { $or: [
                                {Date : today_date},
                                {Date : yesterday}
                               ]
                        }
                    ]
        
                }
        
         var result =  await NewsModel.find(query);
         if(result)
         {
            result = shuffle(result);
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

            $and : [
                        { $or: [
                                {Label:"WORLD"},
                               ]
                        },

                        { $or: [
                                {Date : today_date},
                                {Date : yesterday}
                               ]
                        }
                    ]
        
                }

        
        
         var result =  await NewsModel.find(query);
         if(result)
         {
            result = shuffle(result);
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
                 reason: "No technology News Avaliable yet",
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

            $and : [
                        { $or: [
                                {Label:"TECHNOLOGY"},
                               ]
                        },

                        { $or: [
                                {Date : today_date},
                                {Date : yesterday}
                               ]
                        }
                    ]
        
                }
        
         var result =  await NewsModel.find(query);
         if(result)
         {
            result = shuffle(result);
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
                 reason: "No technology News Avaliable yet",
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

            $and : [
                        { $or: [
                                {Label:"SPORTS"},
                               ]
                        },

                        { $or: [
                                {Date : today_date},
                                {Date : yesterday}
                               ]
                        }
                    ]
        
                }
        
         var result =  await NewsModel.find(query);
         if(result)
         {
            result = shuffle(result);
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
                 reason: "No sports News Avaliable yet",
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

            $and : [
                        { $or: [
                                {Label:"BUSINESS"},
                               ]
                        },

                        { $or: [
                                {Date : today_date},
                                {Date : yesterday}
                               ]
                        }
                    ]
        
                }
        
         var result =  await NewsModel.find(query);
         if(result)
         {
            result = shuffle(result);
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
                 reason: "No Business News Avaliable yet",
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

 // get entertainment news
 router.get('/entertainment', verifyToken, async(req, res) => {
    try {

         // Make query
         var query = {

            $and : [
                        { $or: [
                                {Label:"ENTERTAINMENT"},
                               ]
                        },

                        { $or: [
                                {Date : today_date},
                                {Date : yesterday}
                               ]
                        }
                    ]
        
                }

         var result =  await NewsModel.find(query);
         if(result)
         {
            result = shuffle(result);
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
                 reason: "No Entertainment News Avaliable yet",
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


 // get off beat news
 router.get('/offbeat', verifyToken,  async(req, res) => {
    try {

        // Make query
        var query = {

                $and : [
                            { $or: [
                                    {Label:"OFFBEAT"},
                                   ]
                            },

                            { $or: [
                                    {Date : today_date},
                                    {Date : yesterday}
                                   ]
                            }
                        ]
            
                    }
    
        
         var result =  await NewsModel.find(query);
         if(result)
         {
            result = shuffle(result);
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
                 reason: "No offbeat News avaliable yet",
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


 // get life style news
 router.get('/lifestyle', verifyToken, async(req, res) => {
    try {

        // Make query
        var query = {

            $and : [
                        { $or: [
                                {Label:"LIFESTYLE"},
                               ]
                        },

                        { $or: [
                                {Date : today_date},
                                {Date : yesterday}
                               ]
                        }
                    ]
        
                }
        
         var result =  await NewsModel.find(query);
         if(result)
         {
            result = shuffle(result);
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
                 reason: "No lifestyle News Avaliable yet",
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


 // get Health news
 router.get('/health', verifyToken, async(req, res) => {
    try {
        // Make query
        var query = {

            $and : [
                        { $or: [
                                {Label:"HEALTH"},
                               ]
                        },

                        { $or: [
                                {Date : today_date},
                                {Date : yesterday}
                               ]
                        }
                    ]
        
                }
                
         var result =  await NewsModel.find(query);
         if(result)
         {
            result = shuffle(result);
            // result = shuffle(result);
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
                 reason: "No health News Avaliable yet",
                 NewsArray: [],
             });
         }
    } catch (err) {
        res.status(400).json({
              success: 0,
             totalNews: 0,
             reason: 'Some Error',
             NewsArray: [],
        });
    } 
 });


 // get sci and tech news
 router.get('/scitech', verifyToken, async(req, res) => {
    try {
        // Make query
        var query = {

            $and : [
                        { $or: [
                                {Label:"SCI & TECH"},
                               ]
                        },

                        { $or: [
                                {Date : today_date},
                                {Date : yesterday}
                               ]
                        }
                    ]
        
                }
        
         var result =  await NewsModel.find(query);
         if(result)
         {
            result = shuffle(result);
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
                 reason: "No scitech News Avaliable yet",
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
        //  const result =  await CoronaModel.find({Date : today_date});
        let result =  await CoronaModel.find();
        result = result[result.length -1];
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
                 reason: "No Data Avaliable yet",
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