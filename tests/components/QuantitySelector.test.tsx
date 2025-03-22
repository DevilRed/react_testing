import { render, screen } from '@testing-library/react'
import { CartProvider } from '../../src/providers/CartProvider';
import QuantitySelector from '../../src/components/QuantitySelector';
import { Product } from '../../src/entities';

describe('QuantitySelector', () => {
	const renderComponent = () => {
		const product: Product = {
			id: 1,
			name: 'Milk',
			price: 5,
			categoryId: 1
		}
		render(
			<CartProvider>
				<QuantitySelector product={product} />
			</CartProvider>
		)

		return {
			addToCartButton: screen.getByRole('button', {name: /add to cart/i})
		}
	}
	it('should render the add to cart button', () => {
		const {addToCartButton} = renderComponent()
		expect(addToCartButton).toBeInTheDocument()
	});
})