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
  const nameInput = () => screen.getByPlaceholderText(/name/i);
  const priceInput = () => screen.getByPlaceholderText(/price/i);
  const categoryInput = () =>
    screen.getByRole("combobox", { name: /category/i });
  const submitButton = () => screen.getByRole("button", { name: /submit/i });

  // new type to represent form data
  type FormData = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [K in keyof Product]: any;
  };
  // object to hold valid data
  const validData: FormData = {
    id: 1,
    name: "a",
    price: 1,
    categoryId: 1,
  };
  const fill = async (product: FormData) => {
    const user = userEvent.setup();
    if (product.name !== undefined) await user.type(nameInput(), product.name);
    if (product.price !== undefined)
      await user.type(priceInput(), product.price.toString());

    await user.click(categoryInput());
    const options = screen.getAllByRole("option");
    await user.click(options[0]);
    await user.click(submitButton());
  };

  return {
    waitForFormToLoad: async () => {
      await screen.findByRole("form");
      return {
        nameInput,
        priceInput,
        categoryInput,
        submitButton,
        fill,
        validData,
      };
    },
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

  it.each([
    {
      scenario: "missing",
      errorMessage: /required/i,
    },
    {
      scenario: "longer than 255 characters",
      name: "a".repeat(256),
      errorMessage: /255/i,
    },
  ])(
    "should display an error if name is $scenario",
    async ({ name, errorMessage }) => {
      const {
        getPriceInput,
        getNameInput,
        getCategoryInput,
        getSubmitButton,
        waitForFormToLoad,
      } = renderComponent();
      // arrange
      await waitForFormToLoad();

      // act
      const user = userEvent.setup();
      await user.type(getPriceInput(), "10");
      if (name !== undefined) await user.type(getNameInput(), name);
      await user.click(getCategoryInput());
      const options = screen.getAllByRole("option");
      await user.click(options[0]);
      await user.click(getSubmitButton());

      // assert
      const alert = await screen.findByRole("alert");
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveTextContent(errorMessage);
    }
  );
  it.each([
    {
      scenario: "missing",
      errorMessage: /required/i,
    },
    {
      scenario: "0",
      price: 0,
      errorMessage: /1/,
    },
    {
      scenario: "negative",
      price: -1,
      errorMessage: /1/,
    },
    {
      scenario: "greater than 1000",
      price: 1001,
      errorMessage: /1000/,
    },
    {
      scenario: "not a number",
      price: "a",
      errorMessage: /required/,
    },
  ])(
    "should display an error if price is $scenario",
    async ({ price, errorMessage }) => {
      const {
        getPriceInput,
        getNameInput,
        getCategoryInput,
        getSubmitButton,
        waitForFormToLoad,
      } = renderComponent();
      await waitForFormToLoad();

      const user = userEvent.setup();
      await user.type(getNameInput(), "a");
      if (price !== undefined)
        await user.type(getPriceInput(), price.toString());
      await user.click(getCategoryInput());
      const options = screen.getAllByRole("option");
      await user.click(options[0]);
      await user.click(getSubmitButton());

      const alert = await screen.findByRole("alert");
      expect(alert).toHaveTextContent(errorMessage);
    }
  );
});
