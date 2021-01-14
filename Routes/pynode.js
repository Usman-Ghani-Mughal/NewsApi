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
// Get previous date.
dt.offsetInDays(-1);
var yesterday = dt.format('Y-m-d');

// For runing python
const spawn  = require('child_process').spawn;


// Get Corna updates news
router.get('/test', async(req, res) => {
    
    const py = spawn('python', ['./Routes/test.py'] );

    py.stdout.on('data', (data) => {
        console.log(data.toString());

        res.status(200).json({
                success: 1,
        });

    });

    py.on('close', (code)=>{
        console.log(`Process closed exited with coode  ${code}`);

            // res.status(400).json({
            //         success: 0,
            //   });
    });

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