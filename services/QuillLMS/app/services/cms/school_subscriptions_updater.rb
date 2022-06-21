# frozen_string_literal: true

module Cms
  class SchoolSubscriptionsUpdater < ApplicationService
    attr_reader :schools, :subscription

    delegate :school_subscriptions, :user_subscriptions, to: :subscription

    def initialize(subscription, schools)
      @subscription = subscription
      @schools = schools
    end

    def run
      return if subscription.nil? || schools.blank?

      ActiveRecord::Base.transaction(requires_new: true) do
        update_checked_school_subscriptions if checked_school_ids.any?
        update_unchecked_school_subscriptions if unchecked_school_ids.any?
      end
    end

    private def checked_school_ids
      schools.select { |school| school[:checked] }.pluck(:id)
    end

    private def unchecked_school_ids
      schools.reject { |school| school[:checked] }.pluck(:id)
    end

    private def update_checked_school_subscriptions
      existing_school_ids = school_subscriptions.where(school_id: checked_school_ids).pluck(:school_id)
      new_school_ids = checked_school_ids - existing_school_ids
      return if new_school_ids.empty?

      new_school_id_attrs = new_school_ids.map { |school_id| { school_id: school_id } }
      school_subscriptions.create!(new_school_id_attrs)
    end

    private def update_unchecked_school_subscriptions
      user_subscriptions.where(user_id: SchoolsUsers.where(school_id: unchecked_school_ids).pluck(:user_id)).delete_all
      school_subscriptions.where(school_id: unchecked_school_ids).delete_all
    end
  end
end
