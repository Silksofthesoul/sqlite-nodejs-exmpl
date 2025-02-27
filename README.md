# 🚲

<!-- vim-markdown-toc GFM -->

* [Описание](#Описание)
* [Что умеет?](#Что-умеет)
  * [SQLite](#sqlite)
  * [Express](#express)
* [TODO:](#todo)

<!-- vim-markdown-toc -->

## Описание
Пример приложения работающего в node.js c такими технологиями:

- SQLite
- Express
- Handlebars (шаблонизатор)
- Basic Аутентификация


## Что умеет?

### SQLite
- Создание базы данных SQLite;
- Создание таблиц и записи;
- Получение данных из таблицы;
- Обновление данных в таблице;
- Удаление данных из таблицы;

Созданы пару классов для работы с условными "статьями" и "пользователями"
В примере работаем с несколькими файлами баз данных.

### Express
- Создание сервера на порту 8080;
- Создание роутов;
  - Оборачиваем в класс;
  - Автоматически формируем навигацию;
  - Прячем функции рендеринга и методы ответа;


## TODO:
- авторизация
  - [ ] session
  - [x] cookies / Basic
  - [ ] JWT
- SQLite
  - [ ] ORM (sequelize)
