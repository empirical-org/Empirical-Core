class MakeDataJsonBlob < ActiveRecord::Migration[4.2]
  def change
    change_column :activities, :data, 'jsonb USING CAST(data AS jsonb)'
  end
end
