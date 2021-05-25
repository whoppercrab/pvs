var express = require('express');
var router = express.Router();

var XLSX = require('xlsx');
var PythonShell = require('python-shell');

var multer = require('multer');

var storage = multer.diskStorage({
	destination: function(req, file, cb) {
		//cb(null, '/home/baruntech-pvs/dev/ub/server');
		cb(null, '../data');
	},

	filename: function(req, file, cb) {
		if(file.originalname.substr(-4, file.originalname.length) == 'xlsx') {
			console.log('xlsxa');
			cb(null, file.originalname);
		} else {
			console.log('invalid file');
		}
	},
});

var upload = multer({storage: storage}).single("list_file");

/* GET home page. */
router.get('/', ensureAuthenticated, function(req, res, next) {
	var loc = req.query.location_num;
	var location_arry = req.query.query.split(',');
    MongoDriver.find('setPoint', JSON.parse('{}'), function(error, docs) {
        res.render('setting', {
            title: 'PVS Server: Basic Setting',
            versions: docs,
			//devices: docs,
			index: loc,
			location_arr: location_arry
        });
    });
});

router.post('/upload', function(req, res) {
	upload(req, res, function(error) {
		if(error) console.log(error);
		else {
			console.log('list file upload success!');
			var workbook = XLSX.readFile('../../' + req.file.originalname);
    		var worksheet = workbook.Sheets[workbook.SheetNames[0]];
			console.log("worksheet : "+ workbook.SheetNames[0]);
			var columnRouter = [];
			var columnAP = [];
			var columnSSID = [];
			var columnPASSWORD = [];
			var columnSSID_5G = [];
            var columnPASSWORD_5G = [];
			var columnMODE = [];
		    for(let z in worksheet) {
				console.log(" "+z.toString()[0]);
				if(z.toString()[0] === 'H') {
				///if(z.toString()[0] === 'G') {
					columnRouter.push(worksheet[z].v);
				} else if(z.toString()[0] === 'C') {
					columnAP.push(worksheet[z].v);
				} else if(z.toString()[0] === 'K') {
                    columnSSID.push(worksheet[z].v);
				} else if(z.toString()[0] === 'O') {
                    columnPASSWORD.push(worksheet[z].v);
                } else if(z.toString()[0] === 'Y') {
                    columnMODE.push(worksheet[z].v);
                } else if(z.toString()[0] === 'R') {
                    columnSSID_5G.push(worksheet[z].v);
                } else if(z.toString()[0] === 'V') {
                    columnPASSWORD_5G.push(worksheet[z].v);
                }
			}
			//columnRouter = columnRouter.slice(1dm, columnRouter.length);
			//columnRouter = columnRouter.slice(2, columnRouter.length);
			columnRouter = columnRouter.slice(1, columnRouter.length);
			columnAP = columnAP.slice(1, columnAP.length);
			columnSSID = columnSSID.slice(1, columnSSID.length);
			columnPASSWORD = columnPASSWORD.slice(1, columnPASSWORD.length);
			columnMODE = columnMODE.slice(1, columnMODE.length);
            columnSSID_5G = columnSSID_5G.slice(1, columnSSID_5G.length);
            columnPASSWORD_5G = columnPASSWORD_5G.slice(1, columnPASSWORD_5G.length);
			var opt = {
				args: [columnRouter, columnAP, columnSSID, columnPASSWORD, columnMODE, columnSSID_5G, columnPASSWORD_5G]
			}
			PythonShell.run('public/python/init_device.py', opt, function(error, results) {
				if(error) {
					console.log("list error");
					console.log(error);
				}
//				console.log("results :");
//				console.log(results);
			});
		}
	});
	res.redirect('/');
});

router.post('/drop', function(req, res) {
	MongoDriver.drop(function(error) {
		if(error) console.log(error);
	});
	res.redirect('/');
});

router.post('/updateMac', function(req, res) {
	oldMac = req.body.oldMac;
	newMac = req.body.newMac;
	MongoDriver.updateMac(oldMac, newMac, function(error) {
		if(error) console.log(error);
	});
	res.redirect('/');
});

router.post('/removeMac', function(req, res) {
	mac = req.body.mac;
	MongoDriver.removeMac(mac, function(error) {
		if(error) console.log(error);
	});
	res.redirect('/');
});


//////////////////////////////////////////////////////////pvs2//////////////////////////////////////////////////////////

/* GET home page. */

router.get('/2', ensureAuthenticated, function(req, res, next) {
    MongoDriver2.find('setPoint', JSON.parse('{}'), function(error, docs) {
        res.render('setting2', {
            title: 'PVS Server: Basic Setting',
            versions: docs
        });
    });
});


router.post('/setting/upload2', function(req, res) {
	upload(req, res, function(error) {
		if(error) console.log(error);
		else {
			console.log('list file upload success!');
			var workbook = XLSX.readFile('../../' + req.file.originalname);
    		var worksheet = workbook.Sheets[workbook.SheetNames[0]];
			console.log("worksheet : "+ workbook.SheetNames[0]);
			var columnRouter = [];
			var columnAP = [];
			var columnSSID = [];
			var columnPASSWORD = [];
			var columnSSID_5G = [];
            var columnPASSWORD_5G = [];
			var columnMODE = [];
		    for(let z in worksheet) {
				console.log(" "+z.toString()[0]);
				if(z.toString()[0] === 'H') {
				///if(z.toString()[0] === 'G') {
					columnRouter.push(worksheet[z].v);
				} else if(z.toString()[0] === 'C') {
					columnAP.push(worksheet[z].v);
				} else if(z.toString()[0] === 'K') {
                    columnSSID.push(worksheet[z].v);
				} else if(z.toString()[0] === 'O') {
                    columnPASSWORD.push(worksheet[z].v);
                } else if(z.toString()[0] === 'Y') {
                    columnMODE.push(worksheet[z].v);
                } else if(z.toString()[0] === 'R') {
                    columnSSID_5G.push(worksheet[z].v);
                } else if(z.toString()[0] === 'V') {
                    columnPASSWORD_5G.push(worksheet[z].v);
                }
			}
			//columnRouter = columnRouter.slice(1dm, columnRouter.length);
			//columnRouter = columnRouter.slice(2, columnRouter.length);
			columnRouter = columnRouter.slice(1, columnRouter.length);
			columnAP = columnAP.slice(1, columnAP.length);
			columnSSID = columnSSID.slice(1, columnSSID.length);
			columnPASSWORD = columnPASSWORD.slice(1, columnPASSWORD.length);
			columnMODE = columnMODE.slice(1, columnMODE.length);
            columnSSID_5G = columnSSID_5G.slice(1, columnSSID_5G.length);
            columnPASSWORD_5G = columnPASSWORD_5G.slice(1, columnPASSWORD_5G.length);
			var opt = {
				args: [columnRouter, columnAP, columnSSID, columnPASSWORD, columnMODE, columnSSID_5G, columnPASSWORD_5G]
			}
			PythonShell.run('public/python/init_device2.py', opt, function(error, results) {
				if(error) {
					console.log("list error");
					console.log(error);
				}
//				console.log("results :");
//				console.log(results);
			});
		}
	});
	res.redirect('/');
});

router.post('/setting/drop2', function(req, res) {
	MongoDriver.drop(function(error) {
		if(error) console.log(error);
	});
	res.redirect('/');
});

router.post('/setting/updateMac2', function(req, res) {
	oldMac = req.body.oldMac;
	newMac = req.body.newMac;
	MongoDriver2.updateMac(oldMac, newMac, function(error) {
		if(error) console.log(error);
	});
	res.redirect('/');
});

router.post('/setting/removeMac2', function(req, res) {
	mac = req.body.mac;
	MongoDriver2.removeMac(mac, function(error) {
		if(error) console.log(error);
	});
	res.redirect('/');
});

function ensureAuthenticated(req, res, next) {
    if(req.isAuthenticated()) { return next(); }
    res.redirect('/');
}

module.exports = router;
