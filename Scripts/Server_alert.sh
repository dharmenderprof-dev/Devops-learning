#!/bin/bash

# =========================================
# VARIABLES
# =========================================

DATE=$(date +%F_%H-%M-%S)

REPORT="server_report_$DATE.txt"

DISK_THRESHOLD=80

# =========================================
# HEADER
# =========================================

echo "========================================" > $REPORT
echo "       SERVER MONITORING REPORT         " >> $REPORT
echo "========================================" >> $REPORT

echo "Generated on: $(date)" >> $REPORT

# =========================================
# SYSTEM UPTIME
# =========================================

echo "" >> $REPORT
echo "===== SYSTEM UPTIME =====" >> $REPORT

uptime >> $REPORT

# =========================================
# MEMORY USAGE
# =========================================

echo "" >> $REPORT
echo "===== MEMORY USAGE =====" >> $REPORT

free -m >> $REPORT

# =========================================
# DISK USAGE
# =========================================

echo "" >> $REPORT
echo "===== DISK USAGE =====" >> $REPORT

df -h >> $REPORT

# =========================================
# DISK ALERT CHECK
# =========================================

echo "" >> $REPORT
echo "===== DISK ALERT CHECK =====" >> $REPORT

USAGE=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')

if [ $USAGE -gt $DISK_THRESHOLD ]
then
    echo "WARNING: Disk usage is above threshold!" >> $REPORT
else
    echo "Disk usage is normal." >> $REPORT
fi

# =========================================
# INTERNET CONNECTIVITY CHECK
# =========================================

echo "" >> $REPORT
echo "===== INTERNET CHECK =====" >> $REPORT

ping -c 2 google.com > /dev/null

if [ $? -eq 0 ]
then
    echo "Internet is WORKING" >> $REPORT
else
    echo "Internet is DOWN" >> $REPORT
fi

# =========================================
# FAILED LOGIN ATTEMPTS
# =========================================

echo "" >> $REPORT
echo "===== FAILED LOGIN ATTEMPTS =====" >> $REPORT

grep "Failed password" /var/log/auth.log >> $REPORT

# =========================================
# TOP MEMORY PROCESSES
# =========================================

echo "" >> $REPORT
echo "===== TOP MEMORY PROCESSES =====" >> $REPORT

ps aux --sort=-%mem | head -5 >> $REPORT

# =========================================
# FINISH
# =========================================

echo "" >> $REPORT
echo "Monitoring completed successfully." >> $REPORT

echo "Report generated: $REPORT"