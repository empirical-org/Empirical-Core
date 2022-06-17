# frozen_string_literal: true

# == Schema Information
#
# Table name: response_previous_feedbacks
#
#  id         :integer          not null, primary key
#  text       :text             not null
#  created_at :datetime         not null
#
# Indexes
#
#  index_response_previous_feedbacks_on_text  (text) UNIQUE
#
require 'rails_helper'

RSpec.describe ResponsePreviousFeedback, type: :model do
  before do
    create(:response_previous_feedback)
  end

  context 'associations' do
    it { should have_many(:responses) }
  end

  context 'validations' do
    it { should validate_presence_of(:text) }
    it { should validate_uniqueness_of(:text) }
  end
end
