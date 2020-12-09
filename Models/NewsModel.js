const mongoose = require('mongoose');


const newsSchema = new mongoose.Schema({
    News:{
        type: String,
        required: true
    },
    Label:{
        type: String,
        required: true
    },
    Source:{
        type: String,
        required: true
    },
    Link:{
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
    ImagePath:{
        type: String,
        required: true
    }
}, { collection : 'News_collection' });

module.exports = mongoose.model('News_collection', newsSchema);