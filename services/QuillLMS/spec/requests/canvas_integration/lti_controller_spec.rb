# frozen_string_literal: true

require 'rails_helper'

module CanvasIntegration
  describe LtiController, type: :request do

    context '#lts_launch_config' do
      before { subject }

      subject { get '/canvas_integration/lti/launch_config.xml' }

      let(:doc) { Nokogiri::XML(response.body) { |config| config.strict } }

      it { expect(response).to have_http_status(:success) }
      it { expect(response.content_type).to eq 'application/xml; charset=utf-8' }
      it { expect { doc }.not_to raise_error }

      context 'blti:launch_url' do
        let(:node) { doc.at_xpath('//blti:launch_url') }

        it { expect(node.content).to eq 'http://www.example.com/canvas_integration/lti/launch' }
      end

      context 'custom_fields' do
        context 'canvas_instance_url' do
          let(:node) { doc.xpath("//lticm:property[@name='canvas_instance_url']") }

          it { expect(node.text).to eq '$Canvas.api.baseUrl' }
        end

        context 'canvas_user_email' do
          let(:node) { doc.xpath("//lticm:property[@name='canvas_user_email']") }

          it { expect(node.text).to eq '$Person.email.primary' }
        end

        context 'canvas_user_external_id' do
          let(:node) { doc.xpath("//lticm:property[@name='canvas_user_external_id']") }

          it { expect(node.text).to eq '$Canvas.user.id' }
        end

        context 'canvas_user_name' do
          let(:node) { doc.xpath("//lticm:property[@name='canvas_user_name']") }

          it { expect(node.text).to eq '$Person.name.full' }
        end
      end
    end

    context '#lti_launch' do
      subject { post '/canvas_integration/lti/launch', params: params }

      let(:params) do
        {
          custom_canvas_instance_url: url,
          custom_canvas_user_email:  email,
          custom_canvas_user_external_id: external_id,
          custom_canvas_user_name: name,
          ext_roles: ext_roles
        }
      end

      let(:canvas_instance) { create(:canvas_instance) }

      let(:url) { canvas_instance.url }
      let(:email)  { Faker::Internet.email }
      let(:external_id) { Faker::Number.number }
      let(:name) { Faker::Name.name }
      let(:ext_roles) { CanvasIntegration::RoleExtractor::INSTRUCTOR_ROLE }

      context 'existing user' do
        let!(:user) { create(:user, email: email) }

        it { expect { subject }.to change(CanvasAccount, :count).by(1) }
        it { expect { subject }.to change(User, :count).by(0) }

        context 'existing canvas account' do
          before { create(:canvas_account, canvas_instance: canvas_instance, external_id: external_id, user: user) }

          it { expect { subject }.to change(CanvasAccount, :count).by(0) }
          it { expect { subject }.to change(User, :count).by(0) }
        end
      end

      context 'new user' do
        it { expect { subject }.to change(CanvasAccount, :count).by(1) }
        it { expect { subject }.to change(User, :count).by(1) }
      end

      context 'happy path' do
        before { subject }

        it { expect(response).to have_http_status(:success) }
        it { expect(response.content_type).to eq 'text/html; charset=utf-8' }
        it { expect(response.body).to include(described_class::LAUNCH_TEXT) }
        it { expect(response.body).not_to include("<script") }  # LTI does not allow scripts
      end
    end
  end
end
