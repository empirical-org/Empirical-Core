# frozen_string_literal: true

# == Schema Information
#
# Table name: lockers
#
#  id          :bigint           not null, primary key
#  label       :string
#  preferences :jsonb
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  user_id     :integer
#
class Locker < ApplicationRecord
  has_one :user

  validates :user_id, presence: true, uniqueness: true
  validates :label, presence: true
end
