import { QueryHookOptions, useQuery } from "@apollo/client";
import { CATEGORY, CategoryQuery } from "../apollo/query/category";
import { CategoryTree, Maybe } from "@/generated/types";

function useCategory(
  options?: QueryHookOptions<
    CategoryQuery["Response"],
    CategoryQuery["Variables"]
  >
) {
  const category = useQuery<
    CategoryQuery["Response"],
    CategoryQuery["Variables"]
  >(CATEGORY, options);

  function flattenCategoryTree(categories: Maybe<CategoryTree>[] | undefined): CategoryTree[] {
    const result: CategoryTree[] = [];
  
    function recurse(items: Maybe<CategoryTree>[]) {
      if (!Array.isArray(items)) return; // Ensure items is an array
  
      for (const item of items) {
        if (item) { // Ensure item is not null or undefined
          result.push(item); // Add the current item
          if (Array.isArray(item.children) && item.children.length > 0) {
            recurse(item.children); // Recursively process children
          }
        }
      }
    }
  
    if (Array.isArray(categories)) {
      recurse(categories.filter(Boolean)); // Filter out null or undefined items
    }
  
    return result;
  }
  
  

  function isCategoryInPath(item: CategoryTree, catId: string | null): boolean {
    if (item.id === catId) return true;
    return (
      item.children?.some((child) =>
        isCategoryInPath(child as CategoryTree, catId)
      ) ?? false
    );
  }

  function getCategoryPath(tree: CategoryTree[], targetId: string): string[] {
    for (const node of tree) {
      if (node.id?.toString() === targetId) {
        return [node.id.toString()];
      }
      if (node.children && node.children.length > 0) {
        const path = getCategoryPath(node.children as CategoryTree[], targetId);
        if (path.length > 0 && node.id) {
          return [node.id.toString(), ...path];
        }
      }
    }
    return [];
  }

  function getAccordionState(categories: CategoryTree[]): Record<string, boolean> {
    const menuState: Record<string, boolean> = {};
  
    function traverse(categories: CategoryTree[]) {
      categories.forEach((category) => {
        if (category.id && category.children && category.children.length) {
          menuState[category.id] = false; // Add the menu_id with a default value of false
        }
  
        if (category.children && category.children.length > 0) {
          traverse(category.children as CategoryTree[]); // Recursively traverse the children
        }
      });
    }
  
    traverse(categories);
    return menuState;
  }

  return {
    category,
    flattenCategoryTree,
    isCategoryInPath,
    getCategoryPath,
    getAccordionState
  };
}

export default useCategory;
