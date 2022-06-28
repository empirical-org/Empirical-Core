# frozen_string_literal: true

module Cms
  class DistrictSchoolsAndSubscriptionStatus < ApplicationService
    attr_reader :district, :subscription

    def initialize(district, subscription)
      @district = district
      @subscription = subscription
    end

    def run
      district_schools_attached_to_subscription + district_schools_not_attached_to_subscription
    end

    private def district_schools
      district&.schools || []
    end

    private def district_schools_attached_to_subscription
      (district_schools & schools_attached_to_subscription).map { |school| school_and_subscription_status(school, true) }
    end

    private def district_schools_not_attached_to_subscription
      (district_schools - schools_attached_to_subscription).map { |school| school_and_subscription_status(school, false) }
    end

    private def schools_attached_to_subscription
      subscription&.schools || []
    end

    private def school_and_subscription_status(school, has_subscription)
      { id: school.id, name: school.name, checked: has_subscription }
    end
  end
end
