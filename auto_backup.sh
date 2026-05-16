#!/bin/bash


source="/home user/data"
backup="/home/user/backup"

filename="backup_$(date +%F).tar.gz"   #Dynamic file name - (backup_2026-05-17.tar.gz) 

tar -czf $backup/$filename $source

echo "Backup completed: $filename"

#Part	Meaning
#tar	compress tool
#-c	create
#-z	gzip
#-f	file name



