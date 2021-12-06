const functions=require('firebase-functions');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    next();
})

var subscribers = []

var FCM=require('fcm-node');
var serverKey='AAAAD4uySRM:APA91bHqQuExK8llOdwOpbkrP1djP7_Nbcr3yWd4pSgW_RtTb4yEHbGKyw1MemtcwtbW8ySNW2QgDZ2lz2zWuH11Ku-1DTUPpR-hC8EGpxsGrQPelplO7WQoCUGD8a10eNdjL-0vEamP';
var fcm=new FCM(serverKey);

app.get('/push', function(req, res) {
    var message = {
        registration_ids: subscribers,
        collapse_key: 'pwa',
    };
    fcm.send(message, function(err, response){
        if (err) {
            console.log("Something has gone wrong!");
            console.log(err)
         } else {
                console.log("Successfully sent with response: ",
                response);
        }
    });
    res.sendStatus(200)
});

app.post('/subscribers/', function(req, res) {
    if (!req.body.hasOwnProperty('subscriptionid')){
        res.statusCode = 400;
        res.send('Error 400: Post syntax incorrect.');
        return;
    }
    console.log(req.body);
    subscribers.push(req.body.subscriptionid)
    res.statusCode = 200;
    res.send('SubscriptionID received');
});

app.delete('/subscribers/:id', function(req, res) {
    console.log(req.params.id)
    const index = subscribers.indexOf(req.params.id)
    if (index !== -1) {
        subscribers.splice(index,1)
    }
    res.statusCode = 200;
    res.send('SubscriptionID deleted');
});

app.listen(8080);
console.log('Rest Service Listening on port 8080');
