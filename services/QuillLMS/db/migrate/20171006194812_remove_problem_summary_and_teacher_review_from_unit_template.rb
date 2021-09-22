class RemoveProblemSummaryAndTeacherReviewFromUnitTemplate < ActiveRecord::Migration[4.2]
  def change
    remove_column :unit_templates, :problem, :string
    remove_column :unit_templates, :summary, :string
    remove_column :unit_templates, :teacher_review, :string
  end
end
