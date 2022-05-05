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
FactoryBot.define do
  factory :student_response_extra_metadata, class: 'StudentResponseExtraMetadata' do
    sequence(:metadata) { {foo: 'bar'} }
    student_response
  end
end
