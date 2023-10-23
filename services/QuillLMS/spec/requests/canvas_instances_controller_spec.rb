# frozen_string_literal: true

require 'rails_helper'

RSpec.describe CanvasInstancesController do
  describe 'create' do
    subject { post canvas_instances_path, params: params }

    let(:params) { {} }

    before do
      allow(User).to receive(:find).with(user.id).and_return(user)
      sign_in user
    end

    context 'user is a student' do
      let(:user) { create(:student) }

      it { expect(subject).to redirect_to new_session_path }
    end

    context 'user is a teacher' do
      let(:user) { create(:teacher) }

      it { expect(subject).to redirect_to new_session_path }
    end

    context 'user is an admin' do
      let(:user) { create(:admin) }
      let(:school) { create(:school) }

      let(:valid_params) do
        {
          canvas_instance: attributes_for(:canvas_instance),
          canvas_config: attributes_for(:canvas_config),
          canvas_instance_schools: { school_ids: [school.id] }
        }
      end

      context 'valid params' do
        let(:params) { valid_params }

        it { should_return_created }
        it { expect { subject}.to change(CanvasInstance, :count).from(0).to(1) }
        it { expect { subject}.to change(CanvasConfig, :count).from(0).to(1) }
        it { expect { subject}.to change(CanvasInstanceSchool, :count).from(0).to(1) }
      end

      context 'invalid params' do
        context 'empty url' do
          let(:params) { valid_params.merge(canvas_instance: { url: '' }) }

          it { should_return_unprocessable_entity }
          it { should_not_create_canvas_objects }
        end

        context 'invalid url' do
          let(:params) { valid_params.merge(canvas_instance: { url: 'not-a-url' }) }

          it { should_return_unprocessable_entity }
          it { should_not_create_canvas_objects }
        end

        context 'empty client_id' do
          let(:params) { valid_params.merge(canvas_config: { client_id: '' }) }

          it { should_return_unprocessable_entity }
          it { should_not_create_canvas_objects }
        end

        context 'empty client_secret' do
          let(:params) { valid_params.merge(canvas_config: { client_secret: '' }) }

          it { should_return_unprocessable_entity }
          it { should_not_create_canvas_objects }
        end
      end
    end
  end

  describe 'update' do
    let(:params) { {} }

    before do
      allow(User).to receive(:find).with(user.id).and_return(user)
      sign_in user
    end

    context 'user is an admin' do
      let(:user) { create(:admin) }
      let(:school1) { create(:school) }
      let(:school2) { create(:school) }

      let!(:canvas_instance) { create(:canvas_instance) }
      let!(:canvas_config) { create(:canvas_config, canvas_instance: canvas_instance) }
      let!(:canvas_instance_school) { create(:canvas_instance_school, school: school1, canvas_instance: canvas_instance) }
      let(:new_url) { "https://#{Faker::Internet.domain_word}-#{Faker::Internet.domain_word}.instructure.com" }
      let(:new_canvas_config) { attributes_for(:canvas_config) }

      let(:valid_params) do
        {
          id: canvas_instance.id,
          canvas_instance: { url: new_url },
          canvas_config: new_canvas_config,
          canvas_instance_schools: { school_ids: [school2.id] }
        }
      end

      subject { put canvas_instance_path(canvas_instance), params: params }

      context 'valid params' do
        let(:params) { valid_params }

        it { should_return_ok }

        it { expect { subject }.to change { canvas_instance.reload.url }.to new_url }
        it { expect { subject }.to change { canvas_instance.reload.client_id }.to new_canvas_config[:client_id] }
        it { expect { subject }.to change { canvas_instance.reload.client_secret }.to new_canvas_config[:client_secret] }
        it { expect { subject }.to change { canvas_instance.reload.school_ids }.to [school2.id] }
      end

      context 'invalid params' do
        context 'empty url' do
          let(:params) { valid_params.merge(canvas_instance: { url: '' }) }

          it { should_return_unprocessable_entity }
        end

        context 'invalid url' do
          let(:params) { valid_params.merge(canvas_instance: { url: 'not-a-url' }) }

          it { should_return_unprocessable_entity }
        end

        context 'empty client_id' do
          let(:params) { valid_params.merge(canvas_config: { client_id: '' }) }

          it { should_return_unprocessable_entity }
        end

        context 'empty client_secret' do
          let(:params) { valid_params.merge(canvas_config: { client_secret: '' }) }

          it { should_return_unprocessable_entity }
        end
      end
    end
  end

  describe 'destroy' do
    before do
      allow(User).to receive(:find).with(user.id).and_return(user)
      sign_in user
    end

    context 'user is an admin' do
      let(:user) { create(:admin) }
      let(:school1) { create(:school) }
      let(:school2) { create(:school) }

      let!(:canvas_instance) { create(:canvas_instance) }
      let!(:canvas_config) { create(:canvas_config, canvas_instance: canvas_instance) }
      let!(:canvas_instance_school) { create(:canvas_instance_school, school: school1, canvas_instance: canvas_instance) }

      let(:valid_params) do
        {
          id: canvas_instance.id,
        }
      end

      subject { delete canvas_instance_path(canvas_instance), params: params }

      context 'valid params' do
        let(:params) { valid_params }

        it { should_return_ok }

        it { expect { subject }.to change(CanvasInstance, :count).to 0 }
        it { expect { subject }.to change(CanvasConfig, :count).to 0 }
        it { expect { subject }.to change(CanvasInstanceSchool, :count).to 0 }
      end
    end
  end

  def should_return_unprocessable_entity
    subject
    expect(response).to have_http_status(:unprocessable_entity)
  end

  def should_return_created
    subject
    expect(response).to have_http_status(:created)
  end

  def should_return_ok
    subject
    expect(response).to have_http_status(:ok)
  end

  def should_not_create_canvas_objects
    expect(CanvasInstance.count).to eq 0
    expect(CanvasConfig.count).to eq 0
    expect(CanvasInstanceSchool.count).to eq 0
  end
end
