class MakeDataJsonBlob < ActiveRecord::Migration
  def change
    change_column :activities, :data, 'jsonb USING CAST(data AS jsonb)'
  end
end
