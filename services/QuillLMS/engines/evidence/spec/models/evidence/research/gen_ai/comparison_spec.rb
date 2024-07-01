# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_comparisons
#
#  id         :bigint           not null, primary key
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  dataset_id :integer          not null
#

require 'rails_helper'

module Evidence
  module Research
    module GenAI
      RSpec.describe Comparison, type: :model do
        let(:factory) { described_class.model_name.singular.to_sym }

        it { expect(build(factory)).to be_valid }

        it { have_many(:comparison_trials) }
        it { have_many(:trials).through(:comparison_trials) }
      end
    end
  end
end
