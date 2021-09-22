class AddRawScoreToActivity < ActiveRecord::Migration[4.2]
  def change
    add_reference :activities, :raw_score, foreign_key: true
  end
end
