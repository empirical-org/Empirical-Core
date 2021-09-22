# == Schema Information
#
# Table name: activity_survey_responses
#
#  id                         :bigint           not null, primary key
#  emoji_selection            :integer          not null
#  multiple_choice_selections :string           not null, is an Array
#  survey_question            :string           not null
#  created_at                 :datetime         not null
#  updated_at                 :datetime         not null
#  activity_session_id        :bigint
#
# Indexes
#
#  index_activity_survey_responses_on_activity_session_id  (activity_session_id)
#
# Foreign Keys
#
#  fk_rails_...  (activity_session_id => activity_sessions.id)
#
class ActivitySurveyResponse < ApplicationRecord
  belongs_to :activity_session
end
