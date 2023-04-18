# frozen_string_literal: true

# == Schema Information
#
# Table name: canvas_instances
#
#  id         :bigint           not null, primary key
#  url        :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
class CanvasInstance < ApplicationRecord
  has_many :school_canvas_instances, dependent: :destroy
  has_many :schools, through: :school_canvas_instances

  has_many :canvas_accounts, dependent: :destroy
  has_many :users, through: :canvas_accounts

  has_many :canvas_configs, dependent: :destroy
end
