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
class StudentResponseExtraMetadata < ApplicationRecord
  belongs_to :student_response

  validates :metadata, presence: true
end
