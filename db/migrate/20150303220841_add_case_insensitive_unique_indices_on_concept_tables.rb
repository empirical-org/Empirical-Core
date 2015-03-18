class AddCaseInsensitiveUniqueIndicesOnConceptTables < ActiveRecord::Migration
  def up
    remove_index :concept_tags, :name
    execute "CREATE UNIQUE INDEX index_concept_tags_on_lowercase_name
             ON concept_tags USING btree (lower(name));"
    remove_index :concept_categories, :name
    execute "CREATE UNIQUE INDEX index_concept_categories_on_lowercase_name
             ON concept_categories USING btree (lower(name));"
    # remove_index :concept_classes, :name
    execute "CREATE UNIQUE INDEX index_concept_classes_on_lowercase_name
             ON concept_classes USING btree (lower(name));"
  end

  def down
    execute "DROP INDEX index_concept_tags_on_lowercase_name;"
    add_index :concept_tags, :name

    execute "DROP INDEX index_concept_categories_on_lowercase_name;"
    add_index :concept_categories, :name

    execute "DROP INDEX index_concept_classes_on_lowercase_name;"
    # add_index :concept_classes, :name

  end
end
