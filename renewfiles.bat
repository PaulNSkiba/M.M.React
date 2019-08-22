REM del files in js folder of sch-journal.dev
REM npm run build 
set targetdir=C:\OpenServer\domains\sch-journal\public\static\js
del /q %targetdir%\*
set targetdir=C:\OpenServer\domains\sch-journal\public\static\css
del /q %targetdir%\*
set targetdir=C:\OpenServer\domains\sch-journal\public\static\media
del /q %targetdir%\*
set targetdir=C:\OpenServer\domains\sch-journal\public
del /q %targetdir%\*.js
del /q %targetdir%\asset-manifest.json

xcopy C:\MyProjects\sch-journal\build\static C:\OpenServer\domains\sch-journal\public\static /E
xcopy C:\MyProjects\sch-journal\build\*.js C:\OpenServer\domains\sch-journal\public 
copy C:\MyProjects\sch-journal\build\asset-manifest.json C:\OpenServer\domains\sch-journal\public\asset-manifest.json
copy C:\MyProjects\sch-journal\build\index.html C:\OpenServer\domains\sch-journal\resources\views\welcome.blade.php