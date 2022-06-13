# frozen_string_literal: true

# == Schema Information
#
# Table name: zipcode_infos
#
#  id                   :integer          not null, primary key
#  _area_codes          :text
#  _secondary_cities    :text
#  city                 :text
#  county               :text
#  decommissioned       :boolean
#  estimated_population :integer
#  lat                  :float
#  lng                  :float
#  state                :text
#  timezone             :text
#  zipcode              :text
#  zipcode_type         :text
#
# Indexes
#
#  index_zipcode_infos_on_zipcode  (zipcode) UNIQUE
#
class ZipcodeInfo < ApplicationRecord


  # Takes a tuple of (lat, lng) where lng and lat are floats, and a distance in
  # miles. Returns a list of zipcodes near the point.

  # rubocop:disable Metrics/CyclomaticComplexity
  def self.isinradius(point, distance)

    zips_in_radius = []

    unless point.is_a? Array and point.length == 2 and point.all? { |e| e.is_a?(Float) }
      # point should be a tuple of floats lat, lon, like (40.7694, -73.9609)
      return [] # NOTE: is this expected behavior?
    end
    unless distance.is_a? Integer or distance.is_a? Float
      return []
    end

    distance = distance.to_i # if distance is a float

    dist_btwn_lat_deg = 69.172
    dist_btwn_lng_deg = Math.cos(point[0]) * 69.172
    lat_degr_rad = distance.to_f/dist_btwn_lat_deg
    lng_degr_rad = distance.to_f/dist_btwn_lng_deg

    latmin = point[0] - lat_degr_rad
    latmax = point[0] + lat_degr_rad
    lngmin = point[1] - lng_degr_rad
    lngmax = point[1] + lng_degr_rad

    if latmin > latmax
      latmin, latmax = latmax, latmin
    end
    if lngmin > lngmax
      lngmin, lngmax = lngmax, lngmin
    end

    zips = ZipcodeInfo.where(
      "lng > #{lngmin}"
    ).where(
      "lng < #{lngmax}"
    ).where(
      "lat > #{latmin}"
    ).where(
      "lat < #{latmax}"
    )

    zips.each do |z|
      if Haversine.distance(point[0], point[1], z.lat, z.lng).to_miles <= distance
        zips_in_radius << z
      end
    end

    zips_in_radius

  end
  # rubocop:enable Metrics/CyclomaticComplexity
end
