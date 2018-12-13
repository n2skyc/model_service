let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let modelParameters = new Schema({
    parameter: String,
    defaultValue: String
});


let docker = new Schema({
    user: String,
    name: String,
    namespace: String,
    description: String,
    is_private: Boolean,
    is_automated: Boolean,
    can_edit: Boolean,
    last_updated: Date
});


let Description = new Schema({
    createdBy: {type: String},
    createdOn: {type: Date},
    name: {type: String},
    docker: docker,
    domain: {type: String},
    yaml: {type: String},
    inputType: {type: String},
    inputDimensions: {type: String},
    modelParameters: [modelParameters],
    endpoint: String,
    isCloudify: Boolean,
    isRunning: {type: Boolean},
    isPublic: {type: Boolean}
});

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Description', Description);