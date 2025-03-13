import { render, screen } from '@testing-library/react'
import OrderStatusSelector from '../../src/components/OrderStatusSelector';
import { Theme } from '@radix-ui/themes';
import userEvent from '@testing-library/user-event';

describe('OrderStatusSelector', () => {
	const renderComponent = (cb=vi.fn()) => {
		render(<Theme>
				<OrderStatusSelector onChange={cb}/>
			</Theme>)
		return {
			button: screen.getByRole('combobox'),
			getOptions: () => screen.findAllByRole('option'),
			getOption: (label: RegExp) => screen.findByRole('option', { name: label}),
			user: userEvent.setup()
		}
	}
	it('should render new as default value', () => {
		const { button } = renderComponent()
		expect(button).toHaveTextContent(/new/i)
	});

	it('should render correct statuses', async () => {
		const { button, getOptions, user } = renderComponent()
		await user.click(button)

		const options = await getOptions()
		expect(options).toHaveLength(3)

		// test options have right labels
		const labels = options.map(option => option.textContent)
		expect(labels).toEqual(['New', 'Processed', 'Fulfilled'])
	});

	// using each as data provider
	it.each([
		{ label: /processed/i, value: 'processed' },
		{ label: /fulfilled/i, value: 'fulfilled' },
	])
	('should call onChange with $value when the $label option is selected', async ({ label, value }) => {
		const myCb = vi.fn();
		const { button, user, getOption } = renderComponent(myCb)
		await user.click(button)

		const option = await getOption(label)
		await user.click(option)

		// test options have right labels
		expect(myCb).toHaveBeenCalledWith(value)
	});

	// new option is default value so click on other option first then get back to new option
	it("should call onChange with 'new' when the New option is selected", async () => {
		const myCb = vi.fn();
		const { button, user, getOption } = renderComponent(myCb)
		await user.click(button)

		const processedOption = await getOption(/processed/i)
		await user.click(processedOption)

		await user.click(button)
		const newOption = await getOption(/new/i)
		await user.click(newOption)

		expect(myCb).toHaveBeenCalledWith('new')
	});
})