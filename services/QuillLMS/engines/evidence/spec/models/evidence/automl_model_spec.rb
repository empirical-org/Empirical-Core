# frozen_string_literal: true

# == Schema Information
#
# Table name: comprehension_automl_models
#
#  id              :integer          not null, primary key
#  automl_model_id :string           not null
#  name            :string           not null
#  labels          :string           default([]), is an Array
#  prompt_id       :integer
#  state           :string           not null
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  notes           :text             default("")
#
require 'rails_helper'

module Evidence
  RSpec.describe AutomlModel, type: :model do
    it { should belong_to(:prompt) }
    it { should have_readonly_attribute(:model_external_id) }
    it { should have_readonly_attribute(:endpoint_external_id) }
    it { should have_readonly_attribute(:name) }
    it { should have_readonly_attribute(:labels) }

    context 'validations' do
      context 'presence and uniqueness' do
        before { create(:evidence_automl_model) }

        it { should validate_presence_of(:model_external_id) }
        it { should validate_uniqueness_of(:model_external_id) }
        it { should validate_presence_of(:endpoint_external_id) }
        it { should validate_uniqueness_of(:endpoint_external_id) }
        it { should validate_presence_of(:name) }
      end

      context 'validates labels' do
        subject { build(:evidence_automl_model) }

        context 'labels is not an array' do
          before { subject.labels = 'not an array' }

          it { should_not be_valid }
        end

        context 'labels is an empty array' do
          before { subject.labels = [] }

          it { should_not be_valid }
        end

        context 'labels is an array with at least one item' do
          before { subject.labels = ['one item'] }

          it { should be_valid }
        end

        context 'labels is an array with multiple items' do
          before { subject.labels = ['is', 'an', 'array'] }

          it { should be_valid }
        end
      end

      context '#before_validation' do
        it 'strips whitespace from model_external_id' do
          model_external_id = '   STRIP_ME   '
          automl_model = build(:evidence_automl_model, model_external_id: model_external_id)
          expect(automl_model).to be_valid
          expect(automl_model.model_external_id).to eq model_external_id.strip
        end

        it 'strips whitespace from endpoint_external_id' do
          endpoint_external_id = '   STRIP_ME   '
          automl_model = build(:evidence_automl_model, endpoint_external_id: endpoint_external_id)
          expect(automl_model).to be_valid
          expect(automl_model.endpoint_external_id).to eq endpoint_external_id.strip
        end
      end

      context 'state is active' do
        let(:automl_model) { create(:evidence_automl_model) }

        before { automl_model.state = Evidence::AutomlModel::STATE_ACTIVE}

        it 'should not validate state = active if labels_have_associated_rules is false' do
          allow(automl_model).to receive(:labels_have_associated_rules?).and_return(false)
          expect(automl_model).not_to be_valid
        end


        it 'validate state = active if labels_have_associated_rules is true' do
          allow(automl_model).to receive(:labels_have_associated_rules?).and_return(true)
          expect(automl_model).to be_valid
        end
      end
    end

    context '#labels_have_associated_rules?' do
      let!(:automl_model) { create(:evidence_automl_model) }

      it 'should be true if there are matching labels tied to the same prompt as the automl_model' do
        prompt = create(:evidence_prompt)
        rule = create(:evidence_rule, :type_automl, prompts: [prompt])
        label = create(:evidence_label, name: automl_model.labels[0], rule: rule)
        automl_model.state = described_class::STATE_ACTIVE
        expect(automl_model.send(:prompt_labels)).to(be_truthy)
        expect(automl_model.errors).to(be_truthy)
      end

      it 'should be false if there are missing labels from the referenced prompt' do
        automl_model.state = described_class::STATE_ACTIVE
        expect(automl_model).not_to be_valid
      end
    end

    context '#serializable_hash' do
      let(:automl_model) { create(:evidence_automl_model) }

      let(:expected_results) do
        {
          id: automl_model.id,
          model_external_id: automl_model.model_external_id,
          endpoint_external_id: automl_model.endpoint_external_id,
          name: automl_model.name,
          labels: automl_model.labels,
          state: automl_model.state,
          created_at: automl_model.created_at,
          updated_at: automl_model.updated_at,
          prompt_id: automl_model.prompt_id,
          older_models: automl_model.older_models,
          notes: automl_model.notes
        }.stringify_keys
      end

      it { expect(automl_model.serializable_hash).to include(expected_results) }
    end

    context '#populate_from_model_external_id' do
      let(:model_external_id) { 'Test-Model-ID' }
      let(:endpoint_external_id) { 'Test-Endpoint-ID' }
      let(:name) { 'Test name' }
      let(:labels) { ['Test label'] }
      let(:automl_model) { AutomlModel.new(model_external_id: model_external_id, endpoint_external_id: endpoint_external_id) }

      before do
        allow(automl_model).to receive(:pull_name).and_return(name)
        allow(automl_model).to receive(:pull_labels).and_return(labels)
        automl_model.populate_from_model_external_id
      end

      it { expect(automl_model).to be_valid }
      it { expect(automl_model.name).to eq name }
      it { expect(automl_model.labels).to eq labels }
      it { expect(automl_model.state).to eq AutomlModel::STATE_INACTIVE }
      it { expect(automl_model.model_external_id).to eq model_external_id }
      it { expect(automl_model.endpoint_external_id).to eq endpoint_external_id }
    end

    context '#fetch_automl_label_and_score' do
      subject { automl_model.fetch_automl_label_and_score(text) }

      let(:automl_model) { create(:evidence_automl_model) }
      let(:endpoint_external_id) { automl_model.endpoint_external_id }
      let(:text) { 'the text' }
      let(:label) { "the label" }
      let(:score) { rand }

      before do
        allow(AutomlLabelAndScoreFetcher)
         .to receive(:run)
         .with(automl_model.endpoint_external_id, text)
         .and_return([label, score])
      end

      it { is_expected.to eq [label, score] }
    end

    context '#model_endpoint' do
      let(:automl_model) { build(:evidence_automl_model, model_external_id: model_external_id) }
      let(:model_client_class) { ::Google::Cloud::AIPlatform::V1::ModelService::Client }
      let(:model_client) { instance_double(model_client_class) }
      let(:model_external_id) { 'MODEL_EXTERNAL_ID' }
      let(:project_id) { 'PROJECT_ID' }
      let(:location) { 'LOCATION' }

      before do
        stub_const('Evidence::AutomlModel::GOOGLE_PROJECT_ID', project_id)
        stub_const('Evidence::AutomlModel::GOOGLE_LOCATION', location)
      end

      it 'calls model_path on the model_client with specified values' do
        expect(model_client_class).to receive(:new).and_return(model_client)

        expect(model_client)
          .to receive(:model_path)
          .with(location: location, model: model_external_id, project: project_id)

        automl_model.send(:model_endpoint)
      end
    end

    context '#activate' do
      let(:prompt) { create(:evidence_prompt) }
      let(:rule1) { create(:evidence_rule, :inactive, :type_automl, prompts: [prompt]) }
      let(:rule2) { create(:evidence_rule, :inactive, :type_automl, prompts: [prompt]) }
      let(:rule3) { create(:evidence_rule, :inactive, :type_automl, prompts: [prompt]) }
      let(:label1) { 'label1' }
      let(:label2) { 'label2' }
      let(:label3) { 'label3' }

      before do
        create(:evidence_label, name: label1, rule: rule1)
        create(:evidence_label, name: label2, rule: rule2)
        create(:evidence_label, name: label3, rule: rule3)
      end

      it 'should set model and associated rules to state active if valid' do
        model = create(:evidence_automl_model, :inactive, prompt: prompt, labels: [label1, label2])
        model.activate
        expect(model).to be_valid
        expect(model.state).to eq AutomlModel::STATE_ACTIVE
        expect(rule1.reload.state).to eq Rule::STATE_ACTIVE
        expect(rule2.reload.state).to eq Rule::STATE_ACTIVE
      end

      it 'should set previously active model and unassociated rules to state inactive' do
        rule1.update(state: Rule::STATE_ACTIVE)
        rule2.update(state: Rule::STATE_ACTIVE)
        old_model = create(:evidence_automl_model, :active, prompt: prompt, labels: [label1, label2])
        new_model = create(:evidence_automl_model, :inactive, prompt: prompt, labels: [label2, label3])
        expect(old_model).to be_valid
        new_model.activate
        expect(old_model.reload.state).to eq AutomlModel::STATE_INACTIVE
        expect(rule1.reload.state).to eq Rule::STATE_INACTIVE
        expect(rule2.reload.state).to eq Rule::STATE_ACTIVE
      end

      it 'should return false and not activate if the active state can not be validated because of labels without corresponding rules' do
        model = create(:evidence_automl_model, :inactive, prompt: prompt, labels: ['no_rule_for_label'])
        response = model.activate
        expect(response).to eq false
        expect(model.reload.state).to eq AutomlModel::STATE_INACTIVE
      end

      it 'should not change state of anything if activate fails' do
        rule1.update(state: Rule::STATE_ACTIVE)
        rule2.update(state: Rule::STATE_ACTIVE)
        old_model = create(:evidence_automl_model, :active, prompt: prompt, labels: [label1, label2])
        new_model = create(:evidence_automl_model, :inactive, prompt: prompt, labels: ['no_rule_for_label'])
        response = new_model.activate
        expect(response).to eq false
        expect(old_model.reload).to be_active
        expect(rule1.reload.state).to eq Rule::STATE_ACTIVE
        expect(rule2.reload.state).to eq Rule::STATE_ACTIVE
      end

      it 'should return self and be valid with state active if this item is already the active model' do
        model = create(:evidence_automl_model, :active, prompt: prompt, labels: [label1, label2])
        expect(model).to be_valid
        expect(AutomlModel::STATE_ACTIVE).to eq model.state
        result = model.activate
        expect(model).to be_valid
        expect(AutomlModel::STATE_ACTIVE).to eq model.state
        expect(model).to eq result
      end
    end

    context '#older_models' do
      let!(:first_model) { create(:evidence_automl_model) }

      it 'should be 0 if there are no previous models for the prompt' do
        expect(first_model.older_models).to(eq(0))
      end

      it 'should be 1 if there is a single previous model for the prompt' do
        second_model = create(:evidence_automl_model, prompt: first_model.prompt)
        expect(first_model.older_models).to(eq(0))
        expect(second_model.older_models).to(eq(1))
      end
    end
  end
end
