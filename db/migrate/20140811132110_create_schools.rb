class CreateSchools < ActiveRecord::Migration
  def change
    create_table :schools do |t|
      t.string  :nces_id, :lea_id, :leanm, :name, :phone, :mail_street, :mail_city,
                :mail_state, :mail_zipcode, :street, :city, :state, :zipcode,
                :nces_type_code, :nces_status_code, :magnet, :charter,
                :ethnic_group
      t.decimal :longitude, :latitude, precision: 9, scale: 6
      t.integer :ulocal, :fte_classroom_teacher, :lower_grade, :upper_grade,
                :school_level, :free_lunches, :total_students
      t.timestamps
    end

    add_index :schools, :nces_id
    add_index :schools, :state
    add_index :schools, :zipcode
    add_index :schools, :name

    create_table :schools_users, id: false do |t|
      t.integer :school_id
      t.integer :user_id
    end

    add_index :schools_users, :school_id
    add_index :schools_users, :user_id
    add_index :schools_users, [:school_id, :user_id]
  end
end
