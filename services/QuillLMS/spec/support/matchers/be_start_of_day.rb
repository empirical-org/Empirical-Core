# frozen_string_literal: true

RSpec::Matchers.define :be_start_of_day do
  match do |actual|
    actual&.hour == 0 && actual&.minute == 0 && actual&.second == 0
  end
end
