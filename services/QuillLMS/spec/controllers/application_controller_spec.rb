# frozen_string_literal: true

require 'rails_helper'

describe ApplicationController, type: :controller do
  context 'protected methods' do
    let(:user) { create(:user) }

    before { allow(controller).to receive(:current_user) { user } }

    describe '#check_staff_for_extended_session' do
      before { ApplicationController.send(:public, :check_staff_for_extended_session) }

      subject { controller.check_staff_for_extended_session }

      context 'current_user is nil' do
        let(:user) { nil }

        it do
          expect(controller).to_not receive(:sign_out)
          subject
        end
      end

      context 'current_user.staff_session_duration is exceeded is false' do
        before { allow(user).to receive(:staff_session_duration_exceeded?).and_return(false) }

        it do
          expect(controller).to_not receive(:sign_out)
          subject
        end
      end

      context 'current_user.staff_session_duration is exceeded is true' do
        before { allow(user).to receive(:staff_session_duration_exceeded?).and_return(true) }

        it do
          expect(controller).to receive(:sign_out)
          subject
        end
      end
    end

    describe "#confirm_valid_session" do
      before { ApplicationController.send(:public, :confirm_valid_session) }

      subject { controller.confirm_valid_session }

      context 'when no current_user' do
        before { allow(user).to receive(:nil?).and_return(true) }

        it do
          expect(controller).to_not receive(:reset_session)
          subject
        end
      end

      context 'when no session' do
        before { allow(session).to receive(:nil?).and_return(true) }

        it do
          expect(controller).to_not receive(:reset_session)
          subject
        end
      end

      context 'when staff is logged in' do
        before { session[:staff_id] = 123 }

        it do
          expect(controller).to_not receive(:reset_session)
          subject
        end
      end

      context "when a reset_session? and current_user.google_access_expired? both false" do
        before do
          allow(controller).to receive(:reset_session?).and_return(false)
          allow(user).to receive(:google_access_expired?).and_return(false)
        end

        it do
          expect(controller).to_not receive(:reset_session)
          subject
        end
      end

      context "when reset_session? is true" do
        before { allow(controller).to receive(:reset_session?).and_return(true) }

        it do
          expect(controller).to receive(:reset_session)
          subject
        end
      end

      context "when current_user.google_access_expired? is true" do
        before { allow(user).to receive(:google_access_expired?).and_return(true) }

        it do
          expect(controller).to receive(:reset_session)
          subject
        end
      end
    end

    describe "#reset_session?" do
      before { ApplicationController.send(:public, :reset_session?) }

      context "when a user.inactive_too_long? is false" do
        before { allow(user).to receive(:inactive_too_long?).and_return(false) }

        it { expect(controller.reset_session?).to be false }
      end

      context "when a user.inactive_too_long? is true" do
        before { allow(user).to receive(:inactive_too_long?).and_return(true) }

        it { expect(controller.reset_session?).to be true }

        context "when KEEP_ME_SIGNED_IN is false" do
          before { session[ApplicationController::KEEP_ME_SIGNED_IN] = false }

          it { expect(controller.reset_session?).to be true }
        end

        context "when KEEP_ME_SIGNED_IN is true" do
          before { session[ApplicationController::KEEP_ME_SIGNED_IN] = true }

          it { expect(controller.reset_session?).to be false }
        end

        context "when user is a Google user" do
          before { allow(user).to receive(:google_id).and_return('123') }

          it { expect(controller.reset_session?).to be false }
        end

        context "when user is a Clever user" do
          before { allow(user).to receive(:clever_id).and_return('123') }

          it { expect(controller.reset_session?).to be false }
        end
      end
    end
  end

  context '#handle_invalid_inauthenticity_token' do
    controller do
      def custom
        raise ActionController::InvalidAuthenticityToken
      end
    end

    let(:referer) { 'http://test.host/referer_path' }
    let(:redirect_path) { URI.parse(referer).path }

    before do
      routes.draw { post 'custom' => "anonymous#custom" }
      request.headers['HTTP_REFERER'] = referer
    end

    it 'handles InvalidAuthenticityToken error with format: :json' do
      post :custom, params: {}, as: :json

      expect(flash[:error]).to eq(I18n.t('actioncontroller.errors.invalid_authenticity_token'))
      expect(response.body).to eq({ redirect: redirect_path }.to_json)
    end

    it 'handles InvalidAuthenticityToken error with format: :html' do
      post :custom, params: {}

      expect(flash[:error]).to eq(I18n.t('actioncontroller.errors.invalid_authenticity_token'))
      expect(response).to redirect_to(redirect_path)
    end
  end
end
