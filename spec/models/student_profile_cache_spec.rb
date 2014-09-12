require 'spec_helper'


describe StudentProfileCache, :type => :model do

	let(:student){FactoryGirl.create(:student)}

	describe "#invalidate_sync" do 

		before do 
			StudentProfileCache.invalidate_sync [student]			
		end

		it "must clear rails cache for controller" do 
			controller_cache_key="controller/student-profile-vars-#{student.id}"			
			expect(Rails.cache.read controller_cache_key).to be_nil
			
		end

		it "must clear rails cache for view" do 
			view_cache_key="views/student-profile-#{student.id}"
			expect(Rails.cache.read view_cache_key).to be_nil
		end

	end

	describe "#invalidate" do 

		it "must enqueue the job" do 
			expect(StudentProfileCache.invalidate [student]).to eq [student]
			#TODO: Review QC looking for the enqueued object
		end

	end

end