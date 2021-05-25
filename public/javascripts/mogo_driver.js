var Db = require('mongodb').Db;
//var Connection = require('mongodb').Connection;
//var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var db;
class MongoDriver {
    constructor(host, port,db) {
        //this.db = new Db('test');
        //try {
        // this.client = new MongoClient(host);
        // this.client.connect(function (err, client) {
        //     assert.equal(null, err);
        //     console.log("Connected successfully to server");
        //     //client = client;
        //     //db=client.db('test', function (error, device_collection) {
                


        // // });
        // });
        // this.db = this.client.db(db);
        // logger.info("MongoClient Connection successfull.");
        //} catch (ex) {
       // }
    //    this.db = new Db(db, new Server(host, port, { auto_reconnect: true }), { safe: false });
    //    this.db.open(function (error) {
    //        if (!error) {
     //           console.log("We are connected " + db);
    //        } else {
    //            console.log(error);
     //       }
    //   });
    }
    async connect(host, port, db){
        try {
            //client = new MongoClient(host);
        var connection = await MongoClient.connect(host);
        this.db = connection.db(db);
        console.log("MongoClient Connection successfull.");
        }catch (ex) {
            console.log(ex);
        }

    }
    getlocaction(){
       return this.locaction; 
    }
    distinct(collections, query, callback) {
        this.getCollection(collections, function (error, collection_results) {
            if (error) callback(error);
            else {
                collection_results.distinct(query,function (error, results) {
                    if (error) callback(error);
                    else callback(null, results);
                });
            }
        });
    };

    getCollection(collections, callback) {
        this.db.collection(collections, function (error, device_collection) {
            if (error) callback(error);
            else callback(null, device_collection);
        });
    };

    findSort(collections, query, callback) {

        this.getCollection(collections, function (error, collection_results) {
            if (error) callback(error);
            else {
                collection_results.find(query).sort({ "config.poe_ap_ssid": 1 }).toArray(function (error, results) {
                    if (error) callback(error);
                    else callback(null, results);
                });
            }
        });
    };


    find(collections, query, callback) {
        this.getCollection(collections, function (error, collection_results) {
            if (error) callback(error);
            else {
                collection_results.find(query).toArray(function (error, results) {
                    if (error) callback(error);
                    else callback(null, results);
                });
            }
        });
    };


    findAll(collections, callback) {

        this.getCollection(collections, function (error, device_collection) {
            if (error) callback(error);
            else {
                device_collection.find().toArray(function (error, results) {
                    if (error) callback(error);
                    else callback(null, results);
                });
            }
        });
    };

    findByMac(collections, dev_mac, callback) {

        this.getCollection(collections, function (error, device_collection) {
            if (error) callback(error);
            else {
                device_collection.findOne({ mac: dev_mac }, function (error, result) {
                    if (error) callback(error);
                    else callback(null, result);
                });
            }
        });
    };


    findById(collections, id, callback) {

        this.getCollection(collections, function (error, device_collection) {
            if (error) callback(error);
            else {
                device_collection.findOne({ _id: ObjectID.createFromHexString(id) }, function (error, result) {
                    if (error) callback(error);
                    else callback(null, result);
                });
            }
        });
    };

    remove(deviceId, callback) {

        this.getCollection('device', function (error, device_collection) {
            if (error) callback(error);
            else {
                device_collection.remove({ _id: ObjectID.createFromHexString(deviceId) }, function () {
                    callback(null, deviceId);
                });
            }
        });
    }


    removeMac(deviceMac, callback) {

        this.getCollection('device', function (error, device_collection) {
            if (error) callback(error);
            else {
                device_collection.remove({ 'mac': deviceMac }, function () {
                    callback(null, deviceMac);
                });
            }
        });
    };

    firmware_update(file_name, device_type, callback) {
        var query = '';
        var version = '';
        var md5 = '';
        var data = '';

        this.getCollection('setPoint', function (error, setPoint_collection) {
            // 펌웨어 구분(Router, AP)
            if (device_type == 'router') {
                query = { 'device': 'router' }
                version = file_name.slice(17, -4)
            } else if (device_type == 'router_5port') {
                query = { 'device': 'router_5port' }
                version = file_name.slice(23, -4)
            } else if (device_type == 'ap') {
                query = { 'device': 'ap' }
                version = file_name.slice(13, -4)
            } else if (device_type == '11ac') {
                query = { 'device': '11ac' }
                version = file_name.slice(18, -4)
            }

            console.log('function start!');
            var child_process = require('child_process').execSync;
            md5 = child_process('md5sum /var/www/html/' + file_name + ' | cut -f1 -d\' \'').toString().slice(0, -1);
            data = { '$set': { 'fw.fw_ver': version, 'fw.fw_name': file_name, 'fw.fw_md5': md5, 'lastest': '0' } }
            console.log('%j, %j', query, data);
            setPoint_collection.update(query, data, function (error, defaultSetting) {
                if (error) console.log(error);
            });
        });
        this.getCollection('device', function (error, device_collection) {
            device_collection.updateMany(query, data, function (error, updateSetting) {
                if (error) console.log(error);
            });
        });
    }

    config_update(config, device_type, callback) {
        var query = ''
        var data = ''

        if (device_type == 'router') {
            query = { 'device': 'router' }
        } else if (device_type == 'router_5port') {
            query = { 'device': 'router_5port' }
        } else if (device_type == 'ap') {
            query = { 'device': 'ap' }
        } else if (device_type == '11ac') {
            query = { 'device': '11ac' }
        }

        config = config.config;
        data = { '$set': { config } }

        this.getCollection('device', function (error, device_collection) {
            device_collection.updateMany(query, data, function (error, updateSetting) {
                if (error) console.log(error);
            });
        });
        this.getCollection('setPoint', function (error, setPoint_collection) {
            setPoint_collection.update(query, data, function (error, defaultSetting) {
                if (error) console.log(error);
            });
        });
    }

    update(deviceId, devices, callback) {

        this.getCollection('device', function (error, device_collection) {
            if (error) callback(error);
            else {
                if (typeof (devices.length) == "undefined")
                    devices = [devices];

                for (var i = 0; i < devices.length; i++)
                    device = devices[i];

                device_collection.update({
                    _id: ObjectID.createFromHexString(deviceId)
                }, { "$set": device }, function (error, device) {
                    if (error) callback(error);
                    else callback(null, device);
                });
            }
        });
    }

    save(devices, callback) {

        this.getCollection('device', function (error, device_collection) {
            if (error) callback(error);
            else {
                if (typeof (devices.length) == "undefined")
                    devices = [devices];

                for (var i = 0; i < devices.length; i++) {
                    device = devices[i];
                }

                device_collection.insert(devices, function () {
                    callback(null, devices);
                });
            }
        });
    };

    drop(callback) {
        this.getCollection('device', function (error, device_collection) {
            if (error) callback(error);
            else {
                device_collection.drop();
            }
        });
    };

    updateMac(oldMac, newMac, callback) {

        this.getCollection('device', function (error, device_collection) {
            device_collection.update({ "mac": oldMac }, { "$set": { "mac": newMac } }, function (error, device) {
                if (error) callback(error);
                else callback(null, oldMac);
            });
        });
    };

    //exports.DeviceProvider = DeviceProvider;
}

module.exports = MongoDriver;
