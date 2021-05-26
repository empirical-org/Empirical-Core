class RecurringBanner < WebinarBanner

  OFFICE_HOURS_TITLE = "Quill Office Hours are live now!"

  # ONE-OFFS have the key format Month-Day-Hour
  # RECURRING have the key format DayOfWeek-Hour

  WEBINARS = {
  }

  private def values
    WEBINARS[key]
  end

  private def key
    "#{time.wday}-#{time.hour}"
  end

end
