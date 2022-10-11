# frozen_string_literal: true

Geocoder.configure(lookup: :test, ip_lookup: :test)

Geocoder::Lookup::Test.set_default_stub(
  [
    {
      data: { 'location' => {'time_zone' => 'America/New_York' } }
    }
  ]
)
