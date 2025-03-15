import { factory, manyOf, oneOf, primaryKey } from '@mswjs/data'
import { faker } from '@faker-js/faker'

export const db = factory({
	product: {
		id: primaryKey(faker.number.int),
		name: faker.commerce.productName,
		price: () => faker.number.int({ min: 1, max: 100}),
		categoryId: faker.number.int,
		// set db relation, product belongs to
		category: oneOf('category')
	},
	category: {
		id: primaryKey(faker.number.int),
		name: faker.commerce.department,
		// category has many
		products: manyOf('product')
	}
})
