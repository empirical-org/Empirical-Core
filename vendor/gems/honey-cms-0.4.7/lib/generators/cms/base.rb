module CMS
  module Generators

    class Base < Rails::Generators::Base
      def self.namespace
        super.sub('c_m_s', 'cms')
      end
    end

  end
end
