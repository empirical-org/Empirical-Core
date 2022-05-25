# frozen_string_literal: true

# == Schema Information
#
# Table name: response_extra_metadata
#
#  id          :bigint           not null, primary key
#  metadata    :jsonb            not null
#  response_id :bigint           not null
#
# Indexes
#
#  index_response_extra_metadata_on_response_id  (response_id)
#
# Foreign Keys
#
#  fk_rails_...  (response_id => responses.id)
#
require 'rails_helper'

RSpec.describe ResponseExtraMetadata, type: :model do
  before do
    create(:response_extra_metadata)
  end

  context 'associations' do
    it { should belong_to(:response) }
  end

  context 'validations' do
    it { should validate_presence_of(:metadata) }
  end
end
