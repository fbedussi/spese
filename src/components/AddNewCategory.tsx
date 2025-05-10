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
        />
        <input
          type="submit"
          value="+"
          data-testid="add-category-btn"
          onClick={(ev) => {
            ev.preventDefault();
            inputRef?.value && props.addCategory(inputRef.value);
          }}
        />
      </fieldset>
    </form>
  );
}
