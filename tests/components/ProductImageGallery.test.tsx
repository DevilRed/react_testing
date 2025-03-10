import { render, screen } from '@testing-library/react'
import ProductImageGallery from '../../src/components/ProductImageGallery';

describe('ProductImageGallery', () => {
	it('should render nothing if given an empty array', () => {
		const { container} = render(<ProductImageGallery imageUrls={[]} />)
		expect(container).toBeEmptyDOMElement()
	});

	it('should render a list of images', () => {
		const imageUrls: string[] = [
			'img1',
			'img2',
		]
		render(<ProductImageGallery imageUrls={imageUrls} />)
		const images = screen.getAllByRole('img')
		expect(images).toHaveLength(imageUrls.length)
		// images have right src attribute
		imageUrls.forEach((url, idx) => {
			expect(images[idx]).toHaveAttribute('src', url)
		})
	});
})