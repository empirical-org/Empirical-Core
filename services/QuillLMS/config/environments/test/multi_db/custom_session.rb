# frozen_string_literal: true

module Test
  module MultiDb
    class CustomSession < ActiveRecord::Middleware::DatabaseSelector::Resolver::Session
      def db_selection_methods
        session[:db_selection_methods] ||= []
      end

      def log_db_selection(method)
        db_selection_methods << method
      end
    end
  end
end

