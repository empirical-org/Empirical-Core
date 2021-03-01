class WebinarBanner
  attr_reader :time

  ZOOM_URL = "https://quill-org.zoom.us/webinar/register"

  # ONE-OFFS have the key format Month-Day-Hour
  # RECURRING have the key format DayOfWeek-Hour

  ONE_OFFS = {}

  RECURRING = {
    '1-16' => ["<strong>Quill Webinar 101: Getting Started</strong> is live now!", "Click here to register and join.", "#{ZOOM_URL}/WN_a4Z1_Zs6RSGUWwr_t0V18Q"],
    '3-10' => ["Quill Office Hours are live now!", "Click here to join", "https://quill-org.zoom.us/j/93744355918#success"],
    '3-16' => ["Quill Office Hours are live now!", "Click here to join", "https://quill-org.zoom.us/j/95335806177#success"]
  }

  MLK_DAY_2021 = Date.parse("20210118")
  PRESIDENTS_DAY_2021 = Date.parse("20210215")
  SKIPPED_DAYS = [MLK_DAY_2021, PRESIDENTS_DAY_2021]

  def initialize(time)
    @time = time
  end

  def link
    values&.at(2)
  end

  def link_display_text
    values&.at(1)
  end

  def title
    values&.at(0)
  end

  def show?
    link.present? && title.present? && link_display_text.present? && !skipped_day?
  end

  private def skipped_day?
    SKIPPED_DAYS.any? { |date| date.month == time.month && date.day == time.day }
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
