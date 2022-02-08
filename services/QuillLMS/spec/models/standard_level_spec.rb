# frozen_string_literal: true

# == Schema Information
#
# Table name: standard_levels
#
#  id         :integer          not null, primary key
#  name       :string
#  position   :integer
#  uid        :string
#  visible    :boolean          default(TRUE)
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
require 'rails_helper'

describe StandardLevel, type: :model do

  let(:standard_level){ build(:standard_level) }

  it_behaves_like 'uid'

  context "when it's created/updated" do

    it "must be valid with valid info" do
      expect(standard_level).to be_valid
    end

    context "when it runs validations" do

      it "must have a name" do
        standard_level.name=nil
        standard_level.valid?
        expect(standard_level.errors[:name]).to include "can't be blank"
      end

    end
  end

  describe 'callbacks' do

    context 'when a standardLevel is archived' do
      it 'should archive all associated standards' do
        standard = create(:standard, standard_level: standard_level)
        standard_level.update(visible: false)
        expect(standard.reload.visible).to eq(false)
      end
    end

    context 'when standardLevel is committed' do
      it "should send clear_activity_search_cache after commit" do
        expect(Activity).to receive(:clear_activity_search_cache)
        standard_level.run_callbacks(:commit)
      end
    end
  end
end
