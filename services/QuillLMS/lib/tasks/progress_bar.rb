class ProgessBar
  def initialize(total)
    @total = total
    @counter = 1
  end

  def increment
    complete = format("%<percent_completed>.2f%%", percent_completed: ((@counter / @total.to_f) * 100))
    print "\r\e[0K#{@counter}/#{@total} (#{complete})"
    @counter += 1
  end
end