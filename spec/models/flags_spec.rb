require 'spec_helper'

describe Flags, :type => :model do

  let(:flag) { Class.new { include Flags } }

  describe "#flag" do 
    it "must do something" do 
      p flag
    end
  end

end