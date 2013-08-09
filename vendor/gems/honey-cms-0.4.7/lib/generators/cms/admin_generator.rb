require 'generators/cms/base'

module CMS
  module Generators

    class AdminGenerator < Base
      argument :email
      argument :password

      def create_admin
        User.create!({
          email: email,
          password: password,
          password_confirmation: password,
          role: 'admin'
        }, {
          without_protection: true,
          validate: false
        })
      end
    end

  end
end
