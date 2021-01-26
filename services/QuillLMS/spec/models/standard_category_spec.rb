# == Schema Information
#
# Table name: standard_categories
#
#  id         :integer          not null, primary key
#  name       :string
#  uid        :string
#  visible    :boolean          default(TRUE)
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
require 'rails_helper'

describe StandardCategory, type: :model do
  it_behaves_like 'uid'
end
