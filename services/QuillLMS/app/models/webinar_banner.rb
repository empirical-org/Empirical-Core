# frozen_string_literal: true

class WebinarBanner
  attr_reader :time

  ZOOM_URL = "https://quill-org.zoom.us/webinar/register"

  MLK_DAY_2021 = Date.parse("20210118")
  PRESIDENTS_DAY_2021 = Date.parse("20210215")
  SKIPPED_DAYS = [MLK_DAY_2021, PRESIDENTS_DAY_2021]

  SCHOOL_PREMIUM_TYPES = ["School Paid", "School District Paid", "School Sponsored Free"]

  def initialize(time)
    @time = time
  end

  def link
    values&.dig(:link)
  end

  def link_display_text
    values&.dig(:link_display_text)
  end

  def title
    values&.dig(:title)
  end

  def subscription_only?
    values&.dig(:subscription_only)
  end

  def second_or_fourth_only
    values&.dig(:second_or_fourth_only)
  end

  def show?(account_type = nil)
    (link.present? && title.present? && link_display_text.present? && !skipped_day? &&
     show_with_subscription?(account_type) && show_with_month_restrictions)
  end

  def show_with_subscription?(account_type)
    !subscription_only? || SCHOOL_PREMIUM_TYPES.include?(account_type)
  end

  def show_with_month_restrictions
    !second_or_fourth_only || second_or_fourth_week_of_month?(time)
  end

  private def skipped_day?
    SKIPPED_DAYS.any? { |date| date.month == time.month && date.day == time.day }
  end

  private def second_or_fourth_week_of_month?(date)
    ((date.day - 1) / 7).odd?
  end
end
