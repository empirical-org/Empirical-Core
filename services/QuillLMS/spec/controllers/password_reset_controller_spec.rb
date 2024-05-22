# frozen_string_literal: true

require 'rails_helper'

describe PasswordResetController do
  describe '#index' do
    let(:new_user)  { double(:user) }

    before do
      allow(User).to receive(:new) { new_user }
    end

    it 'should set a new user' do
      get :index
      expect(assigns(:user)).to eq new_user
    end
  end

  describe '#create' do
    context 'when user exists' do
      let!(:user) { create(:user) }
      let(:mailer) { double(:mailer, deliver_now!: true) }

      before do
        allow(UserMailer).to receive(:password_reset_email) { mailer }
      end

      it 'does not call unlink_google_account!' do
        expect(user).not_to receive(:unlink_google_account!)
        subject
      end

      it 'should refresh the token, send the password reset mailer and redirect to index path' do
        expect_any_instance_of(User).to receive(:refresh_token!)
        expect(UserMailer).to receive(:password_reset_email).with(user)
        expect(ExpirePasswordTokenWorker).to receive(:perform_in).with(24.hours, user.id)
        post :create, params: { user: { email: user.email } }
        expect(response.body).to eq ({ redirect: '/password_reset'}.to_json)

      end
    end

    context 'when user does not exist' do
      it 'should render the index page and show error' do
        post :create, params: { user: { email: "test@test.com" } }
        expect(response.body).to eq ({ message: 'An account with this email does not exist. Try again.', type: 'email' }.to_json)
      end
    end

    context 'when user exists, but is a sales_contact type' do
      let!(:user) { create(:user, role: User::SALES_CONTACT) }

      it 'should refresh the token, send the password reset mailer and redirect to index path' do
        post :create, params: { user: { email: user.email } }
        expect(response.body).to eq ({ message: 'An account with this email does not exist. Try again.', type: 'email' }.to_json)
      end
    end

    context 'when user exists and is a google user' do
      subject { post :create, params: { user: { email: user.email } } }

      let(:user) { create(:user, google_id: 1234, role: role) }

      before { allow(User).to receive(:find_by_email).with(user.email).and_return(user) }

      context 'when user is a teacher' do
        let(:role) { User::TEACHER }

        it 'calls unlink_google_account!' do
          expect(user).to receive(:unlink_google_account!)
          subject
        end
      end

      context 'when user is an admin' do
        let(:role) { User::ADMIN }

        it 'calls unlink_google_account!' do
          expect(user).to receive(:unlink_google_account!)
          subject
        end
      end

      context 'when user is a student' do
        let(:role) { User::STUDENT }

        it 'does not call unlink_google_account!' do
          expect(user).not_to receive(:unlink_google_account!)
          subject
        end
      end
    end
  end

  describe '#show' do
    context 'when user exists' do
      let!(:user) { create(:user) }

      before do
        user.refresh_token!
      end

      it 'should set the user' do
        get :show, params: { id: user.token }
        expect(assigns(:user)).to eq user
      end
    end

    context 'when user does not exists' do
      it 'should redirect to password reset index' do
        get :show, params: { id: 1234 }
        expect(response).to redirect_to password_reset_index_path
      end
    end
  end

  describe '#update' do
    before do
      @user = create(:user)
      @user.refresh_token!
    end

    it 'should update the sign the user in and redirect to profile path' do
      expect(@user.password).to_not eq "test123"
      post :update, params: { id: @user.token, user: { password: "test123" } }
      expect(session[:user_id]).to eq @user.id
      expect(response.body).to eq({ redirect: '/profile'}.to_json)
      expect(@user.reload.token).to eq nil
    end

  end
end
