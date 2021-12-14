# frozen_string_literal: true

module Evidence
  class ApplicationRecord < ::ActiveRecord::Base
    self.abstract_class = true
  end
end
