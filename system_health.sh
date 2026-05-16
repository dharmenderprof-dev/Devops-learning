#!/bin/bash

echo "======SYSTEM HEALTH REPORT ======="

echo "Date: $(date)"
uptime


df -h

free -m


top -bn1 | head -5

echo "==================================="



#      $( )  command output capture
# uptime - server kitni der se chal raha hai
# Disk usage - df (disk free ) -h (human readable)
# -m (memory usage ) -m MB 
# top -bn1 | head -5 -  (system processes) -b (batch mode) -n1(1 time run)  | (pipe (output pass) head -5 (top 5 lines)

