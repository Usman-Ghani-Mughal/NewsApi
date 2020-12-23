const router = require('express').Router();
const verifyToken = require('../Validation/verifyToken');
const {userInterestValidation} = require('../Validation/validation');
const NewsModel =  require('../Models/NewsModel');
const { date, string } = require('@hapi/joi');
var dateTime = require('node-datetime');
// Get today date.
var dt = dateTime.create();
var today_date = dt.format('Y-m-d');


router.get('/recomendedNews', verifyToken, async(req, res) => {
    try {
        // check if req have userinterests or not
        var query_parameter =  req.query;
        if(query_parameter.userinterests)
        {
            var user_interests = query_parameter.userinterests;
            user_interests = user_interests.split(",");
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
                        NewsArray: result
                    });
                }
                else
                {
                    res.status(400).json({
                        success: 0,
                        NewsArray: result
                    });
                }
            }
            else
            {
                res.status(400).json({
                    success: 0,
                    reason: "Invalid User interests"
                });
            }
        }
        else
        {
            res.status(400).json({
                success: 0,
                reason: "Request parameters must have userinterests"
            });
        }
    } catch (err) {
        res.status(400).json({
            success: 0,
            reason: err
        });
    }
    
});





router.get('/latestnews', verifyToken, async(req, res) => {
   try {
        const result =  await NewsModel.find({Date : today_date});
        if(result)
        {
            res.status(200).json({
                success: 1,
                NewsArray: result
            });
        }
        else
        {
            res.status(400).json({
                success: 0,
                NewsArray: result
            });
        }
   } catch (err) {
       res.status(400).json({
           success:0,
           error: err
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