module.exports = function (app) {

    let Project = require('./../models/Project');
    let VINNSL_Description_NN = require('./../models/VINNSL_Description_NN');

    app.post('/project/create', function (req, res) {

        let project = new Project({
            createdBy: req.body.createdBy,
            createdOn: new Date(),
            name: req.body.name,
            description: req.body.description,
            nn_ids_paradigms: [],
            nn_ids_developed: [],
            nn_models_id: [],
            nn_descriptions_id: []
        });

        project.save(function (err, obj) {
            console.log(obj);
            if (err) {
                res.json({success: false, id: obj._id});
            }
            else {
                res.json({success: true, id: obj._id});
            }
        });
    });

    app.post('/projects/:from/:limit', function (req, res) {


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

            }
        }

        Object.assign(filters, req.body.static_filters);

        console.log(filters);

        Project.find(filters, function (err, models) {
            console.log(models);
            res.json(models);
        }).skip(parseInt(req.params.from)).limit(parseInt(req.params.limit));
    });

    app.get('/project/:id', function (req, res) {

        Project.findById(req.params.id, function (err, response) {

            if (err) throw err;


            if (response && response.nn_descriptions_id.length > 0) {

                VINNSL_Description_NN.find({'_id': {$in: response.nn_descriptions_id}}, function (er2, res2) {

                    res.send(Object.assign({nns: res2}, response._doc));

                })

            } else {
                res.send(response);
            }
        });
    });

    app.delete('/project/nn/:nnId', function (req, res) {
        Project.update({}, {$pull: {"nn_descriptions_id": req.body.nnId}}, function (err, models) {
            VINNSL_Description_NN.findByIdAndRemove(req.params.nnId, function (e, r) {
                console.log(e);
                console.log(r);
                res.send(r);
            });
        });


    });

    app.delete('/project/:id', function (req, res) {
        Project.findByIdAndRemove(req.params.id, function (err, doc) {
            if (doc.nn_descriptions_id && doc.nn_descriptions_id.length > 0) {
                VINNSL_Description_NN.remove({_id: {$in: doc.nn_descriptions_id}}, function (e, r) {
                    console.log(e);
                    console.log(r);
                    res.send(r);
                });
            } else {
                res.send(doc);
            }

        })
    });

    app.post('/project/add_nn_id/:id', function (req, res) {
        Project.update({_id: req.params.id}, {$push: {"nn_descriptions_id": req.body.nn_id}}, function (err, models) {
            res.json(models);
        });
    });

    app.post('/project/delete_nn_id/:id', function (req, res) {
        Project.update({_id: req.params.id}, {$pull: {"nn_descriptions_id": req.body.nn_id}}, function (err, models) {
            res.json(models);
        });
    });

    app.post('/project/add_model_id/:id', function (req, res) {
        Project.update({_id: req.params.id}, {$push: {"nn_models_id": req.body.model_id}}, function (err, models) {
            res.json(models);
        });
    });

    app.post('/project/add_model_id/:id', function (req, res) {
        Project.update({_id: req.params.id}, {$push: {"nn_models_id": req.body.model_id}}, function (err, models) {
            res.json(models);
        });
    });

};