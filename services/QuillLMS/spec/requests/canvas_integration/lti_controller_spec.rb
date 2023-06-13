# frozen_string_literal: true

require 'rails_helper'

module CanvasIntegration
  describe LtiController, type: :request do
    before { subject }

    context '#lts_launch_config' do
      subject { get '/canvas_integration/lti/launch_config.xml' }

      let(:doc) { Nokogiri::XML(response.body) { |config| config.strict } }

      it { expect(response).to have_http_status(:success) }
      it { expect(response.content_type).to eq 'application/xml; charset=utf-8' }
      it { expect { doc }.not_to raise_error }

      context 'blti:launch_url' do
        let(:node) { doc.at_xpath('//blti:launch_url') }

        it { expect(node.content).to eq 'http://www.example.com/canvas_integration/lti/launch' }
      end
    end

    context '#lti_launch' do
      subject { post '/canvas_integration/lti/launch' }

      it { expect(response).to have_http_status(:success) }
      it { expect(response.content_type).to eq 'text/html; charset=utf-8' }
      it { expect(response.body).to include(described_class::LAUNCH_TEXT) }
      it { expect(response.body).not_to include("<script") }  # LTI does not allow scripts
    end
  end
end
