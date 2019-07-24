class FakeSegmentBackend
  attr_accessor :identify_calls, :track_calls

  def initialize
    @identify_calls = []
    @track_calls = []
  end

  def identify(options)
    @identify_calls << options
  end

  def track(options)
    @track_calls << options
  end
end