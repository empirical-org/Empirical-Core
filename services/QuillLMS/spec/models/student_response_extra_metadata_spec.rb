# frozen_string_literal: true

# == Schema Information
#
# Table name: student_response_extra_metadata
#
#  id                  :bigint           not null, primary key
#  metadata            :jsonb            not null
#  student_response_id :bigint           not null
#
# Indexes
#
#  index_student_response_extra_metadata_on_student_response_id  (student_response_id)
#
# Foreign Keys
#
#  fk_rails_...  (student_response_id => student_responses.id)
#
require 'rails_helper'

RSpec.describe StudentResponseExtraMetadata, type: :model do
  before do
    create(:student_response_extra_metadata)
  end

  context 'associations' do
    it { should belong_to(:student_response) }
  end

  context 'validations' do
    it { should validate_presence_of(:metadata) }
  end
end
