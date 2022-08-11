# frozen_string_literal: true

class ApplicationRecord < ActiveRecord::Base
  self.abstract_class = true

  if ENV.fetch('USE_MULTI_DB_CONFIGURATION', false) == 'true'
    connects_to database: { writing: :primary, reading: :replica }
  else
    connects_to database: { writing: :primary, reading: :primary }
  end
end
