unless Rails.env.development?
  $mixpanel = Mixpanel::Tracker.new('2e87e79bda898d69197d3623c426be35')
end
