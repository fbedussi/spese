import { subCategories } from '~/data';

export function SelectSubCategory(props: {
  selectedCategory: string;
  selectedSubCategory?: string;
}) {
  return (
    <label data-testid="select-subcategory">
      Sottocategoria
      <select name="subcategory">
        {subCategories()[props.selectedCategory]?.map((subcategory) => (
          <option
            value={subcategory}
            selected={subcategory === props.selectedSubCategory}
          >
            {subcategory}
          </option>
        ))}
      </select>
    </label>
  );
}
