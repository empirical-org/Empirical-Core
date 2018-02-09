require 'rails_helper'

describe.skip BlogPostsController, type: :controller do
  describe '#index' do
    it 'should return all non-draft blog posts' do

    end

    it 'should never return a draft' do

    end

    it 'should return the current webinar announcement' do

    end
  end

  describe '#show' do
    it 'should return a 404 if no such post found' do

    end

    it 'should return the called blog post' do

    end

    it 'should increment the blog post read count' do

    end

    it 'should return the blog post author' do

    end

    it 'should return the three most recent posts' do

    end
  end

  skip '#show_topic' do
    it 'should return a 404 if topic slug is not found' do

    end

    context '#pagination' do
      it 'should return the next 9 blog posts in the topic' do

      end

      it 'should never return a draft' do

      end
    end
  end
end
