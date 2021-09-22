class CreateZipcodeInfos < ActiveRecord::Migration[4.2]
  def change
    create_table :zipcode_infos do |t|
      t.text :zipcode, index: { unique: true }
      t.text :zipcode_type
      t.text :city
      t.text :state
      t.text :timezone
      t.float :lat
      t.float :lng
      t.text :_secondary_cities
      t.text :county
      t.boolean :decommissioned
      t.integer :estimated_population
      t.text :_area_codes

      #t.timestamps null: false
    end
    Rake::Task['zipcode:populate'].invoke
  end
end
