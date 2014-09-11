require 'spec_helper'


describe ActivitySession, :type => :model do

  describe "can behave lika an uid class" do 

    context "when behaves like uid" do
      it_behaves_like "uid"
    end

  end


end
