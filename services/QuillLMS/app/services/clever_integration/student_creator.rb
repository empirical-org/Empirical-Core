module CleverIntegration
  class StudentCreator
    ACCOUNT_TYPE = ::User::CLEVER_ACCOUNT
    ROLE = ::User::STUDENT

    attr_reader :data

    def initialize(data)
      @data = data
    end

    def run
      student
    end

    private def student
      ::User.create!(student_attrs)
    end

    private def student_attrs
      data.merge(role: ROLE, account_type: ACCOUNT_TYPE)
    end
  end
end
