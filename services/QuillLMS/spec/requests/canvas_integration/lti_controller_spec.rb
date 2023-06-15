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
        context 'canvas_api_baseurl' do
          let(:node) { doc.xpath("//lticm:property[@name='canvas_api_baseurl']") }

          it { expect(node.text).to eq '$Canvas.api.baseUrl' }
        end

        context 'canvas_user_id' do
          let(:node) { doc.xpath("//lticm:property[@name='canvas_user_id']") }

          it { expect(node.text).to eq '$Canvas.user.id' }
        end
      end
    end

    context '#lti_launch' do
      subject { post '/canvas_integration/lti/launch', params: params }

      let(:custom_canvas_api_base_url) { 'http://www.example.com' }
      let(:ext_roles) { CanvasIntegration::RoleExtractor::INSTRUCTOR_ROLE }
      let(:role) { User::TEACHER }
      let(:params) { { custom_canvas_api_baseurl: custom_canvas_api_base_url, ext_roles: ext_roles} }

      it do
        expect(CanvasIntegration::RoleExtractor).to receive(:run).with(ext_roles).and_return(role)
        subject
      end

      context 'with valid params' do
        before { subject }

        it { expect(response).to have_http_status(:success) }
        it { expect(response.content_type).to eq 'text/html; charset=utf-8' }
        it { expect(response.body).to include(described_class::LAUNCH_TEXT) }
        it { expect(response.body).not_to include("<script") }  # LTI does not allow scripts
      end
    end
  end
end
