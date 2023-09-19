# frozen_string_literal: true

class ApplicationRecord < ActiveRecord::Base
  self.abstract_class = true

  connects_to database: { writing: :primary, reading: :replica }

  # Rescues previously unhandled exceptions, like ActiveRecord::RecordNotUnique
  def save_with_error_handling
    save
  rescue ActiveRecord::RecordNotUnique => e
    handle_not_unique_error(e)
  rescue StandardError => e
    handle_standard_error(e)
  end

  def handle_not_unique_error(exception)
    /Key \((\w+)\)/ =~ exception.message
    attribute_sym = Regexp.last_match(1) ? Regexp.last_match(1).to_sym : :base
    errors.add(attribute_sym, 'not unique')
    ErrorNotifier.report(exception)
    false
  end

  def handle_standard_error(exception)
    errors.add(:base, :invalid, message: exception)
    ErrorNotifier.report(exception)
    false
  end

end
