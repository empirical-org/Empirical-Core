require 'rails_helper'

module Comprehension
  RSpec.describe(AutomlModelsController, :type => :controller) do
    before { routes = Engine.routes }

    context 'should index' do

      it 'should return successfully - no automl_model' do
        get(:index)
        parsed_response = JSON.parse(response.body)
        expect(response.status).to eq(200)
        expect(parsed_response.class).to(eq(Array))
        expect(parsed_response.empty?).to(eq(true))
      end

      context 'should with automl_models' do
        before { let(:automl_model) { create(:comprehension_automl_model) } }

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
      before { let(:automl_model) { build(:comprehension_automl_model) } }

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
      before { let(:automl_model) { create(:comprehension_automl_model) } }

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
      before { let(:automl_model) { create(:comprehension_automl_model) } }

      it 'should update record if valid' do
        let(:new_prompt) { create(:comprehension_prompt) }
        new_prompt_id = new_prompt_id
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
      before { let(:automl_model) { create(:comprehension_automl_model) } }

      it 'should return an empty 200 response if activation is successful' do
        AutomlModel.stub_any_instance(:activate, true) do
          patch(:activate, :params => ({ :id => automl_model.id }))
          expect(response.body).to(eq(""))
          expect(response.code.to_i).to(eq(204))
        end
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
      before { let(:automl_model) { create(:comprehension_automl_model) } }

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
