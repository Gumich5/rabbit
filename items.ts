import { ConsumeMessage } from 'amqplib'
import { createClient } from './amqp'

const items = [
	{ id: 1, title: 'trainers' },
	{ id: 2, title: 'T-shorts' },
	{ id: 3, title: 'other' }
]

;(async () => {
	const conn = await createClient()

	const ch1 = await conn.createChannel()
	await ch1.assertQueue('orders_queue')

	ch1.consume('orders_queue', async (msg: ConsumeMessage | null) => {
		if (msg !== null) {
			console.log('Recieved:', msg.content.toString())
			ch1.ack(msg)
			const req = JSON.parse(msg.content.toString())

			const ch2 = await conn.createChannel()
			const res = req.map((reqId: number) => items.find(({ id }) => id === reqId))

			ch2.sendToQueue('items_queue', Buffer.from(JSON.stringify(res)))
			await ch2.close
		} else {
			console.log('Consumer cancelled by server')
		}
	})
})()
