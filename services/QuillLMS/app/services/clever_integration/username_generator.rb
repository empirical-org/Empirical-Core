module CleverIntegration
  class UsernameGenerator
    attr_reader :first_name, :last_name

    def initialize(name)
      @first_name = name.to_s.split("\s")[0]
      @last_name = name.to_s.split("\s")[-1]
    end

    def run
      GenerateUsername.new(first_name, last_name).call
    end
  end
end
