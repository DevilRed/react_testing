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
			getQuantityControls: () => ({// a function returning an object
				quantity:  screen.queryByRole('status'),
				decrementButton:  screen.queryByRole('button', { name: '-'}),
				incrementButton:  screen.queryByRole('button', { name: '+'})
			}),
			user: userEvent.setup(),
		}
	}
	it('should render the add to cart button', () => {
		const {addToCartButton} = renderComponent()
		expect(addToCartButton).toBeInTheDocument()
	});

	it('should add product to the cart',async () => {
		const {addToCartButton, user, getQuantityControls} = renderComponent()
		await user.click(addToCartButton)

		const { quantity, incrementButton, decrementButton } = getQuantityControls()

		expect(quantity).toHaveTextContent('1')
		expect(decrementButton).toBeInTheDocument()
		expect(incrementButton).toBeInTheDocument()

		expect(addToCartButton).not.toBeInTheDocument()
	});

	it('should increment quantity', async() => {
		const {addToCartButton, user, getQuantityControls} = renderComponent()
		await user.click(addToCartButton)

		const { quantity, incrementButton } = getQuantityControls()
		await user.click(incrementButton!)

		expect(quantity).toHaveTextContent('2')
	});

	it('should decrement quantity', async() => {
		const {addToCartButton, user, getQuantityControls} = renderComponent()
		await user.click(addToCartButton)

		const { quantity, decrementButton } = getQuantityControls()
		await user.click(decrementButton!)

		expect(quantity).not.toBeInTheDocument()
	});
})