class Banner
  attr_reader :time

  ONE_OFFS = {
    '10-07-11' => ['Quill 101', "https://quill-org.zoom.us/webinar/register/WN_uzoWu3HuQCa2ZpyQ0j4C5g"],


  }

  RECURRING = {
    '1-11' => ["Quill 101",  "https://quill-org.zoom.us/webinar/register/WN_OmB4MXOgTkWh_jeTFXUTnw"]

  }

  def initialize(time)
    @time = time
  end


  # TODO fix up pseudo code
  # Banner.still_running?
  def self.still_running?
    current_time_on_east_coast < Date.parse("20201217")
  end

  def link
    return nil if values.nil?
    # find banner for day
    # check if in time
    values[1]
  end

  def title
    return nil if values.nil?

    values[0]
  end

  def show?
    link.present? && title.present?
  end

  # TODO fix up pseudo code
  private def values
    if is_monday? || is_tuesday?
      key = "#{time.day_of_week}-#{time.hour}"
      RECURRING[key]
    else is_wednseday
      key = "#{time.month}-#{time.day}-#{time.hour}"
      ONE_OFFS[key]
    end
  end
end
