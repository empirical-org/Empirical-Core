# frozen_string_literal: true

# == Schema Information
#
# Table name: images
#
#  id         :integer          not null, primary key
#  file       :string
#  created_at :datetime
#  updated_at :datetime
#
class Image < ApplicationRecord
  mount_uploader :file, FileUploader
end
