/**
 * Created by AlexAdamenko on 12/8/2017.
 */

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let parameters = new Schema({
    parameter: String,
    defaultValue: String
});

let applicationField = new Schema({
    name: String
});

let layer = new Schema({
    dimension: {
        min: {type: Number},
        max: {type: Number}
    },
    size: {
        min: {type: Number},
        max: {type: Number}
    }
});

let ViNNSL_Description = new Schema({
    metadata: {
        paradigm : {type: String},
        name : {type: String},
        description: {type: String},
        version: {
            major: {type: String},
            minor: {type: String}
        }
    },
    creator : {
        name: {type: String},
        contact: {type: String}
    },
    problemDomain:{
      propagationType: {
          learningType: {type: String}
      },
        applicationField: [applicationField],
        networkType: {type: String},
        problemType: {type: String}
    },
    endpoints:{
        train: {type:Boolean, Default: true},
        retrain: {type:Boolean, Default: true},
        test: {type:Boolean, Default: true}
    },
    structure: [layer],
    parameters: [parameters],
    data:{
        description: {type: String},
        tableDescription: {type: String},
        fileDescription: {type: String, Default: "no file needed"}
    }
});

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('ViNNSL_Description', ViNNSL_Description);