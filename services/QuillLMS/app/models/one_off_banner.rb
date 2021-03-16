class OneOffBanner < WebinarBanner

  # ONE-OFFS have the key format Month-Day-Hour
  # RECURRING have the key format DayOfWeek-Hour

  WEBINARS = {
    '3-16-13' => {
      title: "Quill's Diagnostics Deep Dive is live now!",
      link_display_text: "Register and join.",
      link: "#{ZOOM_URL}/WN_Va64n0FNQvOAhYWXUreRvw"
    },
    '3-24-16' => {
      title: "Quill's Diagnostics Deep Dive is live now!",
      link_display_text: "Register and join.",
      link: "#{ZOOM_URL}/WN_Va64n0FNQvOAhYWXUreRvw"
    },
    '3-31-16' => {
      title: "Quill's Spotlight on Supporting Students with IEPs is live now!",
      link_display_text: "Register and join.",
      link: "#{ZOOM_URL}/WN_941XHDtrQweTVEAhUO9YoQ"
    },
    '4-7-16' => {
      title: "Quill's Activity Library Deep Dive is live now!",
      link_display_text: "Register and join.",
      link: "#{ZOOM_URL}/WN_tZvfRYTmSxaGvnUHIb4JOw"
    },
    '4-14-16' => {
      title: "Quill Lessons Deep Dive is live now!",
      link_display_text: "Register and join.",
      link: "#{ZOOM_URL}/WN_dLPDCgrFTYKBmCxnxez3TQ"
    },
    '4-21-16' => {
      title: "Quill Connect Deep Dive is live now!",
      link_display_text: "Register and join.",
      link: "#{ZOOM_URL}/WN_k0PpCaUOQWO1rV0eCC4csA"
    },
    '4-28-16' => {
      title: "Quill's Dashboard Deep Dive is live now!",
      link_display_text: "Register and join.",
      link: "#{ZOOM_URL}/WN_cfJyPnQcSAiMGg5wDUPonA"
    },
    '5-5-16' => {
      title: "Quill's Spotlight on Improving Sentence Fluency is live now!",
      link_display_text: "Register and join.",
      link: "#{ZOOM_URL}/WN_ayEhvBGEQimd_N6qRcPRAQ"
    },
    '5-12-16' => {
      title: "Quill's Reports Deep Dive is live now!",
      link_display_text: "Register and join.",
      link: "#{ZOOM_URL}/WN_JRbcCZC6SPu2tsm5QRayiQ"
    },
    '5-19-16' => {
      title: "Quill's Spotlight on Supporting English Language Learners is live now!",
      link_display_text: "Register and join.",
      link: "#{ZOOM_URL}/WN_aGUHfo-jQD6Zhg8EVzcajA"
    }
  }

  def initialize(time)
    super(time)
  end

  private def values
    WEBINARS[key]
  end

  private def key
    "#{time.month}-#{time.day}-#{time.hour}"
  end

end
