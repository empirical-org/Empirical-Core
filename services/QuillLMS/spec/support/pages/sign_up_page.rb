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
    click_button('Educator')
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

    fill_in 'first_name', with:  first_name
    fill_in 'last_name', with: last_name
    fill_in 'username', with: username if type == :student
    fill_in 'password', with: password
    fill_in 'email', with: email

    if type == :teacher
      send_newsletter ? (check 'sendNewsletter') : (uncheck 'sendNewsletter')
    end

    submit_form
  end

  def select_school(choose_unlisted_school)
    # choose_unlisted_school is deprecated, and this method now
    # simply selects the the user is not a member of any school.
    # page.has_content?('not listed')
    # click_link('school_not_listed')
    click_button('No')
    click_button('Other')
  end

  def submit_form
    click_button('Sign Up')
  end

  def self.path
    "#{submit_target_path}/new"
  end

  def self.submit_target_path
    '/account'
  end

end
