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
# Indexes
#
#  index_canvas_instances_on_url  (url) UNIQUE
#
class CanvasInstance < ApplicationRecord
  has_many :canvas_instance_schools, dependent: :destroy
  has_many :schools, through: :canvas_instance_schools

  has_many :canvas_accounts, dependent: :destroy
  has_many :users, through: :canvas_accounts

  has_many :canvas_configs, dependent: :destroy

  before_validation :downcase_url

  validates :url,
    presence: true,
    uniqueness: true,
    url: true

  def canvas_config
    canvas_configs.last
  end

  def client_id
    canvas_config&.client_id
  end

  def client_secret
    canvas_config&.client_secret
  end

  private def downcase_url
    self.url = url.downcase if url.present?
  end
end
