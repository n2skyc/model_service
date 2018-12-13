let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let parameters = new Schema({
    parameter: String,
    defaultValue: String,
    possibleValues: [String]
});
//
// let applicationField = new Schema({
//     name: String
// });


let connectionsShortcuts = {
    from: String,
    to: String,
    isFullConnected: Boolean
};

let inputOutputLayer = new Schema({
    nodesId: [String],
    amount: Number
});

let hiddenLayer = new Schema({
    id: String,
    nodesId: [String],
    amount: Number
});


let endpoints = new Schema({
    name: String,
    endpoint: String
});

let image = new Schema({
    imageType: String,
    endpoint: String
});

let VINNSL_Description_NN = new Schema({
    metadata: {
        name: {type: String},
        description: {type: String},
        paradigm: {type: String},
        createdOn: Date,
        version: {
            major: {type: String},
            minor: {type: String}
        }
    },
    creator: {
        name: {type: String},
        contact: {type: String}
    },
    problemDomain: {
        propagationType: {
            propType: String,
            learningType: String
        },
        applicationField: [String],
        problemType: {type: String},
        networkType: {type: String}
    },
    endpoints: [endpoints],
    structure: {
        inputLayer: inputOutputLayer,
        hiddenLayer: [hiddenLayer],
        outputLayer: inputOutputLayer
    },
    connections: {
        fullyConnected: {
            isConnected: Boolean
        },
        shortcuts: {
            isConnected: Boolean,
            connections: [connectionsShortcuts]
        }
    },
    parameters: {
        input: [parameters],
        output: String
    },
    data: {
        description: {type: String},
        tableDescription: {type: String},
        fileDescription: {type: String, Default: "no file needed"}
    },
    executionEnvironment: {
        lastRun: Date,
        isRunning: {type: Boolean, Default: false},
        hardware: String,
        isPublic: Boolean,
        image: image
    }
});

module.exports = mongoose.model('VINNSL_Description_NN', VINNSL_Description_NN);