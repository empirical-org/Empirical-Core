require 'rails_helper'

describe SessionsController, type: :controller do
  it { should use_before_filter :signed_in! }
  it { should use_before_filter :set_cache_buster }

  describe '#create' do
    let!(:user) { create(:user) }

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
      context 'when user is teacher' do
        let!(:teacher) { create(:teacher) }

        before do
          teacher.update(password: "test123")
        end

        it 'should kick off the background job' do
          expect(TestForEarnedCheckboxesWorker).to receive(:perform_async)
          post :create, user: { email: teacher.email, password: "test123" }
        end
      end

      context 'when redirect present' do
        before do
          user.update(password: "test123")
        end

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
          post :create, user: { email: user.email, password: "test123" }, redirect: "www.test.com"
          expect(response).to redirect_to profile_path
        end
      end
    end
  end

  describe '#login_through_ajax' do
    let!(:user) { create(:user) }

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
      context 'when user is teacher' do
        let!(:teacher) { create(:teacher) }

        before do
          teacher.update(password: "test123")
        end

        it 'should kick off the background job' do
          expect(TestForEarnedCheckboxesWorker).to receive(:perform_async)
          post :login_through_ajax, user: { email: user.email }, format: :json
        end
      end

      context 'when session post auth redirect present' do
        before do
          session[:post_auth_redirect] = root_path
        end

        it 'should redirect to the value' do
          post :login_through_ajax, user: { email: user.email }, format: :json
          expect(response.body).to eq({redirect: root_path}.to_json)
          expect(session[:post_auth_redirect]).to eq nil
        end
      end

      context 'when params redirect present' do
        it 'should redirect to the value given' do
          post :login_through_ajax, user: { email: user.email }, redirect: root_path, format: :json
          expect(response.body).to eq({redirect: root_path}.to_json)
        end
      end

      context 'when user is auditor and has a school subscription' do
        before do
          allow_any_instance_of(User).to receive { double(:subscription, school_subscription?: true) }
        end

        it 'should redirect to subscriptions path' do
          post :login_through_ajax, user: { email: user.email }, format: :json
          expect(response.body).to eq({redirect: '/subscriptions'}.to_json)
        end
      end

      context 'when none of the above' do
        it 'should redirect to root path' do
          post :login_through_ajax, user: { email: user.email }, format: :json
          expect(response.body).to eq({redirect: '/'}.to_json)
        end
      end
    end
  end
end
