require 'rails_helper'

describe Section, type: :model do

	let(:section){ FactoryGirl.build(:section) }

	describe 'can behave like an uid class' do
    context 'when behaves like uid' do
      it_behaves_like 'uid'
    end
  end

	context "when it's created/updated" do

		it "must be valid with valid info" do
			expect(section).to be_valid
		end

		context "when it runs validations" do

			it "must have a name" do
				section.name=nil
				section.valid?
				expect(section.errors[:name]).to include "can't be blank"
			end

		end
	end
end
