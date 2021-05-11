require 'rails_helper'

RSpec.describe FeedbackHistoryFlag, type: :model do
  context 'associations' do
    it { should belong_to(:feedback_history) }
  end

  context 'validations' do
    it { should validate_presence_of(:flag) }
    it { should validate_inclusion_of(:flag).in_array(FeedbackHistoryFlag::FLAG_TYPES) }
  end
end
