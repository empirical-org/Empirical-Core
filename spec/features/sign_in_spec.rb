require 'rails_helper'

feature 'Signing in' do
  def self.for_each_credential_sym
    %i(email username).each { |sym| yield sym }
  end

  def self.use_sym_credential(sym)
    :"use_#{sym}_credential" # e.g., :use_email_credential
  end

  def self.using_sym_succeeds(sym)
    :"using_#{sym}_succeeds" # e.g., :using_email_succeeds
  end

  for_each_credential_sym do |sym|
    use_credential_context_name = use_sym_credential(sym)

    shared_context use_credential_context_name do
      let(:credential) { sym }
    end

    shared_context using_sym_succeeds(sym) do
      context "using #{sym}" do
        include_context use_credential_context_name do
          include_examples :sign_in_succeeds
        end
      end
    end
  end

  shared_examples_for :sign_in_fails do
    it 'fails' do
      expect(current_path).to eq sign_in_page.sign_in_failed_path

      error_text = 'Incorrect username/email or password'
      expect(sign_in_page).to have_content error_text
    end
  end

  shared_examples_for :sign_in_succeeds do
    it 'succeeds' do
      expect(current_path).to eq sign_in_succeeded_path
    end
  end

  shared_examples_for :sign_in_methods_succeed do
    for_each_credential_sym do |sym|
      include_context using_sym_succeeds(sym)
    end
  end

  let(:sign_in_page) { SignInPage.visit }

  context 'as a known Teacher' do
    let(:mr_kotter) { FactoryGirl.create :mr_kotter }

    def sign_in_user
      sign_in_page.sign_in mr_kotter, using: credential
    end

    context '-- with no classrooms --' do
      let(:sign_in_succeeded_path) { Teachers::CreateClassPage.path }

      before(:each) { sign_in_user }

      include_examples :sign_in_methods_succeed
    end

    context '-- with a classroom --' do
      let!(:sweathogs_classroom) do
        FactoryGirl.create :sweathogs, teacher: mr_kotter
      end

      before(:each) { sign_in_user }

      let(:sign_in_succeeded_path) do
        Teachers::ScorebookPage.new(sweathogs_classroom).path
      end

      include_examples :sign_in_methods_succeed
    end
  end

  context 'as a known Student' do
    let(:vinnie)                 { FactoryGirl.create :vinnie_barbarino }
    let(:sign_in_succeeded_path) { '/profile' }

    # doesn't matter whether/not student is already in a class

    before(:each) { sign_in_page.sign_in vinnie, using: credential }

    include_examples :sign_in_methods_succeed
  end

  context 'with an unknown' do
    let(:unknown_user) do
      FactoryGirl.build :user, username: 'some_name',
                                  email: 'some.name@coldmail.com',
                               password: 'doesnt_matter'
    end

    before(:each) { sign_in_page.sign_in unknown_user, using: credential }

    for_each_credential_sym do |sym|
      context sym do
        include_context use_sym_credential(sym) do
          include_examples :sign_in_fails
        end
      end
    end
  end

  context 'without filling in the form' do
    before(:each) { sign_in_page.submit_form }

    include_examples :sign_in_fails
  end
end
