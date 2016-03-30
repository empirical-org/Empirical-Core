class FirstLastNameValidator

  def initialize(name_hash)
    @name_hash = name_hash
  end

  def check_names
    strip_first_and_last_names
    if @name_hash[:first_name].blank? or @name_hash[:last_name].blank?
      {status: 'failed', notice: 'Please provide both a first name and a last name.'}
    elsif do_names_contain_spaces
      {status: 'failed', notice: 'Names cannot contain spaces.'}
    else
      capitalize_first_and_last_name
      @name_hash
    end
  end

  def strip_first_and_last_names
    @name_hash[:first_name].strip!
    @name_hash[:last_name].strip!
  end

  def do_names_contain_spaces
    a = @name_hash[:first_name].index(/\s/)
    b = @name_hash[:last_name].index(/\s/)
    !(a.nil? and b.nil?)
  end

  def capitalize_first_and_last_name
    # make sure this is called after fix_full_name_in_first_name_field
    @name_hash[:first_name].capitalize!
    @name_hash[:last_name].capitalize!
  end

end
