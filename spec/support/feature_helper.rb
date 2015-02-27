shared_context :when_signed_in_as_a_student do
  let(:vinnie) { FactoryGirl.create :vinnie_barbarino }

  before(:each) { sign_in_user vinnie }
end

shared_examples_for :requires_sign_in do
  it 'navigates to sign-in' do
    expect(current_path).to eq SignInPage.path
  end
end

def sign_in_user(user)
  SignInPage.visit.sign_in user
end
