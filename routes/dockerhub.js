module.exports = function (app) {

    let request = require('request');

    app.get('/docker/hub/:user', function (req, res) {
        request({
            uri: "https://hub.docker.com/v2/repositories/" + req.params.user,
            method: "GET",
            timeout: 10000,
            followRedirect: true,
            maxRedirects: 10
        }, function (error, response, body) {
            res.json(JSON.parse(body));
        });
    });

};