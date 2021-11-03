require 'rails_helper'

describe ApplicationController, type: :controller do
  let(:user) { create(:user) }

  describe "#user_inactive_for_too_long?" do

    before(:each) do
      ApplicationController.send(:public, *ApplicationController.protected_instance_methods)
    end

    context "when KEEP_ME_SIGNED_IN is true" do

      it 'should always return false' do
        session[ApplicationController::KEEP_ME_SIGNED_IN] = true

        expect(controller.user_inactive_for_too_long?).not_to be
      end

    end

    context "when user is a Google user" do
      before do
        user = create(:user, google_id: 123)
        allow(controller).to receive(:current_user) { user }
      end

      it 'should always return false' do
        expect(controller.user_inactive_for_too_long?).not_to be
      end

    end

    context "when user is a Clever user" do
      before do
        user = create(:user, clever_id: 123)
        allow(controller).to receive(:current_user) { user }
      end

      it 'should always return false' do
        expect(controller.user_inactive_for_too_long?).not_to be
      end

    end

    context "when user has a last active value and a last sign in value that are both more than 30 days old" do

      before do
        user = create(:user, last_active: 31.days.ago, last_sign_in: 31.days.ago)
        allow(controller).to receive(:current_user) { user }
      end

      it 'should return true' do
        expect(controller.user_inactive_for_too_long?).to be
      end
    end

  end

  describe '#confirm_valid_session' do
    before(:each) do
      ApplicationController.send(:public, *ApplicationController.protected_instance_methods)
    end

    it 'when user has a google ID and their auth credential is expired' do
      user = create(:user, google_id: 123)
      session[:user_id] = user.id
      auth_credential = create(:auth_credential, provider: 'google', user: user, refresh_token: 'refresh', expires_at: Time.now - 1.day)
      allow(controller).to receive(:current_user) { user }

      expect(controller.confirm_valid_session).to be(nil)
      expect(session[:user_id]).to eq(nil)
    end
  end
end
