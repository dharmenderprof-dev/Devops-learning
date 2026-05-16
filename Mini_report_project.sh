#!/bin/bash

report="report_$(date +%F).txt"

echo "System Report - $(date)" > $report

uptime >> $report
df -h >> $report
free -m >> $report

echo "Report created: $report"


#dynamic file banega

#overwrite ( > )

#append ( >> )