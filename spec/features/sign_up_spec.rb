require 'rails_helper'

feature 'Signing up' do
  let(:sign_up_page) { SignUpPage.visit }

  context 'as a new Teacher' do
    scenario 'prompts for class creation', js: true do
      VCR.configuration.ignore_localhost = true

      sign_up_page.sign_up(type: :teacher,
                           name: 'Some Name',
                       username: 'somename',
                       password: 'some_password',
          password_confirmation: 'some_password',
                          email: 'some.name@email.provider.com',
                        zipcode: '12345')

      expect(current_path).to eq Teachers::Classrooms::NewPage.path
    end
  end
end
