var express = require('express');
var router = express.Router();

var PythonShell = require('python-shell');
var multer = require('multer');

var storage = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, '/var/www/html');
	},
	
	filename: function(req, file, cb) {
		if(file.originalname.substr(-3, file.originalname.length) == 'bin') {
			if (file.originalname.substr(0, 17) == 'MULTICUBE_ROUTER_') {
				console.log('This is 16 Port Router\'s firmware ' + file.originalname);
				file['type'] = 'router';
				cb(null, file.originalname);
			} else if (file.originalname.substr(0, 23) == 'MULTICUBE_5PORT_ROUTER_') {
                console.log('This is 5 Port Router\'s firmware ' + file.originalname);
                file['type'] = 'router_5port';
                cb(null, file.originalname);
			}else {
				console.log('This is invalid firmware file');
			}
		}
	}
});

var upload = multer({storage: storage}).single('router_firmware')
/*
router.get('/home/multicube', ensureAuthenticated, function (req, res) {
    var loc = req.query.location_num;
    // var num = req.query.pathname;
    var location_arry = req.query.query.split(',');
    //var test = location_arry[loc];
    var query = JSON.parse('{"device": "router","location":"' + location_arry[loc] + '"}');
    //var path= location_num: 1, query: location_docs
    MongoDriver.findSort('device', query, function (error, docs) {
        for (device in docs) {
            if (docs[device]['log'] != undefined)
                if ((Date.now() - Date.parse(docs[device]['log'])) < 86400000 * docs[device]['config']['pvs_period']) docs[device]['state'] = 1;
                else docs[device]['state'] = 0;
            else docs[device]['state'] = 0;
        }

        MongoDriver.find('device', JSON.parse('{"device":"ap"}'), function (error, ap_docs) {
            for (ap_device in ap_docs) {
                if (ap_docs[ap_device]['log'] != undefined)
                    if ((Date.now() - Date.parse(ap_docs[ap_device]['log'])) < 86400000 * ap_docs[ap_device]['config']['pvs_period']) ap_docs[ap_device]['state'] = 1;
                    else ap_docs[ap_device]['state'] = 0;
                else ap_docs[ap_device]['state'] = 0;
            } res.render('multicube_index', {
                title: 'PVS Server: home',
                devices: docs,
                ap_devices: ap_docs,
                index: loc,
                location_arr: location_arry,
                // obj: req.query.query,

            });
        });
    });
});*/
/* GET home page. */
router.get('/11n/router', ensureAuthenticated, function(req, res) {
    var loc = req.query.location_num;
    var location_arry = req.query.query.split(',');
    var query = JSON.parse('{"device": "router","location":"' + location_arry[loc] + '"}');
    MongoDriver.find('device', query, function(error, docs) {
		for(device in docs) {
			if(docs[device]['log'] != undefined)
				if((Date.now() - Date.parse(docs[device]['log'])) < 86400000 * docs[device]['config']['pvs_period']) docs[device]['state'] = 1;
				else docs[device]['state'] = 0;
			else docs[device]['state'] = 0;
		}
        res.render('11n_router', {
            title: 'PVS Server: Router',
            devices: docs,
            index: loc,
            location_arr: location_arry
        });
    });
});

router.get('/setting/11n/router', ensureAuthenticated, function(req, res, next) {
    var loc = req.query.location_num;
    var location_arry = req.query.query.split(',');
    var query = JSON.parse('{"device": "router","location":"' + location_arry[loc] + '"}');
    MongoDriver.find('setPoint', query, function(error, device) {
        res.render('11n_setting_router', {
            title: 'PVS Server: Setting',
            device: device[0],
            index: loc,
            location_arr: location_arry
        });
    });
});


router.post('/setting/11n/upload', upload, function(req, res, next) {
    var loc = req.query.location_num;
    var location_arry = req.query.query.split(',');
	upload(req, res, function(err) {
		if(err) {
            res.redirect('/router/11n/setting' + "?location_num=" + loc + "&query=" + location_arry); //수정포인트
			return
		} else {
            MongoDriver.firmware_update(req.file.originalname, req.file.type);
		}
	});
    res.redirect('/router/11n/setting' + "?location_num=" + loc + "&query=" + location_arry);  //수정포인트
});

router.post('/setting/11n/update', function(req, res, next) {
    var loc = req.query.location_num;
    var location_arry = req.query.query.split(',');
    MongoDriver.config_update({
		config: {
			op_mode: req.body.op_mode,
			ip_addr: req.body.ip_addr,
			dhcp_client_start: req.body.dhcp_client_start,
			dhcp_client_end: req.body.dhcp_client_end,
			poe_ap_ssid : req.body.poe_ap_ssid,
			poe_ap_password : req.body.poe_ap_password,
			pvs_period: req.body.pvs_period
		}
	}, 'router', function(error, docs) {
		if(error) console.log(error);
	});
	res.redirect('/router/11n/setting');
});

router.post('/11n/:mac/update', function(req, res) {
    var loc = req.query.location_num;
    var location_arry = req.query.query;
    MongoDriver.update(req.body._id, {
		mac: req.body.mac,
		fw: {
			fw_name: req.body.fw_name,
			fw_ver: req.body.fw_ver,
			fw_download_path: req.body.fw_download_path,
			fw_md5: req.body.fw_md5
		},
		config: {
			config_ver: req.body.config_ver,
			op_mode: req.body.op_mode,
			ip_addr: req.body.ip_addr,
			dhcp_client_start: req.body.dhcp_client_start,
			dhcp_client_end: req.body.dhcp_client_end,
			poe_ap_ssid : req.body.poe_ap_ssid,
			poe_ap_password : req.body.poe_ap_password,
			pvs_period: req.body.pvs_period
		}
	}, function(error, docs) {
		if(error) console.log(error);
	});
    res.redirect("/device/11n/"+req.body.mac+"?location_num=" + loc + "&query=" + location_arry);
	//res.redirect('/router/11n');
});
router.post('/11n/:mac/reboot', function(req, res) {
    var loc = req.query.location_num;
    var location_arry = req.query.query;
    var opt = {
        args: req.body.mac
    }
    PythonShell.run('public/python/reboot_device.py', opt, function(error, results) {
        if(error) console.log(error);
            console.log(results);
    });
    //res.redirect("/device/11n/" + req.body.mac + "?location_num=" + loc + "&query=" + location_arry);
    //res.redirect('/router/11n');
});

router.post('/11n/:mac/poe_measure', function(req, res) {
    //var loc = req.query.location_num;
    //var location_arry = req.query.query;
	var opt = {
        args: req.body.mac
    }
    PythonShell.run('public/python/poe_measure_device.py', opt, function(error, results) {
        if(error) console.log(error);
            console.log(results);
    });
	//res.redirect('/router/11n');
});

/* GET home page. */
router.get('/11ac/router', ensureAuthenticated, function(req, res) {
    var loc = req.query.location_num;
    var location_arry = req.query.query.split(',');
    var query = JSON.parse('{"device": "router_5port","location":"' + location_arry[loc] + '"}');
    //MongoDriver.find('setPoint', query, function (error, device) {
        MongoDriver.find('device', query, function(error, docs) {
        for(device in docs)
        {
            if(docs[device]['log'] != undefined)
            {
                if ((Date.now() - Date.parse(docs[device]['log'])) < 86400000 * docs[device]['config']['pvs_period']) 
                {
                    docs[device]['state'] = 1;
                }
                else 
                {
                    docs[device]['state'] = 0;
                }
            }
            else 
            {
                docs[device]['state'] = 0;
            }
        }

	res.render('11ac_router', {
            title: 'PVS Server: Router',
            devices: docs,
            index: loc,
            location_arr: location_arry 
        });
    });
});


router.get('/11ac/setting', ensureAuthenticated, function(req, res, next) {
    var loc = req.query.location_num;
    var location_arry = req.query.query.split(',');
    var query = JSON.parse('{"device": "router_5port","location":"' + location_arry[loc] + '"}');
    //MongoDriver.find('setPoint', query, function (error, device) {
    MongoDriver.find('setPoint', query, function(error, device) {
        res.render('11ac_setting_router', {
            title: 'PVS Server: Setting',
            device: device[0],
            index: loc,
            location_arr: location_arry
        });
    });
});

router.post('/11ac/setting/upload', function(req, res, next) {
    upload(req, res, function(err) {
        if(err) {
            res.redirect('/router/11ac/setting');
            return
        } else {
            deviceProvider.firmware_update(req.file.originalname, req.file.type);
        }
    });
    res.redirect('/router/11ac/setting');
});

router.post('/11ac/setting/update', function(req, res, next) {
    deviceProvider.config_update({
        config: {
            op_mode: req.body.op_mode,
            ip_addr: req.body.ip_addr,
            dhcp_client_start: req.body.dhcp_client_start,
            dhcp_client_end: req.body.dhcp_client_end,
			pvs_address: req.body.pvs_address,
            g_5: {
                poe_ap_ssid : req.body.poe_ap_5g_ssid,
                poe_ap_password : req.body.poe_ap_5g_password,
                hidden: req.body.hidden,
                mode: req.body.mode,
                bandwidth: req.body.bandwidth,
                channel: req.body.channel,
                power: req.body.power,
            },
            g_2_4: {
                poe_ap_ssid : req.body.poe_ap_2_4g_ssid,
                poe_ap_password : req.body.poe_ap_2_4g_password,
                hidden: req.body.hidden_2_4,
                mode: req.body.mode_2_4,
                bandwidth: req.body.bandwidth_2_4,
                channel: req.body.channel_2_4,
                power: req.body.power_2_4,
            },
            pvs_period: req.body.pvs_period
        }
    }, 'router_5port', function(error, docs) {
        if(error) console.log(error);
    });
    res.redirect('/router/11ac/setting');
});

router.post('/11ac/:mac/update', function(req, res) {
    deviceProvider.update(req.body._id, {
        mac: req.body.mac,
        fw: {
            fw_name: req.body.fw_name,
            fw_ver: req.body.fw_ver,
            fw_download_path: req.body.fw_download_path,
            fw_md5: req.body.fw_md5
        },
        config: {
            config_ver: req.body.config_ver,
            op_mode: req.body.op_mode,
            ip_addr: req.body.ip_addr,
            dhcp_client_start: req.body.dhcp_client_start,
            dhcp_client_end: req.body.dhcp_client_end,
			pvs_address: req.body.pvs_address,
			g_5: {
            	poe_ap_ssid : req.body.poe_ap_5g_ssid,
            	poe_ap_password : req.body.poe_ap_5g_password,
                hidden: req.body.hidden,
                mode: req.body.mode,
                bandwidth: req.body.bandwidth,
                channel: req.body.channel,
                power: req.body.power,
			},
			g_2_4: {
                poe_ap_ssid : req.body.poe_ap_2_4g_ssid,
                poe_ap_password : req.body.poe_ap_2_4g_password,
                hidden: req.body.hidden_2_4,
                mode: req.body.mode_2_4,
                bandwidth: req.body.bandwidth_2_4,
                channel: req.body.channel_2_4,
                power: req.body.power_2_4,
			},
            pvs_period: req.body.pvs_period
        }
    }, function(error, docs) {
        if(error) console.log(error);
    });
    res.redirect('/router/11ac');
});
router.post('/11ac/:mac/reboot', function(req, res) {
    var opt = {
        args: req.body.mac
    }
    PythonShell.run('public/python/reboot_device.py', opt, function(error, results) {
        if(error) console.log(error);
            console.log(results);
    });
    res.redirect('/router/11ac');
});

router.post('/11ac/:mac/flash_reset', function(req, res) {
    var opt = {
        args: req.body.mac
    }
    PythonShell.run('public/python/flashReset_device.py', opt, function(error, results) {
        if(error) console.log(error);
            console.log(results);
    });
    res.redirect('/router/11ac');
});

router.post('/11ac/:mac/poe_measure', function(req, res) {
    var opt = {
        args: req.body.mac
    }
    PythonShell.run('public/python/poe_measure_device.py', opt, function(error, results) {
        if(error) console.log(error);
            console.log(results);
    });
    //res.redirect('/router/11ac');
});

/////////////////////////////////////////////////////pvs2///////////////////////////////////////////////////////////////




router.get('/11n/:mac', ensureAuthenticated, function(req, res) {

    var loc = req.query.location_num;
    var location_arry = req.query.query.split(',');
    //var query = JSON.parse('{"device": "router_5port","location":"' + location_arry[loc] + '"}');
    var query = JSON.parse('{"mac":"' + req.params.mac + '"}');
    //MongoDriver.find('setPoint', query, function (error, device) {
    MongoDriver.find('device', query, function (error, docs) {

     //   for (device in docs) {
      //      if (docs[device]['log'] != undefined)
      //          if ((Date.now() - Date.parse(docs[device]['log'])) < 86400000 * docs[device]['config']['pvs_period']) docs[device]['state'] = 1;
     //           else docs[device]['state'] = 0;
     //       else docs[device]['state'] = 0;
      //  }
        res.render('11n_router_field', {
            title: docs[0].mac,
            device: docs[0],
            index: loc,
            location_arr: location_arry
        });
    });
});


router.get('/11ac/:mac', ensureAuthenticated, function(req, res) {
    deviceProvider.findByMac('device', req.params.mac, function(error, device) {
        res.render('11ac_router_field', {
            title: device.mac,
            device: device
        });
    });
});





function ensureAuthenticated(req, res, next) {
    if(req.isAuthenticated()) { return next(); }
    res.redirect('/');
}



module.exports = router;
