require 'test_helper'

module Comprehension
  class AutomlModelsControllerTest < ActionController::TestCase
    setup do
      @routes = Engine.routes
    end

    context "index" do
      should "return successfully - no automl_model" do
        get :index

        parsed_response = JSON.parse(response.body)

        assert_response :success
        assert_equal Array, parsed_response.class
        assert parsed_response.empty?
      end

      context 'with automl_models' do
        setup do
          @automl_model = create(:comprehension_automl_model)
        end

        should "return successfully" do
          get :index

          parsed_response = JSON.parse(response.body)

          assert_response :success
          assert_equal Array, parsed_response.class
          refute parsed_response.empty?

          assert_equal @automl_model.automl_model_id, parsed_response.first['automl_model_id']

          assert_equal @automl_model.name, parsed_response.first['name']

          assert_equal @automl_model.prompt_id, parsed_response.first['prompt_id']

          assert_equal @automl_model.state, parsed_response.first['state']

          assert_equal @automl_model.labels, parsed_response.first['labels']

        end
      end
    end

    context "create" do
      setup do
        @controller.session[:user_id] = 1
        @activity = create(:comprehension_activity, parent_activity_id: 1, title: "First Activity", target_level: 8, scored_level: "4th grade")
        @prompt = create(:comprehension_prompt, activity: @activity, text: "it is good.")
        @automl_model = build(:comprehension_automl_model, prompt: @prompt)
      end

      should "create a valid record and return it as json" do
        AutomlModel.stub_any_instance(:automl_name, @automl_model.name) do
          AutomlModel.stub_any_instance(:automl_labels, @automl_model.labels) do
            post :create, automl_model: { prompt_id: @automl_model.prompt_id, automl_model_id: @automl_model.automl_model_id }
          end
        end

        parsed_response = JSON.parse(response.body)

        assert_equal 201, response.code.to_i

        assert_equal @automl_model.automl_model_id, parsed_response['automl_model_id']

        assert_equal @automl_model.name, parsed_response['name']

        assert_equal @automl_model.prompt_id, parsed_response['prompt_id']

        assert_equal AutomlModel::STATE_INACTIVE, parsed_response['state']

        assert_equal @automl_model.labels, parsed_response['labels']

        assert_equal 1, AutomlModel.count
      end

      should "create new records with state = inactive no matter what is passed in" do
        AutomlModel.stub_any_instance(:automl_name, @automl_model.name) do
          AutomlModel.stub_any_instance(:automl_labels, @automl_model.labels) do
            post :create, automl_model: { prompt_id: @automl_model.prompt_id, automl_model_id: @automl_model.automl_model_id, state: AutomlModel::STATE_ACTIVE }
          end
        end

        parsed_response = JSON.parse(response.body)

        assert_equal 201, response.code.to_i
        assert_equal AutomlModel::STATE_INACTIVE, parsed_response['state']
        assert_equal 1, AutomlModel.count
      end

      should "not create an invalid record and return errors as json" do
        AutomlModel.stub_any_instance(:automl_name, @automl_model.name) do
          AutomlModel.stub_any_instance(:automl_labels, @automl_model.labels) do
            post :create, automl_model: { prompt_id: @automl_model.prompt_id, automl_model_id: '' }
          end
        end

        parsed_response = JSON.parse(response.body)

        assert_equal 422, response.code.to_i
        assert parsed_response['automl_model_id'].include?("can't be blank")
        assert_equal 0, AutomlModel.count
      end

      should "make a change log record after creating the AutoML record" do
        AutomlModel.stub_any_instance(:automl_name, @automl_model.name) do
          AutomlModel.stub_any_instance(:automl_labels, @automl_model.labels) do
            post :create, automl_model: { prompt_id: @automl_model.prompt_id, automl_model_id: @automl_model.automl_model_id }
          end
        end

        automl = AutomlModel.last
        change_log = Comprehension.change_log_class.last
        assert_equal change_log.action, "AutoML Model - created"
        assert_equal change_log.user_id, 1
        assert_equal change_log.changed_record_type, "Comprehension::Prompt"
        assert_equal change_log.changed_record_id, automl.prompt_id
        assert_equal change_log.new_value, automl.automl_model_id.to_s
      end
    end

    context "show" do
      setup do
        @automl_model = create(:comprehension_automl_model)
      end

      should "return json if found" do
        get :show, id: @automl_model.id

        parsed_response = JSON.parse(response.body)

        assert_equal 200, response.code.to_i

        assert_equal @automl_model.automl_model_id, parsed_response['automl_model_id']

        assert_equal @automl_model.name, parsed_response['name']

        assert_equal @automl_model.prompt_id, parsed_response['prompt_id']

        assert_equal @automl_model.state, parsed_response['state']

        assert_equal @automl_model.labels, parsed_response['labels']

      end

      should "raise if not found (to be handled by parent app)" do
        assert_raises ActiveRecord::RecordNotFound do
          get :show, id: 99999
        end
      end
    end

    context "update" do
      setup do
        @automl_model = create(:comprehension_automl_model)
      end

      should "update record if valid, return nothing" do
        # NOTE: Only prompt_id is available to change during an update call
        @new_prompt = create(:comprehension_prompt)
        new_prompt_id = @new_prompt_id
        patch :update, id: @automl_model.id, automl_model: { prompt_id: new_prompt_id }

        assert_equal "", response.body
        assert_equal 204, response.code.to_i

        @automl_model.reload

        assert_equal new_prompt_id, @automl_model.prompt_id
      end

      should "not update read-only attributes return empty 204" do
        old_id = @automl_model.automl_model_id
        patch :update, id: @automl_model.id, automl_model: { automl_model_id: 'anything', name: 'anything', labels: ['anything'] }

        assert_equal 204, response.code.to_i
        assert_equal response.body, ''

        @automl_model.reload
        assert_equal @automl_model.automl_model_id, old_id
      end
    end

    context 'activate' do
      setup do
        @controller.session[:user_id] = 1
        @automl_model = create(:comprehension_automl_model)
      end

      should 'return an empty 200 response if activation is successful' do
        AutomlModel.stub_any_instance(:activate, true) do
          patch :activate, id: @automl_model.id

          assert_equal "", response.body
          assert_equal 204, response.code.to_i
        end
      end

      should 'return a 422 with the unmodified object if activation fails' do
        AutomlModel.stub_any_instance(:activate, false) do
          patch :activate, id: @automl_model.id

          parsed_response = JSON.parse(response.body)

          assert_equal 422, response.code.to_i
          assert_equal parsed_response['state'], AutomlModel::STATE_INACTIVE
        end
      end

      should "make a change log record after activating the AutoML record" do
        AutomlModel.stub_any_instance(:activate, true) do
          patch :activate, id: @automl_model.id

          change_log = Comprehension.change_log_class.last
          assert_equal change_log.action, "AutoML Model - activated"
          assert_equal change_log.user_id, 1
          assert_equal change_log.changed_record_type, "Comprehension::Prompt"
          assert_equal change_log.changed_record_id, @automl_model.prompt_id
          assert_equal change_log.new_value, @automl_model.automl_model_id.to_s
        end
      end
    end

    context 'destroy' do
      setup do
        @automl_model = create(:comprehension_automl_model)
      end

      should "destroy record at id" do
        delete :destroy, id: @automl_model.id

        assert_equal "", response.body
        assert_equal 204, response.code.to_i
        assert @automl_model.id # still in test memory
        assert_nil AutomlModel.find_by_id(@automl_model.id) # not in DB.
      end
    end
  end
end
