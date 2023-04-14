# frozen_string_literal: true

# == Schema Information
#
# Table name: canvas_configs
#
#  id                       :bigint           not null, primary key
#  client_id_ciphertext     :text             not null
#  client_secret_ciphertext :text             not null
#  url                      :string           not null
#  created_at               :datetime         not null
#  updated_at               :datetime         not null
#
require 'rails_helper'

RSpec.describe CanvasConfig, type: :model do
  let(:canvas_config) { create(:canvas_config) }

  it { expect(canvas_config).to be_valid }

  it { should have_many(:school_canvas_configs).dependent(:destroy)}
  it { should have_many(:canvas_accounts).dependent(:destroy) }
  it { should have_many(:users).through(:canvas_accounts)}
end
