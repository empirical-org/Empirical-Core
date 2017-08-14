require 'rails_helper'

feature 'Signing up', js: true do
  before(:each) { vcr_ignores_localhost }

  let(:sign_up_page) { SignUpPage.visit }

  def password_cannot_be_blank
    "Password can't be blank"
  end

  def username_already_taken
    'Username has already been taken'
  end

  def email_already_taken
    'Email has already been taken'
  end

  context 'a Teacher' do
    let(:user_type)         { :teacher }
    let(:mr_kotter)         { FactoryGirl.build :mr_kotter }
    let!(:school)            { FactoryGirl.create :school, name: "Brooklyn Charter School", zipcode: '11206'}
    let(:send_newsletter)   { true }

    before(:each) { sign_up_page.be_a_teacher }

    def sign_up_teacher(user, send_newsletter)
      sign_up_page.sign_up(type: user_type,
                           first_name: user.first_name,
                           last_name: user.last_name,
                       password: user.password,
                          email: user.email,
                send_newsletter: send_newsletter)
    end

    def sign_up_teacher_and_select_school(user, send_newsletter)
      sign_up_teacher(user, send_newsletter)
      sign_up_page.select_school(nil)
    end

    def self.signup_succeeded; 'signup succeeded and'; end
    shared_examples_for signup_succeeded do
      it 'prompts for class creation' do
        expect(page).to have_content('Create Your Class')
      end
    end

    context 'with new info' do
      context 'send_newsletter is false' do
        before(:each) { sign_up_teacher_and_select_school mr_kotter, false }
        it_behaves_like signup_succeeded
        skip 'marks it appropriately' do
          user = User.find_by email: mr_kotter.email
          expect(user.send_newsletter).to eq(false)
        end
      end

      context 'send_newsletter is true' do
        before(:each) { sign_up_teacher_and_select_school mr_kotter, true }
        it_behaves_like signup_succeeded
        skip 'marks it appropriately' do
          user = User.find_by email: mr_kotter.email
          expect(user.send_newsletter).to eq(true)
        end
      end
    end


    context 'with blank password' do
      let(:mr_kotter) do
        FactoryGirl.build :mr_kotter, password: ''
      end

      before(:each) { sign_up_teacher mr_kotter, true }

      it 'shows the problem on the form' do
        expect(sign_up_page).to have_content password_cannot_be_blank
      end
    end

    context 'with minimal info' do
      # let(:x) { 'x' }
      #
      # let(:professor_x) do
      #   FactoryGirl.build :teacher,
      #                       name: 'x x',
      #                       password: x,
      #                          email: 'x@x.com'
      # end
      #
      #
      # let(:send_newsletter)   { false }
      #
      # before(:each) { sign_up_teacher_and_select_school professor_x, true }

      # it_behaves_like signup_succeeded
    end

    context 'with duplicate info' do
      before(:each) do
        FactoryGirl.create :mr_kotter
        sign_up_teacher mr_kotter, true
      end

      it 'shows the errors on the form' do
        expect(sign_up_page).to have_content email_already_taken
      end
    end
  end

  context 'a Student' do
    let(:user_type)    { :student }
    let(:vinnie)       { FactoryGirl.build :vinnie_barbarino }

    before(:each) do
      # at least 1 Section must already exist
      FactoryGirl.create :section

      sign_up_page.be_a_student
    end

    def sign_up_student(user)
      sign_up_page.sign_up(type: user_type,
                           first_name: user.first_name,
                           last_name: user.last_name,
                       username: user.username,
                       password: user.password,
                          email: user.email)
    end

    def self.signup_succeeded; 'signup succeeded and'; end
    shared_examples_for signup_succeeded do
      it 'goes to the profile page' do
        expect(page).to have_content "Add Your Class"
      end
    end

    context 'with no info' do
      before(:each) do
        sign_up_page.submit_form
      end

      xit 'shows the problem(s) on the form' do
        expect(sign_up_page).to have_content "Username can't be blank"
        expect(sign_up_page).to have_content password_cannot_be_blank
      end
    end

    context 'with new info' do
      before(:each) { sign_up_student vinnie }

      it_behaves_like signup_succeeded

      context 'with blank password' do
        let(:vinnie) do
          FactoryGirl.build :vinnie_barbarino, password: ''
        end

        xit 'shows the problem on the form' do
          expect(sign_up_page).to have_content password_cannot_be_blank
        end
      end
    end

    context 'with minimal info' do
      let(:x) { 'x' }

      let(:student_x) do
        FactoryGirl.build :student,
                           name: 'x x',
                            username: x,
                            password: x,
                               email: ''
      end

      before(:each) { sign_up_student student_x }

      it_behaves_like signup_succeeded
    end

    context 'with duplicate info' do
      before(:each) do
        FactoryGirl.create :vinnie_barbarino

        sign_up_student vinnie
      end

      it 'shows the errors on the form' do
        expect(sign_up_page).to have_content username_already_taken
      end
    end

    context 'with duplicate e-mail' do
      let(:dup_email) { 'sweathog@yarhoo.com' }
      let(:horshack)  { FactoryGirl.build :arnold_horshack, email: dup_email }

      before(:each) do
        FactoryGirl.create :vinnie_barbarino, email: dup_email
        sign_up_student horshack
      end

      xit 'shows the errors on the form' do
        # previously this was expeted to succeed;
        # however, even though emails are not required of students, if they are supplied then we expect them to be unique
        expect(sign_up_page).to have_content email_already_taken
      end
    end
  end
end
