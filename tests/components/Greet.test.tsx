import { render, screen } from '@testing-library/react';
import { it, expect, describe } from 'vitest';
import Greet from '../../src/components/Greet';

// add more matchers
// github.com/testing-library/jest-dom
import '@testing-library/jest-dom/vitest';

describe('Greet component', () => {
	it('should show message with given name', () => {
		render(<Greet name="Josua" />);
		const heading = screen.getByRole('heading');
		expect(heading).toBeInTheDocument();
		expect(heading).toHaveTextContent(/hello josua/i);
	})

	it('should render login button when name is not provided', () => {
		render(<Greet />);
		const button = screen.getByRole('button');
		expect(button).toBeInTheDocument();
		expect(button).toHaveTextContent(/login/i);
	})
})