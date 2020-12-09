const mongoose = require('mongoose');
var dateTime = require('node-datetime');
var dt = dateTime.create();
var today_date = dt.format('Y-m-d');

const appSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        min: 5,
        max: 255
    },
    email:{
        type: String,
        required: true,
        min: 7,
        max: 255
    },
    password:{
        type: String,
        required: true,
        min:8,
        max:1024
    },
    date:{
        type: String,
        default: today_date
    },
    status:{
        type: String,
        default: "UnBlocked"
    },
    statusreason:{
        type: String,
        default: "Good"
    },
    token:{
        type: String,
    }
}, { collection : 'App_collection' });

module.exports = mongoose.model('App_collection', appSchema);