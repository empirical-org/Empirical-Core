# frozen_string_literal: true

shared_context :when_signed_in_as_a_student do
  let(:vinnie) { create :student }

  before { sign_in_user vinnie }
end

shared_examples_for :requires_sign_in do
  it 'navigates to sign-in' do
    expect(page).to have_current_path SignInPage.path, ignore_query: true
  end
end

def sign_in_user(user)
  SignInPage.visit.sign_in user
end
