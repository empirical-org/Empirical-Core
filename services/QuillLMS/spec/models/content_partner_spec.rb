# frozen_string_literal: true

# == Schema Information
#
# Table name: content_partners
#
#  id          :integer          not null, primary key
#  description :string
#  name        :string           not null
#  visible     :boolean          default(TRUE)
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#
require 'rails_helper'

describe ContentPartner do
  let!(:content_partner) { create(:content_partner) }

  it { expect(subject).to validate_presence_of :name }
  it { expect(subject).to have_many :content_partner_activities }

  it "should send callback after commit" do
    expect(Activity).to receive(:clear_activity_search_cache)
    content_partner.run_callbacks(:commit)
  end
end
