# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Auth::LearnWorldsController do
  subject { post auth_learn_worlds_courses_path }

  let(:courses_endpoint) { stub_const('Auth::LearnWorlds::COURSES_ENDPOINT', 'https://learnworlds.com/courses') }

  before do
    allow(User).to receive(:find).with(user.id).and_return(user)
    sign_in user
  end

  context 'user is a student' do
    let(:user) { create(:student) }

    it { expect(subject).to redirect_to new_session_path }
  end

  context 'user is a teacher' do
    let(:user) { create(:teacher) }

    before { allow(user).to receive(:learn_worlds_access?).and_return(learn_worlds_access) }

    context 'user does not have learn_worlds_access' do
      let(:learn_worlds_access) { false }

      it { expect(subject).to redirect_to root_path }
    end

    context 'user has learn_worlds_access' do
      let(:learn_worlds_access) { true }
      let(:learn_worlds_account_external_id) { SecureRandom.hex(12) }

      let(:sso_response) do
        {
          user_id: learn_worlds_account_external_id,
          success: success,
          url: courses_endpoint
        }.stringify_keys
      end

      before { allow(Auth::LearnWorlds::SSORequest).to receive(:run).with(user).and_return(sso_response) }

      context 'sso_success? is false' do
        let(:success) { false }

        it { expect(subject).to redirect_to root_path }
      end

      context 'sso_success? is true' do
        let(:success) { true }

        it { expect(subject).to redirect_to courses_endpoint }

        context 'user does not have a learn_worlds_account' do
          it { expect { subject }.to change(user, :learn_worlds_account).from(nil).to be_a(LearnWorldsAccount) }
        end

        context 'user has existing learn_worlds_account' do
          before { create(:learn_worlds_account, user: user, external_id: learn_worlds_account_external_id) }

          it { expect { subject }.not_to change(user, :learn_worlds_account) }
        end
      end
    end
  end
end
