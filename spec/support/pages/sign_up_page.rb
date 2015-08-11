require_relative 'page'

class SignUpPage < Page
  def self.visit
    page.visit path
    new
  end

  def be_a_student
    script = "$('.select_student').click();"
    execute_script(script)
  end

  def be_a_teacher
    script = "$('.select_teacher').click();"
    execute_script(script)
  end

  def path
    self.class.path
  end

  def sign_up(type: nil,
              first_name: '',
              last_name: '',
          username: '',
          password: '',
             email: '',
   send_newsletter: true)

    # ideally these are in the order seen on the form
    # so that the form appears to be filled out from
    # top to bottom
    fill_in                 'first_name', with:  first_name
    fill_in                  'last_name', with: last_name
    fill_in              'username', with: username
    fill_in              'password', with: password
    fill_in                'email', with: email

    if type == :teacher
      fill zipcode_field, zipcode

      school_not_listed_checkbutton.set school_not_listed
      send_newsletter_checkbutton  .set send_newsletter
    end


    submit_form
  end

  def submit_form
    #find("#sign_up").trigger('click')
    #click_button('Sign Up')
    script = "$('#sign_up').click()"
    execute_script(script)
  end

  private

  def self.path
    "#{submit_target_path}/new"
  end

  def self.submit_target_path
    '/account'
  end

end
