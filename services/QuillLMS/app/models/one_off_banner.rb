# frozen_string_literal: true

class OneOffBanner < WebinarBanner

  # ONE-OFFS have the key format Month-Day-Hour
  # RECURRING have the key format DayOfWeek-Hour

  WEBINARS = {
    '5-12-11' => {
      title: "<strong>Webinar: Wrapping Up the School Year with Quill</strong> is live now!",
      link_display_text: "Click here to register and join.",
      link: "#{ZOOM_URL}/WN_m7Yc_C87RUu5sLW8yTz4eA#/registration"
    }
  }

  private def values
    WEBINARS[key]
  end

  private def key
    "#{time.month}-#{time.day}-#{time.hour}"
  end

end
