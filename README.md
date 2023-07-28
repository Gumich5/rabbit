# AMQP тестовое задание RabbitMQ

Алгоритм работы:
• Получаем HTTP запрос на уровне микросервиса М1.  
• Транслируем HTTP запрос в очередь RabbitMQ. Запрос трансформируется в задание.
• Обрабатываем задание микросервисом М2 из очереди RabbitMQ.
• Помещаем результат обработки задания в RabbitMQ.
• Возвращаем результат HTTP запроса как результат выполнения задания из RabbitMQ.

## Содержание

-   [Технологии](#технологии)
-   [Использование](#использование)
-   [Тестирование](#тестирование)

## Технологии

-   [NodeJS]
-   [RabbitMQ]

## Использование

```sh
# Для начала запускаем RabbitMQ
docker run -d -p 5672:5672 rabbitmq

# Затем установить пакет
yarn install

# Запускаем первый микросервис
yarn start:order

# Запускаем второй микросервис
yarn start:items
```

## Тестирование

Отправьте GET запрос на первый микросервис, по ссылке: http://localhost:3000/order/<id>, где в id указывается существующий номер заказа. В наших примерах либо 1, либо 2.
В ответ ожидается возврат объекта заказа с массивом объектов товаров, полученных через RabbitMQ из второго микросервиса.