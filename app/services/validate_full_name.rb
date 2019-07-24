class ValidateFullName

  def initialize(names)
    @names = names
  end

  def call
    check_names
  end

  private

  attr_reader :names

  def check_names
    strip_first_and_last_names

    return name_missing_error    if name_missing?
    return name_has_spaces_error if name_has_spaces?

    capitalize_first_and_last_name

    names
  end

  def name_missing_error
    {
      status: 'failed',
      notice: 'Please provide both a first name and a last name.'
    }
  end

  def name_has_spaces_error
    {
      status: 'failed',
      notice: 'Names cannot contain spaces.'
    }
  end

  def strip_first_and_last_names
    names[:first_name].strip!
    names[:last_name].strip!
  end

  def name_missing?
    names[:first_name].blank? || names[:last_name].blank?
  end

  def name_has_spaces?
    a = names[:first_name].index(/\s/)
    b = names[:last_name].index(/\s/)
    !(a.nil? and b.nil?)
  end

  def capitalize_first_and_last_name
    names[:first_name].capitalize!
    names[:last_name].capitalize!
  end
end
