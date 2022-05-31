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

  validates :name, presence: true

  has_many :schools
  has_many :district_admins, class_name: 'DistrictAdmin', dependent: :destroy
  has_many :admins, through: :district_admins, source: :user

  scope :by_name, ->(name) { where('lower(name) LIKE ?', "%#{name.downcase}%") }
  scope :by_city, ->(city) { where('lower(city) LIKE ?', "%#{city.downcase}%") }
  scope :by_state, ->(state) { where(:state => state.upcase) }
  scope :by_zipcode, ->(zipcode) { where(:zipcode => zipcode) }
  scope :by_nces_id, ->(nces_id) { where(:nces_id => nces_id) }

  def total_invoice
    schools.sum { |s| s&.subscription&.payment_amount || 0 } / 100.0
  end

  def vitally_data
    {
      externalId: id.to_s,
      name: name,
      traits: {
        name: name,
        nces_id: nces_id,
        clever_id: clever_id,
        city: city,
        state: state,
        zipcode: zipcode,
        phone: phone,
        total_students: total_students,
        total_schools: total_schools
      }
    }
  end

end
