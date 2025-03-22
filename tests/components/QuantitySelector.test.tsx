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

		const getAddToCartButton = () =>  screen.getByRole('button', {name: /add to cart/i})
		const getQuantityControls = () => ({
				quantity:  screen.queryByRole('status'),
				decrementButton:  screen.queryByRole('button', { name: '-'}),
				incrementButton:  screen.queryByRole('button', { name: '+'})
			})
		const user = userEvent.setup()

		const addToCart = async () => {
			const button = getAddToCartButton()
			await user.click(button!)
		}

		const incrementQuantity = async () => {
			const {incrementButton} = getQuantityControls()
			await user.click(incrementButton!)
		}

		const decrementQuantity = async () => {
			const {decrementButton} = getQuantityControls()
			await user.click(decrementButton!)
		}

		return {
			getAddToCartButton,
			getQuantityControls,
			addToCart,
			incrementQuantity,
			decrementQuantity,
		}
	}
	it('should render the add to cart button', () => {
		const {getAddToCartButton} = renderComponent()
		expect(getAddToCartButton()).toBeInTheDocument()
	});

	it('should add product to the cart',async () => {
		const {getQuantityControls, addToCart} = renderComponent()
		await addToCart()

		const { quantity, incrementButton, decrementButton } = getQuantityControls()

		expect(quantity).toHaveTextContent('1')
		expect(decrementButton).toBeInTheDocument()
		expect(incrementButton).toBeInTheDocument()

		expect(screen.queryByRole('button', { name: /add to cart/i})).not.toBeInTheDocument()
	});

	it('should increment quantity', async() => {
		const {getQuantityControls, addToCart, incrementQuantity} = renderComponent()
		await addToCart()

		await incrementQuantity()

		const { quantity } = getQuantityControls()
		expect(quantity).toHaveTextContent('2')
	});

	it('should decrement quantity', async() => {
		const { getQuantityControls, addToCart, incrementQuantity, decrementQuantity} = renderComponent()
		await addToCart()
		await incrementQuantity()

		await decrementQuantity()

		const { quantity } = getQuantityControls()
		expect(quantity).toHaveTextContent('1')
	});

	it('should remove product from the cart when quantity is 1', async() => {
		const {getAddToCartButton, getQuantityControls, addToCart, decrementQuantity} = renderComponent()
		await addToCart()

		await decrementQuantity()

		const { quantity, incrementButton, decrementButton } = getQuantityControls()
		expect(quantity).not.toBeInTheDocument()
		expect(incrementButton).not.toBeInTheDocument()
		expect(decrementButton).not.toBeInTheDocument()
		expect(getAddToCartButton()).toBeInTheDocument()
	});
})