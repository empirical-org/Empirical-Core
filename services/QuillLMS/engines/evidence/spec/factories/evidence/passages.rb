# frozen_string_literal: true

# == Schema Information
#
# Table name: comprehension_passages
#
#  id                       :integer          not null, primary key
#  activity_id              :integer
#  text                     :text
#  created_at               :datetime         not null
#  updated_at               :datetime         not null
#  image_link               :string
#  image_alt_text           :string           default("")
#  highlight_prompt         :string
#  image_caption            :text             default("")
#  image_attribution        :text             default("")
#  essential_knowledge_text :string           default("")
#
FactoryBot.define do
  factory :evidence_passage, class: 'Evidence::Passage' do
    association :activity, factory: :evidence_activity
    text { "The beginning of a wonderful passage. And more information goes here." }
  end
end
