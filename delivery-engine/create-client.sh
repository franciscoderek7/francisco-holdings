#!/data/data/com.termux/files/usr/bin/bash

CLIENT=$1

mkdir -p "clients/$CLIENT"

cp templates/client-intake.md "clients/$CLIENT/"
cp templates/website-project.md "clients/$CLIENT/"
cp templates/automation-project.md "clients/$CLIENT/"

echo "Created client workspace: $CLIENT"

