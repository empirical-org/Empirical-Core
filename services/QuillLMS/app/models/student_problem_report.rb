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
class StudentProblemReport < ApplicationRecord
  belongs_to :feedback_history

  validates_presence_of :feedback_history_id
  validates_presence_of :report
  validates_presence_of :optimal
end
