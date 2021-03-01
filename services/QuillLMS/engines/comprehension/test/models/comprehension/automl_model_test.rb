require 'test_helper'

module Comprehension
  class AutomlModelTest < ActiveSupport::TestCase

    context 'validations' do
      context "shoulda matchers" do
        setup do
          create(:comprehension_automl_model)
        end

        should validate_presence_of(:automl_model_id)
        should validate_uniqueness_of(:automl_model_id)
        should validate_presence_of(:name)
      end

      context "validate labels" do
        should "not be valid if labels is not an array" do
          automl_model = build(:comprehension_automl_model)
          automl_model.labels='not an array'
          assert !automl_model.valid?
        end

        should "be valid if labels is an array" do
          automl_model = build(:comprehension_automl_model)
          automl_model.labels = ['is', 'an', 'array']
          assert automl_model.valid?
        end

        should "not be valid if labels is empty" do
          automl_model = build(:comprehension_automl_model)
          automl_model.labels = []
          assert !automl_model.valid?
        end

        should "be valid if labels has at least one item in it" do
          automl_model = build(:comprehension_automl_model)
          automl_model.labels = ['one item']
          assert automl_model.valid?
        end
      end

      context '#state_can_be_active' do
        setup do
          @automl_model = create(:comprehension_automl_model)
        end

        should 'not validate state = active if labels_have_associated_rules is false' do
          @automl_model.state = Comprehension::AutomlModel::STATE_ACTIVE
          def @automl_model.labels_have_associated_rules
            false
          end
          assert !@automl_model.valid?
        end

        should 'validate state = active if labels_have_associated_rules is true' do
          @automl_model.state = Comprehension::AutomlModel::STATE_ACTIVE
          def @automl_model.labels_have_associated_rules
            true
          end
          assert @automl_model.valid?
        end
      end

      context '#forbid_automl_model_id_change' do
        should 'not allow automl_model_id to change after create' do
          original_id = 'automl_id'
          automl_model = create(:comprehension_automl_model, automl_model_id: original_id)
          automl_model.automl_model_id = 'some new value'
          automl_model.save
          automl_model.reload
          assert_equal automl_model.automl_model_id, original_id
        end
      end

      context '#forbid_name_change' do
        should 'not allow name to change after create' do
          original_name = 'name'
          automl_model = create(:comprehension_automl_model, name: original_name)
          automl_model.name = 'some new value'
          automl_model.save
          automl_model.reload
          assert_equal automl_model.name, original_name
        end
      end

      context '#forbid_labels_change' do
        should 'not allow labels to change after create' do
          original_labels = ['label1']
          automl_model = create(:comprehension_automl_model, labels: original_labels)
          automl_model.labels = ['some new value']
          automl_model.save
          automl_model.reload
          assert_equal automl_model.labels, original_labels
        end
      end
    end

    context '#labels_have_associated_rules?' do
      setup do
        @automl_model = create(:comprehension_automl_model)
      end

      should 'be true if there are matching labels tied to the same prompt as the automl_model' do
        prompt = create(:comprehension_prompt)
        rule = create(:comprehension_rule, rule_type: Rule::TYPE_AUTOML, prompts: [prompt])
        label = create(:comprehension_label, name: @automl_model.labels[0], rule: rule)

        @automl_model.state = AutomlModel::STATE_ACTIVE
        assert @automl_model.send(:prompt_labels), nil
        assert @automl_model.errors, nil
      end

      should 'be false if there are missing labels from the referenced prompt' do
        @automl_model.state = AutomlModel::STATE_ACTIVE
        assert !@automl_model.valid?
      end
    end

    context 'relationships' do
      should belong_to(:prompt)
    end

    context '#serializable_hash' do
      should 'serialize into the expected shape' do
        automl_model = create(:comprehension_automl_model)
        assert_equal automl_model.serializable_hash, {
          id: automl_model.id,
          automl_model_id: automl_model.automl_model_id,
          name: automl_model.name,
          labels: automl_model.labels,
          state: automl_model.state,
          prompt_id: automl_model.prompt_id
        }.stringify_keys
      end
    end

    context '#populate_from_automl_model_id' do
      should 'set name, labels, and state when called' do
        automl_model_id = 'Test-ID'
        name = 'Test name'
        labels = ['Test label']
        AutomlModel.stub_any_instance(:automl_name, name) do
          AutomlModel.stub_any_instance(:automl_labels, labels) do
            model = AutomlModel.new(automl_model_id: automl_model_id)
            model.populate_from_automl_model_id
            assert model.valid?
            assert_equal model.automl_model_id, automl_model_id
            assert_equal model.name, name
            assert_equal model.labels, labels
            assert_equal model.state, AutomlModel::STATE_INACTIVE
          end
        end
      end
    end

    context '#automl_model_full_id' do
      should 'call model_path on the automl_client with specified values' do
        project_id = 'PROJECT'
        location = 'us-central1'
        model = create(:comprehension_automl_model)

        ENV['AUTOML_GOOGLE_PROJECT_ID'] = project_id
        ENV['AUTOML_GOOGLE_LOCATION'] = location

        mock = Minitest::Mock.new
        mock.expect(:model_path, nil, [{project: project_id, location: location, model: model.automl_model_id}])
        AutomlModel.stub_any_instance(:automl_client, mock) do
          model.send(:automl_model_full_id)
          assert mock.verify
        end
      end
    end

    context '#activate' do
      setup do
        @prompt = create(:comprehension_prompt)
        @label1 = 'label1'
        @label2 = 'label2'
        @label3 = 'label3'
        @rule1 = create(:comprehension_rule, prompts: [@prompt], rule_type: Rule::TYPE_AUTOML, state: Rule::STATE_INACTIVE)
        @rule2 = create(:comprehension_rule, prompts: [@prompt], rule_type: Rule::TYPE_AUTOML, state: Rule::STATE_INACTIVE)
        @rule3 = create(:comprehension_rule, prompts: [@prompt], rule_type: Rule::TYPE_AUTOML, state: Rule::STATE_INACTIVE)
        create(:comprehension_label, name: @label1, rule: @rule1)
        create(:comprehension_label, name: @label2, rule: @rule2)
        create(:comprehension_label, name: @label3, rule: @rule3)
      end

      should 'set model and associated rules to state active if valid' do
        @model = create(:comprehension_automl_model, prompt: @prompt, state: AutomlModel::STATE_INACTIVE, labels: [@label1, @label2])

        @model.activate

        @rule1.reload
        @rule2.reload

        assert @model.valid?
        assert_equal @model.state, AutomlModel::STATE_ACTIVE
        assert_equal @rule1.state, Rule::STATE_ACTIVE
        assert_equal @rule2.state, Rule::STATE_ACTIVE
      end

      should 'set previously active model and unassociated rules to state inactive' do
        @rule1.update(state: Rule::STATE_ACTIVE)
        @rule2.update(state: Rule::STATE_ACTIVE)
        @old_model = create(:comprehension_automl_model, prompt: @prompt, state: AutomlModel::STATE_ACTIVE, labels: [@label1, @label2])
        @new_model = create(:comprehension_automl_model, prompt: @prompt, state: AutomlModel::STATE_INACTIVE, labels: [@label2, @label3])

        assert @old_model.valid?

        @new_model.activate

        @old_model.reload
        @rule1.reload
        @rule2.reload

        assert_equal @old_model.state, AutomlModel::STATE_INACTIVE
        assert_equal @rule1.state, Rule::STATE_INACTIVE
        assert_equal @rule2.state, Rule::STATE_ACTIVE
      end

      should 'return false and not activate if the active state can not be validated because of labels without corresponding rules' do
        @model = create(:comprehension_automl_model, prompt: @prompt, state: AutomlModel::STATE_INACTIVE, labels: ['no_rule_for_label'])

        response = @model.activate

        assert_equal response, false
        assert_equal @model.state, AutomlModel::STATE_INACTIVE 
      end

      should 'not change state of anything if activate fails' do
        @rule1.update(state: Rule::STATE_ACTIVE)
        @rule2.update(state: Rule::STATE_ACTIVE)
        @old_model = create(:comprehension_automl_model, prompt: @prompt, state: AutomlModel::STATE_ACTIVE, labels: [@label1, @label2])
        @new_model = create(:comprehension_automl_model, prompt: @prompt, state: AutomlModel::STATE_INACTIVE, labels: ['no_rule_for_label'])

        assert @old_model.valid?

        response = @new_model.activate
        assert_equal response, false

        @old_model.reload
        @rule1.reload
        @rule2.reload

        assert @new_model.valid?
        assert_equal @old_model.state, AutomlModel::STATE_ACTIVE
        assert_equal @rule1.state, Rule::STATE_ACTIVE
        assert_equal @rule2.state, Rule::STATE_ACTIVE
      end

      should 'leave the model in an valid state when activate fails' do
        @model = create(:comprehension_automl_model, prompt: @prompt, state: AutomlModel::STATE_INACTIVE, labels: ['no_rule_for_label'])

        response = @model.activate

        assert @model.valid?
      end

      should 'return self and be valid with state active if this item is already the active model' do
        @model = create(:comprehension_automl_model, prompt: @prompt, state: AutomlModel::STATE_ACTIVE, labels: [@label1, @label2])

        assert @model.valid?
        assert_equal @model.state, AutomlModel::STATE_ACTIVE

        result = @model.activate

        assert @model.valid?
        assert_equal @model.state, AutomlModel::STATE_ACTIVE
        assert_equal result, @model
      end
    end
  end
end
