let mongoose = require('mongoose');
let Schema = mongoose.Schema;


let test = new Schema({
    user : String,
    testing_data : String,
    result: String,
    createdOn : Date
});

let parameters = new Schema({
    parameter: String,
    value: String
});

let endpoints = new Schema({
    name: String,
    endpoint: String
});


let VinnslModel = new Schema({
    isTrainingDone: Boolean,
    rawModel: {},
    vinnslDescriptionId : String,
    trainedBy: String,
    trainedOn: Date,
    parameters: {
        input: [parameters],
        output: String
    },
    endpoints: [endpoints],
    tests: [test],
    isCopy: Boolean,
    copiedFromModelId: String,
    training_data: String,
    logs: {}
});

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('VinnslModel', VinnslModel);