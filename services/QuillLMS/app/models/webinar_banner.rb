class WebinarBanner
  attr_reader :time
  ZOOM_URL = "https://quill-org.zoom.us/webinar/register"

  MLK_DAY_2021 = Date.parse("20210118")
  PRESIDENTS_DAY_2021 = Date.parse("20210215")
  SKIPPED_DAYS = [MLK_DAY_2021, PRESIDENTS_DAY_2021]

  def initialize(time)
    @time = time
  end

  def link
    values&.fetch(:link, nil)
  end

  def link_display_text
    values&.fetch(:link_display_text, nil)
  end

  def title
    values&.fetch(:title, nil)
  end

  def subscription_only?
    values&.fetch(:subscription_only, nil)
  end

  def second_or_fourth_only
    values&.fetch(:second_or_fourth_only, nil)
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

  private def values
    # implemented in the subclass
  end

  private def key
    # implemented in the subclass
  end

  private def skipped_day?
    SKIPPED_DAYS.any? { |date| date.month == time.month && date.day == time.day }
  end

  private def is_second_or_fourth_week_of_month(date)
    ((date.day - 1) / 7).odd?
  end
end
