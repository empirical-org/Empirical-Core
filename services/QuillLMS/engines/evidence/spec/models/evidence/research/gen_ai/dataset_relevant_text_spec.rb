# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_dataset_relevant_texts
#
#  id               :bigint           not null, primary key
#  default          :boolean          default(FALSE)
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  dataset_id       :integer          not null
#  relevant_text_id :integer          not null
#

require 'rails_helper'

module Evidence
  module Research
    module GenAI
      RSpec.describe DatasetRelevantText, type: :model do
        let(:factory) { described_class.model_name.singular.to_sym }

        it { expect(build(factory)).to be_valid }

        it { should belong_to(:dataset) }
        it { should belong_to(:relevant_text) }

        it { should validate_presence_of(:dataset_id) }
        it { should validate_presence_of(:relevant_text_id) }

        it { should have_readonly_attribute(:dataset_id) }
        it { should have_readonly_attribute(:relevant_text_id) }

        context 'callbacks' do
          describe '#update_other_defaults' do
            let(:dataset) { create(:evidence_research_gen_ai_dataset) }
            let(:other_dataset) { create(:evidence_research_gen_ai_dataset) }
            let!(:relevant_text1) { create(:evidence_research_gen_ai_relevant_text) }
            let!(:relevant_text2) { create(:evidence_research_gen_ai_relevant_text) }
            let!(:relevant_text3) { create(:evidence_research_gen_ai_relevant_text) }

            context 'when creating a new record' do
              let!(:existing1) { create(factory, dataset:, relevant_text: relevant_text1, default: true) }
              let!(:existing2) { create(factory, dataset:, relevant_text: relevant_text2, default: true) }

              it 'sets other records default to false when creating a new default record' do
                new_record = create(factory, dataset:, relevant_text: relevant_text3, default: true)

                expect(existing1.reload.default).to be false
                expect(existing2.reload.default).to be false
                expect(new_record.reload.default).to be true
              end

              it 'does not affect records from other datasets' do
                other_record = create(factory, dataset: other_dataset, relevant_text: relevant_text1, default: true)
                create(factory, dataset:, relevant_text: relevant_text2, default: true)

                expect(other_record.reload.default).to be true
              end
            end

            context 'when updating an existing record' do
              let!(:existing1) { create(factory, dataset:, relevant_text: relevant_text1, default: true) }
              let!(:existing2) { create(factory, dataset:, relevant_text: relevant_text2, default: false) }
              let!(:existing3) { create(factory, dataset:, relevant_text: relevant_text3, default: false) }

              it 'updates other records when setting an existing record to default' do
                existing2.update!(default: true)

                expect(existing1.reload.default).to be false
                expect(existing2.reload.default).to be true
                expect(existing3.reload.default).to be false
              end

              it { expect { existing1.update(default: false) }.not_to change { existing2.reload.default } }
            end
          end
        end
      end
    end
  end
end
