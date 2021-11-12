class OneOffBanner < WebinarBanner

  # ONE-OFFS have the key format Month-Day-Hour
  # RECURRING have the key format DayOfWeek-Hour

  WEBINARS = {
    '11-3-19' => {
      title: "<strong>Webinar: Supporting ELLs with Quill</strong> is live now!",
      link_display_text: "Click here to register and join.",
      link: "#{ZOOM_URL}/WN_Yu6rY35bRTGfHOte0ciD0A"
    },
    '11-4-16' => {
      title: "<strong>Webinar: Supporting ELLs with Quill</strong> is live now!",
      link_display_text: "Click here to register and join.",
      link: "#{ZOOM_URL}/WN_Yu6rY35bRTGfHOte0ciD0A"
    },
    '11-10-19' => {
      title: "<strong>Webinar: Using Quill to Support Students with IEPs</strong> is live now!",
      link_display_text: "Click here to register and join.",
      link: "#{ZOOM_URL}/WN_fbhlNZrsRz2FDoWMzSBg5Q"
    },
    '11-11-16' => {
      title: "<strong>Webinar: Using Quill to Support Students with IEPs</strong> is live now!",
      link_display_text: "Click here to register and join.",
      link: "#{ZOOM_URL}/WN_fbhlNZrsRz2FDoWMzSBg5Q"
    },
    '11-17-19' => {
      title: "<strong>Webinar: Reports Deep Dive</strong> is live now!",
      link_display_text: "Click here to register and join.",
      link: "#{ZOOM_URL}/WN_5A7DtmELR4Kz0trUyzqHXw"
    },
    '11-18-16' => {
      title: "<strong>Webinar: Reports Deep Dive</strong> is live now!",
      link_display_text: "Click here to register and join.",
      link: "#{ZOOM_URL}/WN_5A7DtmELR4Kz0trUyzqHXw"
    },
    '12-1-19' => {
      title: "<strong>Webinar: Teacher-led Instruction with Quill Lessons</strong> is live now!",
      link_display_text: "Click here to register and join.",
      link: "#{ZOOM_URL}/WN_5A7DtmELR4Kz0trUyzqHXw"
    },
    '12-2-16' => {
      title: "<strong>Webinar: Teacher-led Instruction with Quill Lessons</strong> is live now!",
      link_display_text: "Click here to register and join.",
      link: "#{ZOOM_URL}/WN_5A7DtmELR4Kz0trUyzqHXw"
    },
    '12-8-19' => {
      title: "<strong>Webinar: Activities Deep Dive</strong> is live now!",
      link_display_text: "Click here to register and join.",
      link: "#{ZOOM_URL}/WN_3iBJ4ehuQnGRGYUOmRXtUA"
    },
    '12-9-16' => {
      title: "<strong>Webinar: Activities Deep Dive</strong> is live now!",
      link_display_text: "Click here to register and join.",
      link: "#{ZOOM_URL}/WN_3iBJ4ehuQnGRGYUOmRXtUA"
    },
    '1-3-16' => {
      title: "<strong>Webinar: Quill 101</strong> is live now!",
      link_display_text: "Click here to register and join.",
      link: "#{ZOOM_URL}/WN_dI4RRV1qQE-R5s68hXuSDQ"
    },
    '1-10-16' => {
      title: "<strong>Webinar: Quill 101</strong> is live now!",
      link_display_text: "Click here to register and join.",
      link: "#{ZOOM_URL}/WN_dI4RRV1qQE-R5s68hXuSDQ"
    },
    '1-24-16' => {
      title: "<strong>Webinar: Quill 101</strong> is live now!",
      link_display_text: "Click here to register and join.",
      link: "#{ZOOM_URL}/WN_dI4RRV1qQE-R5s68hXuSDQ"
    },
    '1-31-16' => {
      title: "<strong>Webinar: Quill 101</strong> is live now!",
      link_display_text: "Click here to register and join.",
      link: "#{ZOOM_URL}/WN_dI4RRV1qQE-R5s68hXuSDQ"
    },
    '1-3-16' => {
      title: "<strong>Webinar: Quill 101</strong> is live now!",
      link_display_text: "Click here to register and join.",
      link: "#{ZOOM_URL}/WN_dI4RRV1qQE-R5s68hXuSDQ"
    },
    '1-5-19' => {
      title: "<strong>Webinar: Using Quill with Google Classroom</strong> is live now!",
      link_display_text: "Click here to register and join.",
      link: "#{ZOOM_URL}/WN_NJgbT-yJQLim1bdJ_J8g_w"
    },
    '1-6-16' => {
      title: "<strong>Webinar: Using Quill with Google Classroom</strong> is live now!",
      link_display_text: "Click here to register and join.",
      link: "#{ZOOM_URL}/WN_NJgbT-yJQLim1bdJ_J8g_w"
    },
    '1-10-16' => {
      title: "<strong>Webinar: Quill 101</strong> is live now!",
      link_display_text: "Click here to register and join.",
      link: "#{ZOOM_URL}/WN_dI4RRV1qQE-R5s68hXuSDQ"
    },
    '1-12-19' => {
      title: "<strong>Webinar: Quill Diagnostics & Recommendations</strong> is live now!",
      link_display_text: "Click here to register and join.",
      link: "#{ZOOM_URL}/WN_eLqaiQtpQSyia8QJHz2ZmA"
    },
    '1-13-16' => {
      title: "<strong>Webinar: Quill Diagnostics & Recommendations</strong> is live now!",
      link_display_text: "Click here to register and join.",
      link: "#{ZOOM_URL}/WN_eLqaiQtpQSyia8QJHz2ZmA"
    },
    '1-19-19' => {
      title: "<strong>Webinar: Exploring the Activity Library</strong> is live now!",
      link_display_text: "Click here to register and join.",
      link: "#{ZOOM_URL}/WN_-U9oIN30Q_y9JPtzYKrZfg"
    },
    '1-20-16' => {
      title: "<strong>Webinar: Exploring the Activity Library</strong> is live now!",
      link_display_text: "Click here to register and join.",
      link: "#{ZOOM_URL}/WN_-U9oIN30Q_y9JPtzYKrZfg"
    },
    '1-24-16' => {
      title: "<strong>Webinar: Quill 101</strong> is live now!",
      link_display_text: "Click here to register and join.",
      link: "#{ZOOM_URL}/WN_dI4RRV1qQE-R5s68hXuSDQ"
    },
    '1-31-16' => {
      title: "<strong>Webinar: Quill 101</strong> is live now!",
      link_display_text: "Click here to register and join.",
      link: "#{ZOOM_URL}/WN_dI4RRV1qQE-R5s68hXuSDQ"
    }
  }

  private def values
    WEBINARS[key]
  end

  private def key
    "#{time.month}-#{time.day}-#{time.hour}"
  end

end
