# frozen_string_literal: true

require 'rails_helper'

describe Auth::CanvasController, type: :request do
  let(:user) { create(:teacher) }
  let(:canvas_account) { create(:canvas_account, user: user) }
  let(:canvas_instance) { canvas_account.canvas_instance }
  let(:uid) { canvas_account.external_id }
  let(:url) { canvas_instance.url }

  let(:auth_hash) { create(:canvas_auth_hash, uid: uid, url: url) }

  before { OmniAuth.config.mock_auth[:canvas] = auth_hash }

  describe '/auth/canvas/callback' do
    subject { get Auth::Canvas::OMNIAUTH_CALLBACK_PATH }

    let(:canvas_auth_credential) { create(:canvas_auth_credential, user: user) }

    before { set_session_canvas_instance_id }

    it do
      expect(CanvasIntegration::AuthCredentialSaver)
        .to receive(:run)
        .with(auth_hash)
        .and_return(canvas_auth_credential)

      subject
    end

    it do
      expect(CanvasIntegration::UpdateTeacherImportedClassroomsWorker)
        .to receive(:perform_async)
        .with(user.id)

      subject
    end

    context 'student user' do
      before { user.update(role: 'student') }

      it do
        expect(CanvasIntegration::UpdateTeacherImportedClassroomsWorker).not_to receive(:perform_async)
        subject
      end
    end

    context 'with a valid auth_hash' do
      before { subject }

      it { expect(response).to redirect_to(profile_path) }
      it { expect(response).to have_http_status(:found) }
    end
  end

  def set_session_canvas_instance_id
    post Auth::Canvas::OMNIAUTH_REQUEST_PATH, params: { canvas_instance_id: canvas_instance.id }
  end
end
