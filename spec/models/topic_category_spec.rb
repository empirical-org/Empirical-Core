require 'rails_helper'

describe TopicCategory, type: :model do
  describe 'can behave like an uid class' do
    context 'when behaves like uid' do
      it_behaves_like 'uid'
    end
  end
end