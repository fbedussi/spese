import { Title } from '@solidjs/meta';
import {
  addCategory,
  addSubcategory,
  categories,
  setSubCategories,
  subCategories,
} from '~/data';

import styles from './categories.module.css';
import { createSignal } from 'solid-js';
import { AddNewSubcategory } from '~/components/AddNewSubcategory';
import { SubcategoryItem } from '~/components/SubcategoryItem';
import { AddNewCategory } from '~/components/AddNewCategory';

export default function About() {
  const [addNewSubcategoryToCategory, setAddNewSubcategoryToCategory] =
    createSignal('');

  return (
    <main class={styles.main}>
      <Title>Categorie</Title>
      <h1>
        <a href="/" aria-label="back to home">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
          >
            <title>back to home</title>
            <path d="M17.77 3.77 16 2 6 12l10 10 1.77-1.77L9.54 12z" />
          </svg>
        </a>
        Categorie
      </h1>
      <table>
        <thead>
          <tr>
            <td>Categorie</td>
            <td>Sottocategorie</td>
          </tr>
        </thead>
        <tbody>
          {categories().map((category) => (
            <tr>
              <td>{category}</td>
              <td>
                {subCategories()[category]?.map((subcategory, index) => (
                  <label class={styles.subcategory}>
                    <input
                      type="radio"
                      name="subcategory"
                      onClick={() => setAddNewSubcategoryToCategory('')}
                    />
                    <SubcategoryItem
                      category={category}
                      subcategory={subcategory}
                      index={index}
                    />
                  </label>
                ))}

                <AddNewSubcategory
                  showForm={addNewSubcategoryToCategory() === category}
                  setShowForm={() => setAddNewSubcategoryToCategory(category)}
                  addSubcategory={(newSubcategory) =>
                    addSubcategory(category, newSubcategory)
                  }
                />
              </td>
            </tr>
          ))}
          <tr>
            <td colSpan={2}>
              <AddNewCategory
                addCategory={(newCategory) => addCategory(newCategory)}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </main>
  );
}
