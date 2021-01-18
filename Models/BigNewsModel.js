const mongoose = require('mongoose');


const bignewsSchema = new mongoose.Schema({
    News_heading:{
        type: String,
        required: true
    },
    News_details:{
        type: String,
        required: true
    },
    ImagePath:{
        type: String,
        required: true
    },
    Link:{
        type: String,
        required: true
    },
    Source:{
        type: String,
        required: true
    },
    Label:{
        type: String,
        required: true
    },
    Date:{
        type: String,
        required: true
    },
    Time:{
        type: String,
        required: true
    },
    
}, { collection : 'Big_News_collection' });

module.exports = mongoose.model('Big_News_collection', bignewsSchema);