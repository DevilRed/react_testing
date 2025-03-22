import { render, screen } from '@testing-library/react'
import { CartProvider } from '../../src/providers/CartProvider';
import QuantitySelector from '../../src/components/QuantitySelector';
import { Product } from '../../src/entities';
import userEvent from '@testing-library/user-event';

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
			addToCartButton: screen.getByRole('button', {name: /add to cart/i}),
			user: userEvent.setup(),
			getQuantity: () =>  screen.queryByRole('status'),
			getDecrementButton: () =>  screen.queryByRole('button', { name: '-'}),
			getIncrementButton: () =>  screen.queryByRole('button', { name: '+'})
		}
	}
	it('should render the add to cart button', () => {
		const {addToCartButton} = renderComponent()
		expect(addToCartButton).toBeInTheDocument()
	});

	it('should add product to the cart',async () => {
		const {addToCartButton, user, getQuantity, getDecrementButton, getIncrementButton} = renderComponent()
		await user.click(addToCartButton)

		expect(getQuantity()).toHaveTextContent('1')
		expect(getDecrementButton()).toBeInTheDocument()
		expect(getIncrementButton()).toBeInTheDocument()

		expect(addToCartButton).not.toBeInTheDocument()
	});

	it('should increment quantity', async() => {
		const {addToCartButton, user, getQuantity, getIncrementButton} = renderComponent()
		await user.click(addToCartButton)

		await user.click(getIncrementButton()!)

		expect(getQuantity()).toHaveTextContent('2')
	});

	it('should decrement quantity', async() => {
		const {addToCartButton, user, getQuantity, getDecrementButton} = renderComponent()
		await user.click(addToCartButton)

		await user.click(getDecrementButton()!)

		expect(getQuantity()).not.toBeInTheDocument()
	});
})