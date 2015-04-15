require_relative 'page'

class SignUpPage < Page
  def self.visit
    page.visit path
    new
  end

  # perhaps these are kept in the order presented on the form to ease
  # visual comparison...?

  has_radiobutton :student?, :student_radio, :user_role_student
  has_radiobutton :teacher?, :teacher_radio, :user_role_teacher

  %i(name username password password_confirmation email).each do |attrib|
    attrib_field = "#{attrib}_field".to_sym # e.g., :email_field
    user_attrib  = "user_#{attrib}" .to_sym # e.g., :user_email

    # e.g.,
    #   has_input_field :email, :email_field, :user_email
    # producces
    #   #email       - fetch the form's 'email' value
    #   #email_field - private method to access the :user_email element
    has_input_field attrib, attrib_field, user_attrib
  end

  has_input_field :zipcode, :zipcode_field, :zipcode

  has_checkbutton :school_not_listed?, :school_not_listed_checkbutton, :school_not_found
  has_checkbutton :accept_terms?,           :accept_terms_checkbutton, :user_terms_of_service
  has_checkbutton :send_newsletter?,     :send_newsletter_checkbutton, :user_newsletter

  def be_a_student
    student_radio.set true
  end

  def be_a_teacher
    teacher_radio.set true
  end

  def has_email_required?
    email_field[:required]
  end

  def path
    self.class.path
  end

  def sign_up(type: nil,
              name: '',
          username: '',
          password: '', password_confirmation: '',
             email: '',
           zipcode: '',
 school_not_listed: true,
      accept_terms: true,
   send_newsletter: true)

    send :"be_a_#{type}" if type.present?

    # ideally these are in the order seen on the form
    # so that the form appears to be filled out from
    # top to bottom
    fill                  name_field, name
    fill              username_field, username
    fill              password_field, password
    fill password_confirmation_field, password_confirmation
    fill                 email_field, email

    if type == :teacher
      fill zipcode_field, zipcode

      school_not_listed_checkbutton.set school_not_listed
      send_newsletter_checkbutton  .set send_newsletter
    end

    accept_terms_checkbutton.set accept_terms

    submit_form
  end

  def submit_form
    click_on 'Sign up'
  end

  private

  def self.path
    "#{submit_target_path}/new"
  end

  def self.submit_target_path
    '/account'
  end

end

RSpec::Matchers.define :be_errored_sign_up_form do |user, options|
  match do |actual|
    @errors = []

    if current_path == SignUpPage.submit_target_path
      if options.has_key?(:type)
        type = options[:type].to_sym

        @errors << "form is not for a #{type}" unless actual.send(:"#{type}?")
      end

      # ideally in the same order as seen on the form
      # so the error output 'matches' the form
      expect_equal user, actual, :name
      expect_equal user, actual, :username
      expect_blank       actual, :password
      expect_blank       actual, :password_confirmation
      expect_equal user, actual, :email

      if user.teacher?
        expect_blank           actual, :zipcode
        expect_false           actual, :school_not_listed?
        expect_option options, actual, :send_newsletter?
      end

      expect_option options, actual, :accept_terms?
    else
      expected_label, got_label = expected_got_labels(:path)
      @errors << ["#{expected_label} '#{SignUpPage.submit_target_path}'",
                       "#{got_label} '#{current_path}'"]
    end

    @errors.empty?
  end

  def expect_blank(page, sym)
    actual = page.send(sym)

    add_expected_got_error('to be blank', actual, sym) unless actual.blank?
  end

  def expect_equal(source, page, sym)
    actual   = page.send(sym)
    expected = if source.respond_to?(sym)
                 source.send(sym)
               else
                 source
               end

    add_expected_got_error("'#{expected}'", actual, sym) if actual != expected
  end

  def expect_false(page, sym)
    actual = page.send(sym)

    add_expected_got_error("'false'", actual, sym) unless !actual
  end

  def expect_option(hash, actual, sym)
    if hash.has_key?(sym)
      expect_equal hash[sym], actual, sym
    end
  end

  def add_expected_got_error(expected, actual, sym)
    expected_label, got_label = expected_got_labels(sym)

    @errors << ["#{expected_label} #{expected}",
                "#{got_label} '#{actual}'"]
  end

  def expected_got_labels(sym)
    # right-justify 'got' to the 'expected' line
    # i.e., make something like
    #   ["expected blar",
    #    "          got"]
    expected_label = "expected #{sym}"
    [expected_label, "%#{expected_label.length}s" % 'got']
  end

  failure_message do |actual|
    unless @errors.empty?
      ["#{actual} does not look like a sign-up page with errors:",
       @errors.map do |line|
        # line = line.join "\n   " if line.respond_to?(:join)
        line = line.try(:join, "\n   ") || line
        " - #{line}"
      end
      ].join("\n")
    end
  end
end
