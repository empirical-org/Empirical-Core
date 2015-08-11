require_relative 'page'

class SignUpPage < Page
  def self.visit
    page.visit path
    new
  end

  def be_a_student
    click_button('Student')
  end

  def be_a_teacher
    click_button('Teacher')
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
      send_newsletter ? (check 'sendNewsletter') : (uncheck 'sendNewsletter')
    end


    submit_form
  end

  def select_school(skips_school_selection)
    if skips_school_selection
      click_button('Skip')
    else
      fill_in 'zip', with: '11206'
      select 'Brooklyn Charter School', from: 'select_school'
      #script = "$('#select_school').trigger('change'); $('.select_school_button').click();"
      #script = "React.addons.TestUtils.Simulate.change(this.refs.select, {target: {value: '1'}})"
      #script = "var event = new Event('change', { bubbles: true }); document.getElementById('select_school').dispatchEvent(event);"
      script = "$('#select_school').trigger('change');"
      execute_script(script)
      click_button('Select your school')
    end
  end

  def send_newsletter_checkbutton

  end

  def submit_form
    click_button('Sign Up')
  end

  private

  def self.path
    "#{submit_target_path}/new"
  end

  def self.submit_target_path
    '/account'
  end

end
