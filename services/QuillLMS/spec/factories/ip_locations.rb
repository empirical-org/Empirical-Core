# == Schema Information
#
# Table name: ip_locations
#
#  id         :integer          not null, primary key
#  city       :string
#  country    :string
#  state      :string
#  zip        :integer
#  created_at :datetime
#  updated_at :datetime
#  user_id    :integer
#
# Indexes
#
#  index_ip_locations_on_user_id  (user_id)
#  index_ip_locations_on_zip      (zip)
#
FactoryBot.define do
  factory :ip_location do
    country 'United States'
    city    { "New York City" }
    state   { "NY" }
    zip     { "10003" }
  end
end
