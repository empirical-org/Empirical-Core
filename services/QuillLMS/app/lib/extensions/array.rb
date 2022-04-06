class Array
  def median
    return nil if self.size == 0
    return self[0] if self.size == 1

    dup = self.sort
    mid = (dup.size / 2).to_i

    return dup[mid] if dup.size.odd?
    return dup[mid] if !dup[0].is_a?(Numeric)

    (dup[mid] + dup[mid - 1])/2.0
  end
end
