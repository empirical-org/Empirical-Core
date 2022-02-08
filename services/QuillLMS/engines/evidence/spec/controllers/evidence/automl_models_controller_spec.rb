# frozen_string_literal: true

require 'rails_helper'

module Evidence
  RSpec.describe(AutomlModelsController, :type => :controller) do
    before { @routes = Engine.routes }

    context 'should index' do

      it 'should return successfully - no automl_model' do
        get(:index)
        parsed_response = JSON.parse(response.body)
        expect(response.status).to eq(200)
        expect(parsed_response.class).to(eq(Array))
        expect(parsed_response.empty?).to(eq(true))
      end

      context 'should with automl_models' do
        let!(:automl_model) { create(:evidence_automl_model) }

        it 'should return successfully' do
          get(:index)
          parsed_response = JSON.parse(response.body)
          expect(response.status).to eq(200)
          expect(parsed_response.class).to(eq(Array))
          expect(parsed_response.empty?).to(eq(false))
          expect(parsed_response.first["automl_model_id"]).to(eq(automl_model.automl_model_id))
          expect(parsed_response.first["name"]).to(eq(automl_model.name))
          expect(parsed_response.first["prompt_id"]).to(eq(automl_model.prompt_id))
          expect(parsed_response.first["state"]).to(eq(automl_model.state))
          expect(parsed_response.first["labels"]).to(eq(automl_model.labels))
        end
      end
    end

    context 'should create' do
      before do
        session[:user_id] = 1
      end

      let!(:activity) { create(:evidence_activity, parent_activity_id: 1, title: "First Activity", target_level: 8, scored_level: "4th grade") }
      let!(:prompt) { create(:evidence_prompt, activity: activity, text: "it is good.") }
      let!(:automl_model) { build(:evidence_automl_model, prompt: prompt) }

      it 'should create a valid record and return it as json' do
        AutomlModel.stub_any_instance(:automl_name, automl_model.name) do
          AutomlModel.stub_any_instance(:automl_labels, automl_model.labels) do
            post(:create, :params => ({ :automl_model => ({ :prompt_id => automl_model.prompt_id, :automl_model_id => automl_model.automl_model_id }) }))
          end
        end
        parsed_response = JSON.parse(response.body)
        expect(response.code.to_i).to(eq(201))
        expect(parsed_response["automl_model_id"]).to(eq(automl_model.automl_model_id))
        expect(parsed_response["name"]).to(eq(automl_model.name))
        expect(parsed_response["prompt_id"]).to(eq(automl_model.prompt_id))
        expect(parsed_response["state"]).to(eq(AutomlModel::STATE_INACTIVE))
        expect(parsed_response["labels"]).to(eq(automl_model.labels))
        expect(AutomlModel.count).to(eq(1))
      end

      it "should make a change log record after creating the AutoML record" do
        AutomlModel.stub_any_instance(:automl_name, automl_model.name) do
          AutomlModel.stub_any_instance(:automl_labels, automl_model.labels) do
            post :create, params: {automl_model: { prompt_id: automl_model.prompt_id, automl_model_id: automl_model.automl_model_id }}
          end
        end

        automl = AutomlModel.last
        change_log = Evidence.change_log_class.last
        expect(change_log.serializable_hash["full_action"]).to(eq("AutoML Model - created"))
        expect(change_log.user_id).to(eq(1))
        expect(change_log.changed_record_type).to(eq("Evidence::AutomlModel"))
        expect(change_log.changed_record_id).to(eq(automl.id))
        expect(change_log.new_value).to(eq(nil))
      end

      it 'should create new records with state = inactive no matter what is passed in' do
        AutomlModel.stub_any_instance(:automl_name, automl_model.name) do
          AutomlModel.stub_any_instance(:automl_labels, automl_model.labels) do
            post(:create, :params => ({ :automl_model => ({ :prompt_id => automl_model.prompt_id, :automl_model_id => automl_model.automl_model_id, :state => (AutomlModel::STATE_ACTIVE) }) }))
          end
        end
        parsed_response = JSON.parse(response.body)
        expect(response.code.to_i).to(eq(201))
        expect(parsed_response["state"]).to(eq(AutomlModel::STATE_INACTIVE))
        expect(AutomlModel.count).to(eq(1))
      end

      it 'should not create an invalid record and return errors as json' do
        AutomlModel.stub_any_instance(:automl_name, automl_model.name) do
          AutomlModel.stub_any_instance(:automl_labels, automl_model.labels) do
            post(:create, :params => ({ :automl_model => ({ :prompt_id => automl_model.prompt_id, :automl_model_id => "" }) }))
          end
        end
        parsed_response = JSON.parse(response.body)
        expect(response.code.to_i).to(eq(422))
        expect(parsed_response["automl_model_id"].include?("can't be blank")).to(eq(true))
        expect(AutomlModel.count).to(eq(0))
      end
    end

    context 'should show' do
      let!(:automl_model) { create(:evidence_automl_model) }

      it 'should return json if found' do
        get(:show, :params => ({ :id => automl_model.id }))
        parsed_response = JSON.parse(response.body)
        expect(response.code.to_i).to(eq(200))
        expect(parsed_response["automl_model_id"]).to(eq(automl_model.automl_model_id))
        expect(parsed_response["name"]).to(eq(automl_model.name))
        expect(parsed_response["prompt_id"]).to(eq(automl_model.prompt_id))
        expect(parsed_response["state"]).to(eq(automl_model.state))
        expect(parsed_response["labels"]).to(eq(automl_model.labels))
      end

      it 'should raise if not found (to be handled by parent app)' do
        expect { get(:show, :params => ({ :id => 99999 })) }.to(raise_error(ActiveRecord::RecordNotFound))
      end
    end

    context 'should update' do
      let!(:automl_model) { create(:evidence_automl_model) }

      it 'should update record if valid' do
        new_prompt = create(:evidence_prompt)
        new_prompt_id = new_prompt.id
        patch(:update, :params => ({ :id => automl_model.id, :automl_model => ({ :prompt_id => new_prompt_id }) }))
        expect(response.code.to_i).to(eq(200))
        expect(automl_model.id).to(eq(JSON.parse(response.body)["id"]))
        automl_model.reload
        expect(automl_model.prompt_id).to(eq(new_prompt_id))
      end

      it 'should not update read-only attributes return 200' do
        old_id = automl_model.automl_model_id
        patch(:update, :params => ({ :id => automl_model.id, :automl_model => ({ :automl_model_id => "anything", :name => "anything", :labels => (["anything"]) }) }))
        expect(response.code.to_i).to(eq(200))
        expect(automl_model.id).to(eq(JSON.parse(response.body)["id"]))
        automl_model.reload
        expect(old_id).to(eq(automl_model.automl_model_id))
      end
    end

    context 'should activate' do
      before do
        session[:user_id] = 1
      end

      let!(:automl_model) { create(:evidence_automl_model) }

      it 'should return an empty 200 response if activation is successful' do
        AutomlModel.stub_any_instance(:activate, true) do
          patch(:activate, :params => ({ :id => automl_model.id }))
          expect(response.body).to(eq(""))
          expect(response.code.to_i).to(eq(204))
        end
      end

      it "should make a change log record after activating the AutoML record" do
        prompt = create(:evidence_prompt)
        automl = create(:evidence_automl_model, prompt: prompt)
        rule = create(:evidence_rule, rule_type: Evidence::Rule::TYPE_AUTOML)
        label = create(:evidence_label, rule: rule, name: automl.labels[0])
        create(:evidence_prompts_rule, prompt: prompt, rule: rule)
        patch :activate, params: {id: automl.id}

        change_log = Evidence.change_log_class.last
        expect(change_log.serializable_hash["full_action"]).to(eq("AutoML Model - activated"))
        expect(change_log.user_id).to(eq(1))
        expect(change_log.changed_record_type).to(eq("Evidence::AutomlModel"))
        expect(change_log.changed_record_id).to(eq(automl.id))
        expect(change_log.new_value).to(eq(nil))
      end

      it 'should return a 422 with the unmodified object if activation fails' do
        AutomlModel.stub_any_instance(:activate, false) do
          patch(:activate, :params => ({ :id => automl_model.id }))
          parsed_response = JSON.parse(response.body)
          expect(response.code.to_i).to(eq(422))
          expect(AutomlModel::STATE_INACTIVE).to(eq(parsed_response["state"]))
        end
      end
    end

    context 'should destroy' do
      let!(:automl_model) { create(:evidence_automl_model) }

      it 'should destroy record at id' do
        delete(:destroy, :params => ({ :id => automl_model.id }))
        expect(response.body).to(eq(""))
        expect(response.code.to_i).to(eq(204))
        expect(automl_model.id).to(be_truthy)
        expect(AutomlModel.find_by_id(automl_model.id)).to(be_nil)
      end
    end
  end
end
