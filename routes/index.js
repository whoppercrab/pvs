const { query } = require('express');
var express = require('express');
var router = express.Router();
var passport = require('passport');
var PythonShell = require('python-shell');
var url = require('url');
var delay = 1;
/* GET home page. */
router.get('/', function (req, res) {
    res.render('login');
});

router.post('/login', passport.authenticate('local', {
    failureRedirect: '/'
}),
    function (req, res) 
    {
    MongoDriver.distinct('device', 'location', function (error, location_docs) {
        //req.query = location_docs;
        res.redirect("/home/11n/?" + new url.URLSearchParams({/* pathname: "/home/multicube",*/location_num:0, query: location_docs}));
    });
});

    

router.get('/logout', function (req, res) {
    req.logout();
    req.redirect('/');
});

// router.get('/home', ensureAuthenticated, function (req, res) {
//     MongoDriver.findSort('device', JSON.parse('{"device": "router"}'), function (error, docs) {

//         for (device in docs) {
//             if (docs[device]['log'] != undefined)
//                 if ((Date.now() - Date.parse(docs[device]['log'])) < 86400000 * docs[device]['config']['pvs_period']) docs[device]['state'] = 1;
//                 else docs[device]['state'] = 0;
//             else docs[device]['state'] = 0;
//         }

//         MongoDriver.find('device', JSON.parse('{"device":"ap"}'), function (error, ap_docs) {
//             for (ap_device in ap_docs) {
//                 if (ap_docs[ap_device]['log'] != undefined)
//                     if ((Date.now() - Date.parse(ap_docs[ap_device]['log'])) < 86400000 * ap_docs[ap_device]['config']['pvs_period']) ap_docs[ap_device]['state'] = 1;
//                     else ap_docs[ap_device]['state'] = 0;
//                 else ap_docs[ap_device]['state'] = 0;
//             }
//             res.render('multicube_index', {
//                 title: 'PVS Server: Home',
//                 devices: docs,
//                 ap_devices: ap_docs,
//             });
//         });
//     });
// });

router.post('/11n/:mac/poe_measure', function (req, res) {
    var opt = {
        args: req.body.mac
    }
    console.log(opt)
    PythonShell.run('public/python/poe_measure_device.py', opt, function (error, results) {
        if (error) console.log(error);
        console.log(results);
    });
    function delay() {
        for (var i = 0; i < 1000000; i++);
    }
    res.redirect('/home/11n/');
});

router.post('/11n/:mac/poe_ap_reboot', function (req, res) {
    var opt = {
        args: [
            req.body.mac,
            req.body.portnum
        ]
    }
    console.log(opt)
    PythonShell.run('public/python/poe_reboot_device.py', opt, function (error, results) {
        if (error) console.log(error);
        console.log(results);
    });
    res.redirect('/home/11n');
});

router.get('/home/11n', ensureAuthenticated, function (req, res) {
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
            } res.render('11n_index', {
                title: 'PVS Server: home',
                devices: docs,
                ap_devices: ap_docs,
                index: loc,
                location_arr: location_arry,
                // obj: req.query.query,

            });    
        });
    });
});

router.get('/home/11ac', ensureAuthenticated, function (req, res) {
    var loc = req.query.location_num;
    // var num = req.query.pathname;
    var location_arry = req.query.query.split(',');
    //var test = location_arry[loc];
    var query = JSON.parse('{"device": "router_5port","location":"' + location_arry[loc] + '"}');

    MongoDriver.findSort('device', query, function (error, docs) {
        for (device in docs) {
            if (docs[device]['log'] != undefined)
                if ((Date.now() - Date.parse(docs[device]['log'])) < 86400000 * docs[device]['config']['pvs_period']) docs[device]['state'] = 1;
                else docs[device]['state'] = 0;
            else docs[device]['state'] = 0;
        }

        MongoDriver.find('device', JSON.parse('{"device":"11ac"}'), function (error, ap_docs) {
            for (ap_device in ap_docs) {
                if (ap_docs[ap_device]['log'] != undefined)
                    if ((Date.now() - Date.parse(ap_docs[ap_device]['log'])) < 86400000 * ap_docs[ap_device]['config']['pvs_period']) ap_docs[ap_device]['state'] = 1;
                    else ap_docs[ap_device]['state'] = 0;
                else ap_docs[ap_device]['state'] = 0;
            }
            res.render('11ac_index', {
                title: 'PVS Server: 11ac',
                devices: docs,
                ap_devices: ap_docs,
                index: loc,
                location_arr: location_arry
            });
        });
    });
});

router.post('/11ac/:mac/poe_measure', function (req, res) {
    var opt = {
        args: req.body.mac
    }
    console.log(opt)
    PythonShell.run('public/python/poe_measure_device.py', opt, function (error, results) {
        if (error) console.log(error);
        console.log(results);
    });
    function delay() {
        for (var i = 0; i < 1000000; i++);
    }
    res.redirect('/home/11ac/');
});

router.post('/11ac/:mac/poe_ap_reboot', function (req, res) {
    var opt = {
        args: [
            req.body.mac,
            req.body.portnum
        ]
    }
    console.log(opt)
    PythonShell.run('public/python/poe_reboot_device.py', opt, function (error, results) {
        if (error) console.log(error);
        console.log(results);
    });
    res.redirect('/home/11ac');
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/');
}

////////////////////////////pvs2///////////////////////////////////


function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/');
}


router.post('/home/multicube/:mac/poe_ap_reboot', function (req, res) {
    var opt = {
        args: [
            req.body.mac,
            req.body.portnum
        ]
    }
    console.log(opt)
    PythonShell.run('public/python/poe_reboot_device.py', opt, function (error, results) {
        if (error) console.log(error);
        console.log(results);
    });
    res.redirect('/home/multicube');
});


router.post('/home/multicube/:mac/poe_measure', function (req, res) {
    var opt = {
        args: req.body.mac
    }
    console.log(opt)
    PythonShell.run('public/python/poe_measure_device.py', opt, function (error, results) {
        if (error) console.log(error);
        console.log(results);
    });
    function delay() {
        for (var i = 0; i < 1000000; i++);
    }
    res.redirect('/home/multicube/');
});

router.post('/home/11ac/:mac/poe_ap_reboot', function (req, res) {
    var opt = {
        args: [
            req.body.mac,
            req.body.portnum
        ]
    }
    console.log(opt)
    PythonShell.run('public/python/poe_reboot_device.py', opt, function (error, results) {
        if (error) console.log(error);
        console.log(results);
    });
    res.redirect('/home/11ac');
});


router.post('/home/11ac/:mac/poe_measure', function (req, res) {
    var opt = {
        args: req.body.mac
    }
    console.log(opt)
    PythonShell.run('public/python/poe_measure_device.py', opt, function (error, results) {
        if (error) console.log(error);
        console.log(results);
    });
    function delay() {
        for (var i = 0; i < 1000000; i++);
    }
    res.redirect('/home/11ac/');
});





function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/');
}




module.exports = router;
