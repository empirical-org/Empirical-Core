# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_guidelines
#
#  id            :bigint           not null, primary key
#  category      :string           not null
#  text          :text             not null
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  stem_vault_id :integer          not null
#

require 'rails_helper'

module Evidence
  module Research
    module GenAI
      RSpec.describe Guideline, type: :model do
        let(:factory) { described_class.model_name.singular.to_sym }

        it { expect(build(factory)).to be_valid }

        it { should validate_presence_of(:category) }
        it { should validate_presence_of(:stem_vault_id) }
        it { should validate_presence_of(:text) }
        it { should have_readonly_attribute(:category) }
        it { should have_readonly_attribute(:stem_vault_id) }
        it { should have_readonly_attribute(:text) }

        it { should belong_to(:stem_vault).class_name('Evidence::Research::GenAI::StemVault') }
      end
    end
  end
end
