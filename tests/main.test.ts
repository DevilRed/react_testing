describe('testing service worker', () => {
	it('should return response', async () => {
		const response = await fetch('/categories')
		const data = await response.json()
		expect(data).toHaveLength(3)
	});
})