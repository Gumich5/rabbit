import { ConsumeMessage } from 'amqplib'
import express, { Express, Request, Response } from 'express'
import { createClient } from './amqp'

const orders = [
	{ id: 1, userId: 1, items: [2, 3] },
	{ id: 2, userId: 2, items: [1, 3] }
]

const getData = async (items: ReadonlyArray<number>) => {
	const conn = await createClient()

	const ch2 = await conn.createChannel()
	ch2.sendToQueue('orders_queue', Buffer.from(JSON.stringify(items)))

	const ch1 = await conn.createChannel()
	await ch1.assertQueue('items_queue')

	const recieveItems = new Promise((resolve, reject) => {
		ch1.consume('items_queue', (msg: ConsumeMessage | null) => {
			if (msg !== null) {
				console.log('Recieved:', msg.content.toString())
				ch1.ack(msg)
				resolve(JSON.parse(msg.content.toString()))
			} else {
				console.log('Consumer cancelled by server')
				reject()
			}
		})
	})

	const result = await recieveItems

	await ch1.close()

	return result
}

const app: Express = express()

app.get('/order/:orderId', async (req: Request, res: Response) => {
	const { orderId } = req.params
	const order = orders.find(({ id }) => id === parseInt(orderId))

	if (order) {
		const result = { ...order, items: await getData(order.items) }
		res.json(result)
	} else {
		res.json({})
	}
})

app.listen(3000, () => {
	console.log('Server started')
})
