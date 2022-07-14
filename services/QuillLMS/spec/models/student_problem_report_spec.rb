# frozen_string_literal: true

# == Schema Information
#
# Table name: student_problem_reports
#
#  id                  :bigint           not null, primary key
#  optimal             :boolean          default(FALSE), not null
#  report              :string           not null
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#  feedback_history_id :bigint           not null
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
  context 'validations' do
    it { should belong_to(:feedback_history) }
    it { should validate_presence_of(:feedback_history_id) }
    it { should validate_presence_of(:report) }
    it { should validate_presence_of(:optimal) }
  end
end
