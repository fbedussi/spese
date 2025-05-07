import { deleteSubcategory, setSubCategories, subCategories } from "~/data";
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
                onClick={() => inputRef?.value && setSubCategories({
                    ...subCategories(),
                    [props.category]: subCategories()[props.category].map((subcategory, index) => index === props.index ? inputRef.value : subcategory)
                })}
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