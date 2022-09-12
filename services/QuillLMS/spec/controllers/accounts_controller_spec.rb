# frozen_string_literal: true

require 'rails_helper'

describe AccountsController, type: :controller do
  let(:user) { create(:user) }

  before { allow(controller).to receive(:current_user) { user } }

  it { should use_before_action :signed_in! }

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
    context 'when role is student or teacher' do
      it 'should set the js_file and role in session' do
        post :role, params: { role: "student" }
        expect(session[:role]).to eq "student"

        post :role, params: { role: "teacher" }
        expect(session[:role]).to eq "teacher"
      end
    end

    context 'when role is not student or teacher' do
      it 'should set the js file but not the role in session' do
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
    context 'user got updated' do
      it 'should redirect to updated_account_path' do
        post :update, params: { user: { email: "new@email.com" } }
        expect(response).to redirect_to root_path
      end
    end

    context 'user did not get updated' do
      it 'should render accounts edit' do
        post :update, params: { user: { email: "new" } }
        expect(response).to render_template "accounts/edit"
      end
    end
  end

  describe '#edit' do
    it 'should set the user' do
      get :edit
      expect(assigns(:user)).to eq user
    end
  end
end
