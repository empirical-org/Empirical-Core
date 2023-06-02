# frozen_string_literal: true

# == Schema Information
#
# Table name: user_logins
#
#  id         :bigint           not null, primary key
#  created_at :datetime         not null
#  user_id    :bigint           not null
#
# Indexes
#
#  index_user_logins_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
require 'rails_helper'

RSpec.describe UserLogin, type: :model do
  context 'should relations' do
    it { should belong_to(:user) }
  end
end
