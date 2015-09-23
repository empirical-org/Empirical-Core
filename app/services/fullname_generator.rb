class FullnameGenerator

  def initialize(name)
    @name = name
  end

  def generate
    f,l = NameSplitter.new(@name).split
    if l.nil?
      if f.present?
        new_name = "#{f} #{f}"
      elsif f.nil?
        new_name = "Firstname Lastname"
      end
    else
      new_name = @name
    end
    new_name
  end

end