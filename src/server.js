var express = require('express');
var proxy = require('http-proxy');
var app = express();
var rp = require('request-promise');
var moment = require('moment');
var bodyParser = require('body-parser');
var jsonQuery = require('json-query');
var fs = require('fs');
var suspend = require('suspend');
var sleep = require('sleep');

var limit = require('simple-rate-limiter');
var request = limit(require('request')).to(1).per(500);

var secrets = {};
secrets.apiKey = process.env.API_KEY || require('../secrets.json').apiKey;

var port = process.env.PORT || 3043;

app.set('port', port);
app.use(express.static(__dirname + '/app'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

proxy.prototype.onError = (err) => {
    console.log(err);
}

var router = express.Router();
var api = proxy.createProxyServer({ changeOrigin: false });

router.use((req, res, next) => {
    console.log(moment().format('h:mm:ss a'), req.method, req.url);
    next();
});

var showIds = [549, 2734, 4601, 7098, 32632, 3357]
var showPromises = [];
showIds.forEach(showId => {
    showPromises.push(
        rp({
            method: 'GET',
            url: 'http://api.themoviedb.org/3/tv/' + showId + '?api_key=' + secrets.apiKey,
            headers: { 'Accept': 'application/json' }
        })
    );
});

guestStars = {};
Promise.all(showPromises).then(showResponses => {
    showResponses.forEach(showResponse => {
        var showData = JSON.parse(showResponse);
        showData.seasons.forEach(season => {
            request({
                method: 'GET',
                url: 'http://api.themoviedb.org/3/tv/' + showData.id + '/season/' + season.season_number + '?api_key=' + secrets.apiKey,
                headers: { 'Accept': 'application/json' }
            }, (err, res, body) => {
                if (err) {
                    console.error('error!');
                    console.dir(err);
                    return;
                }

                var seasonData = JSON.parse(body);
                if (seasonData.episodes) {
                    seasonData.episodes.forEach(episode => {
                        episode.show_name = showData.name;
                        episode.guest_stars.forEach(guestStar => {
                            if (guestStars[guestStar.name]) {
                                guestStars[guestStar.name].push(episode);
                            } else {
                                guestStars[guestStar.name] = [episode];
                            }
                        });
                    });
                    console.log('loaded ' + seasonData.episodes.length + ' episodes from season ' + seasonData.season_number + ' of ' + showData.name + '. guest star count: ' + Object.keys(guestStars).length);
                } else {
                    console.dir(seasonData);
                }
            });
        });
    });
});

router.post('/api/check', (req, res) => {
    var hits = {};

    Object.keys(guestStars).forEach(key => {
        var index = key.toLowerCase().indexOf(req.body.name.toLowerCase())
        if (index >= 0) {
            hits[key] = guestStars[key];
        }
    });

    res.send(hits);
});

router.post('/api/link', (req, res) => {
    request({
        method: 'GET',
        url: 'http://www.imdb.com/find?ref_=nv_sr_fn&q=' + encodeURIComponent('Law & Order ' + req.body.name + ' ' + req.body.year),
        headers: { 'Accept': 'application/json' }
    }, (error, response, body) => {

        var startIndex = body.indexOf('href="/title/tt') + 6;
        var nextQuote = body.substring(startIndex).indexOf('"');
        var target = body.substring(startIndex, startIndex + nextQuote);

        res.send({ link: target });
    })
});

app.use('/', router);

app.listen(port, () => {
    console.log('Server listening on port ' + port);
});