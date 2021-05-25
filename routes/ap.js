var express = require('express');
var router = express.Router();

var PythonShell = require('python-shell');
var multer = require('multer');

var storage = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, '/var/www/html');
	},
	
	filename: function(req, file, cb) {
		console.log(file.originalname)
		if(file.originalname.substr(-3, file.originalname.length) == 'bin') {
			if(file.originalname.substr(0, 13) == 'MULTICUBE_AP_') {
				console.log('This is Multicube AP\'s firmware ' + file.originalname);
				file['type'] = 'ap';
				cb(null, file.originalname);
			} else if(file.originalname.substr(0, 18) == 'MULTICUBE_11AC_AP_') {
                console.log('This is 11AC AP\'s firmware ' + file.originalname);
                file['type'] = '11ac';
                cb(null, file.originalname);
            }
			else {
				console.log('This is invalid firmware file');
			}
		}
	}
});

var upload = multer({storage: storage}).single('ap_firmware')

/* GET home page. */
router.get('/11n', ensureAuthenticated, function(req, res) {
    var loc = req.query.location_num;
    var location_arry = req.query.query.split(',');
    var query = JSON.parse('{"device": "ap","location":"' + location_arry[loc] + '"}');
    //MongoDriver.find('setPoint', query, function (error, device) {
    MongoDriver.find('device', query, function(error, docs) {
		for(device in docs) {
            if(docs[device]['log'] != undefined)
                if((Date.now() - Date.parse(docs[device]['log'])) < 86400000 * docs[device]['config']['pvs_period']) docs[device]['state'] = 1;
                else docs[device]['state'] = 0;
            else docs[device]['state'] = 0;
        }
        res.render('11n_ap', {
            title: 'PVS Server: AP',
            devices: docs,
            index: loc,
            location_arr: location_arry
        });
    });
});

router.get('/11n/setting', ensureAuthenticated, function(req, res, next) {
    var loc = req.query.location_num;
    var location_arry = req.query.query.split(',');
    var query = JSON.parse('{"device": "ap","location":"' + location_arry[loc] + '"}');
    //MongoDriver.find('setPoint', query, function (error, device) {
    MongoDriver.find('setPoint', query, function(error, device) {
        res.render('11n_setting_ap', {
            title: 'PVS Server: Setting',
            device: device[0],
            index: loc,
            location_arr: location_arry
        });
    });
});


router.post('/11n/setting/upload', function(req, res, next) {
	upload(req, res, function(err) {
		if(err) {
            res.redirect('/ap/11n/setting');
			return
		} else {
			deviceProvider.firmware_update(req.file.originalname, req.file.type);
		}
	});
    res.redirect('/ap/11n/setting');
});

router.post('/11n/setting/update', function(req, res, next) {
	deviceProvider.config_update({
		config: {
			op_mode: req.body.op_mode,
			ssid: req.body.ssid,
			password: req.body.password,
			hidden: req.body.hidden,
			mode: req.body.mode,
			bandwidth: req.body.bandwidth,
			channel: req.body.channel,
			power: req.body.power,
			pvs_period: req.body.pvs_period
		}
	}, 'ap', function(error, docs) {
		if(error) console.log(error);
	});
    res.redirect('/ap/11n/setting');
});

router.post('/11n/:mac/update', function(req, res) {
	deviceProvider.update(req.body._id, {
		mac: req.body.mac,
		fw: {
			fw_name: req.body.fw_name,
			fw_ver: req.body.fw_ver,
			fw_download_path: req.body.fw_download_path,
			fw_md5: req.body.fw_md5
		},
		config: {
			op_mode: req.body.op_mode,
			ssid: req.body.ssid,
			password: req.body.password,
			hidden: req.body.hidden,
			mode: req.body.mode,
			bandwidth: req.body.bandwidth,
			channel: req.body.channel,
			power: req.body.power,
			pvs_period: req.body.pvs_period
		}
	}, function(error, docs) {
		if(error) console.log(error);
	});

	var opt = {
		args: req.body.mac
	}
	PythonShell.run('public/python/submit_config.py', opt, function(error, results) {
		if(error) console.log(error);
			console.log(results);
	});
    res.redirect('/ap/11n');
});

router.get('/11ac', ensureAuthenticated, function(req, res) {
    var loc = req.query.location_num;
    var location_arry = req.query.query.split(',');
    var query = JSON.parse('{"device": "11ac","location":"' + location_arry[loc] + '"}');
    //MongoDriver.find('setPoint', query, function (error, device) {
    MongoDriver.find('device', query, function(error, docs) {
        for(device in docs) 
	{
            if(docs[device]['log'] != undefined)
            {
                if((Date.now() - Date.parse(docs[device]['log'])) < 86400000 * docs[device]['config']['pvs_period']) 
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
        res.render('11ac_ap', {
            title: 'PVS Server: AP',
            devices: docs,
            index: loc,
            location_arr: location_arry
        });
    });
});

router.get('/11ac/setting', ensureAuthenticated, function(req, res, next) {
    var loc = req.query.location_num;
    var location_arry = req.query.query.split(',');
    var query = JSON.parse('{"device": "11ac","location":"' + location_arry[loc] + '"}');
    //MongoDriver.find('setPoint', query, function (error, device) {
    deviceProvider.find('setPoint', query, function(error, device) {
        res.render('11ac_setting_ap', {
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
            console.log(err);
            res.redirect('/ap/11ac/setting');
			return
		} else {
            console.log(req.file);
			deviceProvider.firmware_update(req.file.originalname, req.file.type);
		}
	});
	res.redirect('/ap/11ac/setting');
});
/*
router.post('/11ac/setting/upload', function(req, res, next) {
		console.log('router.post call upload()!');
    upload(req, res, function(err) {
		console.log('router.post this is here 2');
		console.log('error : ' + err);
        if(err) {
		console.log('router.post this is here 3');
		console.log('error : ' + err);
            res.redirect('/ap/11ac/setting');
		console.log('router.post this is here 3-1');*/
            /* MOON return */
        /*} else {
		console.log('router.post this is here 4');
            deviceProvider.firmware_update(req.file.originalname, req.file.type);
        }
    });
		console.log('router.post this is here 5');
    res.redirect('/ap/11ac/setting');
		console.log('router.post this is here 6');
});
*/
router.post('/11ac/setting/update', function(req, res, next) {
    deviceProvider.config_update({
        config: {
            op_mode: req.body.op_mode,
			pvs_period: req.body.pvs_period,
            g_5: {
                ssid: req.body.ssid,
                password: req.body.password,
                hidden: req.body.hidden,
                mode: req.body.mode,
                bandwidth: req.body.bandwidth,
                channel: req.body.channel,
                power: req.body.power,
            },
            g_2_4: {
                ssid: req.body.ssid_2_4,
                password: req.body.password_2_4,
                hidden: req.body.hidden_2_4,
                mode: req.body.mode_2_4,
                bandwidth: req.body.bandwidth_2_4,
                channel: req.body.channel_2_4,
                power: req.body.power_2_4,
            }
		}
    }, '11ac', function(error, docs) {
        if(error) console.log(error);
    });
    res.redirect('/ap/11ac/setting');
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
            op_mode: req.body.op_mode,
			g_5: {
	            ssid: req.body.ssid,
    	        password: req.body.password,
        	    hidden: req.body.hidden,
            	mode: req.body.mode,
	            bandwidth: req.body.bandwidth,
    	        channel: req.body.channel,
        	    power: req.body.power,
			},
            g_2_4: {
                ssid: req.body.ssid_2_4,
                password: req.body.password_2_4,
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

    var opt = {
        args: req.body.mac
    }
    PythonShell.run('public/python/submit_config.py', opt, function(error, results) {
        if(error) console.log(error);
            console.log(results);
    });
    res.redirect('/ap/11ac');
});

router.post('/11ac/:mac/flash_reset', function(req, res) {
    var opt = {
        args: req.body.mac
    }
    PythonShell.run('public/python/flashReset_device.py', opt, function(error, results) {
        if(error) console.log(error);
            console.log(results);
    });
    res.redirect('/ap/11ac');
});

router.post('/11ac/:mac/reboot', function(req, res) {
    var opt = {
        args: req.body.mac
    }
    PythonShell.run('public/python/reboot_device.py', opt, function(error, results) {
        if(error) console.log(error);
            console.log(results);
    });
    res.redirect('/ap/11ac');
});

////////////////////////////////////////////////////pvs2////////////////////////////////////////

var storage2 = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, '/var/www/html/pvs2');
	},
	
	filename: function(req, file, cb) {
		console.log(file.originalname)
		if(file.originalname.substr(-3, file.originalname.length) == 'bin') {
			if(file.originalname.substr(0, 13) == 'MULTICUBE_AP_') {
				console.log('This is Multicube AP\'s firmware ' + file.originalname);
				file['type'] = 'ap';
				cb(null, file.originalname);
			} else if(file.originalname.substr(0, 18) == 'MULTICUBE_11AC_AP_') {
                console.log('This is 11AC AP\'s firmware ' + file.originalname);
                file['type'] = '11ac';
                cb(null, file.originalname);
            }
			else {
				console.log('This is invalid firmware file');
			}
		}
	}
});

var upload2 = multer({storage: storage2}).single('ap_firmware')

/* GET home page. */
router.get('/multicube2', ensureAuthenticated, function(req, res) {
    deviceProvider2.find('device', JSON.parse('{"device":"ap"}'), function(error, docs) {
		for(device in docs) {
            if(docs[device]['log'] != undefined)
                if((Date.now() - Date.parse(docs[device]['log'])) < 86400000 * docs[device]['config']['pvs_period']) docs[device]['state'] = 1;
                else docs[device]['state'] = 0;
            else docs[device]['state'] = 0;
        }
        res.render('multicube_ap2', {
            title: 'PVS Server: AP',
            devices: docs
        });
    });
});

router.get('/multicube/setting2', ensureAuthenticated, function(req, res, next) {
    deviceProvider2.find('setPoint', JSON.parse('{"device":"ap"}'), function(error, device) {
        res.render('multicube_setting_ap2', {
            title: 'PVS Server: Setting',
            device: device[0]
        });
    });
});

router.post('/multicube/setting/upload2', function(req, res, next) {
	upload2(req, res, function(err) {
		if(err) {
			res.redirect('/ap/multicube/setting2');
			return
		} else {
			deviceProvider2.firmware_update(req.file.originalname, req.file.type);
		}
	});
	res.redirect('/ap/multicube/setting2');
});

router.post('/multicube/setting/update2', function(req, res, next) {
	deviceProvider2.config_update({
		config: {
			op_mode: req.body.op_mode,
			ssid: req.body.ssid,
			password: req.body.password,
			hidden: req.body.hidden,
			mode: req.body.mode,
			bandwidth: req.body.bandwidth,
			channel: req.body.channel,
			power: req.body.power,
			pvs_period: req.body.pvs_period
		}
	}, 'ap', function(error, docs) {
		if(error) console.log(error);
	});
	res.redirect('/ap/multicube/setting2');
});

router.post('/multicube2/:mac/update', function(req, res) {
	deviceProvider2.update(req.body._id, {
		mac: req.body.mac,
		fw: {
			fw_name: req.body.fw_name,
			fw_ver: req.body.fw_ver,
			fw_download_path: req.body.fw_download_path,
			fw_md5: req.body.fw_md5
		},
		config: {
			op_mode: req.body.op_mode,
			ssid: req.body.ssid,
			password: req.body.password,
			hidden: req.body.hidden,
			mode: req.body.mode,
			bandwidth: req.body.bandwidth,
			channel: req.body.channel,
			power: req.body.power,
			pvs_period: req.body.pvs_period
		}
	}, function(error, docs) {
		if(error) console.log(error);
	});

	var opt = {
		args: req.body.mac
	}
	PythonShell.run('public/python/submit_config2.py', opt, function(error, results) {
		if(error) console.log(error);
			console.log(results);
	});
	res.redirect('/ap/multicube2');
});

router.get('/11ac2', ensureAuthenticated, function(req, res) {
    deviceProvider2.find('device', JSON.parse('{"device":"11ac"}'), function(error, docs) {
        for(device in docs) 
	{
            if(docs[device]['log'] != undefined)
            {
                if((Date.now() - Date.parse(docs[device]['log'])) < 86400000 * docs[device]['config']['pvs_period']) 
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
        res.render('11ac_ap2', {
            title: 'PVS Server: AP',
            devices: docs
        });
    });
});

router.get('/11ac/setting2', ensureAuthenticated, function(req, res, next) {
    deviceProvider2.find('setPoint', JSON.parse('{"device":"11ac"}'), function(error, device) {
        res.render('11ac_setting_ap2', {
            title: 'PVS Server: Setting',
            device: device[0]
        });
    });
});

router.post('/11ac/setting/upload2', function(req, res, next) {
		console.log('router.post call upload()!');
    upload2(req, res, function(err) {
		console.log('router.post this is here 2');
		console.log('error : ' + err);
        if(err) {
		console.log('router.post this is here 3');
		console.log('error : ' + err);
            res.redirect('/ap/11ac/setting2');
		console.log('router.post this is here 3-1');
            /* MOON return */
        } else {
		console.log('router.post this is here 4');
            deviceProvider2.firmware_update(req.file.originalname, req.file.type);
        }
    });
		console.log('router.post this is here 5');
    res.redirect('/ap/11ac/setting2');
		console.log('router.post this is here 6');
});

router.post('/11ac/setting/update2', function(req, res, next) {
    deviceProvider2.config_update({
        config: {
            op_mode: req.body.op_mode,
			pvs_period: req.body.pvs_period,
            g_5: {
                ssid: req.body.ssid,
                password: req.body.password,
                hidden: req.body.hidden,
                mode: req.body.mode,
                bandwidth: req.body.bandwidth,
                channel: req.body.channel,
                power: req.body.power,
            },
            g_2_4: {
                ssid: req.body.ssid_2_4,
                password: req.body.password_2_4,
                hidden: req.body.hidden_2_4,
                mode: req.body.mode_2_4,
                bandwidth: req.body.bandwidth_2_4,
                channel: req.body.channel_2_4,
                power: req.body.power_2_4,
            }
		}
    }, '11ac', function(error, docs) {
        if(error) console.log(error);
    });
    res.redirect('/ap/11ac/setting2');
});

router.post('/11ac2/:mac/update', function(req, res) {
    deviceProvider2.update(req.body._id, {
        mac: req.body.mac,
        fw: {
            fw_name: req.body.fw_name,
            fw_ver: req.body.fw_ver,
            fw_download_path: req.body.fw_download_path,
            fw_md5: req.body.fw_md5
        },
        config: {
            op_mode: req.body.op_mode,
			g_5: {
	            ssid: req.body.ssid,
    	        password: req.body.password,
        	    hidden: req.body.hidden,
            	mode: req.body.mode,
	            bandwidth: req.body.bandwidth,
    	        channel: req.body.channel,
        	    power: req.body.power,
			},
            g_2_4: {
                ssid: req.body.ssid_2_4,
                password: req.body.password_2_4,
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

    var opt = {
        args: req.body.mac
    }
    PythonShell.run('public/python/submit_config2.py', opt, function(error, results) {
        if(error) console.log(error);
            console.log(results);
    });
    res.redirect('/ap/11ac2');
});

router.post('/11ac2/:mac/flash_reset', function(req, res) {
    var opt = {
        args: req.body.mac
    }
    PythonShell.run('public/python/flashReset_device2.py', opt, function(error, results) {
        if(error) console.log(error);
            console.log(results);
    });
    res.redirect('/ap/11ac2');
});

router.post('/11ac2/:mac/reboot', function(req, res) {
    var opt = {
        args: req.body.mac
    }
    PythonShell.run('public/python/reboot_device2.py', opt, function(error, results) {
        if(error) console.log(error);
            console.log(results);
    });
    res.redirect('/ap/11ac2');
});


function ensureAuthenticated(req, res, next) {
    if(req.isAuthenticated()) { return next(); }
    res.redirect('/');
}

router.get('/multicube/:mac', ensureAuthenticated, function(req, res) {
    deviceProvider.findByMac('device', req.params.mac, function(error, device) {
        res.render('multicube_ap_field', {
            title: device.mac,
            device: device
        });
    });
});

router.get('/11ac/:mac', ensureAuthenticated, function(req, res) {
    deviceProvider.findByMac('device', req.params.mac, function(error, device) {
        res.render('11ac_ap_field', {
            title: device.mac,
            device: device
        });
    });
});

router.get('/multicube2/:mac', ensureAuthenticated, function(req, res) {
    deviceProvider2.findByMac('device', req.params.mac, function(error, device) {
        res.render('multicube_ap_field2', {
            title: device.mac,
            device: device
        });
    });
});

router.get('/11ac2/:mac', ensureAuthenticated, function(req, res) {
    deviceProvider2.findByMac('device', req.params.mac, function(error, device) {
        res.render('11ac_ap_field2', {
            title: device.mac,
            device: device
        });
    });
});



module.exports = router;
