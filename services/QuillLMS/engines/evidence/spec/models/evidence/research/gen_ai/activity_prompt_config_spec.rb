# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_activity_prompt_configs
#
#  id                :bigint           not null, primary key
#  conjunction       :string           not null
#  optimal_rules     :text             not null
#  stem              :text             not null
#  sub_optimal_rules :text             not null
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  activity_id       :integer          not null
#
require 'rails_helper'

module Evidence
  module Research
    module GenAI
      RSpec.describe ActivityPromptConfig, type: :model do
        let(:factory) { described_class.model_name.singular.to_sym }

        it { expect(build(factory)).to be_valid }

        it { should validate_presence_of(:stem) }
        it { should validate_presence_of(:conjunction) }
        it { should validate_presence_of(:optimal_rules) }
        it { should validate_presence_of(:sub_optimal_rules) }
        it { should validate_presence_of(:activity_id) }
        it { should validate_inclusion_of(:conjunction).in_array(described_class::CONJUNCTIONS)}
        it { should have_readonly_attribute(:stem) }
        it { should have_readonly_attribute(:conjunction) }
        it { should have_readonly_attribute(:optimal_rules) }
        it { should have_readonly_attribute(:sub_optimal_rules) }
        it { should have_readonly_attribute(:activity_id) }

        it { belong_to(:activity).class_name('Evidence::Research::GenAI::Activity') }

        it { have_many(:student_responses).dependent(:destroy) }
        it { have_many(:quill_feedbacks).through(:student_responses) }
        it { have_many(:llm_feedbacks).through(:student_responses) }
        it { have_many(:trials).dependent(:destroy) }
      end
    end
  end
end
