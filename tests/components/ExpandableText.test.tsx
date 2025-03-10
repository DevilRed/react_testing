import { render, screen } from '@testing-library/react'
import ExpandableText from '../../src/components/ExpandableText';
import userEvent from '@testing-library/user-event';

describe('ExpandableText', () => {
	const limit = 255;
	const longText = "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Velit in obcaecati ducimus, asperiores recusandae possimus laboriosam? Ea unde omnis quaerat distinctio! Optio ex dolorem veritatis, assumenda dolores quo ullam tempora dolore? Reiciendis inventore tempora fugiat? Dolores sunt aliquam, voluptate aut, eius corporis saepe vel officiis cum ad blanditiis consectetur asperiores adipisci atque ratione ullam dolorum in vitae voluptatum consequatur totam similique! Reprehenderit vero placeat molestias, id consectetur natus dolore amet, ex laborum culpa minima illo fuga. Iusto reiciendis sed fugit a quia sit veniam, obcaecati iste sunt enim ad molestiae autem facilis perspiciatis alias consequatur tenetur consectetur hic accusamus amet.";
	const truncatedText = longText.substring(0, limit) + '...';

	it('should render all text if its is below limnit', () => {
		const text = "lalala lala"
		render(<ExpandableText text={text} />)
		const article = screen.getByRole('article')
		expect(article).toHaveTextContent(text)
	});

	it('should render a button to expand content if text is greatger than limit', () => {
		render(<ExpandableText text={longText} />)
		expect(screen.getByRole('article')).toHaveTextContent(truncatedText)
		const button = screen.getByRole('button')
		expect(button).toBeInTheDocument()
		expect(button).toHaveTextContent(/show more/i)
	});

	it('should expand text if button is clicked', async () => {
		const user = userEvent.setup()
		render(<ExpandableText text={longText} />)
		const button = screen.getByRole('button')

		await user.click(button)
		expect(screen.queryByText(longText)).toBeInTheDocument()
		expect(button).toHaveTextContent(/less/i)
	});

	it('should collapse text if show less button is clicked', async () => {
		// click btn to have text expanded
		const user = userEvent.setup()
		render(<ExpandableText text={longText} />)
		const showMoreButton = screen.getByRole('button', {name: /Show More/i})
		await user.click(showMoreButton)

		// click btn again to collapse text
		const showLessButton = screen.getByRole('button', {name: /Show Less/i})
		await user.click(showLessButton)
		expect(screen.queryByText(truncatedText)).toBeInTheDocument()
		expect(showLessButton).toHaveTextContent(/more/i)
	});
})