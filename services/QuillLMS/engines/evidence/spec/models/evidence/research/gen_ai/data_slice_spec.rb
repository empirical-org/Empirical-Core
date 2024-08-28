# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_data_slices
#
#  id                :bigint           not null, primary key
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  child_dataset_id  :integer          not null
#  parent_dataset_id :integer          not null
#

require 'rails_helper'

module Evidence
  module Research
    module GenAI
      RSpec.describe DataSlice, type: :model do
        let(:factory) { described_class.model_name.singular.to_sym }

        it { expect(build(factory)).to be_valid }

        it { belong_to(:parent_dataset).class_name('Evidence::Research::GenAI::Dataset') }
        it { belong_to(:child_dataset).class_name('Evidence::Research::GenAI::Dataset') }

        it { should validate_presence_of(:parent_dataset) }
        it { should validate_presence_of(:child_dataset) }

        it { have_readonly_attribute(:parent_dataset_id) }
        it { have_readonly_attribute(:child_dataset_id) }

        describe 'relationships' do
          let(:parent_dataset) { create(:evidence_research_gen_ai_dataset) }
          let(:child_dataset) { create(:evidence_research_gen_ai_dataset) }
          let(:data_slice) { create(:evidence_research_gen_ai_data_slice, parent_dataset:, child_dataset:) }

          it { expect(data_slice.parent_dataset).to eq(parent_dataset) }
          it { expect(data_slice.child_dataset).to eq(child_dataset) }
        end
      end
    end
  end
end
