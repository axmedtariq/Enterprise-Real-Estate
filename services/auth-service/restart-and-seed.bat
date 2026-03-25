@echo off
echo Attempting to restart SQL Server (SQLEXPRESS04)...
echo NOTE: You might need to run this script as Administrator.

net stop "MSSQL$SQLEXPRESS04"
if %errorlevel% neq 0 (
    echo Failed to stop service. Please run as Administrator or restart manually via services.msc.
    pause
    exit /b
)

net start "MSSQL$SQLEXPRESS04"
if %errorlevel% neq 0 (
    echo Failed to start service. Please check error logs.
    pause
    exit /b
)

echo SQL Server restarted successfully.
echo Waiting for service to initialize...
timeout /t 5

echo Starting database seeding...
call seed-db.bat
