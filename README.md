# Тестовое задание в школу Node.js Яндекса.

## Запуск

Для запуска тестового задания необходим небольшой сервер nginx 
или же запуск из IDE WebStorm/Idea (что, собственно, очевидно, ведь загрузка локальных файлов 
посредством AJAX заблокирована политикой CORS из Google Chrome). Альтернативным методом является запуск 
Google Chrome с параметрами `--disable-web-security --user-data-dir`, что отлючит проверку Cross-Origin.
Ну, или используйте другой браузер.

## Работа

Работа приложения протестирована на latest Chrome с операционной системой Windows 10. Технологии, используемые в 
разработке присутствовали в этом браузере на момент написания. Приложение инициализурется и работает сразу после открытия. В глобальной области видимости присутствует 
объект MyForm, который отвечает за работу с формой. Для реализации AJAX используется `XmlHttpRequest`, обернутый 
в native Promises. Можно и использовать `isomorphic fetch`, но он еще хуже работает с файловой системой. Глобальный 
объект `MyForm` был написан с использованием ES6 Classes, потому что "почему бы и нет?". По желанию могу переписать на 
прототипы, хоть классы это всего лишь синтаксический сахар. Promise был использован исключительно для легкого 
украшения кода и может быть спокойно удален по одному лишь требованию.

## Вопросы к "редакции"

- В задании не были описаны способы переключения action формы, потому, я полагаю, будет переключение через 
Chrome Dev Tools, что, в принципе, работает.
- Также в задании не было описано, требуется ли отправка данных на сервер и если требуется, то каким методом.
Потому я решил это сам и выставил метод POST и отправляю данные в формате `multipart/form-data` только потому, 
что это быстро и легко. Парсить параметры в queryString я посчитал избыточным, потому не стал этого делать.
- Ничего не было сказано про дизайн и наличие CSS, потому этот аспект я так же взял на себя и минимально 
оформил форму, чтобы она не выглядела ну уж совсем страшно.