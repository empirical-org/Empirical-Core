class MakeQuestionColumnsNotNull < ActiveRecord::Migration[4.2]
  def change
    change_column_null :questions, :uid, false
    change_column_null :questions, :data, false, {}
  end
end
