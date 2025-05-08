import { deleteSubcategory, editSubcategory, setSubCategories, subCategories } from "~/data";
import { DeleteIcon } from "./DeleteIcon";
import { CheckIcon } from "./CheckIcon";

export function SubcategoryItem(props: { category: string, subcategory: string, index: number }) {
    let inputRef: HTMLInputElement | undefined

    return (
        <span data-testid={`subcategory-${props.subcategory}`}>
            <span>
                {props.subcategory}
            </span>
            <input type="text" value={props.subcategory} ref={inputRef} data-testid="subcategory-edit-input" />
            <button
                aria-label={`salva sottocategoria ${props.subcategory}`}
                onClick={() => inputRef?.value && editSubcategory({ category: props.category, updatedSubcategory: inputRef.value, index: props.index })}
            >
                <CheckIcon />
            </button>
            <button
                class="outline"
                aria-label={`cancella sottocategoria ${props.subcategory}`}
                onClick={() => deleteSubcategory(props)}
            >
                <DeleteIcon />
            </button>
        </span>
    )
}