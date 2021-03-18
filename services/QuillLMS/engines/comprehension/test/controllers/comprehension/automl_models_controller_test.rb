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

      context "with filter params" do
        setup do
          @prompt1 = create(:comprehension_prompt)
          @prompt2 = create(:comprehension_prompt)

          @model1 = create(:comprehension_automl_model, prompt_id: @prompt1.id, state: 'inactive')
          @model2 = create(:comprehension_automl_model, prompt_id: @prompt1.id, state: 'active')
          @model3 = create(:comprehension_automl_model, prompt_id: @prompt2.id, state: 'inactive')
          @model4 = create(:comprehension_automl_model, prompt_id: @prompt2.id, state: 'inactive')
        end

        should 'only get Models for specified prompt id when provided' do
          get :index, prompt_id: @prompt1.id, active: true

          parsed_response = JSON.parse(response.body)

          assert_equal parsed_response.length, 2
          parsed_response.each do |r|
            assert r['prompt_ids'].include?(@prompt1.id)
            assert r['state'] == 'active'
          end
        end
      end
    end

    context "create" do
      setup do
        @automl_model = build(:comprehension_automl_model)
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
