const express = require('express');
const proxy = require('http-proxy');
const app = express();
const request = require('request');
const moment = require('moment');
const bodyParser = require('body-parser');
const jsonQuery = require('json-query');
const fs = require('fs');


const secrets = require('../secrets.json');

var data = require('../data.json');
var data2 = require('../data2.json');
Object.keys(data2).forEach(key => {
    if (data[key]) {
        data2[key].forEach(ep => data[key].push(ep));
    } else {
        data[key] = data2[key];
    }
});

const port = process.env.PORT || 3000;

app.set('port', port);
app.use(express.static(__dirname + '/app'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

proxy.prototype.onError = (err) => {
    console.log(err);
}

const router = express.Router();
const api = proxy.createProxyServer({ changeOrigin: false });

router.use((req, res, next) => {
    console.log(moment().format('h:mm:ss a'), req.method, req.url);
    next();
});

router.get('/api/actor', (req, res) => {
    var guestStars = {};
    request({
        method: 'GET',
        url: 'http://api.themoviedb.org/3/tv/549?api_key=' + secrets.apiKey,
        headers: { 'Accept': 'application/json' }
    }, (error, response, seasonBody) => {
        var seasonData = JSON.parse(seasonBody);
        
        seasonData.seasons.forEach(season => {
            request({
                method: 'GET',
                url: 'http://api.themoviedb.org/3/tv/549/season/' + season.season_number + '?api_key=' + secrets.apiKey,
                headers: { 'Accept': 'application/json' }
            }, (error2, response2, episodeBody) => {
                var episodeData = JSON.parse(episodeBody);

                episodeData.episodes.forEach(ep => {
                    ep.guest_stars.forEach(guestStar => {
                        if (guestStars[guestStar.name]) {
                            guestStars[guestStar.name].push(ep); 
                        } else {
                            guestStars[guestStar.name] = [ep];
                        }
                    });
                });

                fs.writeFile('data.json', JSON.stringify(guestStars), (err) => {
                    if (err) throw err;
                    console.log('saved!');
                })
            });
        });
    });
});

router.post('/api/check', (req, res) => {
    var hits = [];

    Object.keys(data).forEach(key => {
        var index = key.toLowerCase().indexOf(req.body.name.toLowerCase())
        if (index >= 0) {
            hits.push(key);
        }
    });

    res.send(hits);
});

app.use('/', router);

app.listen(port, () => {
    console.log('Server listening on port ' + port);
});