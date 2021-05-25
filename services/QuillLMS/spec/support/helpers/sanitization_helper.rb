require 'fileutils'

module SanitizationHelper
  def sanitize_hash_array_for_comparison_with_sql(array_of_hashes)
    array_of_hashes.map do |hash|
      hash.map do |key, value|
        # Convert Times to have the right level of fidelity, and strip trailing zeroes
        value = value.strftime('%Y-%m-%d %T.%6N').gsub(/0*$/, '') if value.is_a? Time
        [key.to_s, value]
      end.to_h
    end
  end

  # This method can be called in any of our tests to convert a hash into a format
  # that allows it to be compared to a hash we pull back from Redis. Please note
  # that this is should not be trusted to be correct. Rather, it should be added
  # to and amended as necessary.
  def sanitize_hash_array_for_comparison_with_redis(array_of_hashes)
    array_of_hashes.map do |hash|
      hash.map do |key, value|
        # Convert numeric values to strings
        value = value.to_s if value.is_a? Numeric
        [key.to_s, value]
      end.to_h
    end
  end
end
