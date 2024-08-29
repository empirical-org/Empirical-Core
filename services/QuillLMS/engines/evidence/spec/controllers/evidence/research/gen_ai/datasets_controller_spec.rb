# frozen_string_literal: true

require 'rails_helper'

module Evidence
  module Research
    module GenAI
      RSpec.describe DatasetsController, type: :controller do
        routes { Evidence::Engine.routes }

        let(:user) { double('User') }

        before do
          allow(controller).to receive(:current_user).and_return(user)
          allow(user).to receive(:staff?).and_return(is_staff)
        end

        describe 'POST #create' do
          subject { post :create, params: { stem_vault_id: }.merge(attributes) }

          let(:stem_vault_id) { create(:evidence_research_gen_ai_stem_vault).id }
          let(:is_staff) { true }

          context 'as not staff' do
            let(:is_staff) { false }
            let(:attributes) { {} }

            it { expect { subject }.not_to change(Dataset, :count) }
            it { expect(subject).to redirect_to '/' }
          end

          context 'with file upload' do
            let(:file) { fixture_file_upload('test.csv', 'text/csv') }
            let(:attributes) { { research_gen_ai_dataset: { file: } } }

            it { expect { subject }.to change(Evidence::Research::GenAI::Dataset, :count).by(1) }

            it 'redirects to the created dataset' do
              subject
              expect(response).to redirect_to(Evidence::Research::GenAI::Dataset.last)
            end

            it 'calls DatasetImporter' do
              expect(Evidence::Research::GenAI::DatasetImporter).to receive(:run)
              subject
            end
          end

          context 'with data subset' do
            let(:dataset) { create(:evidence_research_gen_ai_dataset, stem_vault_id:) }
            let(:parent_id) { dataset.id }
            let(:test_examples) { create_list(:evidence_research_gen_ai_test_example, 2, dataset:) }
            let(:data_subset) { create(:evidence_research_gen_ai_dataset, parent_id:) }
            let(:test_example_ids) { test_examples.pluck(:id) }

            let(:attributes) { { research_gen_ai_dataset: { parent_id:, test_example_ids: } } }

            before { allow(Evidence::Research::GenAI::DataSubsetBuilder).to receive(:run).and_return(data_subset) }

            it 'redirects to the created data_subset' do
              subject
              expect(response).to redirect_to(data_subset)
            end
          end
        end
      end
    end
  end
end
