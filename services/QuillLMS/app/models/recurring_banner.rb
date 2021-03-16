class RecurringBanner < WebinarBanner

  OFFICE_HOURS_TITLE = "Quill Office Hours are live now!"

  # ONE-OFFS have the key format Month-Day-Hour
  # RECURRING have the key format DayOfWeek-Hour

  WEBINARS = {
    '1-16' => {
      title: "Quill 101 is live now!",
      link_display_text: "Register and join.",
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

  def initialize(time)
    super(time)
  end

  private def values
    WEBINARS[key]
  end

  private def key
    "#{time.wday}-#{time.hour}"
  end

end
