# frozen_string_literal: true

require 'rails_helper'

describe PagesController do
  it { should use_before_action :determine_js_file }
  it { should use_before_action :determine_flag }

  describe '#home_new' do
    context 'when user is signed in' do
      before do
        allow(controller).to receive(:signed_in?) { true }
        allow(controller).to receive(:current_user) { create(:user) }
      end

      it 'should redirect to profile path' do
        get :home_new
        expect(response).to redirect_to profile_path
      end
    end

    context 'when user is not signed in' do
      it 'should set the title and description' do
        get :home_new
        expect(assigns(:title)).to eq 'Quill.org | Interactive Writing and Grammar'
        expect(assigns(:description)).to eq 'Quill provides free writing and grammar activities for middle and high school students.'
        expect(assigns(:logging_user_out)).to eq nil
      end
    end

    context 'when user is not signed in, weird format' do
      it 'should render page' do
        headers = { Accept: "RandomGobbledyguck"}
        request.headers.merge! headers
        get :home_new

        expect(response).to render_template 'pages/home_new'
      end
    end

    context 'when a user has just signed out' do
      before do
        allow(controller).to receive(:check_should_clear_segment_identity) { true }
      end

      it 'should set the @logging_user_out flag' do
        get :home_new
        expect(assigns(:logging_user_out)).to eq true
      end
    end
  end

  describe '#play' do
    let!(:activity) { create(:activity, uid: "-K0rnIIF_iejGqS3XPJ8") }

    it 'should assign the activity and module url and redirect to the same url' do
      get :play
      expect(assigns(:activity)).to eq activity
      expect(assigns(:module_url)).to eq activity.anonymous_module_url
      expect(response).to redirect_to activity.anonymous_module_url.to_s
    end
  end

  describe '#tos' do
    it 'should assign the body class' do
      get :tos
      expect(assigns(:body_class)).to eq 'auxiliary white-page formatted-text'
    end
  end

  describe '#privacy' do
    it 'should set the body class' do
      get :privacy
      expect(assigns(:body_class)).to eq 'auxiliary white-page formatted-text'
    end
  end

  describe '#diagnostic_tool' do
    it 'should set the title and description' do
      get :diagnostic_tool
      expect(assigns(:title)).to eq 'Quill Diagnostic | Free Diagnostic and Adaptive Lesson Plan'
      expect(assigns(:description)).to eq 'Quickly determine which skills your students need to work on with our 22 question diagnostic.'
    end
  end

  describe '#grammar_tool' do
    it 'should set the title and description' do
      get :grammar_tool
      expect(assigns(:title)).to eq 'Quill Grammar | Free 10 Minute Activities for your Students'
      expect(assigns(:description)).to eq 'Over 150 sentence writing activities to help your students practice basic grammar skills.'
    end
  end

  describe '#proofreader_tool' do
    it 'should set the title and description' do
      get :proofreader_tool
      expect(assigns(:title)).to eq 'Quill Proofreader | Over 100 Expository Passages To Read And Edit'
      expect(assigns(:description)).to eq 'Students edit passages and receive personalized exercises based on their results.'
    end
  end

  describe '#connect_tool' do
    it 'should set the title and description' do
      get :connect_tool
      expect(assigns(:title)).to eq 'Quill Connect | Free Sentence Structure Activities'
      expect(assigns(:description)).to eq 'Help your students advance from fragmented and run-on sentences to complex and well-structured sentences with Quill Connect.'
    end
  end

  describe '#lessons_tool' do
    it 'should set the title and description' do
      get :lessons_tool
      expect(assigns(:title)).to eq 'Quill Lessons | Free Group Writing Activities'
      expect(assigns(:description)).to eq 'Lead whole-class and small group writing instruction with interactive writing prompts and discussion topics.'
    end
  end

  describe '#activities' do
    let!(:standard_level) { create(:standard_level) }

    it 'should set the body class, standard_level and standards' do
      get :activities
      expect(assigns(:body_class)).to eq 'full-width-page white-page'
      expect(assigns(:standard_level)).to eq standard_level
      expect(assigns(:standards)).to eq standard_level.standards.map{ |standard| [standard, standard.activities.production] }.select{ |group| group.second.any? }
    end
  end

  describe '#premium' do
    let!(:user) { create(:user) }

    before { allow(controller).to receive(:current_user) { user } }

    it 'should set the variables' do
      get :premium
      expect(assigns(:user_is_eligible_for_new_subscription)).to eq true
      expect(assigns(:user_is_eligible_for_trial)).to eq true
      expect(assigns(:user_has_school)).to eq false
      expect(assigns(:user_belongs_to_school_that_has_paid)).to eq false
    end
  end

  describe '#locker' do
    let!(:user) { create(:user) }

    before do
      allow(controller).to receive(:current_user) { user }
    end

    it 'should redirect if current user is not staff' do
      get :locker
      expect(response).to redirect_to profile_path
    end

    it 'should render for staff' do
      user.role = 'staff'
      get :locker
      expect(response.status).to eq 200
    end
  end

  describe '#press' do
    let!(:post) { create(:blog_post, draft: false, topic: "In the news") }
    let!(:other_post) { create(:blog_post, draft: false, topic: "Press releases") }

    it 'should assign the blog posts' do
      get :press
      expect(assigns(:in_the_news)).to eq([post])
      expect(assigns(:press_releases)).to eq([other_post])
    end
  end

  describe '#announcements' do
    let!(:post) { create(:blog_post, draft: false, topic: "What's new?") }

    it 'should assign the blog posts' do
      get :announcements
      expect(assigns(:blog_posts)).to eq([post])
    end
  end

  describe 'careers page' do
    it 'should load page' do
      get :careers
      expect(response).to be_successful
    end
  end

end
