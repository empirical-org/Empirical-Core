# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_guidelines
#
#  id                         :bigint           not null, primary key
#  curriculum_assigned_status :string           not null
#  text                       :text             not null
#  created_at                 :datetime         not null
#  updated_at                 :datetime         not null
#  stem_vault_id              :integer          not null
#

require 'rails_helper'

module Evidence
  module Research
    module GenAI
      RSpec.describe Guideline, type: :model do
        let(:factory) { described_class.model_name.singular.to_sym }

        it { expect(build(factory)).to be_valid }

        it { should validate_presence_of(:curriculum_assigned_status) }
        it { should validate_presence_of(:stem_vault_id) }
        it { should validate_presence_of(:text) }
        it { should have_readonly_attribute(:curriculum_assigned_status) }
        it { should have_readonly_attribute(:stem_vault_id) }
        it { should have_readonly_attribute(:text) }

        it { should belong_to(:stem_vault) }

        it_behaves_like 'has_assigned_status'
      end
    end
  end
end
