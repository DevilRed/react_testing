import { http, HttpResponse } from "msw";

export const handlers = [
	http.get('/categories', () => {
		return HttpResponse.json([
			{ id: 1, name: 'Electronics'},
			{ id: 2, name: 'Beuaty'},
			{ id: 3, name: 'Gardening'},
		])
	}),

	http.get('/products', () => {// 4.16
		return HttpResponse.json([
			{ id: 1, name: 'Product 1'},
			{ id: 2, name: 'Product 2'},
			{ id: 3, name: 'Product 3'},
		])
	})
];