import { render, screen, waitForElementToBeRemoved } from '@testing-library/react'
import BrowseProducts from '../../src/pages/BrowseProductsPage';
import { http, delay, HttpResponse } from 'msw';
import { server } from '../mocks/server';
import { Theme } from '@radix-ui/themes';
import { Category } from "../../src/entities";
import { db } from "../mocks/db";

const renderComponent = () => {
  render(
    <Theme>
      <BrowseProducts />
    </Theme>
  );
};

describe("BrowseProductsPage", () => {
  const categories: Category[] = [];
  beforeAll(() => {
    [1, 2].forEach(() => {
      categories.push(db.category.create());
    });
  });

  afterAll(() => {
    const categoryIds = categories.map((cat) => cat.id);
    db.category.deleteMany({ where: { id: { in: categoryIds } } });
  });

  it("should render a loading skeleton when fetching categories", () => {
    // overwrite request to create a delay
    server.use(
      http.get("/categories", async () => {
        await delay();
        return HttpResponse.json([]);
      })
    );
    renderComponent();
    expect(
      screen.getByRole("progressbar", { name: /categories/i })
    ).toBeInTheDocument();
  });

  it("should hide the loading skeleton after categories are fetched", async () => {
    renderComponent();
    await waitForElementToBeRemoved(() =>
      screen.queryByRole("progressbar", { name: /categories/i })
    );
  });

  it("should render a loading skeleton when fetching products", () => {
    // overwrite request to create a delay
    server.use(
      http.get("/products", async () => {
        await delay();
        return HttpResponse.json([]);
      })
    );
    renderComponent();
    expect(
      screen.getByRole("progressbar", { name: /products/i })
    ).toBeInTheDocument();
  });

  it("should hide the loading skeleton after products are fetched", async () => {
    renderComponent();
    await waitForElementToBeRemoved(() =>
      screen.queryByRole("progressbar", { name: /products/i })
    );
  });

  it("should not render an error if categories cannot be fetched", async () => {
    server.use(http.get("/categories", () => HttpResponse.error()));
    renderComponent();
    await waitForElementToBeRemoved(() =>
      screen.getByRole("progressbar", { name: /categories/i })
    );
    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
    expect(
      screen.queryByRole("combobox", { name: /category/i })
    ).not.toBeInTheDocument();
  });

  it("should render an error if products cannot be fetched", async () => {
    server.use(http.get("/products", () => HttpResponse.error()));
    renderComponent();
    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });

  it("should render categories", async () => {
    renderComponent();

    const combobox = await screen.findByRole("combobox");
    expect(combobox).toBeInTheDocument();
  });
});