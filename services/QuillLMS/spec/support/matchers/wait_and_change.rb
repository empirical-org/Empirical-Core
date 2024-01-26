# frozen_string_literal: true

RSpec::Matchers.define :wait_and_change do
  supports_block_expectations

  chain :by_waiting, :wait_time

  match do |actual_block|
    default_wait_time = 0.5.seconds
    initial_value = block_arg.call
    sleep(wait_time || default_wait_time)
    actual_block.call
    @new_value = block_arg.call
    initial_value != @new_value
  end

  failure_message do |_actual_block|
    "expected that the block would change the value, but it remained #{initial_value.inspect}"
  end
end
