const host = require('./../HOST.json');

module.exports = function (app) {

    let csv = require('parse-csv');
    let VinnslModel = require('./../models/VINNSL_Model');
    let request = require('request');

    app.post('/nn/train', function (req, res) {


        let nnModel = new VinnslModel({
            isTrainingDone: false,
            rawModel: null,
            vinnslDescriptionId: req.body.vinnsl._id,
            trainedBy: req.body.trainedBy,
            trainedOn: new Date(),
            parameters: req.body.parameters,
            endpoints: req.body.endpoints,
            tests: [],
            isCopy: false,
            copiedFromModelId: "",
            training_data: req.body.file,
            logs: null
        });

        nnModel.save(function (err, obj) {
            console.log(obj);
            if (err) {
                res.json({success: false, id: obj._id});
            }
            else {
                res.json({success: true, id: obj._id});

                request({
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    uri: req.body.vinnsl.endpoints.filter((e) => e.name === 'train')[0].endpoint,
                    form: {
                        'vinnsl': JSON.stringify(req.body.vinnsl),
                        'model_id': obj._id.toString(),
                        'training_data': req.body.file
                    },
                    method: 'POST'
                }, function (err_py, response, body) {

                    if (err_py) return;


                    request(host.logs_host + obj._id.toString(), function (logs_err, logs_response, logs_body) {
                        let params = {
                            isTrainingDone: true,
                            rawModel: body,
                            logs: JSON.parse(logs_body)
                        };

                        VinnslModel.update({_id: obj._id.toString()}, {$set: params}, function (err, model) {
                            console.log(model);
                        });
                        }
                    );





                })
                ;


            }

        });

        console.log(req);

    });

    app.post('/nn/logs/', function (req, res) {
        request(req.body.endpoint +'logs/' + req.body.modelId, function (logs_err, logs_response, logs_body) {
               res.json(JSON.parse(logs_body));
            }
        );

    });

    app.post('/nn/test', function (req, res) {

        VinnslModel.findById(req.body.modelId, function (err, model) {
            request({
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                uri: model.endpoints.filter((e) => e.name === 'test')[0].endpoint,
                form: {'testing_data': req.body.testing_data, 'model': model.rawModel},
                method: 'POST'
            }, function (err, response, body) {

                let test = {
                    user: req.body.user,
                    testing_data: req.body.testing_data,
                    result: body,
                    createdOn: new Date()
                };

                VinnslModel.update({_id: req.body.modelId}, {$push: {tests: test}}, function (err, doc) {
                    if (err) return res.send(500, {error: err});
                    return res.send(doc);
                });
            });
        });

    });

    app.post('/nn/models/:from/:limit', function (req, res) {


        let filters = {};

        if (req.body.filters) {
            for (let [key, value] of Object.entries(req.body.filters)) {
                console.log(typeof(value));

                if (value && typeof(value) !== "boolean") {
                    filters[key] = {$regex: ".*" + value + ".*"};
                }
                if (typeof(value) === "boolean" && value) {
                    filters[key] = value;
                }
                if (value && typeof value === 'object' && value.constructor === Array) {
                    filters[key] = {$in: value};
                }

            }
        }

        Object.assign(filters, req.body.static_filters);

        console.log(filters);

        VinnslModel.find(filters, function (err, models) {
            console.log(models);
            res.json(models);
        }).skip(parseInt(req.params.from)).limit(parseInt(req.params.limit)).sort({trainedOn: 'desc'});

    });


};
