let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let UserReferecedDescription = new Schema({
    user: {type: String, unique: true},
    descriptionsId: [String]
});

module.exports = mongoose.model('UserReferecedDescription', UserReferecedDescription);