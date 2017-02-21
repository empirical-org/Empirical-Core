require 'rails_helper'

feature 'As someone who is not signed in, ensure that the' do

  context 'homepage' do
    before(:each) { visit root_path }
    it 'has a signup button in the navigation menu that redirects when clicked' do
      within(:css, '.home-nav-right') do
        click_link('Sign Up')
        expect(current_path).to eq(new_account_path)
      end
    end
    it 'has a signup button in the header that redirects when clicked' do
      within(:css, '.q-hero-text') do
        click_link('Sign Up')
        expect(current_path).to eq(new_account_path)
      end
    end
    it 'has a signup button at the bottom of the page that redirects when clicked' do
      within(:css, '.press-section') do
        click_link('Join Now, It\'s Free')
        expect(current_path).to eq(new_account_path)
      end
    end
    it 'has a navbar' do
      expect(page).to have_css('.home-nav-right')
    end
    it 'has a footer' do
      expect(page).to have_css('.home-footer')
    end
  end

  apps = ['Connect', 'Diagnostic', 'Proofreader', 'Grammar']

  apps.each do |app|
    context "#{app} tools page" do
      before(:each) { visit "/tools/#{app.downcase}" }
      it 'has hero text' do
        within(:css, '.tool-hero h1') { expect(page).to have_content("Quill #{app}") }
      end
      it 'has a preview link' do
        within(:css, '.tool-try-it .cta-button') { expect(page).to have_content("Preview") }
      end
      it 'has a signup link that redirects when clicked' do
        within(:css, '.tool-sign-up') do
          click_link('Sign Up')
          expect(current_path).to eq(new_account_path)
        end
      end
      it 'has a tab menu that links to each app with the current app having class active' do
        within(:css, '.full-screen .desktop-nav-list') do
          apps.each { |a| expect(page).to have_content("Quill #{a}") }
          within(:css, 'li.active') { expect(page).to have_content("Quill #{app}") }
        end
      end
    end
  end

end
