import { Title } from "@solidjs/meta";
import { DeleteIcon } from "~/components/DeleteIcon";
import { categories, deleteSubcategory, setSubCategories, subCategories } from "~/data";

import styles from './categories.module.css'
import { createSignal, Show } from "solid-js";
import { PlusIcon } from "~/components/PlusIcon";
import { AddNewSubcategory } from "~/components/AddNewSubcategory";

export default function About() {
  const [addNewSubcategoryToCategory, setAddNewSubcategoryToCategory] = createSignal('')

  return (
    <main style="padding: 1rem;">
      <Title>Categorie</Title>
      <h1><a href="/" aria-label="home" >
        <svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-1phnduy" aria-hidden="true" viewBox="0 0 24 24"><path d="M17.77 3.77 16 2 6 12l10 10 1.77-1.77L9.54 12z"></path></svg>
      </a>Categorie</h1>
      <table>
        <thead>
          <tr>
            <td>Categorie</td>
            <td>Sottocategorie</td>
          </tr>
        </thead>
        <tbody>
          {categories().map(category => (
            <tr>
              <td>{category}</td>
              <td>

                {subCategories()[category].map(subcategory => (
                  <label class={styles.subcategory}>
                    <input type="radio" name="subcategory" onClick={() => setAddNewSubcategoryToCategory('')} />
                    <span>
                      <span>
                        {subcategory}
                      </span>
                      <input type="text" value={subcategory} />
                      <button
                        aria-label={`salva sottocategoria ${subcategory}`}
                        onClick={() => deleteSubcategory({ category, subcategory })}
                      >
                        <DeleteIcon />
                      </button>
                      <button
                        class="outline"
                        aria-label={`cancella sottocategoria ${subcategory}`}
                        onClick={() => deleteSubcategory({ category, subcategory })}
                      >
                        <DeleteIcon />
                      </button>
                    </span>
                  </label>
                ))}

                <AddNewSubcategory
                  showForm={addNewSubcategoryToCategory() === category}
                  setShowForm={() => setAddNewSubcategoryToCategory(category)}
                  addSubcategory={(newSubcategory) => {
                    setSubCategories({
                      ...subCategories(),
                      [category]: subCategories()[category].concat(newSubcategory)
                    })
                  }}
                />
              </td>
            </tr>
          ))}

        </tbody>

      </table>
    </main>
  );
}
