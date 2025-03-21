@echo off

:: Запуск сервера
cd /d D:\projects\kita-app\server
start "SERVER" cmd /k "node server.js"

:: Запуск клиента
cd /d D:\projects\kita-app
start "CLIENT" cmd /k "npm start"
