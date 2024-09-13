# frozen_string_literal: true

module CoreExtensions
  module Array
    # return middle element of sorted array
    # for even-sized non-number arrays, return larger of middle two
    # for even-sized number arrays, return average of middle two
    def median
      return nil if empty?
      return self[0] if size == 1

      dup = sort
      mid = (dup.size / 2).to_i

      return dup[mid] if dup.size.odd?
      return dup[mid] if !dup[0].is_a?(Numeric)

      (dup[mid] + dup[mid - 1]) / 2.0
    end

    def average
      return 0 if empty?

      sum.to_f / size
    end

    def dot_product(other_array) = zip(other_array).map { |a, b| a * b }.sum
    def magnitude = Math.sqrt(map { |x| x**2 }.sum)

    # Method to calculate cosine similarity between two arrays
    def cosine_similarity(other_array)
      mag = magnitude
      mag_other = other_array.magnitude

      return 0 if mag == 0 || mag_other == 0

      dot_product(other_array) / (mag * mag_other)
    end

    def cosine_distance(other_array) = 1 - cosine_similarity(other_array)
  end
end
