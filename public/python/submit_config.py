import sys
sys.path.append('/usr/local/lib/python3.4/dist-packages')

import subprocess

# argument[1] is ap's mac address
mac = sys.argv[1]
mac = mac[:2] + ':' + mac[2:4] + ':' + mac[4:6] + ':' + mac[6:8] + ':' + mac[8:10] + ':' + mac[10:]

server_address = subprocess.check_output('cat ../server_address', shell = True)[0:-1].replace("\n", "")

command = 'mosquitto_pub -h ' + server_address + ' -t PVS/device/config/' + mac + ' -m ""'
print(command)
subprocess.call(command, shell = True)
