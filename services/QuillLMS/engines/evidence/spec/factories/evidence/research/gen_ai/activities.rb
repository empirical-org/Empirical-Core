# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_activities
#
#  id               :bigint           not null, primary key
#  because_evidence :text             default(""), not null
#  but_evidence     :text             default(""), not null
#  name             :string           not null
#  so_evidence      :text             default(""), not null
#  text             :text             not null
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#

module Evidence
  module Research
    module GenAI
      FactoryBot.define do
        factory :evidence_research_gen_ai_activity, class: 'Evidence::Research::GenAI::Activity' do
          name { 'Activity 1' }
          text { 'This is the text' }
        end
      end
    end
  end
end
