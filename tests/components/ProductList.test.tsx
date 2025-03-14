import { render, screen, waitForElementToBeRemoved } from '@testing-library/react'
import ProductList from '../../src/components/ProductList';
import { server } from '../mocks/server';
import { http, HttpResponse, delay } from "msw";
import { db } from '../mocks/db';
import { QueryClient, QueryClientProvider } from 'react-query';

const renderComponent = () => {
	const client = new QueryClient({
		defaultOptions: {
			queries: {
				retry: false
			}
		}
	})

	render(
		<QueryClientProvider client={client}>
			<ProductList />
		</QueryClientProvider>
	)
}

describe('ProductList', () => {
	const productIds: number[] = []
	// create product data needed before testing
	beforeAll(() => {
		[1, 2, 3].forEach(() => {
			const product = db.product.create()
			productIds.push(product.id)
		})
	})

	afterAll(() => {
		db.product.deleteMany({ where: {id: {in: productIds}}})
	})
	it('should render the list of products', async () => {
		renderComponent()

		const items = await screen.findAllByRole('listitem')
		expect(items.length).toBeGreaterThan(0)
	});

	it('should render no products available if no products is found', async() => {
		// overwrite products endpoint response to return an empty array
		server.use(http.get( '/products', () => HttpResponse.json([]) ))
		renderComponent()

		const message = await screen.findByText(/no products/i)
		expect(message).toBeInTheDocument()
	});

	it('should render an error message when there is an error', async () => {
		server.use(http.get( '/products', () => HttpResponse.error() ))
		renderComponent()

		expect(await screen.findByText(/error/i)).toBeInTheDocument()
	});

	it('should render a loading indicator when fetching data', async () => {
		server.use(http.get( '/products', async () => {
			await delay()
			// no product is needed because we are testing the loading
			return HttpResponse.json([])
		} ))
		renderComponent()

		expect(await screen.findByText(/loading/i)).toBeInTheDocument()
	});

	it('should remove loading indicator after data is fetched', async () => {
		renderComponent()
		// kind of expect since it fails if element is not removed
		await waitForElementToBeRemoved(() => screen.queryByText(/loading/i))
	});

	it('should remove loading indicator if data fetching fails', async () => {
		server.use(http.get( '/products', () => HttpResponse.error() ))
		renderComponent()
		// kind of expect since it fails if element is not removed
		await waitForElementToBeRemoved(() => screen.queryByText(/loading/i))
	});
})