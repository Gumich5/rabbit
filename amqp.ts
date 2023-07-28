import amqp from 'amqplib'

export const createClient = async () => await amqp.connect('amqp://localhost')
