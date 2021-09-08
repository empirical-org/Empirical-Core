class RecurringBanner < WebinarBanner

  OFFICE_HOURS_TITLE = "Quill Office Hours are live now!"

  # ONE-OFFS have the key format Month-Day-Hour
  # RECURRING have the key format DayOfWeek-Hour

  WEBINARS = {
    '2-16' => {
      title: "<strong>Quill Webinar 101: Getting Started</strong> is live now!",
      link_display_text: "Click here to register and join.",
      link: "#{ZOOM_URL}/WN_vA0O4ltWSJKMLqghSm4otw"
    },
    '4-11' => {
      title: "<strong>Quill Webinar 101: Getting Started</strong> is live now!",
      link_display_text: "Click here to register and join.",
      link: "#{ZOOM_URL}/WN_vA0O4ltWSJKMLqghSm4otw"
    },
    '4-17' => {
      title: "<strong>Quill Webinar 101: Getting Started</strong> is live now!",
      link_display_text: "Click here to register and join.",
      link: "#{ZOOM_URL}/WN_vA0O4ltWSJKMLqghSm4otw"
    },
    '3-16' => {
      title: "<strong>Quill Webinar 201: Diving into Data</strong> is live now!",
      link_display_text: "Click here to register and join.",
      link: "#{ZOOM_URL}/WN_aIXMEsiVS_qYmLRTt-T4Tw"
    },
    '3-19' => {
      title: "<strong>Quill Webinar 201: Diving into Data</strong> is live now!",
      link_display_text: "Click here to register and join.",
      link: "#{ZOOM_URL}/WN_aIXMEsiVS_qYmLRTt-T4Tw"
    }
  }

  private def values
    WEBINARS[key]
  end

  private def key
    "#{time.wday}-#{time.hour}"
  end

end
