require 'rails_helper'

describe FirebaseApp, :type => :model do

  let(:firebase_app){ FirebaseApp.create!(name: 'foobar', secret: 'bazfoo') } 

  context "#token_for" do 
        
  end

end
