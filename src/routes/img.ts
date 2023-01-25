import { Router } from "express"
import { v4 } from 'uuid'
import { images } from '../index.js'

export default Router().post('/', async (req, res) => {
	//começar upload
	let id = v4()
	await images.insertOne({
		id: id,
		base64: req.body.base64,
		completed: false
	})
	setTimeout(async () => {
		images.findOneAndDelete({ completed: false })
	}, 5 * 60 * 1000)
	res.send(id)
}).post('/single', async (req, res) => {
	//single upload
	let id = v4()
	await images.insertOne({
		id: id,
		base64: req.body.base64,
		completed: true
	})
	res.send(id)
}).post('/:id', async (req, res) => {
	if (!req.body.completed) {
		//continuar upload
		let img = await images.findOne({ id: req.params.id })
		images.updateOne({ id: img.id }, { $set: { base64: img.base64 + req.body.base64 } })
		res.send(img.id)
	} else if (req.body.completed) {
		//finalizar upload
		let img = await images.findOne({ id: req.params.id })
		images.updateOne({ id: img.id }, { $set: { base64: img.base64 + req.body.base64, completed: true } })
		res.send(req.params.id)
	} else {
		res.status(400).send()
	}
}).get('/:id/:part', async (req, res) => {
	let img = await images.findOne({ id: req.params.id })

	if (img) {
		res.send({
			string: img.base64.slice(Number(req.params.part), Number(req.params.part) + 100000),
			completed: !(Number(req.params.part) + 100000 < img.base64.length)
		})
	} else {
		res.status(404).send()
	}
}).delete('/:id', async (req, res) => {
	await images.deleteOne({ id: req.params.id })
	res.send()
})