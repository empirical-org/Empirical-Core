# frozen_string_literal: true

class OneOffBanner < WebinarBanner

  # ONE-OFFS have the key format Month-Day-Hour
  # RECURRING have the key format DayOfWeek-Hour

  LINK_TEXT = "Click here to register and join."

  WEBINAR_BASIC = {
    title: "The webinar <strong>Back to School with Quill: Learn the Basics</strong> is live now!",
    link_display_text: LINK_TEXT,
    link: "#{ZOOM_URL}/WN_2LfW2CGRSfyfJzv79kF_2Q#/registration"
  }

  WEBINAR_BEYOND = {
    title: "The webinar <strong>Back to School with Quill: Beyond the Basics</strong> is live now!",
    link_display_text: LINK_TEXT,
    link: "#{ZOOM_URL}/WN_h2usGleLTRqPBLv9D5KNvw#/registration"
  }

  WEBINAR_EVIDENCE = {
    title: "The webinar <strong>Introducing Quill’s Newest Tool: Reading for Evidence (grades 8 & up)</strong> is live now!",
    link_display_text: LINK_TEXT,
    link: "#{ZOOM_URL}/WN_SBH_CLO5TIucJSlH7j2lkQ#/registration",
    custom_length: 30
  }

  WEBINARS = {
    '8-10-11' => WEBINAR_BASIC,
    '8-17-18' => WEBINAR_BASIC,
    '8-24-11' => WEBINAR_BASIC,
    '8-31-18' => WEBINAR_BASIC,
    '9-07-16' => WEBINAR_BASIC,
    '9-14-11' => WEBINAR_BASIC,
    '8-11-11' => WEBINAR_BEYOND,
    '8-18-18' => WEBINAR_BEYOND,
    '8-25-11' => WEBINAR_BEYOND,
    '9-01-18' => WEBINAR_BEYOND,
    '9-08-16' => WEBINAR_BEYOND,
    '9-15-11' => WEBINAR_BEYOND,
    '8-09-16' => WEBINAR_EVIDENCE,
    '8-23-11' => WEBINAR_EVIDENCE,
    '9-06-16' => WEBINAR_EVIDENCE,
    '9-20-11' => WEBINAR_EVIDENCE,
  }

  private def values
    WEBINARS[key]
  end

  private def key
    "#{time.month}-#{time.day}-#{time.hour}"
  end

end
