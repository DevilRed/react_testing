import { render, screen } from '@testing-library/react'
import { User } from '../../src/entities';
import UserList from '../../src/components/UserList';

describe('UserList', () => {
	it('should a list of user if they are provided', () => {
		const users:User[] = [
			{id: 1, name: 'To', isAdmin: true},
			{id: 2, name: 'Ta', isAdmin: false},
		]
		render(<UserList users={users} />)
		users.map(user => {
			const link = screen.getByRole('link', { name: user.name})
			expect(link).toBeInTheDocument()
			expect(link).toHaveAttribute('href', `/users/${user.id}`)
		})
	});
})