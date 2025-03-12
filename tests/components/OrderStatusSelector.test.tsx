import { render, screen } from '@testing-library/react'
import OrderStatusSelector from '../../src/components/OrderStatusSelector';
import { Theme } from '@radix-ui/themes';
import userEvent from '@testing-library/user-event';

describe('OrderStatusSelector', () => {
	it('should render new as default value', () => {
		render(
			<Theme>
				<OrderStatusSelector onChange={vi.fn()}/>
			</Theme>
		)
		const button = screen.getByRole('combobox')
		expect(button).toHaveTextContent(/new/i)
	});

	it('should render correct statuses', async () => {
		const user = userEvent.setup()
		render(
			<Theme>
				<OrderStatusSelector onChange={vi.fn()}/>
			</Theme>
		)
		const button = screen.getByRole('combobox')
		await user.click(button)

		const options = await screen.findAllByRole('option')
		expect(options).toHaveLength(3)

		// test options have right labels
		const labels = options.map(option => option.textContent)
		expect(labels).toEqual(['New', 'Processed', 'Fulfilled'])
	});
})