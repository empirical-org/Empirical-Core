class NameSplitter
  def initialize(name)
    @name = name
  end

  def split
    f,l = @name.lstrip.rstrip.try(:split, /\s+/)
    [f,l]
  end
end