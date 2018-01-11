class AddConstraintToClassroomsTeachers < ActiveRecord::Migration
  def self.up
    execute "ALTER TABLE classrooms_teachers ADD CONSTRAINT check_role_is_valid CHECK (role IN ('owner', 'coteacher') AND role IS NOT null)"
    add_index :classrooms_teachers, [:user_id, :classroom_id], unique: true, name: 'unique_classroom_and_user_ids_on_classrooms_teachers'
  end

  def self.down
    execute "ALTER TABLE classrooms_teachers DROP CONSTRAINT check_role_is_valid"
    remove_index :classrooms_teachers, name: 'unique_classroom_and_user_ids_on_classrooms_teachers'
  end
end
