# frozen_string_literal: true

# == Schema Information
#
# Table name: districts
#
#  id             :integer          not null, primary key
#  city           :string
#  grade_range    :string
#  name           :string           not null
#  phone          :string
#  state          :string
#  token          :string
#  total_schools  :integer
#  total_students :integer
#  zipcode        :string
#  created_at     :datetime
#  updated_at     :datetime
#  clever_id      :string
#  nces_id        :integer
#
# Indexes
#
#  index_districts_on_nces_id  (nces_id) UNIQUE
#
class District < ApplicationRecord
  include Subscriber

  validates :name, presence: true

  has_many :schools
  has_many :district_admins, class_name: 'DistrictAdmin', dependent: :destroy
  has_many :admins, through: :district_admins, source: :user
  has_many :district_subscriptions
  has_many :subscriptions, through: :district_subscriptions

  scope :by_name, ->(name) { where('lower(name) LIKE ?', "%#{name.downcase}%") }
  scope :by_city, ->(city) { where('lower(city) LIKE ?', "%#{city.downcase}%") }
  scope :by_state, ->(state) { where(:state => state.upcase) }
  scope :by_zipcode, ->(zipcode) { where(:zipcode => zipcode) }
  scope :by_nces_id, ->(nces_id) { where(:nces_id => nces_id) }

  def join_subscription(subscription)
    district_subscriptions.create(subscription: subscription)
  end

  def total_invoice
    schools.sum { |s| s&.subscription&.payment_amount || 0 } / 100.0
  end

  def schools_and_subscription_status
    schools_with_subscription + schools_without_subscription
  end

  def schools_with_subscription
    (schools & (subscription&.schools || [])).map { |school| school_and_subscription_status(school, true) }
  end

  def schools_without_subscription
    (schools - (subscription&.schools || [])).map { |school| school_and_subscription_status(school, false) }
  end

  private def school_and_subscription_status(school, has_subscription)
    { id: school.id, name: school.name, checked: has_subscription }
  end

end
