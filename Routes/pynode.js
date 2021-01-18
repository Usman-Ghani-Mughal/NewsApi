const router = require('express').Router();
const verifyToken = require('../Validation/verifyToken');
const {userInterestValidation} = require('../Validation/validation');

const NewsModel =  require('../Models/NewsModel');
const BigNewsModel =  require('../Models/BigNewsModel');

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


function between(min, max) {  
    return Math.floor(
      Math.random() * (max - min + 1) + min
    )
  }

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
// --------------------------------------------------------------------------------- //


// Genrate Rules
router.get('/genraterules', verifyToken, async(req, res) => {
    
    const py = spawn('python', ['./PythonScripts/Genrate_Rules.py']);

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
router.get('/genrateuerprofiles', verifyToken, async(req, res) => {
    
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
router.get('/userrecommendations',  verifyToken , async (req, res) => {
    try {
        // check if req have name or not
        var query_parameter =  req.query;
        if(query_parameter.name){
            const py = spawn('python', ['./PythonScripts/Get_User_Recomendation.py', query_parameter.name] );
            py.stdout.on('data', async (data) => {
                var user_label = await data.toString();
                user_label = user_label.replace(/(\r\n|\n|\r)/gm,"");
                var query = {Label: user_label} 
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


 router.get('/userrecommendednews', verifyToken, async(req, res)=>{

    try {
        console.log("we are in");

        // check if req have userinterests or not
        var query_parameter =  req.query;
        if(query_parameter.userinterests && query_parameter.name)
        {
            console.log("we got name and interest");
            var user_interests = query_parameter.userinterests;
            console.log("Orignal_user Interest : ",user_interests)
            user_interests = user_interests.split(",");
            console.log("operated user interst : ", user_interests)
            console.log(user_interests[0])
            console.log(user_interests[1])
            console.log(user_interests[2])
            if(userInterestValidation(user_interests))
            {
                console.log("interests are valid");
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
                // applay query
                var result =  await NewsModel.find(query);
                console.log("result done");
                if(result){
                    console.log("result ok");
                    result = shuffle(result);
                    console.log("result shuffle ok");
                    // res.status(200).json({
                    //     success: 1,
                    //     totalNews: result.length,
                    //     reason: "",
                    //     NewsArray: result,  
                    // });

                    //--------------------- Now Association rule mining --------------------//

                    const py = spawn('python', ['./PythonScripts/Get_User_Recomendation.py', query_parameter.name] );
                    console.log("python called");
                    py.stdout.on('data', async (data) => {
                        console.log("python return");
                        var user_label = await data.toString();
                        user_label = user_label.replace(/(\r\n|\n|\r)/gm,"");
                        console.log(user_label);
                        // make querry
                        var query1 = {Label: user_label}
                        const result1 =  await BigNewsModel.find(query1);
                        console.log(" result one done");
                        if(result1)
                        {
                            console.log(" result one ok");
                                if(result1.length < 6){
                                    console.log(" result one ok not");
                                    var mostPopularInterests = ['PAKISTAN', 'WORLD', 'BUSINESS', 'TECHNOLOGY']
                                    var number =  between(0,3);
                                    var selectedInterst =  mostPopularInterests[number];
                                    var query1 = {
                                        $and : [
                                                { $or: [
                                                        {Label:selectedInterst},
                                                    ]
                                                },
                                                { $or: [
                                                        {Date : today_date},
                                                        {Date : yesterday}
                                                    ]
                                                }
                                            ]
                                        }
                                        const result1 =  await BigNewsModel.find(query1);
                                        console.log(" result one ok not ok");
                                        res.status(200).json({
                                            success: 1,
                                            totalNews: result.length,
                                            totalNews1: result1.length,
                                            reason: "",
                                            NewsArray: result,
                                            NewsArray1: result1
                                        });
            
                                }else{
                                    console.log(" result one ok ok");
                                    res.status(200).json({
                                        success: 1,
                                        totalNews: result.length,
                                        totalNews1: result1.length,
                                        reason: "",
                                        NewsArray: result,
                                        NewsArray1: result1
                                    });
                                }
                                
                        }
                        else{
                            console.log(" result one juagr");
                                var mostPopularInterests = ['PAKISTAN', 'WORLD', 'BUSINESS', 'TECHNOLOGY']
                                var number =  between(0,3);
                                var selectedInterst =  mostPopularInterests[number];
                                var query1 = {
                                    $and : [
                                            { $or: [
                                                    {Label:selectedInterst},
                                                ]
                                            },
                                            { $or: [
                                                    {Date : today_date},
                                                    {Date : yesterday}
                                                ]
                                            }
                                        ]
                                    }
                                    const result1 =  await BigNewsModel.find(query1);
                                    res.status(200).json({
                                        success: 1,
                                        totalNews: result.length,
                                        totalNews1: result1.length,
                                        reason: "",
                                        NewsArray: result,
                                        NewsArray1: result1
                                    });
                            }
                    });
            
                }else{
                    console.log(" result one juagr");
                        res.status(200).json({
                            success: 0,
                            totalNews: 0,
                            totalNews1: 0,
                            reason: "No news to recommend",
                            NewsArray: [],
                            NewsArray1: [],
                            
                        });
                        // send response what it must have name in query parameters
                    }
            }else{
                console.log("ERROR 2");
                        res.status(400).json({
                            success: 0,
                            totalNews: 0,
                            totalNews1: 0,
                            reason: "Interestes Does not matched",
                            NewsArray: [],
                            NewsArray1: [],
                        });
                }
        }else{
                console.log("ERROR 1");
                res.status(400).json({
                    success: 0,
                    totalNews: 0,
                    totalNews1: 0,
                    reason: "request must have user interest and user name",
                    NewsArray: [],
                    NewsArray1: [],
                });
            }
        
    } catch (err) {
        console.log(" ERROR");
        res.status(400).json({
            success: 0,
            totalNews: 0,
            totalNews1: 0,
            reason: err.message,
            NewsArray: [],
            NewsArray1: [],
        });
    }

 });




 router.get('/test', verifyToken, async(req, res) => {
    
    const py = spawn('python', ['./PythonScripts/testpython.py'] );

    py.stdout.on('data', (data) => {
        var  ok = data.toString()
        console.log(ok);
        res.status(200).json({
                    success: ok
              });
    });

    py.on('close', (code)=>{
        console.log(`Process closed exited with coode  ${code}`);
            // res.status(400).json({
            //         success: 0,
            //   });
    });
    console.log("below");
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














// Make query
                // var query = {
                //             $and : [
                //                     { $or: [
                //                             {Label: user_label},
                //                         ]
                //                     },
                //                     { $or: [
                //                             {Date : today_date},
                //                             {Date : yesterday}
                //                         ]
                //                     }
                //                 ]
                //             }