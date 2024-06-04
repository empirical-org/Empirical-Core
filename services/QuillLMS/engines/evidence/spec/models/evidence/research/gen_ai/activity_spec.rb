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
require 'rails_helper'

module Evidence
  module Research
    module GenAI
      RSpec.describe Activity, type: :model do
        it { should validate_presence_of(:name) }
        it { should validate_presence_of(:text) }
        it { should have_readonly_attribute(:name) }
        it { should have_readonly_attribute(:text) }
        it { should have_readonly_attribute(:because_evidence) }
        it { should have_readonly_attribute(:but_evidence) }
        it { should have_readonly_attribute(:so_evidence) }

        it { should have_many(:passage_prompts).class_name('Evidence::Research::GenAI::PassagePrompt').dependent(:destroy) }

        it { expect(build(:evidence_research_gen_ai_activity)).to be_valid }
      end
    end
  end
end
