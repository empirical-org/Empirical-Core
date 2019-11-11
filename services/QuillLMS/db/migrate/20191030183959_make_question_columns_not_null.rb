class MakeQuestionColumnsNotNull < ActiveRecord::Migration
  def change
    change_column_null :questions, :uid, false
    change_column_null :questions, :data, false, {}
  end
end
