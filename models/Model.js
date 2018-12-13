let mongoose = require('mongoose');
let Schema = mongoose.Schema;


let test = new Schema({
    user : String,
    testing_data : String,
    result: String,
    createdOn : Date
});



let Model = new Schema({
    name : String,
    descriptionId : String,
    trainedBy: String,
    trainedOn: Date,
    accuracy: String,
    model: {},
    endpoint: String,
    modelParameters: {},
    tests: [test],
    isCopy: Boolean,
    copiedFromModelId: String
});

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Model', Model);