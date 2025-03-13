import { db } from "./db";

export const handlers = [
	/* http.get('/products', () => {
		return HttpResponse.json(products)
	}),

	// redefine logic to get a product
	http.get('/products/:id', ({ params }) => {
		const id = parseInt(params.id as string)
		const product = products.find(p => p.id === id)
		if (!product) return new HttpResponse(null, { status: 404})
		return HttpResponse.json(product)
	}) */
	// remove hardcoded data because as the app evolves endpoints can grow if would be unmanageable

	// this return an array of request handlers for all http methods (get, post, put, delete)
	...db.product.toHandlers('rest')
];