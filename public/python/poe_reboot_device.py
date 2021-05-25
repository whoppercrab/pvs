import sys
sys.path.append('/usr/local/lib/python3.4/dist-packages')

import subprocess

# argument[1] is ap's mac address
mac = sys.argv[1]
portnum = sys.argv[2];

server_address = subprocess.check_output('cat ../server_address', shell = True)[0:-1].replace("\n", "")

command = 'mosquitto_pub -h ' + server_address + ' -t PVS/server/command/' + mac + ' -m "'+portnum+'"'
print(command)
subprocess.call(command, shell = True)
