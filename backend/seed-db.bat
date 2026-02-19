@echo off
echo Starting database seeding process...
cd /d "%~dp0"

echo Ensuring dependencies are installed...
call npm install

echo Pushing database schema...
call npx prisma db push

echo Generating Prisma Client...
call npx prisma generate

echo Seeding database...
call npx prisma db seed

echo Done!
pause
