import { categories } from "~/data";

export function SelectCategory(props: { selectedCategory?: string, onSelect: (value: string) => void }) {
    // preselect the first category on first render
    props.onSelect(categories()[0])

    return (
        <label data-testid="select-category">
            Categoria
            <select name="category" required onChange={ev => props.onSelect(ev.currentTarget.value)}>
                {categories().map(category => (
                    <option value={category} selected={category === props.selectedCategory}>{category}</option>
                ))}
            </select>
        </label>
    )
}