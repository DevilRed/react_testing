import { render, screen, waitForElementToBeRemoved } from '@testing-library/react'
import BrowseProducts from '../../src/pages/BrowseProductsPage';
import { http, delay, HttpResponse } from 'msw';
import { server } from '../mocks/server';
import { Theme } from '@radix-ui/themes';

const renderComponent = () => {
	render(<Theme><BrowseProducts /></Theme>)
}

describe('BrowseProductsPage', () => {
	it('should render a loading skeleton when fetching categories', () => {
		// overwrite request to create a delay
		server.use(http.get('/categories', async () => {
			await delay()
			return HttpResponse.json([])
		}))
		renderComponent()
		expect(screen.getByRole('progressbar', { name: /categories/i})).toBeInTheDocument()
	});

	it('should hide the loading skeleton after categories are fetched', async() => {
		renderComponent()
		await waitForElementToBeRemoved(() => screen.queryByRole('progressbar', { name: /categories/i}))
	});

	it('should render a loading skeleton when fetching products', () => {
		// overwrite request to create a delay
		server.use(http.get('/products', async () => {
			await delay()
			return HttpResponse.json([])
		}))
		renderComponent()
		expect(screen.getByRole('progressbar', { name: /products/i})).toBeInTheDocument()
	});

	it('should hide the loading skeleton after products are fetched', async() => {
		renderComponent()
		await waitForElementToBeRemoved(() => screen.queryByRole('progressbar', { name: /products/i}))
	});
})