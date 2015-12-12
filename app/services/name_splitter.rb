class NameSplitter
  def initialize(name)
    @name = name
  end

  def split
    if @name.nil?
      f = nil
      l = nil
    else
      f, l = @name.lstrip.rstrip.try(:split, /\s+/)
    end
    [f, l]
  end
end
