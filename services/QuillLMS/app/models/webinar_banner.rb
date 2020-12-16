class WebinarBanner
  attr_reader :time

  ZOOM_URL = "https://quill-org.zoom.us/webinar/register"

  # ONE-OFFS have the key format Month-Day-Hour
  # RECURRING have the key format DayOfWeek-Hour

  ONE_OFFS = {}

  RECURRING = {
    '1-16' => ["Quill Webinar 101: Getting Started", "#{ZOOM_URL}/WN_a4Z1_Zs6RSGUWwr_t0V18Q"]
  }

  def initialize(time)
    @time = time
  end

  def link
    values&.at(1)
  end

  def title
    values&.at(0)
  end

  def show?
    link.present? && title.present?
  end

  private def values
    if recurring?
      RECURRING[recurring_key]
    elsif one_off?
      ONE_OFFS[one_off_key]
    end
  end

  private def recurring?
    time.wday == 1 || time.wday == 2
  end

  private def recurring_key
    "#{time.wday}-#{time.hour}"
  end

  private def one_off?
    time.wday == 3
  end

  private def one_off_key
    "#{time.month}-#{time.day}-#{time.hour}"
  end
end
