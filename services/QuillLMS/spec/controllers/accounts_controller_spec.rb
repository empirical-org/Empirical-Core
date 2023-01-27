# frozen_string_literal: true

require 'rails_helper'

describe AccountsController, type: :controller do
  let(:user) { create(:user) }

  before { allow(controller).to receive(:current_user) { user } }

  it { should use_before_action :set_js_file }
  it { should use_before_action :set_user }
  it { should use_before_action :set_user_by_token }

  describe '#new' do
    before { session[:role] = "something" }

    it 'should kick off the background job, set the session values and variables' do
      get :new, params: { redirect: "www.test.com" }
      expect(session[:role]).to eq 'something'
      expect(session[:post_sign_up_redirect]).to eq "www.test.com"
      expect(assigns(:teacher_from_google_signup)).to eq false
      expect(assigns(:js_file)).to eq "session"
    end
  end

  describe '#role' do
    context 'when role is student, teacher or individual-contributor' do
      it 'should set the role in session' do
        post :role, params: { role: User::STUDENT }
        expect(session[:role]).to eq User::STUDENT

        post :role, params: { role: User::TEACHER }
        expect(session[:role]).to eq User::TEACHER

        post :role, params: { role: User::INDIVIDUAL_CONTRIBUTOR }
        expect(session[:role]).to eq User::INDIVIDUAL_CONTRIBUTOR
      end
    end

    context 'when role is not student or teacher' do
      it 'should not set the role in session' do
        post :role, params: { role: "not student or teacher" }
        expect(session[:role]).to eq nil
      end
    end
  end

  describe '#create' do
    context 'when user found' do
      let!(:another_user) { create(:user) }
      let(:name) { 'Test Name' }
      let(:password) { 'test123' }

      before { session[:temporary_user_id] = another_user.id }

      context 'when user is saved' do
        let(:callbacks) { double(:callbacks, call: true) }

        before { allow(CompleteAccountCreation).to receive(:new) { callbacks } }

        it 'should kick off the account creation callback' do
          expect(callbacks).to receive(:call)
          post :create, params: { user: { classcode: "code", email: "test@test.com", password: "test123", role: "student" } }
        end

        context 'when user is a teacher and affliate tag present' do
          context 'when referrer user id found' do
            let!(:referrer) { ReferrerUser.create(referral_code: "some code", user: user) }

            before do
              allow(user).to receive(:teacher?) { true }
              request.env['affiliate.tag'] = user.referral_code
            end

            it 'should create the referralsuser' do
              post :create, params: { user: { email: "test@test.com", password: "test123", role: "teacher" } }
              new_user = User.find_by_email("test@test.com")
              expect(ReferralsUser.find_by_user_id(user.id).present?).to eq true
              expect(ReferralsUser.find_by_referred_user_id(new_user.id).present?).to eq true
            end
          end
        end

        context 'when post sign up redirect present' do
          before do
            session[:post_sign_up_redirect] = "www.test.com"
          end

          it 'should render the json' do
            post :create, params: { user: { classcode: "code", email: "test@test.com", password: "test123", role: "student" } }
            expect(response.body).to eq({
              redirect: "www.test.com"
            }.to_json)
            expect(session[:post_sign_up_redirect]).to eq nil
          end
        end

        context 'when post sign up redirect not present' do
          context 'when user has outstanding coteacher invitation' do
            before do
              allow_any_instance_of(User).to receive(:has_outstanding_coteacher_invitation?) { true }
            end

            it 'should render the teachers classroom path json' do
              post :create, params: { user: { classcode: "code", email: "test@test.com", password: "test123", role: "student" } }
              expect(response.body).to eq({redirect: teachers_classrooms_path}.to_json)
            end
          end

        end
      end

      context 'when user is not saved' do
        it 'should render the errors json' do
          post :create, params: { user: { classcode: "code", email: "test", role: "user" } }
          expect(response.status).to eq 422
          expect(response.body).to eq({errors: {email: ["Enter a valid email"]}}.to_json)
        end
      end

      context 'when user already exists in db as a sales contact' do
        let!(:user) { create(:user, role: User::SALES_CONTACT) }

        it 'should use that same user record but update all the fields' do
          expect do
            post :create, params: { user: { name: name, email: user.email, password: password, role: User::TEACHER } }
          end.to change(User, :count).by(0)
          expect(response.status).to eq 200

          updated_user = User.find(user.id)
          expect(updated_user.name).to eq(name)
          expect(updated_user.authenticate(password)).not_to eq(false)
          expect(updated_user.role).to eq(User::TEACHER)
        end
      end

      context 'when user tries to enter an email that already exists and is not a preexisting sales contact' do
        let(:user) { create(:user, role: User::TEACHER) }

        it 'should render a duplicate email error' do
          post :create, params: { user: { name: name, email: user.email, password: password, role: User::TEACHER } }
          expect(response.status).to eq 422
          expect(response.body).to eq({errors: {email: ["That email is taken. Try another."]}}.to_json)
        end
      end
    end
  end

  describe '#update' do
    before do
      user.refresh_token!
    end

    context 'user got updated' do
      it 'should update the user and return the redirect path' do
        new_name = 'Brandy Oleson'
        new_password = 'some-password'
        post :update, params: { token: user.token, user: { name: new_name, password: new_password } }
        expect(user.reload.name).to eq(new_name)
        expect(response.body).to eq({ redirect: profile_path }.to_json)
      end
    end

    context 'user did not get updated' do
      it 'should render the errors json' do
        post :update, params: { token: user.token, user: { name: '', password: 'some-password' } }
        expect(response.status).to eq 422
        expect(response.body).to eq({errors: {name: ["can't be blank"]}}.to_json)
      end
    end
  end

  describe '#edit' do
    before do
      user.refresh_token!
    end

    it 'should set the user based on the token' do
      get :edit, params: { token: user.token }
      expect(assigns(:user)).to eq user
    end

    it 'should redirect with a flash error if the token is not present' do
      get :edit, params: { token: 'not-a-token' }
      expect(response).to redirect_to profile_path
      # rubocop:disable Rails/OutputSafety
      expect(flash[:notice]).to eq(I18n.t('accounts.edit.expired_link').html_safe)
      # rubocop:enable Rails/OutputSafety
    end
  end
end
