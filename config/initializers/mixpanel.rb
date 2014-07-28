unless [:development, :test].include?(Rails.env.to_sym)
  $mixpanel = Mixpanel::Tracker.new('2e87e79bda898d69197d3623c426be35')
end
