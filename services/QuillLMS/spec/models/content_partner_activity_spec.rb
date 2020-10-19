require 'rails_helper'

describe ContentPartnerActivity do
  it { should belong_to :content_partner }
  it { should belong_to :activity }
end
