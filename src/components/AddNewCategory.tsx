export function AddNewCategory(props: {
  addCategory: (category: string) => void;
}) {
  let inputRef: HTMLInputElement | undefined;
  return (
    <form>
      <fieldset role="group">
        <input
          name="new-category"
          type="text"
          ref={inputRef}
          data-testid="add-category-input"
          placeholder="nuova categoria"
        />
        <input
          type="submit"
          value="+"
          data-testid="add-category-btn"
          onClick={(ev) => {
            ev.preventDefault();
            if (inputRef?.value) {
              props.addCategory(inputRef.value);
              inputRef.value = '';
            }
          }}
        />
      </fieldset>
    </form>
  );
}
