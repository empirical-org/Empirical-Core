# frozen_string_literal: true

# == Schema Information
#
# Table name: student_responses
#
#  id                                  :bigint           not null, primary key
#  attempt_number                      :integer          not null
#  correct                             :boolean          not null
#  question_number                     :integer          not null
#  created_at                          :datetime         not null
#  activity_session_id                 :bigint           not null
#  question_id                         :bigint           not null
#  student_response_answer_text_id     :bigint           not null
#  student_response_directions_text_id :bigint           not null
#  student_response_prompt_text_id     :bigint           not null
#  student_response_question_type_id   :bigint           not null
#
# Indexes
#
#  index_student_responses_on_activity_session_id                  (activity_session_id)
#  index_student_responses_on_question_id                          (question_id)
#  index_student_responses_on_student_response_answer_text_id      (student_response_answer_text_id)
#  index_student_responses_on_student_response_directions_text_id  (student_response_directions_text_id)
#  index_student_responses_on_student_response_prompt_text_id      (student_response_prompt_text_id)
#  index_student_responses_on_student_response_question_type_id    (student_response_question_type_id)
#
# Foreign Keys
#
#  fk_rails_...  (activity_session_id => activity_sessions.id)
#  fk_rails_...  (student_response_answer_text_id => student_response_answer_texts.id)
#  fk_rails_...  (student_response_directions_text_id => student_response_directions_texts.id)
#  fk_rails_...  (student_response_prompt_text_id => student_response_prompt_texts.id)
#  fk_rails_...  (student_response_question_type_id => student_response_question_types.id)
#
require 'rails_helper'

RSpec.describe StudentResponseAnswerText, type: :model do
  before do
    create(:student_response)
  end

  context 'associations' do
    it { should belong_to(:activity_session) }
    it { should belong_to(:question) }
    it { should belong_to(:student_response_answer_text) }
    it { should belong_to(:student_response_directions_text) }
    it { should belong_to(:student_response_prompt_text) }
    it { should belong_to(:student_response_question_type) }

    it { should have_one(:student_resopnse_extra_metadata) }

    it { should have_many(:student_responses_concepts) }
    it { should have_many(:concepts).through(:student_responses_concepts) }
  end

  context 'validations' do
    it { should validate_presence_of(:attempt_number) }
    it { should validate_presence_of(:question_number) }
    it { should validate_inclusion_of(:correct).in([true, false]) }
  end
end
