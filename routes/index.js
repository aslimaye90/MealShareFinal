var express = require('express');
var router = express.Router();
var multer = require('multer');
var fs = require('fs');
var upload = multer(
	{
	    dest:'uploads/'
	}
);
var apn = require('apn');
var config = require("../config.js");

/* GET home page. */
router.get('/', function(req, res) {
	res.render('index');
});

router.get('/upload', function(req, res){
	res.render('pages/upload');
});


/*body: {"availableSpots":"",
"description":"Decribe your cuisine",
"endDateTime":"2015-11-11T18:48:48-0800",
"imagePath":"/Users/manavpavitrasingh/Library/Developer/CoreSimulator/Devices/70DCC380-ED00-4C1B-81D4-D0E7205FDD36/data/Containers/Data/Application/DB3D0F88-CA48-4E3F-B2DE-7DFA58F942D9/Documents/test.png",
"mealAddress":"",
"seller":"561dfe85eb65f6da3a6de62d",
"startDateTime":"2015-10-25T15:00:00Z",
"title":"ss"}
{ fieldname: 'image',
  originalname: 'test.png',
  encoding: '7bit',
  mimetype: 'image/png',
  destination: 'uploads/',
  filename: '73c271bd248d04971cf5698700fd1d13',
  path: 'uploads/73c271bd248d04971cf5698700fd1d13',
  size: 1941794 }*/


router.post('/upload', function(req,res,next){
	upload.single('image')(req, res, function(err){
		if (err) {
			console.log('in error');
			console.log(err);
			res.send(err);
			return;
		}
		console.log('title: '+req.body.title);
		console.log('body: '+JSON.stringify(req.body));
		console.log(req.file);
		res.json({'ok':'ok'});
	});
});

router.get('/getImage/:imageID', function(req,res){
	try{
		var img = fs.readFileSync(String(__dirname).slice(0,-7) + '/uploads/'+String(req.params.imageID));
		res.writeHead(200, {'Content-Type': 'image/gif' });
		res.end(img, 'binary');		
	}
	catch(err){
		res.statusCode = 400;
		res.send('image not found');
	}

});

router.get('/hacky/notification', function(req, res) {
    var options = {
        gateway: 'gateway.sandbox.push.apple.com',
        errorCallback: function(data){
            console.log(JSON.stringify(data));
        },
        cert: String(__dirname).slice(0,-6)+"certificates/cert.pem",
        key:  String(__dirname).slice(0,-6)+"certificates/key.pem",
        passphrase: config.secret,
        port: 2195,
        enhanced: true,
        cacheLength: 100
    };
    var apnConnection = new apn.Connection(options);
    
    var myDevice = new apn.Device(config.appleDeciveID);
    var note = new apn.Notification();
    note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
    note.badge = 3;
    note.sound = "ping.aiff";
    note.alert = "You have a new message";
    note.payload = {'messageFrom': 'Test'};
    apnConnection.pushNotification(note, myDevice);
    res.send('okok');
});

module.exports = router;