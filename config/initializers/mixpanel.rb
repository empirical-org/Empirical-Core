if defined?(Mixpanel)
  $mixpanel = Mixpanel::Tracker.new(ENV['MIXPANEL_KEY'])
end
