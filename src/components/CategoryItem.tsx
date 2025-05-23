import { deleteCategory, editCategory } from '~/data';
import { DeleteIcon } from './DeleteIcon';
import { CheckIcon } from './CheckIcon';

export function CategoryItem(props: {
  category: string;
  index: number;
}) {
  let inputRef: HTMLInputElement | undefined;

  return (
    <span data-testid={`category-${props.category}`}>
      <span>{props.category}</span>
      <input
        type="text"
        value={props.category}
        ref={inputRef}
        data-testid="category-edit-input"
      />
      <button
        type="button"
        aria-label={`salva categoria ${props.category}`}
        onClick={() =>
          inputRef?.value &&
          editCategory({
            category: inputRef.value,
            index: props.index,
          })
        }
      >
        <CheckIcon />
      </button>
      <button
        type="button"
        class="outline"
        aria-label={`cancella categoria ${props.category}`}
        onClick={() => deleteCategory(props)}
      >
        <DeleteIcon />
      </button>
    </span>
  );
}
