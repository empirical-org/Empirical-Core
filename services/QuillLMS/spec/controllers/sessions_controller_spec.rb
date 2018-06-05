require 'rails_helper'

describe SessionsController, type: :controller do
  it { should use_before_filter :signed_in! }
  it { should use_before_filter :set_cache_buster }

  describe '#create' do
    let!(:user) { create(:user) }

    before do
      user.update(password: "test123")
      user.reload
    end

    context 'when user is nil' do
      it 'should report login failiure' do
        post :create, user: { email: "test@whatever.com" }
        expect(response).to redirect_to "/session/new"
      end
    end

    context 'when user has signed up with google' do
      before do
        allow_any_instance_of(User).to receive(:signed_up_with_google) { true }
      end

      it 'should report login failiure' do
        post :create, user: { email: user.email }
        expect(flash[:error]).to eq 'You signed up with Google, please log in with Google using the link above.'
        expect(response).to redirect_to "/session/new"
      end
    end

    context 'when user has no password digest' do
      before do
        allow_any_instance_of(User).to receive(:password_digest) { nil }
      end

      it 'should report login failiure' do
        post :create, user: { email: user.email }
        expect(flash[:error]).to eq 'Login failed. Did you sign up with Google? If so, please log in with Google using the link above.'
        expect(response).to redirect_to "/session/new"
      end
    end

    context 'when user is authenticated' do
      context 'when redirect present' do
        it 'should redirect to the given url' do
          post :create, user: { email: user.email, password: "test123" }, redirect: root_path
          expect(response).to redirect_to root_path
        end
      end

      context 'when redirect not present' do
        before do
          user.update(password: "test123")
        end

        it 'should redirect to profile path' do
          post :create, user: { email: user.email, password: "test123" }
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
        post :login_through_ajax, user: { email: "test@whatever.com" }, format: :json
        expect(response.body).to eq({message: 'Incorrect username/email or password'}.to_json)
      end
    end

    context 'when user has signed up with google' do
      before do
        allow_any_instance_of(User).to receive(:signed_up_with_google) { true }
      end

      it 'should report login failiure' do
        post :login_through_ajax, user: { email: user.email }, format: :json
        expect(response.body).to eq({message: 'You signed up with Google, please log in with Google using the link above.'}.to_json)
      end
    end

    context 'when user has no password digest' do
      before do
        allow_any_instance_of(User).to receive(:password_digest) { nil }
      end

      it 'should report login failiure' do
        post :login_through_ajax, user: { email: user.email }, format: :json
        expect(response.body).to eq({message: 'Did you sign up with Google? If so, please log in with Google using the link above.'}.to_json)
      end
    end

    context 'when user is authenticated' do
      context 'when session post auth redirect present' do
        before do
          session[:post_auth_redirect] = root_path
        end

        it 'should redirect to the value' do
          post :login_through_ajax, user: { email: user.email, password: "test123" }, format: :json
          expect(response.body).to eq({redirect: root_path}.to_json)
          expect(session[:post_auth_redirect]).to eq nil
        end
      end

      context 'when params redirect present' do
        it 'should redirect to the value given' do
          post :login_through_ajax, user: { email: user.email, password: "test123" }, redirect: root_path, format: :json
          expect(response.body).to eq({redirect: root_path}.to_json)
        end
      end

      context 'when user is auditor and has a school subscription' do
        before do
          allow_any_instance_of(User).to receive(:subscription) { double(:subscription, school_subscription?: true) }
          allow_any_instance_of(User).to receive(:auditor?) { true }
        end

        it 'should redirect to subscriptions path' do
          post :login_through_ajax, user: { email: user.email, password: "test123" }, format: :json
          expect(response.body).to eq({redirect: '/subscriptions'}.to_json)
        end
      end

      context 'when none of the above' do
        it 'should redirect to root path' do
          post :login_through_ajax, user: { email: user.email, password: "test123" }, format: :json
          expect(response.body).to eq({redirect: '/'}.to_json)
        end
      end
    end
  end

  describe '#destroy' do
    let(:user) { create(:user ) }

    before do
      allow(controller).to receive(:current_user) { user }
    end

    context'when session admin id present' do
      let!(:admin) { create(:admin) }

      before do
        session[:admin_id] = admin.id
      end

      it 'should login the admin and redirect to profile path' do
        delete :destroy
        expect(response).to redirect_to profile_path
        expect(session[:user_id]).to eq admin.id
      end
    end

    context 'when session staff id is present' do
      context 'when staff exists' do  
        let!(:staff) { create(:staff) }

        before do
          session[:staff_id] = staff.id
        end

        it 'should sign the staff in and redirect to cms users path' do
          delete :destroy
          expect(response).to redirect_to cms_users_path
          expect(session[:user_id]).to eq staff.id
        end
      end

      context 'when staff does not exist' do
        before do
          session[:staff_id] = 12
        end

        it 'should redirect to signed out path' do
          delete :destroy
          expect(response).to redirect_to root_path
        end
      end
    end
  end
  
  describe '#new' do
    it 'should set the js file, role in session  and post auth redirect in session' do
      session[:role] = "something"
      session[:post_auth_redirect] = "something else"
      get :new, redirect: root_path
      expect(assigns(:js_file)).to eq "login"
      expect(session[:role]).to eq nil
      expect(session[:post_auth_redirect]).to eq root_path
    end
  end
end
