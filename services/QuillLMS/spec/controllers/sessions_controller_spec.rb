# frozen_string_literal: true

require 'rails_helper'

describe SessionsController, type: :controller do
  it { should use_before_action :signed_in! }

  describe '#create' do
    let!(:user) { create(:user) }

    before do
      user.update(password: "test123")
      user.reload
    end

    context 'when user is nil' do
      it 'should report login failiure' do
        post :create, params: { user: { email: "test@whatever.com" } }
        expect(response).to redirect_to "/session/new"
      end
    end

    context 'when user has signed up with google' do
      before do
        allow_any_instance_of(User).to receive(:signed_up_with_google) { true }
      end

      it 'should report login failiure' do
        post :create, params: { user: { email: user.email } }
        expect(flash[:error]).to eq 'You signed up with Google, please log in with Google using the link above.'
        expect(response).to redirect_to "/session/new"
      end
    end

    context 'when user has no password digest' do
      before do
        allow_any_instance_of(User).to receive(:password_digest) { nil }
      end

      it 'should report login failiure' do
        post :create, params: { user: { email: user.email } }
        expect(flash[:error]).to eq 'Login failed. Did you sign up with Google? If so, please log in with Google using the link above.'
        expect(response).to redirect_to "/session/new"
      end
    end

    context 'when user is authenticated' do
      context 'when redirect present' do
        it 'should redirect to the given url' do
          post :create, params: { user: { email: user.email, password: "test123" }, redirect: root_path }
          expect(response).to redirect_to root_path
        end
      end

      context 'when redirect not present' do
        before do
          user.update(password: "test123")
        end

        it 'should redirect to profile path' do
          post :create, params: { user: { email: user.email, password: "test123" } }
          expect(response).to redirect_to profile_path
        end
      end
    end
  end

  describe '#login_through_ajax' do
    let!(:user) { create(:user) }

    before do
      user.update(password: "test123")
      user.reload
    end

    context 'when user is nil' do
      it 'should report login failiure' do
        post :login_through_ajax, params: { user: { email: "test@whatever.com" } }, as: :json
        expect(response.body).to eq({message: 'An account with this email or username does not exist. Try again.', type: 'email'}.to_json)
      end
    end

    context 'when user has a non-authenticating role' do
      it 'should report login failiure' do
        user.update(role: User::SALES_CONTACT)
        post :login_through_ajax, params: { user: { email: user.email } }, as: :json
        expect(response.body).to eq({message: 'An account with this email or username does not exist. Try again.', type: 'email'}.to_json)
      end
    end

    context 'when user has signed up with google' do
      before do
        allow_any_instance_of(User).to receive(:signed_up_with_google) { true }
      end

      it 'should report login failiure' do
        post :login_through_ajax, params: { user: { email: user.email } }, as: :json
        expect(response.body).to eq({message: 'Oops! You have a Google account. Log in that way instead.', type: 'email'}.to_json)
      end
    end

    context 'when user has no password digest' do
      before do
        allow_any_instance_of(User).to receive(:password_digest) { nil }
      end

      it 'should report login failiure' do
        post :login_through_ajax, params: { user: { email: user.email } }, as: :json
        expect(response.body).to eq({message: 'Did you sign up with Google? If so, please log in with Google using the link above.', type: 'email'}.to_json)
      end
    end

    context 'when user is authenticated' do
      context 'when session post auth redirect present' do
        before do
          session[ApplicationController::POST_AUTH_REDIRECT] = root_path
        end

        it 'should redirect to the value' do
          post :login_through_ajax, params: { user: { email: user.email, password: "test123" } }, as: :json
          expect(response.body).to eq({redirect: root_path}.to_json)
          expect(session[ApplicationController::POST_AUTH_REDIRECT]).to eq nil
        end
      end

      context 'when params redirect present' do
        it 'should redirect to the value given' do
          post :login_through_ajax,
            params: {
              user: {
                email: user.email,
                password: "test123"
              },
              redirect: root_path,
            },
            as: :json

          expect(response.body).to eq({redirect: root_path}.to_json)
        end
      end

      context 'when user is auditor and has a school subscription' do
        before do
          allow_any_instance_of(User).to receive(:subscription) { double(:subscription, school_subscription?: true) }
          allow_any_instance_of(User).to receive(:auditor?) { true }
        end

        it 'should redirect to subscriptions path' do
          post :login_through_ajax, params: { user: { email: user.email, password: "test123" } }, as: :json
          expect(response.body).to eq({redirect: '/subscriptions'}.to_json)
        end
      end

      context 'when none of the above' do
        it 'should redirect to root path' do
          post :login_through_ajax, params: { user: { email: user.email, password: "test123" } }, as: :json
          expect(response.body).to eq({redirect: '/'}.to_json)
        end
      end
    end
  end

  describe '#destroy' do
    let(:user) { create(:user ) }

    before { allow(controller).to receive(:current_user) { user } }

    context 'when session admin id present' do
      let!(:admin) { create(:admin) }

      before { session[:admin_id] = admin.id }

      it 'should login the admin and redirect to profile path' do
        delete :destroy
        expect(response).to redirect_to profile_path
        expect(session[:user_id]).to eq admin.id
      end
    end

    context 'when session staff id is present' do
      context 'when staff exists' do
        let!(:staff) { create(:staff) }

        before { session[:staff_id] = staff.id }

        it 'should sign the staff in and redirect to cms users path' do
          delete :destroy
          expect(response).to redirect_to cms_users_path
          expect(session[:user_id]).to eq staff.id
        end
      end

      context 'when staff does not exist' do
        before { session[:staff_id] = 12 }

        it 'should redirect to signed out path' do
          delete :destroy
          expect(response).to redirect_to root_path
        end
      end
    end
  end

  describe '#new' do
    it 'should set the js file, role in session and post auth redirect in session' do
      session[:role] = "something"
      session[ApplicationController::POST_AUTH_REDIRECT] = "something else"
      get :new, params: { redirect: root_path }
      expect(assigns(:js_file)).to eq "login"
      expect(session[:role]).to eq nil
      expect(session[ApplicationController::POST_AUTH_REDIRECT]).to eq root_path
    end
  end

  describe '#set post_auth_redirect' do
    it 'should save the post_auth_redirect param to the session' do
      url = "/blah"
      get :set_post_auth_redirect, params: { post_auth_redirect: url }
      expect(session[ApplicationController::POST_AUTH_REDIRECT]).to eq url
    end
  end

  describe '#finish_sign_up' do
    context 'when there is a post auth redirect saved' do
      it 'should redirect to the post auth redirect and remove it from the session' do
        url = "/blah"
        session[ApplicationController::POST_AUTH_REDIRECT] = url
        get :finish_sign_up
        expect(response).to redirect_to url
        expect(session[ApplicationController::POST_AUTH_REDIRECT]).to be nil
      end
    end

    context 'when there is no post auth redirect' do
      it 'should redirect to the profile path' do
        get :finish_sign_up
        expect(response).to redirect_to profile_path
      end
    end

  end
end
