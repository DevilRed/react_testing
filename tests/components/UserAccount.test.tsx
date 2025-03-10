import { render, screen } from '@testing-library/react';
import UserAccount from '../../src/components/UserAccount';
import { User } from '../../src/entities';

describe('UserAccount', () => {
	it('should show edit button if user is admin', () => {
		const user: User = { id: 1, name: 'Thulio', isAdmin: true}
		render(<UserAccount user={user} />)

		const button = screen.getByRole('button')
		expect(button).toBeInTheDocument()
		expect(button).toHaveTextContent(/edit/i)
	});
	it('should not show edit button if user is not admin', () => {
		const user: User = { id: 1, name: 'Jane', isAdmin: false}
		render(<UserAccount user={user} />)
		expect(screen.queryByText(/edit/i)).not.toBeInTheDocument()
	});
	it('should render user name', () => {
		const user: User = { id: 1, name: 'Zagarnaga'}
		render(<UserAccount user={user} />)
		expect(screen.getByText(user.name)).toBeInTheDocument()
	});
})