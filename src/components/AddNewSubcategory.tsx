import styles from './addNewSubcategory.module.css';

export function AddNewSubcategory(props: {
  showForm: boolean;
  setShowForm: () => void;
  addSubcategory: (subcategory: string) => void;
}) {
  let inputRef: HTMLInputElement | undefined;
  return (
    <form
      classList={{
        [styles.addNewSubcategory]: true,
        [styles.isOpen]: props.showForm,
      }}
    >
      <fieldset role="group">
        <input
          name="new-subcategory"
          type="text"
          ref={inputRef}
          data-testid="add-subcategory-input"
        />
        <input
          type="submit"
          value="+"
          data-testid="add-subcategory-btn"
          onClick={(ev) => {
            ev.preventDefault();
            if (props.showForm) {
              inputRef?.value && props.addSubcategory(inputRef.value);
            } else {
              props.setShowForm();
              inputRef?.focus();
            }
          }}
        />
      </fieldset>
    </form>
  );
}
