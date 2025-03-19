import { render, screen } from "@testing-library/react";
import ProductForm from "../../src/components/ProductForm";
import { Category, Product } from "../../src/entities";
import AllProviders from "../AllProviders";
import { db } from "../mocks/db";

const renderComponent = (product?: Product) => {
  render(<ProductForm onSubmit={vi.fn()} product={product} />, {
    wrapper: AllProviders,
  });
  return {
    waitForFormToLoad: () => screen.findByRole("form"),
    getNameInput: () => screen.getByPlaceholderText(/name/i),
    getPriceInput: () => screen.getByPlaceholderText(/price/i),
    getCategoryInput: () => screen.getByRole("combobox", { name: /category/i }),
  };
};

describe("ProductForm", () => {
  let categoryMock: Category;
  beforeAll(() => {
    categoryMock = db.category.create();
  });
  afterAll(() => {
    db.category.delete({ where: { id: { equals: categoryMock.id } } });
  });
  it("should render form fields", async () => {
    const { getNameInput, getPriceInput, getCategoryInput, waitForFormToLoad } =
      renderComponent();
    // await for form element to be rendered
    await waitForFormToLoad();
    expect(getNameInput()).toBeInTheDocument();
    expect(getPriceInput()).toBeInTheDocument();
    expect(getCategoryInput()).toBeInTheDocument();
  });
  it("should render product data when editing", async () => {
    const product: Product = {
      id: 1,
      name: "Product 1",
      price: 100,
      categoryId: categoryMock.id,
    };
    const { getNameInput, getPriceInput, getCategoryInput, waitForFormToLoad } =
      renderComponent(product);
    await waitForFormToLoad();
    expect(getNameInput()).toHaveValue(product.name);
    expect(getPriceInput()).toHaveValue(product.price.toString());
    expect(getCategoryInput()).toHaveTextContent(categoryMock.name);
  });
});
