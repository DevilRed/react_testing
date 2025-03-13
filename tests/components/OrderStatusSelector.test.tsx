import { render, screen } from '@testing-library/react'
import OrderStatusSelector from '../../src/components/OrderStatusSelector';
import { Theme } from '@radix-ui/themes';
import userEvent from '@testing-library/user-event';

describe('OrderStatusSelector', () => {
	const renderComponent = () => {
		render(<Theme>
				<OrderStatusSelector onChange={vi.fn()}/>
			</Theme>)
		return {
			button: screen.getByRole('combobox'),
			getOptions: () => screen.findAllByRole('option')
		}
	}
	it('should render new as default value', () => {
		const { button } = renderComponent()
		expect(button).toHaveTextContent(/new/i)
	});

	it('should render correct statuses', async () => {
		const user = userEvent.setup()
		const { button, getOptions } = renderComponent()
		await user.click(button)

		const options = await getOptions()
		expect(options).toHaveLength(3)

		// test options have right labels
		const labels = options.map(option => option.textContent)
		expect(labels).toEqual(['New', 'Processed', 'Fulfilled'])
	});
})