# Запуск проекта

Для запуска проекта, убедитесь, что у вас установлена NodeJS версии 20.10.0.
Так же на компьютере должны быть установлены программы gcc, make, python2, python3. (На линуксе всё это находиться в пакете build-essential)

## Запуск сервера

Перейти в папку с сервером `cd packages/server`
установить зависимости `npm i -ci`
Запустить сервер `npm run start`

Теперь по адресу localhost:3000 доступен сервер

## Запуск сайта

Перейти в папку с сайтом `cd packages/web`
Установить зависимости `npm i -ci`
ЗАпустить режим разработки `npm run dev`

Теперь по адресу localhost:5173 доступен сайт


## Создание администратора

Т.К. проект использует SQLite то все данные в БД храняться на устройстве. Поэтому нужно создать пользвоателя с правами администратора вручную. 
Например `curl -H "Content-Type: application/json" -d '{"login": "admin-user", "password": "super-password-1"}"'`
Создаст администратора с логином admin-user и паролем super-password-1
