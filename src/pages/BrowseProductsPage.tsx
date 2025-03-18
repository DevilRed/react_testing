import { Select, Table } from "@radix-ui/themes";
import axios from "axios";
import { useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useQuery } from "react-query";
import QuantitySelector from "../components/QuantitySelector";
import { Category, Product } from "../entities";

function BrowseProducts() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<
    number | undefined
  >();

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: () => axios.get<Category[]>("/categories").then((res) => res.data),
    enabled: false,
  });

  const productsQuery = useQuery<Product[], Error>({
    queryKey: ["products"],
    queryFn: () => axios.get<Product[]>("/products").then((res) => res.data),
    enabled: false,
  });

  if (productsQuery.error)
    return <div>Error: {productsQuery.error.message}</div>;

  const renderCategories = () => {
    const { isLoading, error, data: categories } = categoriesQuery;
    if (isLoading)
      return (
        <div role="progressbar" aria-label="loading categories">
          <Skeleton />
        </div>
      );
    if (error) return null;

    return (
      <Select.Root
        onValueChange={(categoryId) =>
          setSelectedCategoryId(parseInt(categoryId))
        }
      >
        <Select.Trigger placeholder="Filter by Category" />
        <Select.Content>
          <Select.Group>
            <Select.Label>Category</Select.Label>
            <Select.Item value="all">All</Select.Item>
            {categories?.map((category) => (
              <Select.Item key={category.id} value={category.id.toString()}>
                {category.name}
              </Select.Item>
            ))}
          </Select.Group>
        </Select.Content>
      </Select.Root>
    );
  };

  const renderProducts = () => {
    const skeletons = [1, 2, 3, 4, 5];
    const { error, data: products, isLoading } = productsQuery;

    if (error) return <div>Error: {error.message}</div>;

    const visibleProducts = selectedCategoryId
      ? products!.filter((p) => p.categoryId === selectedCategoryId)
      : products;

    return (
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Price</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body
          role={isLoading ? "progressbar" : undefined}
          aria-label={isLoading ? "loading products" : undefined}
        >
          {isLoading &&
            skeletons.map((skeleton) => (
              <Table.Row key={skeleton}>
                <Table.Cell>
                  <Skeleton />
                </Table.Cell>
                <Table.Cell>
                  <Skeleton />
                </Table.Cell>
                <Table.Cell>
                  <Skeleton />
                </Table.Cell>
              </Table.Row>
            ))}
          {!isLoading &&
            visibleProducts!.map((product) => (
              <Table.Row key={product.id}>
                <Table.Cell>{product.name}</Table.Cell>
                <Table.Cell>${product.price}</Table.Cell>
                <Table.Cell>
                  <QuantitySelector product={product} />
                </Table.Cell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table.Root>
    );
  };

  return (
    <div>
      <h1>Products</h1>
      <div className="max-w-xs">{renderCategories()}</div>
      {renderProducts()}
    </div>
  );
}

export default BrowseProducts;
