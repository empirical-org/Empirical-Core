# frozen_string_literal: true

# == Schema Information
#
# Table name: districts
#
#  id             :integer          not null, primary key
#  city           :string
#  grade_range    :string
#  name           :string
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
class District < ApplicationRecord

  has_many :schools
  has_many :districts_admins, class_name: 'DistrictsAdmins'
  has_many :admins, through: :districts_admins, source: :user

  def total_invoice
    schools.map { |s| s&.subscription&.payment_amount || 0 }.inject(0, :+)
  end

end
