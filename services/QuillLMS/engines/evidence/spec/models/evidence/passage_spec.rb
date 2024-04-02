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
require 'rails_helper'

module Evidence
  RSpec.describe(Passage, :type => :model) do

    context 'relations' do
      it { should belong_to(:activity) }
    end

    context 'should validations' do

      it { should validate_presence_of(:activity) }

      it { should validate_presence_of(:text) }

      it { should validate_length_of(:text).is_at_least(50) }
    end
  end
end
