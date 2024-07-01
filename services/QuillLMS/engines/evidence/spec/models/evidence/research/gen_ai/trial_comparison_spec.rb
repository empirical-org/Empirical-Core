# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_comparison_trials
#
#  id            :bigint           not null, primary key
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  comparison_id :integer          not null
#  trial_id      :integer          not null
#

require 'rails_helper'

module Evidence
  module Research
    module GenAI
      RSpec.describe TrialComparison, type: :model do
        let(:factory) { described_class.model_name.singular.to_sym }

        it { expect(build(factory)).to be_valid }

        it { should validate_presence_of(:comparison_id) }
        it { should validate_presence_of(:trial_id) }
        it { should have_readonly_attribute(:comparison_id) }
        it { should have_readonly_attribute(:trial_id) }

        it { belong_to(:comparison) }
        it { belong_to(:trial) }
      end
    end
  end
end
