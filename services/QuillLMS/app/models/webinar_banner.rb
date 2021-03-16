class WebinarBanner
  attr_reader :time

  ZOOM_URL = "https://quill-org.zoom.us/webinar/register"

  # ONE-OFFS have the key format Month-Day-Hour
  # RECURRING have the key format DayOfWeek-Hour

  ONE_OFFS = {}

  OFFICE_HOURS_TITLE = "Quill Office Hours are live now!"

  RECURRING = {
    '1-16' => {
      title: "<strong>Quill Webinar 101: Getting Started</strong> is live now!",
      link_display_text: "Click here to register and join.",
      link: "#{ZOOM_URL}/WN_a4Z1_Zs6RSGUWwr_t0V18Q",
      subscription_only: false,
      second_or_fourth_only: false
    },
    '3-10' => {
      title: OFFICE_HOURS_TITLE,
      link_display_text: "Click here to join",
      link: "https://quill-org.zoom.us/j/93744355918#success",
      subscription_only: true,
      second_or_fourth_only: true
    },
    '3-16' => {
      title: OFFICE_HOURS_TITLE,
      link_display_text: "Click here to join",
      link: "https://quill-org.zoom.us/j/95335806177#success",
      subscription_only: true,
      second_or_fourth_only: true
    }
  }

  MLK_DAY_2021 = Date.parse("20210118")
  PRESIDENTS_DAY_2021 = Date.parse("20210215")
  SKIPPED_DAYS = [MLK_DAY_2021, PRESIDENTS_DAY_2021]

  def initialize(time)
    @time = time
  end

  def link
    values&.fetch(:link)
  end

  def link_display_text
    values&.fetch(:link_display_text)
  end

  def title
    values&.fetch(:title)
  end

  def subscription_only?
    values&.fetch(:subscription_only)
  end

  def second_or_fourth_only
    values&.fetch(:second_or_fourth_only)
  end

  def show?(has_subscription)
    (link.present? && title.present? && link_display_text.present? && !skipped_day? &&
     show_with_subscription?(has_subscription) && show_with_month_restrictions)
  end

  def show_with_subscription?(has_subscription)
    !subscription_only? || has_subscription
  end

  def show_with_month_restrictions
    !second_or_fourth_only || is_second_or_fourth_week_of_month(time)
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
    time.wday == 1 || time.wday == 2 || time.wday == 3
  end

  private def recurring_key
    "#{time.wday}-#{time.hour}"
  end

  private def one_off?
    false
  end

  private def one_off_key
    "#{time.month}-#{time.day}-#{time.hour}"
  end

  private def is_second_or_fourth_week_of_month(date)
    ((date.day - 1) / 7).odd?
  end
end
