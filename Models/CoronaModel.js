const mongoose = require('mongoose');


const coronaSchema = new mongoose.Schema({
    New_Cases:{
        type: String,
        required: true
    },
    New_Deaths:{
        type: String,
        required: true
    },
    Positive_Rate:{
        type: String,
        required: true
    },
    Active_Cases:{
        type: String,
        required: true
    },
    Total_Cases:{
        type: String,
        required: true
    },
    Recovered:{
        type: String,
        required: true
    },
    Total_Deaths:{
        type: String,
        required: true
    },
    Date:{
        type: String,
        required: true
    },
}, { collection : 'Corona_collection' });

module.exports = mongoose.model('Corona_collection', coronaSchema);