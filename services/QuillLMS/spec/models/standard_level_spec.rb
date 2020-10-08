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
end
