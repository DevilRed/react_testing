import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import { http, HttpResponse, DefaultBodyType } from "msw";
import ProductDetail from '../../src/components/ProductDetail';
import { db } from '../mocks/db';
import { server } from '../mocks/server';

describe('ProductDetail', () => {
	let productId: number;
	beforeAll(() => {
		const product = db.product.create()
		productId = product.id
	})
	afterAll(() => {
		db.product.delete({ where: { id: { equals: productId }}})
	})
	it('should render the product', async() => {
		const product = db.product.findFirst({where: { id: {equals: productId}}})
		render(<ProductDetail productId={productId} />)
		expect(await screen.findByText(new RegExp(product!.name))).toBeInTheDocument()
		expect(await screen.findByText(new RegExp(product!.price.toString()))).toBeInTheDocument()
	});

	it('should render message if product is not found', async() => {
		server.use(http.get('/products/1', () => HttpResponse.json(null)))

		render(<ProductDetail productId={1} />)
		const message = await screen.findByText(/not found/i)
		expect(message).toBeInTheDocument()
	});

	it('should render an error for invalid product id', async() => {
		// no mocking is needed because an invalid id is passed
		// server.use(http.get('/products/1', () => HttpResponse.json(null)))

		render(<ProductDetail productId={0} />)
		const message = await screen.findByText(/invalid/i)
		expect(message).toBeInTheDocument()
	});

	it('should render an error message data fetching fails', async() => {
		server.use(http.get('/products/1', () => HttpResponse.error()))

		render(<ProductDetail productId={1} />)
		const message = await screen.findByText(/error/i)
		expect(message).toBeInTheDocument()
	});

	it('should render a loading indicator when fetching data', async () => {
		server.use(http.get( '/products', async () => {
			await delay()
			// no product is needed because we are testing the loading
			return HttpResponse.json([])
		} ))
		render(<ProductDetail productId={1} />)

		expect(await screen.findByText(/loading/i)).toBeInTheDocument()
	});

	it('should remove loading indicator after data is fetched', async () => {
		render(<ProductDetail productId={1} />)
		// kind of expect since it fails if element is not removed
		await waitForElementToBeRemoved(() => screen.queryByText(/loading/i))
	});

	it('should remove loading indicator if data fetching fails', async () => {
		server.use(http.get( '/products', () => HttpResponse.error() ))
		render(<ProductDetail productId={1} />)
		// kind of expect since it fails if element is not removed
		await waitForElementToBeRemoved(() => screen.queryByText(/loading/i))
	});
})