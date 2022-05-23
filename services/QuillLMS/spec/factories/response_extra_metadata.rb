# frozen_string_literal: true

# == Schema Information
#
# Table name: response_extra_metadata
#
#  id                  :bigint           not null, primary key
#  metadata            :jsonb            not null
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
FactoryBot.define do
  factory :response_extra_metadata, class: 'ResponseExtraMetadata' do
    sequence(:metadata) { {foo: 'bar'} }
    response
  end
end
