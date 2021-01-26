# == Schema Information
#
# Table name: objectives
#
#  id                :integer          not null, primary key
#  action_url        :string
#  archived          :boolean          default(FALSE)
#  help_info         :string
#  name              :string
#  section           :string
#  section_placement :integer
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#
require 'rails_helper'

RSpec.describe Objective, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
