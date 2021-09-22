# == Schema Information
#
# Table name: student_problem_reports
#
#  id                  :bigint           not null, primary key
#  report              :string           not null
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#  feedback_history_id :bigint
#
# Indexes
#
#  index_student_problem_reports_on_feedback_history_id  (feedback_history_id)
#
# Foreign Keys
#
#  fk_rails_...  (feedback_history_id => feedback_histories.id)
#
describe StudentProblemReport, type: :model do
  it { should belong_to(:feedback_history) }
end
