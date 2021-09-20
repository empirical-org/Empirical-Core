class AddNotesToAutoMlModel < ActiveRecord::Migration[4.2]
  def change
    add_column :comprehension_automl_models, :notes, :text, default: ''
  end
end
