class SplitName

  def initialize(name)
    @name = name
  end

  def call
    split_name
  end

  private

  attr_reader :name

  def split_name
    if name.nil?
      first_name, last_name = [nil, nil]
    else
      first_name, last_name = name.lstrip.rstrip.try(:split, /\s+/)
    end
    [first_name, last_name]
  end
end
