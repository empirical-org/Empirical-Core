require 'rails_helper'

module Comprehension
  RSpec.describe(AutomlModel, :type => :model) do

    context 'should validations' do

      context 'should shoulda matchers' do
        before { create(:comprehension_automl_model) }

        it { should validate_presence_of(:automl_model_id) }

        it { should validate_uniqueness_of(:automl_model_id) }

        it { should validate_presence_of(:name) }
      end

      context 'should validate labels' do

        it 'should not be valid if labels is not an array' do
          automl_model = build(:comprehension_automl_model)
          automl_model.labels = "not an array"
          expect((!automl_model.valid?)).to(be_truthy)
        end

        it 'should be valid if labels is an array' do
          automl_model = build(:comprehension_automl_model)
          automl_model.labels = ["is", "an", "array"]
          expect(automl_model.valid?).to(eq(true))
        end

        it 'should not be valid if labels is empty' do
          automl_model = build(:comprehension_automl_model)
          automl_model.labels = []
          expect((!automl_model.valid?)).to(be_truthy)
        end

        it 'should be valid if labels has at least one item in it' do
          automl_model = build(:comprehension_automl_model)
          automl_model.labels = ["one item"]
          expect(automl_model.valid?).to(eq(true))
        end
      end


      context '#state_can_be_active' do
        let!(:automl_model) { create(:comprehension_automl_model) } 


        it 'should not validate state = active if labels_have_associated_rules is false' do
          automl_model.state = Comprehension::AutomlModel::STATE_ACTIVE
          def automl_model.labels_have_associated_rules
            false
          end
          expect(automl_model.valid?).to be false
        end


        it 'validate state = active if labels_have_associated_rules is true' do
          automl_model.state = Comprehension::AutomlModel::STATE_ACTIVE
          def automl_model.labels_have_associated_rules
            true
          end
          expect(automl_model.valid?).to be true
        end
      end


      context 'should #forbid_automl_model_id_change' do

        it 'should not allow automl_model_id to change after create' do
          original_id = "automl_id"
          automl_model = create(:comprehension_automl_model, :automl_model_id => original_id)
          automl_model.automl_model_id = "some new value"
          automl_model.save
          automl_model.reload
          expect(original_id).to(eq(automl_model.automl_model_id))
        end
      end

      context 'should #forbid_name_change' do

        it 'should not allow name to change after create' do
          original_name = "name"
          automl_model = create(:comprehension_automl_model, :name => original_name)
          automl_model.name = "some new value"
          automl_model.save
          automl_model.reload
          expect(original_name).to(eq(automl_model.name))
        end
      end

      context 'should #forbid_labels_change' do

        it 'should not allow labels to change after create' do
          original_labels = ["label1"]
          automl_model = create(:comprehension_automl_model, :labels => original_labels)
          automl_model.labels = ["some new value"]
          automl_model.save
          automl_model.reload
          expect(original_labels).to(eq(automl_model.labels))
        end
      end
    end

    context 'should #labels_have_associated_rules?' do
      let!(:automl_model) { create(:comprehension_automl_model) } 

      it 'should be true if there are matching labels tied to the same prompt as the automl_model' do
        prompt = create(:comprehension_prompt)
        rule = create(:comprehension_rule, :rule_type => (Rule::TYPE_AUTOML), :prompts => ([prompt]))
        label = create(:comprehension_label, :name => automl_model.labels[0], :rule => rule)
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

    context 'should #serializable_hash' do

      it 'should serialize into the expected shape' do
        automl_model = create(:comprehension_automl_model)
        expect({ :id => automl_model.id, :automl_model_id => automl_model.automl_model_id, :name => automl_model.name, :labels => automl_model.labels, :state => automl_model.state, :created_at => automl_model.created_at, :prompt_id => automl_model.prompt_id, :older_models => automl_model.older_models, :notes => automl_model.notes }.stringify_keys).to(eq(automl_model.serializable_hash))
      end
    end

    context 'should #populate_from_automl_model_id' do

      it 'should set name, labels, and state when called' do
        automl_model_id = "Test-ID"
        name = "Test name"
        labels = ["Test label"]
        AutomlModel.stub_any_instance(:automl_name, name) do
          AutomlModel.stub_any_instance(:automl_labels, labels) do
            model = AutomlModel.new(:automl_model_id => automl_model_id)
            model.populate_from_automl_model_id
            expect(model.valid?).to(eq(true))
            expect(automl_model_id).to(eq(model.automl_model_id))
            expect(name).to(eq(model.name))
            expect(labels).to(eq(model.labels))
            expect(AutomlModel::STATE_INACTIVE).to(eq(model.state))
          end
        end
      end
    end

    context 'should #fetch_automl_label' do 
      let!(:automl_model) { create(:comprehension_automl_model) }


      it 'return the highest score label display_name' do
        class MockResult
          attr_reader :classification
          attr_reader :display_name

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
 
        allow(prediction_client).to receive(:predict).and_return( MockPayload.new([result1, result2]) )
        Google::Cloud::AutoML.stub(:prediction_service).and_return(prediction_client)

        client = double
        allow(client).to receive(:model_path).and_return("the_path")
        Google::Cloud::AutoML.stub(:auto_ml).and_return(client)

        expect(automl_model.fetch_automl_label('some text')).to eq 'result1'
      end
    end


    context 'should #automl_model_full_id' do

      it 'should call model_path on the automl_client with specified values' do
        project_id = "PROJECT"
        location = "us-central1"
        model = create(:comprehension_automl_model)
        ENV["AUTOML_GOOGLE_PROJECT_ID"] = project_id
        ENV["AUTOML_GOOGLE_LOCATION"] = location

        client = double
        allow(client).to receive(:model_path).and_return("the_path")
        Google::Cloud::AutoML.stub(:auto_ml).and_return(client)
        expect(model.send(:automl_model_full_id)).to eq "the_path"
      end
    end

    context 'should #activate' do
      let!(:prompt) { create(:comprehension_prompt) }
      let!(:rule1) { create(:comprehension_rule, :prompts => ([prompt]), :rule_type => (Rule::TYPE_AUTOML), :state => (Rule::STATE_INACTIVE)) }
      let!(:rule2) { create(:comprehension_rule, :prompts => ([prompt]), :rule_type => (Rule::TYPE_AUTOML), :state => (Rule::STATE_INACTIVE)) }
      let!(:rule3) { create(:comprehension_rule, :prompts => ([prompt]), :rule_type => (Rule::TYPE_AUTOML), :state => (Rule::STATE_INACTIVE)) }
      let(:label1) { "label1" } 
      let(:label2) { "label2" } 
      let(:label3) { "label3" } 
      
      before do  
        create(:comprehension_label, :name => (label1), :rule => (rule1))
        create(:comprehension_label, :name => (label2), :rule => (rule2))
        create(:comprehension_label, :name => (label3), :rule => (rule3))
      end

      it 'should set model and associated rules to state active if valid' do
        model = create(:comprehension_automl_model, :prompt => (prompt), :state => (AutomlModel::STATE_INACTIVE), :labels => ([label1, label2])) 
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
        old_model = create(:comprehension_automl_model, :prompt => (prompt), :state => (AutomlModel::STATE_ACTIVE), :labels => ([label1, label2])) 
        new_model = create(:comprehension_automl_model, :prompt => (prompt), :state => (AutomlModel::STATE_INACTIVE), :labels => ([label2, label3])) 
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
        model = create(:comprehension_automl_model, :prompt => (prompt), :state => (AutomlModel::STATE_INACTIVE), :labels => (["no_rule_for_label"])) 
        response = model.activate
        model.reload
        expect(false).to(eq(response))
        expect(AutomlModel::STATE_INACTIVE).to(eq(model.state))
      end

      it 'should not change state of anything if activate fails' do
        rule1.update(:state => (Rule::STATE_ACTIVE))
        rule2.update(:state => (Rule::STATE_ACTIVE))
        old_model = create(:comprehension_automl_model, :prompt => (prompt), :state => (AutomlModel::STATE_ACTIVE), :labels => ([label1, label2])) 
        new_model = create(:comprehension_automl_model, :prompt => (prompt), :state => (AutomlModel::STATE_INACTIVE), :labels => (["no_rule_for_label"])) 
        response = new_model.activate
        expect(false).to(eq(response))
        old_model.reload
        rule1.reload
        rule2.reload
        expect(old_model.active?).to(eq(true))
        expect(Rule::STATE_ACTIVE).to(eq(rule1.state))
        expect(Rule::STATE_ACTIVE).to(eq(rule2.state))
      end

      it 'should return self and be valid with state active if this item is already the active model' do
        model = create(:comprehension_automl_model, :prompt => (prompt), :state => (AutomlModel::STATE_ACTIVE), :labels => ([label1, label2])) 
        expect(model.valid?).to(eq(true))
        expect(AutomlModel::STATE_ACTIVE).to(eq(model.state))
        result = model.activate
        expect(model.valid?).to(eq(true))
        expect(AutomlModel::STATE_ACTIVE).to(eq(model.state))
        expect(model).to(eq(result))
      end
    end

    context 'should #older_models' do
      let!(:first_model) { create(:comprehension_automl_model) } 

      it 'should be 0 if there are no previous models for the prompt' do
        expect(0).to(eq(first_model.older_models))
      end

      it 'should be 1 if there is a single previous model for the prompt' do
        second_model = create(:comprehension_automl_model, :prompt => first_model.prompt)
        expect(0).to(eq(first_model.older_models))
        expect(1).to(eq(second_model.older_models))
      end
    end
  end
end
