import { Title } from '@solidjs/meta';
import { addCategory, addSubcategory, categories, subCategories } from '~/data';

import { createSignal } from 'solid-js';
import { AddNewCategory } from '~/components/AddNewCategory';
import { AddNewSubcategory } from '~/components/AddNewSubcategory';
import { CategoryItem } from '~/components/CategoryItem';
import { SubcategoryItem } from '~/components/SubcategoryItem';
import styles from './categories.module.css';

export default function About() {
  const [addNewSubcategoryToCategory, setAddNewSubcategoryToCategory] =
    createSignal('');

  return (
    <main class={styles.main}>
      <Title>Categorie</Title>
      <h1>
        <a href="/" aria-label="back to home">
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <title>back to home</title>
            <path d="M17.77 3.77 16 2 6 12l10 10 1.77-1.77L9.54 12z" />
          </svg>
        </a>
        Categorie
      </h1>
      <ul>
        {categories().map((category, index) => (
          <li>
            <label class={styles.categoryItem}>
              <input type="radio" name="subcategory" />
              <CategoryItem category={category} index={index} />
            </label>

            <ul>
              {subCategories()[category]?.map((subcategory, index) => (
                <li>
                  <label class={styles.categoryItem}>
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
                </li>
              ))}
              <li>
                <AddNewSubcategory
                  showForm={addNewSubcategoryToCategory() === category}
                  setShowForm={() => setAddNewSubcategoryToCategory(category)}
                  addSubcategory={(newSubcategory) =>
                    addSubcategory(category, newSubcategory)
                  }
                />
              </li>
            </ul>
          </li>
        ))}
      </ul>
      <AddNewCategory addCategory={(newCategory) => addCategory(newCategory)} />
    </main>
  );
}
