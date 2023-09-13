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
    context 'validations' do
      context 'should shoulda matchers' do
        before { create(:evidence_automl_model) }

        it { should validate_presence_of(:external_id) }
        it { should validate_uniqueness_of(:external_id) }
        it { should validate_presence_of(:name) }
      end

      context 'should validate labels' do
        subject { build(:evidence_automl_model) }

        context 'labels is not an array' do
          before { subject.labels = "not an array" }

          it { should_not be_valid }
        end

        context 'labels is an empty array' do
          before { subject.labels = [] }

          it { should_not be_valid }
        end

        context 'labels is an array with at least one item' do
          before { subject.labels = ["one item"] }

          it { should be_valid }
        end

        context 'labels is an array with multiple items' do
          before { subject.labels = ["is", "an", "array"] }

          it { should be_valid }
        end
      end

      context '#before_validation' do
        it 'should strip whitespace from "external_id"' do
          model_id = '   STRIP_ME   '
          automl_model = build(:evidence_automl_model, external_id: model_id)
          automl_model.valid?
          expect(automl_model.external_id).to eq(model_id.strip)
        end
      end


      context '#state_can_be_active' do
        let!(:automl_model) { create(:evidence_automl_model) }


        it 'should not validate state = active if labels_have_associated_rules is false' do
          automl_model.state = Evidence::AutomlModel::STATE_ACTIVE
          def automl_model.labels_have_associated_rules
            false
          end
          expect(automl_model.valid?).to be false
        end


        it 'validate state = active if labels_have_associated_rules is true' do
          automl_model.state = Evidence::AutomlModel::STATE_ACTIVE
          def automl_model.labels_have_associated_rules
            true
          end
          expect(automl_model.valid?).to be true
        end
      end


      context 'should #forbid_external_id_change' do

        it 'should not allow external_id to change after create' do
          original_id = "automl_id"
          automl_model = create(:evidence_automl_model, :external_id => original_id)
          automl_model.external_id = "some new value"
          automl_model.save
          automl_model.reload
          expect(original_id).to(eq(automl_model.external_id))
        end
      end

      context 'should #forbid_name_change' do

        it 'should not allow name to change after create' do
          original_name = "name"
          automl_model = create(:evidence_automl_model, :name => original_name)
          automl_model.name = "some new value"
          automl_model.save
          automl_model.reload
          expect(original_name).to(eq(automl_model.name))
        end
      end

      context 'should #forbid_labels_change' do

        it 'should not allow labels to change after create' do
          original_labels = ["label1"]
          automl_model = create(:evidence_automl_model, :labels => original_labels)
          automl_model.labels = ["some new value"]
          automl_model.save
          automl_model.reload
          expect(original_labels).to(eq(automl_model.labels))
        end
      end
    end

    context '#labels_have_associated_rules?' do
      let!(:automl_model) { create(:evidence_automl_model) }

      it 'should be true if there are matching labels tied to the same prompt as the automl_model' do
        prompt = create(:evidence_prompt)
        rule = create(:evidence_rule, :rule_type => (Rule::TYPE_AUTOML), :prompts => ([prompt]))
        label = create(:evidence_label, :name => automl_model.labels[0], :rule => rule)
        automl_model.state = AutomlModel::STATE_ACTIVE
        expect(automl_model.send(:prompt_labels)).to(be_truthy)
        expect(automl_model.errors).to(be_truthy)
      end

      it 'should be false if there are missing labels from the referenced prompt' do
        automl_model.state = AutomlModel::STATE_ACTIVE
        expect((!automl_model.valid?)).to(be_truthy)
      end
    end

    context 'relationships' do
      it { should belong_to(:prompt) }
    end

    context '#serializable_hash' do
      let(:automl_model) { create(:evidence_automl_model) }

      let(:expected_results) do
        {
          :id => automl_model.id,
          :external_id => automl_model.external_id,
          :name => automl_model.name,
          :labels => automl_model.labels,
          :state => automl_model.state,
          :created_at => automl_model.created_at,
          :updated_at => automl_model.updated_at,
          :prompt_id => automl_model.prompt_id,
          :older_models => automl_model.older_models,
          :notes => automl_model.notes
        }.stringify_keys
      end

      it { expect(automl_model.serializable_hash).to include(expected_results) }
    end

    context '#populate_from_external_id' do
      it 'should set name, labels, and state when called' do
        external_id = "Test-ID"
        name = "Test name"
        labels = ["Test label"]
        AutomlModel.stub_any_instance(:automl_name, name) do
          AutomlModel.stub_any_instance(:automl_labels, labels) do
            model = AutomlModel.new(:external_id => external_id)
            model.populate_from_external_id
            expect(model.valid?).to(eq(true))
            expect(external_id).to(eq(model.external_id))
            expect(name).to(eq(model.name))
            expect(labels).to(eq(model.labels))
            expect(AutomlModel::STATE_INACTIVE).to(eq(model.state))
          end
        end
      end
    end

    context '#fetch_automl_label' do
      let!(:automl_model) { create(:evidence_automl_model) }

      it 'return the highest score label display_name' do
        class MockResult
          attr_reader :classification, :display_name

          class Classification
            attr_reader :score

            def initialize(score)
              @score = score
            end
          end

          def initialize(score, display_name)
            @classification = Classification.new(score)
            @display_name = display_name
          end

        end

        class MockPayload
          attr_reader :payload

          def initialize(payload)
            @payload = payload
          end
        end

        prediction_client = double
        result1 = MockResult.new(2, 'result1')
        result2 = MockResult.new(1, 'result2')

        expect(prediction_client).to receive(:predict).and_return( MockPayload.new([result1, result2]) )
        expect(Google::Cloud::AutoML).to receive(:prediction_service).and_return(prediction_client)
        expect(prediction_client).to receive(:model_path).and_return("the_path")

        expect(automl_model.fetch_automl_label('some text')).to eq ['result1', 2]
      end

      it "should raise if the google api a raises for a timeout" do
        prediction_client = double

        expect(prediction_client).to receive(:predict).and_raise(Google::Cloud::Error)
        expect(Google::Cloud::AutoML).to receive(:prediction_service).and_return(prediction_client)
        expect(prediction_client).to receive(:model_path).and_return("the_path")

        expect { automl_model.fetch_automl_label('some text')}.to(raise_error(Google::Cloud::Error))
      end
    end

    context '#automl_model_path' do
      let(:automl_model) { build(:evidence_automl_model, external_id: external_id) }
      let(:auto_ml_stub) { double(:auto_ml_stub) }
      let(:project_id) { 'PROJECT_ID' }
      let(:location) { 'LOCATION' }
      let(:external_id) { '   HAS_SPACES   ' }

      before do
        stub_const("Evidence::AutomlModel::GOOGLE_PROJECT_ID", project_id)
        stub_const("Evidence::AutomlModel::GOOGLE_LOCATION", location)
      end

      it 'should strip any whitespace that is on "external_id" before looking records up via Google' do
        expect(Google::Cloud::AutoML)
          .to receive(:auto_ml)
          .and_return(auto_ml_stub)

        expect(auto_ml_stub)
          .to receive(:model_path)
          .with(model: external_id.strip, location: location, project: project_id)

        automl_model.send(:automl_model_path)
      end
    end

    context '#activate' do
      let!(:prompt) { create(:evidence_prompt) }
      let!(:rule1) { create(:evidence_rule, :prompts => ([prompt]), :rule_type => (Rule::TYPE_AUTOML), :state => (Rule::STATE_INACTIVE)) }
      let!(:rule2) { create(:evidence_rule, :prompts => ([prompt]), :rule_type => (Rule::TYPE_AUTOML), :state => (Rule::STATE_INACTIVE)) }
      let!(:rule3) { create(:evidence_rule, :prompts => ([prompt]), :rule_type => (Rule::TYPE_AUTOML), :state => (Rule::STATE_INACTIVE)) }
      let(:label1) { "label1" }
      let(:label2) { "label2" }
      let(:label3) { "label3" }

      before do
        create(:evidence_label, :name => (label1), :rule => (rule1))
        create(:evidence_label, :name => (label2), :rule => (rule2))
        create(:evidence_label, :name => (label3), :rule => (rule3))
      end

      it 'should set model and associated rules to state active if valid' do
        model = create(:evidence_automl_model, :prompt => (prompt), :state => (AutomlModel::STATE_INACTIVE), :labels => ([label1, label2]))
        model.activate
        rule1.reload
        rule2.reload
        expect(model.valid?).to(eq(true))
        expect(AutomlModel::STATE_ACTIVE).to(eq(model.state))
        expect(Rule::STATE_ACTIVE).to(eq(rule1.state))
        expect(Rule::STATE_ACTIVE).to(eq(rule2.state))
      end

      it 'should set previously active model and unassociated rules to state inactive' do
        rule1.update(:state => (Rule::STATE_ACTIVE))
        rule2.update(:state => (Rule::STATE_ACTIVE))
        old_model = create(:evidence_automl_model, :prompt => (prompt), :state => (AutomlModel::STATE_ACTIVE), :labels => ([label1, label2]))
        new_model = create(:evidence_automl_model, :prompt => (prompt), :state => (AutomlModel::STATE_INACTIVE), :labels => ([label2, label3]))
        expect(old_model.valid?).to(eq(true))
        new_model.activate
        old_model.reload
        rule1.reload
        rule2.reload
        expect(AutomlModel::STATE_INACTIVE).to(eq(old_model.state))
        expect(Rule::STATE_INACTIVE).to(eq(rule1.state))
        expect(Rule::STATE_ACTIVE).to(eq(rule2.state))
      end

      it 'should return false and not activate if the active state can not be validated because of labels without corresponding rules' do
        model = create(:evidence_automl_model, :prompt => (prompt), :state => (AutomlModel::STATE_INACTIVE), :labels => (["no_rule_for_label"]))
        response = model.activate
        model.reload
        expect(response).to(eq(false))
        expect(AutomlModel::STATE_INACTIVE).to(eq(model.state))
      end

      it 'should not change state of anything if activate fails' do
        rule1.update(:state => (Rule::STATE_ACTIVE))
        rule2.update(:state => (Rule::STATE_ACTIVE))
        old_model = create(:evidence_automl_model, :prompt => (prompt), :state => (AutomlModel::STATE_ACTIVE), :labels => ([label1, label2]))
        new_model = create(:evidence_automl_model, :prompt => (prompt), :state => (AutomlModel::STATE_INACTIVE), :labels => (["no_rule_for_label"]))
        response = new_model.activate
        expect(response).to(eq(false))
        old_model.reload
        rule1.reload
        rule2.reload
        expect(old_model.active?).to(eq(true))
        expect(Rule::STATE_ACTIVE).to(eq(rule1.state))
        expect(Rule::STATE_ACTIVE).to(eq(rule2.state))
      end

      it 'should return self and be valid with state active if this item is already the active model' do
        model = create(:evidence_automl_model, :prompt => (prompt), :state => (AutomlModel::STATE_ACTIVE), :labels => ([label1, label2]))
        expect(model.valid?).to(eq(true))
        expect(AutomlModel::STATE_ACTIVE).to(eq(model.state))
        result = model.activate
        expect(model.valid?).to(eq(true))
        expect(AutomlModel::STATE_ACTIVE).to(eq(model.state))
        expect(model).to(eq(result))
      end
    end

    context '#older_models' do
      let!(:first_model) { create(:evidence_automl_model) }

      it 'should be 0 if there are no previous models for the prompt' do
        expect(first_model.older_models).to(eq(0))
      end

      it 'should be 1 if there is a single previous model for the prompt' do
        second_model = create(:evidence_automl_model, :prompt => first_model.prompt)
        expect(first_model.older_models).to(eq(0))
        expect(second_model.older_models).to(eq(1))
      end
    end
  end
end
