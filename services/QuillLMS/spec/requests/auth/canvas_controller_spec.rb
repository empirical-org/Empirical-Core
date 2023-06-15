# frozen_string_literal: true

require 'rails_helper'

module Auth
  describe CanvasController, type: :request do
    let(:auth_hash) { create(:canvas_auth_hash) }
    let(:url) { auth_hash.dig(:info, :url) }
    let(:canvas_instance) { create(:canvas_instance, :with_canvas_config, url: url) }
    let(:role) { User::TEACHER }

    before { OmniAuth.config.mock_auth[:canvas] = auth_hash }

    describe '/auth/canvas/callback' do
      subject { get Auth::Canvas::OMNIAUTH_CALLBACK_PATH }

      before { set_session_canvas_instance_id_and_role }

      it do
        expect(CanvasIntegration::UserImporter)
          .to receive(:run)
          .with(auth_hash, role)
          .and_return(create(:user))

        subject
      end

      context 'with a valid auth_hash' do
        before { subject }

        it { expect(response).to redirect_to(profile_path) }
        it { expect(response).to have_http_status(:found) }
      end
    end

    def set_session_canvas_instance_id_and_role
      post Auth::Canvas::OMNIAUTH_REQUEST_PATH, params: { canvas_instance_id: canvas_instance&.id, role: role }
    end
  end
end
