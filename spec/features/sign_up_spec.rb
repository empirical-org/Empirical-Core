require 'rails_helper'

feature 'Signing up', js: true do
  before(:each) { VCR.configuration.ignore_localhost = true }

  let(:sign_up_page) { SignUpPage.visit }

  context 'a Teacher' do
    let(:user_type)         { :teacher }
    let(:mr_kotter)         { FactoryGirl.build :mr_kotter }

    let(:accept_terms)      { true }
    let(:school_not_listed) { true }
    let(:send_newsletter)   { true }
    let(:zipcode)           { '11214' }

    def sign_up_teacher(user)
      sign_up_page.sign_up(type: user_type,
                           name: user.name,
                       username: user.username,
                       password: user.password,
          password_confirmation: user.password_confirmation,
                          email: user.email,
                        zipcode: zipcode,
              school_not_listed: school_not_listed,
                   accept_terms: accept_terms,
                send_newsletter: send_newsletter)
    end

    def self.signup_succeeded; 'signup succeeded and'; end
    shared_examples_for signup_succeeded do
      it 'prompts for class creation' do
        expect(current_path).to eq new_teachers_classroom_path
      end
    end

    def self.disallows_submission; 'submission is disallowed and'; end
    shared_examples_for disallows_submission do
      it 'remains on the new-form page' do
        expect(current_path).to eq sign_up_page.new_form_path
      end
    end

    context 'with no info' do
      before(:each) do
        sign_up_page.be_a_teacher
        sign_up_page.submit_form
      end

      it_behaves_like disallows_submission
    end

    context 'with new info' do
      before(:each) { sign_up_teacher mr_kotter }

      it_behaves_like signup_succeeded

      context 'with no zipcode/school info' do
        let(:school_not_listed) { false }
        let(:zipcode)           { '' }

        it_behaves_like signup_succeeded
      end

      context 'without accepting the Terms of Service' do
        let(:accept_terms) { false }

        it 'shows the problem on the form' do
          expect(sign_up_page).to have_content 'Terms of service must be accepted'

          expect(sign_up_page).to be_errored_sign_up_form(mr_kotter,
                                                          type: user_type,
                                                 accept_terms?: accept_terms,
                                              send_newsletter?: send_newsletter)
        end

        context 'with a mixed-case username' do
          let(:username)  { 'MrKotter' }
          let(:mr_kotter) { FactoryGirl.build :mr_kotter, username: username }

          describe 'the errored form' do
            it 'down-cases the username' do
              # make it expect downcase for comparing against the form
              mr_kotter.username.downcase!

              expect(sign_up_page).to be_errored_sign_up_form(mr_kotter,
                                                              type: user_type,
                                                     accept_terms?: accept_terms,
                                                  send_newsletter?: send_newsletter)
            end
          end
        end
      end

      context 'with blank password' do
        let(:mr_kotter) do
          FactoryGirl.build :mr_kotter, password: ''
        end

        it 'shows the problem on the form' do
          expect(sign_up_page).to have_content "Password can't be blank"

          expect(sign_up_page).to be_errored_sign_up_form(mr_kotter,
                                                          type: user_type,
                                                 accept_terms?: accept_terms,
                                              send_newsletter?: send_newsletter)
        end
      end

      context 'with mismatched password and confirmation' do
        let(:mr_kotter) do
          FactoryGirl.build :mr_kotter, password:              'something',
                                        password_confirmation: 'different'
        end

        it 'shows the problem on the form' do
          expect(sign_up_page).to have_content "Password confirmation doesn't match Password"

          expect(sign_up_page).to be_errored_sign_up_form(mr_kotter,
                                                          type: user_type,
                                                 accept_terms?: accept_terms,
                                              send_newsletter?: send_newsletter)
        end
      end

      context 'with a bogus e-mail address' do
        let(:mr_kotter) { FactoryGirl.build :mr_kotter, email: 'bogus' }

        it_behaves_like disallows_submission
      end
    end

    context 'with minimal info' do
      let(:x) { 'x' }

      let(:professor_x) do
        FactoryGirl.build :teacher,
                          first_name: '',
                           last_name: '',
                            password: x,
               password_confirmation: x,
                               email: 'x@x.x'
      end

      let(:zipcode)           { '' }
      let(:school_not_listed) { false }
      let(:send_newsletter)   { false }

      before(:each) { sign_up_teacher professor_x }

      it_behaves_like signup_succeeded
    end

    context 'with duplicate info' do
      before(:each) do
        FactoryGirl.create :mr_kotter

        sign_up_teacher mr_kotter
      end

      it 'shows the errors on the form' do
        expect(sign_up_page).to have_content 'Username has already been taken'
        expect(sign_up_page).to have_content    'Email has already been taken'

        expect(sign_up_page).to be_errored_sign_up_form(mr_kotter,
                                                        type: user_type,
                                               accept_terms?: accept_terms,
                                             end_newsletter?: send_newsletter)
      end
    end
  end
end
