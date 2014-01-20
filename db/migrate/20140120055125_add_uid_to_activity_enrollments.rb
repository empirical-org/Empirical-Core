class AddUidToActivityEnrollments < ActiveRecord::Migration
  def change
    add_column :activity_enrollments, :uid, :string
  end
end
