class AddNotesToAutoMlModel < ActiveRecord::Migration
  def change
    add_column :comprehension_automl_models, :notes, :text, default: ''
  end
end
