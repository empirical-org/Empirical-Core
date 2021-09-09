class AddCoordinatorAndAuthorizerToSchool < ActiveRecord::Migration[4.2]
  def change
    add_column :schools, :authorizer_id, :integer, index: true
    add_column :schools, :coordinator_id, :integer, index: true
  end
end
