import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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
    getSubmitButton: () => screen.getByRole("button", { name: /submit/i }),
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
  it("should set autofocus on product name input when component is loaded", async () => {
    const product: Product = {
      id: 1,
      name: "Product 1",
      price: 100,
      categoryId: categoryMock.id,
    };
    const { getNameInput, waitForFormToLoad } = renderComponent(product);
    await waitForFormToLoad();
    expect(getNameInput()).toHaveFocus();
  });

  it("should display an error if name is missing", async () => {
    const {
      getPriceInput,
      getCategoryInput,
      getSubmitButton,
      waitForFormToLoad,
    } = renderComponent();
    // arrange
    await waitForFormToLoad();

    // act
    const user = userEvent.setup();
    await user.type(getPriceInput(), "10");
    await user.click(getCategoryInput());
    const options = screen.getAllByRole("option");
    await user.click(options[0]);
    await user.click(getSubmitButton());

    // assert
    const alert = await screen.findByRole("alert");
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent(/name is required/i);
  });
});
