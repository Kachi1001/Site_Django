@echo off
setlocal enabledelayedexpansion

rem Caminho para o arquivo .env
set "env_file=.env"
rem Caminho para a pasta de backup
set "backup_dir=backup"

rem Verifica se o arquivo .env existe
if not exist %env_file% (
    echo Arquivo .env nao encontrado!
    exit /b 1
)

rem Verifica se a pasta de backup existe, se nao, cria a pasta
if not exist %backup_dir% (
    mkdir %backup_dir%
)

rem Le o arquivo .env linha por linha
for /f "usebackq tokens=1* delims==" %%A in ("%env_file%") do (
    set "key=%%A"
    set "value=%%B"

    rem Remove espacos em branco ao redor da chave e do valor
    set "key=!key:~0,-1!"
    set "value=!value!"

    rem Define a variavel de ambiente
    set "!key!=!value!"
)

rem Obter a data e hora atual no formato AAAA-MM-DD_HH-MM-SS
for /f "tokens=2 delims==" %%i in ('wmic os get localdatetime /value') do set datetime=%%i
set datetime=%datetime:~0,4%-%datetime:~4,2%-%datetime:~6,2%_%datetime:~8,2%-%datetime:~10,2%-%datetime:~12,2%

rem Caminho do arquivo de backup
set "backup_file=%backup_dir%\models_backup_%datetime%.py"


rem Executa inspectdb e salva em Home/models.py
py manage.py inspectdb > Home/models.py

rem Fazendo backup do arquivo Home/models.py
if exist Home\models.py (
    copy Home\models.py %backup_file%
    echo Backup criado em %backup_file%
) else (
    echo Arquivo Home\models.py nao encontrado!
)

rem Executa o servidor Django
py manage.py runserver %DJ_HOS%:%DJ_POR%

PAUSE
endlocal
