# This migration comes from comprehension (originally 20210525194626)
class AddNotesToAutoMlModel < ActiveRecord::Migration
  def change
    add_column :comprehension_automl_models, :notes, :text, default: ''
  end
end
