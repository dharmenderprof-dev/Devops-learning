#!/bin/bash
logfile="/var/log/syslog" 
echo "checking ERROR logs..."
grep "error" $logfile
echo "Done checking logs"

#script bash shell me run hogi
# logfile = variable (box)
#/var/log/syslog = Linux system log file path
#screen par message show karta hai
#grep search tool
