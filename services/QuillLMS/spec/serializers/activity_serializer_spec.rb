# frozen_string_literal: true

# == Schema Information
#
# Table name: activities
#
#  id                         :integer          not null, primary key
#  data                       :jsonb
#  description                :text
#  flags                      :string(255)      default([]), not null, is an Array
#  name                       :string(255)
#  repeatable                 :boolean          default(TRUE)
#  supporting_info            :string
#  uid                        :string(255)      not null
#  created_at                 :datetime
#  updated_at                 :datetime
#  activity_classification_id :integer
#  follow_up_activity_id      :integer
#  raw_score_id               :integer
#  standard_id                :integer
#  topic_id                   :integer
#
# Indexes
#
#  index_activities_on_activity_classification_id  (activity_classification_id)
#  index_activities_on_raw_score_id                (raw_score_id)
#  index_activities_on_topic_id                    (topic_id)
#  index_activities_on_uid                         (uid) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (raw_score_id => raw_scores.id)
#  fk_rails_...  (standard_id => standards.id)
#
require 'rails_helper'

describe ActivitySerializer, type: :serializer do
  it_behaves_like 'serializer' do
    let(:record_instance) { create(:activity) }

    let(:expected_serialized_keys) do
      %w(anonymous_path
         classification
         created_at
         data
         description
         flags
         id
         name
         readability_grade_level
         standard
         uid
         updated_at
         activity_category
         supporting_info)
    end
  end
end
