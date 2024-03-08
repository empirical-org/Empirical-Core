require 'rails_helper'

# == Schema Information
#
# Table name: evidence_prompt_response_feedbacks
#
#  id                 :bigint           not null, primary key
#  feedback           :text             not null
#  metadata           :jsonb
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  prompt_response_id :integer          not null
#

module Evidence
  RSpec.describe PromptResponseFeedback, type: :model do
    it { is_expected.to belong_to(:prompt_response) }

    it { is_expected.to validate_presence_of(:feedback) }
    it { is_expected.to validate_presence_of(:prompt_response) }
  end
end
