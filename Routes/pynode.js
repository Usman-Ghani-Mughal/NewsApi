const router = require('express').Router();
const verifyToken = require('../Validation/verifyToken');
const {userInterestValidation} = require('../Validation/validation');

const NewsModel =  require('../Models/NewsModel');

const { date, string } = require('@hapi/joi');
var dateTime = require('node-datetime');

// Get today date.
var dt = dateTime.create();
var today_date = dt.format('Y-m-d');
// Get previous date.
dt.offsetInDays(-1);
var yesterday = dt.format('Y-m-d');

// For runing python
const spawn  = require('child_process').spawn;
const Joi = require('@hapi/joi');

// Genrate Rules
router.get('/genraterules', async(req, res) => {
    
    const py = spawn('python', ['./PythonScripts/Genrate_Rules.py'] );

    py.stdout.on('data', (data) => {
        console.log(data.toString());

    });

    py.on('close', (code)=>{
        console.log(`Process closed exited with coode  ${code}`);
            // res.status(400).json({
            //         success: 0,
            //   });
    });

    
    res.status(200).json({
        success: 1,
    });

 });


 // Genrate Rules
router.get('/genrateuerprofiles', async(req, res) => {
    
    const py = spawn('python', ['./PythonScripts/Genrate_Users_Profile.py'] );

    py.stdout.on('data', (data) => {
        console.log(data.toString());
    });

    py.on('close', (code)=>{
        console.log(`Process closed exited with coode  ${code}`);
            // res.status(400).json({
            //         success: 0,
            //   });
    });

    
    res.status(200).json({
        success: 1,
    });

 });


  // Genrate Rules
router.get('/userrecommendations', async (req, res) => {
    try {
        // check if req have name or not
        var query_parameter =  req.query;
        if(query_parameter.name){
            const py = spawn('python', ['./PythonScripts/Get_User_Recomendation.py', query_parameter.name] );

            py.stdout.on('data', async (data) => {
                var user_label = await data.toString();
                user_label = user_label.replace(/(\r\n|\n|\r)/gm,"");

                // Make query
                var query = {
                            $and : [
                                    { $or: [
                                            {Label: user_label},
                                        ]
                                    },
                                    { $or: [
                                            {Date : today_date},
                                            {Date : yesterday}
                                        ]
                                    }
                                ]
                            } 

                 await console.log(query);


            const result =  await NewsModel.find(query);

            console.log(result.length);

            if(result)
                {
                    if(result.length === 0){
                        var query = {
                            $and : [
                                    { $or: [
                                            {Label:'PAKISTAN'},
                                        ]
                                    },
                                    { $or: [
                                            {Date : today_date},
                                            {Date : yesterday}
                                        ]
                                    }
                                ]
                            }
                            const result =  await NewsModel.find(query);
                            res.status(200).json({
                                success: 1,
                                totalNews: result.length,
                                reason: "",
                                NewsArray: result,
                                
                            });

                    }else{
                        res.status(200).json({
                            success: 1,
                            totalNews: result.length,
                            reason: "",
                            NewsArray: result,
                            
                        });
                    }
                    
                }
                else
                {
                    res.status(200).json({
                        success: 0,
                        totalNews: 0,
                        reason: "Some error",
                        NewsArray: result
                    });
                }

            });

        }else{
            res.status(200).json({
                success: 0,
                totalNews: 0,
                reason: "Request doesnot have name",
                NewsArray: [],
                
            });
            // send response what it must have name in query parameters
        }
    } catch (error) {
        res.status(200).json({
            success: 0,
            totalNews: 0,
            reason: "Some error",
            NewsArray: [],
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