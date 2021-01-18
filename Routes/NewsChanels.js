const router = require('express').Router();
const verifyToken = require('../Validation/verifyToken');


const NewsModel =  require('../Models/NewsModel');

const { date, string } = require('@hapi/joi');

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


// Get Pakistan news
 router.get('/channels', verifyToken, async(req, res) => {

    try {

        var query_parameter =  req.query;
        if(query_parameter.channel){
            
            var channel_name = query_parameter.channel
            // Make query
            var query = {
                $and : [
                            { $or: [
                                    {Source:channel_name},
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
                res.status(200).json({
                    success: 0,
                    totalNews: 0,
                    reason: "No News Avaliable yet",
                    NewsArray: [],
                });
            }

        }else{
            res.status(200).json({
                success: 0,
                totalNews: 0,
                reason: "Request parameters must have channel name",
                NewsArray: []
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



module.exports = router;




