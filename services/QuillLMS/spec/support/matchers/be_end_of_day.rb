# frozen_string_literal: true

RSpec::Matchers.define :be_end_of_day do
  match do |actual|
    actual&.hour == 23 && actual&.minute == 59 && actual&.second == 59
  end
end
