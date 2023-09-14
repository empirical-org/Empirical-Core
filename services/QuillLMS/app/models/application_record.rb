# frozen_string_literal: true

class ApplicationRecord < ActiveRecord::Base
  self.abstract_class = true

  connects_to database: { writing: :primary, reading: :replica }

  # Rescues previously unhandled exceptions, like ActiveRecord::RecordNotUnique
  def safer_save
    save
  rescue ActiveRecord::RecordNotUnique => e
    /Key \((\w+)\)/ =~ e.message
    attribute_sym = Regexp.last_match(1) ? Regexp.last_match(1).to_sym : :base
    errors.add(attribute_sym, 'not unique')
    false
  rescue StandardError => e
    errors.add(:base, :invalid, message: e)
    false
  end
end
