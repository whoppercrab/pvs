import sys
sys.path.append('/usr/local/lib/python3.4/dist-packages')

from pymongo import MongoClient
import json

# Init Variable
mongo_client = MongoClient()
db = mongo_client.UB2

settingCollection = db.setPoint
deviceCollection = db.device

router_list = sys.argv[1].split(',')
ap_list = sys.argv[2].split(',')
ssid_list = sys.argv[3].split(',')
password_list = sys.argv[4].split(',');
mode_list = sys.argv[5].split(',');
ssid_list_5g = sys.argv[6].split(',')
password_list_5g = sys.argv[7].split(',');
'''
Router Registration
'''
# Load Router's MAC address
# Load Router's Default setting values
#setting = settingCollection.find_one({'device': 'router'}, {'_id': 0})
# Insert MongoDB
#for index, x in router_list:
for index, x in enumerate(router_list):
	if mode_list[index] == '11AC':
		if deviceCollection.find_one({'mac': x, 'device': 'router_5port'}) == None:
			setting = settingCollection.find_one({'device': 'router_5port'}, {'_id': 0})
			setting.update({'mac': x})
			deviceCollection.insert_one(setting.copy())
			print(index)
			deviceCollection.update({'mac':x}, {'$set':{'config.g_5.poe_ap_ssid':ssid_list_5g[index]}})
			deviceCollection.update({'mac':x}, {'$set':{'config.g_5.poe_ap_password':password_list_5g[index]}})
			deviceCollection.update({'mac':x}, {'$set':{'config.g_2_4.poe_ap_ssid':ssid_list[index]}})
			deviceCollection.update({'mac':x}, {'$set':{'config.g_2_4.poe_ap_password':password_list[index]}})
		else :
			deviceCollection.update({'mac':x}, {'$set':{'config.g_5.poe_ap_ssid':ssid_list_5g[index]}})
			deviceCollection.update({'mac':x}, {'$set':{'config.g_5.poe_ap_password':password_list_5g[index]}})
			deviceCollection.update({'mac':x}, {'$set':{'config.g_2_4.poe_ap_ssid':ssid_list[index]}})
			deviceCollection.update({'mac':x}, {'$set':{'config.g_2_4.poe_ap_password':password_list[index]}})

	else :
		if deviceCollection.find_one({'mac': x, 'device': 'router'}) == None:
			setting = settingCollection.find_one({'device': 'router'}, {'_id': 0})
			setting.update({'mac': x})
			deviceCollection.insert_one(setting.copy())
			deviceCollection.update({'mac':x}, {'$set':{'config.poe_ap_ssid':ssid_list[index]}})
			deviceCollection.update({'mac':x}, {'$set':{'config.poe_ap_password':password_list[index]}})
		else :
			deviceCollection.update({'mac':x}, {'$set':{'config.poe_ap_ssid':ssid_list[index]}})
			deviceCollection.update({'mac':x}, {'$set':{'config.poe_ap_password':password_list[index]}})		
#        deviceCollection.update({'mac':x}, {'config.poe_ap_ssid':'UB_AP1234'})

'''
AP Registration
'''
# Load AP's MAC address
# Load AP's Default setting values
#setting = settingCollection.find_one({'device': 'ap'}, {'_id': 0})
# Insert MongoDB
#for x in ap_list:
for index, x in enumerate(ap_list):
	if mode_list[index] == '11AC':
		if deviceCollection.find_one({'mac': x, 'device': '11ac'}) == None:
			setting = settingCollection.find_one({'device': '11ac'}, {'_id': 0})
			setting.update({'mac': x})
			deviceCollection.insert_one(setting.copy())
	else :
		if deviceCollection.find_one({'mac': x, 'device': 'ap'}) == None:
			setting = settingCollection.find_one({'device': 'ap'}, {'_id': 0})
			setting.update({'mac': x})
			deviceCollection.insert_one(setting.copy())


deviceCollection.remove({'mac':''})
