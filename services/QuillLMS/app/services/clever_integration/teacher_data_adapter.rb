# frozen_string_literal: true

module CleverIntegration
  class TeacherDataAdapter < ApplicationService
    class BlankEmailError < ::CleverIntegration::Error
      MESSAGE = 'Teacher import has blank email'
    end

    attr_reader :info_hash

    def initialize(info_hash)
      @info_hash = info_hash
    end

    def run
      { clever_id: clever_id, email: email, name: name }
    end

    private def clever_id
      info_hash.id
    end

    private def email
      raise BlankEmailError if info_hash.email.blank?

      info_hash.email.downcase
    end

    private def first_name
      info_hash.name['first']
    end

    private def last_name
      info_hash.name['last']
    end

    private def name
      NameBuilder.run(first_name, last_name)
    end
  end
end
