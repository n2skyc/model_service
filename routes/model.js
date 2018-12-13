module.exports = function (app) {

    let Model = require('./../models/Model');
    let Vinnsl_model = require('./../models/ViNNSL_Description');
    let request = require('request');
    let querystring = require('querystring');


    app.post('/model/train', function (req, res) {

        let formData = querystring.stringify(req.body.modelParameters);
        let contentLength = formData.length;


        request({
            headers: {
                'Content-Length': contentLength,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            uri: req.body.endpoint + "/train",
            body: formData,
            method: 'POST'
        }, function (err, response, body) {


            let model = new Model({
                name: req.body.name,
                descriptionId: req.body.descriptionId,
                trainedBy: req.body.trainedBy,
                trainedOn: new Date(),
                endpoint: req.body.endpoint,
                accuracy: req.body.accuracy,
                modelParameters: req.body.modelParameters,
                model: JSON.parse(body),
                isCopy: req.body.isCopy ? req.body.isCopy : false,
                copiedFromModelId: req.body.copiedFromModelId ? req.body.copiedFromModelId : null,
                tests: []
            });


            model.save(function (err) {
                if (err) {
                    res.json({success: false});
                }
                else {
                    res.json({success: true});
                }

            });
        });
    });

    app.post('/model/test', function (req, res) {

        Model.findById(req.body.modelId, function (err, model) {
            request({
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                uri: model.endpoint + "/test",
                form: {'testing_data': req.body.testing_data, 'model': JSON.stringify(model.model)},
                method: 'POST'
            }, function (err, response, body) {

                let test = {
                    user: req.body.user,
                    testing_data: req.body.testing_data,
                    result: body,
                    createdOn: new Date()
                };

                Model.update({_id: req.body.modelId}, {$push: {tests: test}}, function (err, doc) {
                    if (err) return res.send(500, {error: err});
                    return res.send(doc);
                });
            });
        });

    });


    app.get('/models/:descriptionId', function (req, res) {
        Model.find({descriptionId: req.params.descriptionId}, function (err, models) {
            res.json(models);
        });
    });


    app.get('/models/id/:modelId', function (req, res) {
        Model.findById(req.params.modelId, function (err, model) {
            res.json(model);
        });
    });

    app.post('/models/descriptions/:from/:limit', function (req, res) {

        let filters = {};
        if (req.body.ids) {
            filters.descriptionId = {$in: req.body.ids};
        }
        if (req.body.filters) {
            for (let [key, value] of Object.entries(req.body.filters)) {
                console.log(typeof(value));

                if (value && typeof(value) !== "boolean") {
                    filters[key] = {$regex: ".*" + value + ".*"};
                }
                if (typeof(value) === "boolean" && value) {
                    filters[key] = value;
                }

            }
        }
        Object.assign(filters, req.body.static_filters);

        console.log(filters);

        Model.find(filters, function (err, models) {
            res.json(models);
        }).skip(parseInt(req.params.from)).limit(parseInt(req.params.limit)).sort({trainedOn: 'desc'});
    });


};