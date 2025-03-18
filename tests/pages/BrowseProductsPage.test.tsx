import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Category, Product } from "../../src/entities";
import BrowseProducts from "../../src/pages/BrowseProductsPage";
import { db, getProductsByCategory } from "../mocks/db";
import { simulateDelay, simulateError } from "../utilities";
import AllProviders from "../AllProviders";

describe("BrowseProductsPage", () => {
  // mock preparation
  const categories: Category[] = [];
  const products: Product[] = [];

  beforeAll(() => {
    [1, 2].forEach((item) => {
      const category = db.category.create({ name: "Category " + item });
      categories.push(category);
      // create 2 product for each category
      [1, 2].forEach(() => {
        products.push(db.product.create({ categoryId: category.id }));
      });
    });
  });

  // mock clean up
  afterAll(() => {
    const categoryIds = categories.map((cat) => cat.id);
    db.category.deleteMany({ where: { id: { in: categoryIds } } });

    const productIds = products.map((p) => p.id);
    db.product.deleteMany({ where: { id: { in: productIds } } });
  });

  it("should render a loading skeleton when fetching categories", () => {
    // overwrite request to create a delay
    simulateDelay("/categories");
    renderComponent();
    expect(
      screen.getByRole("progressbar", { name: /categories/i })
    ).toBeInTheDocument();
  });

  it("should hide the loading skeleton after categories are fetched", async () => {
    const { getCategoriesSkeleton } = renderComponent();
    await waitForElementToBeRemoved(getCategoriesSkeleton);
  });

  it("should render a loading skeleton when fetching products", () => {
    // overwrite request to create a delay
    simulateDelay("/products");
    renderComponent();
    expect(
      screen.getByRole("progressbar", { name: /products/i })
    ).toBeInTheDocument();
  });

  it("should hide the loading skeleton after products are fetched", async () => {
    const { getProductsSkeleton } = renderComponent();
    await waitForElementToBeRemoved(getProductsSkeleton);
  });

  it("should not render an error if categories cannot be fetched", async () => {
    simulateError("/categories");
    const { getCategoriesSkeleton, getCategoriesCombobox } = renderComponent();
    await waitForElementToBeRemoved(getCategoriesSkeleton);
    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
    expect(getCategoriesCombobox()).not.toBeInTheDocument();
  });

  it("should render an error if products cannot be fetched", async () => {
    simulateError("/products");
    renderComponent();
    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });

  it("should render categories", async () => {
    const user = userEvent.setup();
    const { getCategoriesSkeleton, getCategoriesCombobox } = renderComponent();
    await waitForElementToBeRemoved(getCategoriesSkeleton);

    const combobox = await getCategoriesCombobox();
    expect(combobox).toBeInTheDocument();

    await user.click(combobox!);

    expect(screen.getByRole("option", { name: /all/i })).toBeInTheDocument();
    categories.forEach((category) => {
      expect(
        screen.getByRole("option", { name: category.name })
      ).toBeInTheDocument();
    });
  });

  it("should render products", async () => {
    const { getProductsSkeleton } = renderComponent();

    await waitForElementToBeRemoved(getProductsSkeleton);

    products.forEach((product) => {
      expect(screen.getByText(product.name)).toBeInTheDocument();
    });
  });

  it("should filter products by category", async () => {
    const { selectCategory, expectProductsToBeInTheDocument } =
      renderComponent();

    // select a category from combobox
    const selectedCategory = categories[0];
    await selectCategory(selectedCategory.name);

    const products = getProductsByCategory(selectedCategory.id);
    expectProductsToBeInTheDocument(products);
  });

  it("should render all products if All category is selected", async () => {
    const { selectCategory, expectProductsToBeInTheDocument } =
      renderComponent();

    await selectCategory(/all/i);

    const products = db.product.getAll();
    expectProductsToBeInTheDocument(products);
  });
});

const renderComponent = () => {
  render(<BrowseProducts />, { wrapper: AllProviders });

  const getProductsSkeleton = () =>
    screen.queryByRole("progressbar", {
      name: /products/i,
    });

  const getCategoriesSkeleton = () =>
    screen.queryByRole("progressbar", { name: /categories/i });

  const getCategoriesCombobox = () => screen.queryByRole("combobox");

  const selectCategory = async (name: RegExp | string) => {
    const user = userEvent.setup();

    await waitForElementToBeRemoved(getCategoriesSkeleton);
    const combobox = getCategoriesCombobox();
    await user.click(combobox!);

    // select a category from combobox
    const option = screen.getByRole("option", { name });
    await user.click(option);
  };

  const expectProductsToBeInTheDocument = (products: Product[]) => {
    // assert number of rows equal number of product in selected category
    const rows = screen.getAllByRole("row");
    // remove heading row in table
    const productRows = rows.slice(1);
    expect(productRows).toHaveLength(products.length);

    // check products are shown in page
    products.forEach((product) => {
      expect(screen.getByText(product.name)).toBeInTheDocument();
    });
  };

  return {
    getProductsSkeleton,
    getCategoriesSkeleton,
    getCategoriesCombobox,
    selectCategory,
    expectProductsToBeInTheDocument,
  };
};
