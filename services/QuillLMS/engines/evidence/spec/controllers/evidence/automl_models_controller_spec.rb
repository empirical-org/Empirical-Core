# frozen_string_literal: true

require 'rails_helper'

module Evidence
  RSpec.describe AutomlModelsController, type: :controller do
    before { @routes = Engine.routes }

    let(:parsed_response) { JSON.parse(response.body) }
    let(:user) { Evidence.user_class.create(name: 'test') }

    describe '#index' do
      subject { get :index }

      it 'should return successfully - no automl_model' do
        subject
        expect(response.status).to eq 200
        expect(parsed_response.class).to eq Array
        expect(parsed_response).to be_empty
      end

      context 'should with automl_models' do
        let!(:automl_model) { create(:evidence_automl_model) }

        it 'should return successfully' do
          subject
          expect(response.status).to eq 200
          expect(parsed_response.class).to eq Array
          expect(parsed_response).not_to be_empty
          expect(parsed_response.first['model_external_id']).to eq automl_model.model_external_id
          expect(parsed_response.first['endpoint_external_id']).to eq automl_model.endpoint_external_id
          expect(parsed_response.first['name']).to eq automl_model.name
          expect(parsed_response.first['prompt_id']).to eq automl_model.prompt_id
          expect(parsed_response.first['state']).to eq automl_model.state
          expect(parsed_response.first['labels']).to eq automl_model.labels
        end
      end
    end

    describe '#create' do
      subject { post :create, params: { automl_model: automl_model_params } }

      let(:prompt) { create(:evidence_prompt) }
      let(:automl_model) { build(:evidence_automl_model, **automl_model_params) }
      let(:name) { 'name' }
      let(:labels) { ['label1'] }

      before do
        session[:user_id] = user.id
        allow(Evidence::AutomlModel).to receive(:new).and_return(automl_model)
        allow(automl_model).to receive(:pull_name).and_return(name)
        allow(automl_model).to receive(:pull_labels).and_return(labels)
      end

      context 'valid params' do
        let(:automl_model_params) do
          {
            endpoint_external_id: endpoint_external_id,
            model_external_id: model_external_id,
            prompt_id: prompt.id,
          }
        end

        let(:endpoint_external_id) { 'endpoint_external_id' }
        let(:model_external_id) { 'model_external_id' }
        let(:state) { AutomlModel::STATE_INACTIVE }

        before { subject }

        it 'creates a valid record and return it as json' do
          expect(response.code.to_i).to eq 201
          expect(parsed_response['model_external_id']).to eq model_external_id
          expect(parsed_response['endpoint_external_id']).to eq endpoint_external_id
          expect(parsed_response['name']).to eq name
          expect(parsed_response['prompt_id']).to eq prompt.id
          expect(parsed_response['state']).to eq AutomlModel::STATE_INACTIVE
          expect(parsed_response['labels']).to eq labels
          expect(AutomlModel.count).to eq 1
        end

        it 'make a change log record after creating the AutoML record' do
          change_log = Evidence.change_log_class.last
          expect(change_log.serializable_hash['full_action']).to eq 'AutoML Model - created'
          expect(change_log.user_id).to eq user.id
          expect(change_log.changed_record).to eq AutomlModel.last
          expect(change_log.new_value).to be_nil
        end

        context 'state = active passed in as param' do
          let(:automl_model_params) { super().merge(state: AutomlModel::STATE_ACTIVE) }

          it 'creates new records with state = inactive' do
            expect(response.code.to_i).to eq 201
            expect(parsed_response['state']).to eq AutomlModel::STATE_INACTIVE
            expect(AutomlModel.count).to eq 1
          end
        end

        context 'state = nil passed in as param' do
          let(:automl_model_params) { super().merge(state: nil) }

          it 'creates new records with state = inactive' do
            expect(response.code.to_i).to eq 201
            expect(parsed_response['state']).to eq AutomlModel::STATE_INACTIVE
            expect(AutomlModel.count).to eq 1
          end
        end
      end

      context 'invalid params' do
        let(:automl_model_params) { { endpoint_external_id: '', model_external_id: '', prompt_id: prompt.id } }

        before { subject }

        it 'does not create record and return errors as json' do
          expect(response.code.to_i).to eq 422
          expect(parsed_response['model_external_id'].include?("can't be blank")).to eq true
          expect(parsed_response['endpoint_external_id'].include?("can't be blank")).to eq true
          expect(AutomlModel.count).to eq 0
        end
      end
    end

    describe '#show' do
      let!(:automl_model) { create(:evidence_automl_model) }

      it 'should return json if found' do
        get :show, params: { id: automl_model.id }

        expect(response.code.to_i).to(eq(200))
        expect(parsed_response['model_external_id']).to(eq(automl_model.model_external_id))
        expect(parsed_response['endpoint_external_id']).to(eq(automl_model.endpoint_external_id))
        expect(parsed_response['name']).to(eq(automl_model.name))
        expect(parsed_response['prompt_id']).to(eq(automl_model.prompt_id))
        expect(parsed_response['state']).to(eq(automl_model.state))
        expect(parsed_response['labels']).to(eq(automl_model.labels))
      end

      it { expect { get :show, params: { id: 99999 } }.to raise_error ActiveRecord::RecordNotFound }
    end

    describe '#update' do
      let!(:automl_model) { create(:evidence_automl_model) }
      let(:new_prompt) { create(:evidence_prompt) }

      it 'should update record if valid' do
        patch :update, params: {
          id: automl_model.id,
          automl_model: { prompt_id: new_prompt.id }
        }

        expect(response.code.to_i).to eq 200
        expect(automl_model.id).to eq JSON.parse(response.body)['id']
        expect(automl_model.reload.prompt_id).to eq new_prompt.id
      end

      it 'should not update read-only attributes return 200' do
        model_external_id = automl_model.model_external_id

        patch :update, params: {
          id: automl_model.id,
          automl_model: {
            model_external_id: 'anything',
            name: 'anything',
            :labels => ['anything']
          }
        }

        expect(response.code.to_i).to eq 200
        expect(automl_model.id).to eq JSON.parse(response.body)['id']
        expect(automl_model.reload.model_external_id).to eq model_external_id
      end
    end

    describe '#activate' do
      subject { patch :activate, params: { id: automl_model.id } }

      let(:automl_model) { create(:evidence_automl_model) }
      let(:lms_user_id) { user.id }

      before { session[:user_id] = lms_user_id }

      context 'successful activation' do
        let(:rule) { create(:evidence_rule, :type_automl) }

        before do
          create(:evidence_label, rule: rule, name: automl_model.labels.first)
          create(:evidence_prompts_rule, prompt: automl_model.prompt, rule: rule)
        end

        it 'should return an empty 204 response if activation is successful' do
          subject
          expect(response.body).to eq ''
          expect(response.code.to_i).to eq 204
        end

        it 'should make a change log record after activating the AutoML record' do
          subject
          change_log = Evidence.change_log_class.last
          expect(change_log.serializable_hash['full_action']).to eq 'AutoML Model - activated'
          expect(change_log.user_id).to eq lms_user_id
          expect(change_log.changed_record).to eq automl_model
          expect(change_log.new_value).to be_nil
        end
      end

      context 'unsuccessful activation' do
        let(:original_state) { automl_model.state }

        before do
          allow(Evidence::AutomlModel).to receive(:find).with(automl_model.id.to_s).and_return(automl_model)
          allow(automl_model).to receive(:activate).and_return(false)
        end

        it 'should return a 422 with the unmodified object if activation' do
          subject
          expect(response.code.to_i).to eq 422
          expect(parsed_response['state']).to eq AutomlModel::STATE_INACTIVE
        end
      end
    end

    describe '#destroy' do
      subject { delete :destroy, params: { id: automl_model.id } }

      let(:automl_model) { create(:evidence_automl_model) }

      it 'should destroy record at id' do
        subject
        expect(response.body).to eq ''
        expect(response.code.to_i).to eq 204
        expect(automl_model.id).not_to be_nil
        expect(AutomlModel.exists?(automl_model.id)).to be false
      end
    end
  end
end
