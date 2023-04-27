# frozen_string_literal: true

require 'rails_helper'

RSpec.describe CanvasInstancesController do
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
    let(:school_ids) { [school.id] }

    let(:valid_params) do
      {
        canvas_instance: attributes_for(:canvas_instance),
        canvas_config: attributes_for(:canvas_config),
        canvas_instance_schools: school_ids
      }
    end

    context 'valid params' do
      let(:params) { valid_params }

      it { should_return_created }
      it { expect { subject}.to change(CanvasInstance, :count).from(0).to(1) }
      it { expect { subject}.to change(CanvasConfig, :count).from(0).to(1) }
      it { expect { subject}.to change(CanvasInstanceSchool, :count).from(0).to(1) }

      context 'school_ids is empty' do
        let(:school_ids) { [] }

        it { expect { subject}.to change(CanvasInstance, :count).from(0).to(1) }
        it { expect { subject}.to change(CanvasConfig, :count).from(0).to(1) }
        it { expect { subject}.not_to change(CanvasInstanceSchool, :count) }
      end
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

  def should_return_unprocessable_entity
    subject
    expect(response).to have_http_status(:unprocessable_entity)
  end

  def should_return_created
    subject
    expect(response).to have_http_status(:created)
  end

  def should_not_create_canvas_objects
    expect(CanvasInstance.count).to eq(0)
    expect(CanvasConfig.count).to eq(0)
    expect(CanvasInstanceSchool.count).to eq(0)
  end
end
