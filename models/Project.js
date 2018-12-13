let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let Project = new Schema({
    createdBy: String,
    createdOn: Date,
    name: String,
    description: String,
    nn_descriptions_id: [String],
    nn_models_id:[String]

});

module.exports = mongoose.model('Project', Project);