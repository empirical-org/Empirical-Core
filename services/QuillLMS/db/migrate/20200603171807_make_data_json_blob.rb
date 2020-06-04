class MakeDataJsonBlob < ActiveRecord::Migration
  def change
    change_column :activities, :data, 'jsonb USING CAST(field_name AS jsonb)'
  end
end
