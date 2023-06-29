# frozen_string_literal: true

require 'rails_helper'

module Auth
  describe CanvasController, type: :request do
    let(:canvas_instance) { create(:canvas_instance) }
    let(:url) { canvas_instance.url }
    let(:auth_hash) { create(:canvas_auth_hash, url: url) }
    let(:external_id) { auth_hash[:uid] }

    before { OmniAuth.config.mock_auth[:canvas] = auth_hash }

    describe '/auth/canvas/callback' do
      subject { get Auth::Canvas::OMNIAUTH_CALLBACK_PATH }

      let(:user) { create(:user) }
      let(:auth_credential) { create(:canvas_auth_credential, user: user) }

      before { set_session_canvas_instance_id }

      it do
        expect(CanvasIntegration::AuthCredentialSaver).to receive(:run).with(auth_hash).and_return(auth_credential)
        subject
      end

      context 'with a valid auth_hash' do
        let!(:canvas_account) { create(:canvas_account, canvas_instance: canvas_instance, external_id: external_id, user: user) }

        before { subject }

        it { expect(response).to redirect_to(profile_path) }
        it { expect(response).to have_http_status(:found) }
      end
    end

    def set_session_canvas_instance_id
      post Auth::Canvas::OMNIAUTH_REQUEST_PATH, params: { canvas_instance_id: canvas_instance.id }
    end
  end
end
