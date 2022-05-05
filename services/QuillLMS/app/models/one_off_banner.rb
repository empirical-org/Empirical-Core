# frozen_string_literal: true

class OneOffBanner < WebinarBanner

  # ONE-OFFS have the key format Month-Day-Hour
  # RECURRING have the key format DayOfWeek-Hour

  WEBINARS = {
    '2-16-16' => {
      title: "<strong>Webinar: Growth Diagnostics</strong> is live now!",
      link_display_text: "Click here to register and join.",
      link: "#{ZOOM_URL}/WN_82Zt1W0rTuWmmZq6dwxl7A"
    },
    '2-17-11' => {
      title: "<strong>Webinar: Growth Diagnostics</strong> is live now!",
      link_display_text: "Click here to register and join.",
      link: "#{ZOOM_URL}/WN_82Zt1W0rTuWmmZq6dwxl7A"
    },
    '4-13-16' => {
      title: "<strong>Webinar: Growth Diagnostics</strong> is live now!",
      link_display_text: "Click here to register and join.",
      link: "#{ZOOM_URL}/WN_82Zt1W0rTuWmmZq6dwxl7A"
    },
    '4-14-11' => {
      title: "<strong>Webinar: Growth Diagnostics</strong> is live now!",
      link_display_text: "Click here to register and join.",
      link: "#{ZOOM_URL}/WN_82Zt1W0rTuWmmZq6dwxl7A"
    },
    '2-17-16' => {
      title: "<strong>Sneak Peek Webinar: Quill Reading for Evidence</strong> is live now!",
      link_display_text: "Click here to register and join.",
      link: "#{ZOOM_URL}/WN_m2vru_HNSieIB8GS4yMDRA"
    },
    '2-24-16' => {
      title: "<strong>Sneak Peek Webinar: Quill Reading for Evidence</strong> is live now!",
      link_display_text: "Click here to register and join.",
      link: "#{ZOOM_URL}/WN_m2vru_HNSieIB8GS4yMDRA"
    },
    '2-23-16' => {
      title: "<strong>Webinar: Using Quill with Google Classroom</strong> is live now!",
      link_display_text: "Click here to register and join.",
      link: "#{ZOOM_URL}/WN_NJgbT-yJQLim1bdJ_J8g_w"
    },
    '2-24-11' => {
      title: "<strong>Webinar: Using Quill with Google Classroom</strong> is live now!",
      link_display_text: "Click here to register and join.",
      link: "#{ZOOM_URL}/WN_NJgbT-yJQLim1bdJ_J8g_w"
    },
    '3-2-16' => {
      title: "<strong>Webinar: Quill Diagnostics & Recommendations</strong> is live now!",
      link_display_text: "Click here to register and join.",
      link: "#{ZOOM_URL}/WN_eLqaiQtpQSyia8QJHz2ZmA"
    },
    '3-3-11' => {
      title: "<strong>Webinar: Quill Diagnostics & Recommendations</strong> is live now!",
      link_display_text: "Click here to register and join.",
      link: "#{ZOOM_URL}/WN_eLqaiQtpQSyia8QJHz2ZmA"
    },
    '3-9-16' => {
      title: "<strong>Webinar: Using Quill to Support Students with IEPs</strong> is live now!",
      link_display_text: "Click here to register and join.",
      link: "#{ZOOM_URL}/WN_fbhlNZrsRz2FDoWMzSBg5Q"
    },
    '3-10-11' => {
      title: "<strong>Webinar: Using Quill to Support Students with IEPs</strong> is live now!",
      link_display_text: "Click here to register and join.",
      link: "#{ZOOM_URL}/WN_fbhlNZrsRz2FDoWMzSBg5Q"
    },
    '3-16-16' => {
      title: "<strong>Webinar: Supporting ELLs with Quill</strong> is live now!",
      link_display_text: "Click here to register and join.",
      link: "#{ZOOM_URL}/WN_Yu6rY35bRTGfHOte0ciD0A"
    },
    '3-17-11' => {
      title: "<strong>Webinar: Supporting ELLs with Quill</strong> is live now!",
      link_display_text: "Click here to register and join.",
      link: "#{ZOOM_URL}/WN_Yu6rY35bRTGfHOte0ciD0A"
    },
    '3-23-16' => {
      title: "<strong>Webinar: Whole-class Instruction with Quill Lessons</strong> is live now!",
      link_display_text: "Click here to register and join.",
      link: "#{ZOOM_URL}/WN_iDlszaO1TeepvZBsUIq-jg"
    },
    '3-24-11' => {
      title: "<strong>Webinar: Whole-class Instruction with Quill Lessons</strong> is live now!",
      link_display_text: "Click here to register and join.",
      link: "#{ZOOM_URL}/WN_iDlszaO1TeepvZBsUIq-jg"
    },
    '3-30-16' => {
      title: "<strong>Webinar: Independent Practice with Quill</strong> is live now!",
      link_display_text: "Click here to register and join.",
      link: "#{ZOOM_URL}/WN_-U9oIN30Q_y9JPtzYKrZfg"
    },
    '3-31-11' => {
      title: "<strong>Webinar: Independent Practice with Quill</strong> is live now!",
      link_display_text: "Click here to register and join.",
      link: "#{ZOOM_URL}/WN_-U9oIN30Q_y9JPtzYKrZfg"
    },
    '4-6-16' => {
      title: "<strong>Webinar: Reports Deep Dive</strong> is live now!",
      link_display_text: "Click here to register and join.",
      link: "#{ZOOM_URL}/WN_5A7DtmELR4Kz0trUyzqHXw"
    },
    '4-7-11' => {
      title: "<strong>Webinar: Reports Deep Dive</strong> is live now!",
      link_display_text: "Click here to register and join.",
      link: "#{ZOOM_URL}/WN_5A7DtmELR4Kz0trUyzqHXw"
    },
    '5-12-11' => {
      title: "Webinar: Wrapping Up the School Year with Quill is live now!",
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
