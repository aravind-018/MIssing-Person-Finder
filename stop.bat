@echo off

echo Stopping GodsEye...

taskkill /F /IM node.exe
taskkill /F /IM python.exe

echo.
echo Done.
pause