class AddCoordinatorAndAuthorizerToSchool < ActiveRecord::Migration
  def change
    add_column :schools, :authorizer_id, :integer, index: true
    add_column :schools, :coordinator_id, :integer, index: true
  end
end
