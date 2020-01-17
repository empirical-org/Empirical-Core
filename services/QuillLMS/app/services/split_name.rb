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
      first_name = nil
      last_name = nil
    else
      first_name, last_name = name.strip.try(:split, /\s+/, 2)
    end
    [first_name, last_name]
  end
end
