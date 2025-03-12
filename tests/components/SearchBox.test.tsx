import { vi } from "vitest";
import { render, screen } from '@testing-library/react'
import SearchBox from '../../src/components/SearchBox';
import userEvent from "@testing-library/user-event";

type MyCbFunction = {
	(): void
}

describe('SearchBox', () => {
	const renderSearchBox = (cb: MyCbFunction) => {
		render(<SearchBox onChange={cb} />)
		return {
			input: screen.getByRole('textbox'),
			user: userEvent.setup()
		}
	}
	it('should render component', () => {
		const callback = vi.fn()
		const {input} = renderSearchBox(callback)
		expect(input).toBeInTheDocument()
	});
	it('should trigger onChange callback when enter is pressed', async () => {
		const callback = vi.fn()
		const {input, user} = renderSearchBox(callback)

		const searchTerm = "searchTerm"
		await user.type(input, `${searchTerm}{enter}`)
		expect(callback).toHaveBeenCalledWith(searchTerm)
	});
	it('should not trigger onChange callback if input field is empty', async () => {
		const callback = vi.fn()
		const {input, user} = renderSearchBox(callback)

		await user.type(input, `{enter}`)
		expect(callback).not.toHaveBeenCalled()
	});
})