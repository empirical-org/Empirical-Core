require 'rails_helper'

feature 'As someone who is not signed in, ensure that the' do

  context 'homepage' do
    before(:each) { visit root_path }
    xit 'has a signup button in the navigation menu that redirects when clicked' do
      within(:css, '.home-nav-right') do
        click_link('Sign Up')
        expect(current_path).to eq(new_account_path)
      end
    end
    xit 'has a signup button in the header that redirects when clicked' do
      within(:css, '.q-hero-text') do
        click_link('Sign Up')
        expect(current_path).to eq(new_account_path)
      end
    end
    xit 'has a signup button at the bottom of the page that redirects when clicked' do
      within(:css, '.press-section') do
        click_link('Join Now, It\'s Free')
        expect(current_path).to eq(new_account_path)
      end
    end
    xit 'has a navbar' do
      expect(page).to have_css('.home-nav-right')
    end
    xit 'has a footer' do
      expect(page).to have_css('.home-footer')
    end
  end

  apps = ['Connect', 'Diagnostic', 'Proofreader', 'Grammar']

  apps.each do |app|
    context "#{app} tools page" do
      before(:each) { visit "/tools/#{app.downcase}" }
      xit 'has hero text' do
        within(:css, '.tool-hero h1') { expect(page).to have_content("Quill #{app}") }
      end
      xit 'has a preview link' do
        within(:css, '.tool-try-it .cta-button') { expect(page).to have_content("Preview") }
      end
      xit 'has a signup link that redirects when clicked' do
        within(:css, '.tool-sign-up') do
          click_link('Sign Up')
          expect(current_path).to eq(new_account_path)
        end
      end
      xit 'has a tab menu that links to each app with the current app having class active' do
        within(:css, '.full-screen .desktop-nav-list') do
          apps.each { |a| expect(page).to have_content("Quill #{a}") }
          within(:css, 'li.active') { expect(page).to have_content("Quill #{app}") }
        end
      end
    end
  end

  context 'premium page', :js => true do
    before(:each) { visit '/premium' }
    xit 'has a pricing guide section' do
      within(:css, '#premium-pricing-guide') { expect(page).to have_content('Pricing Guide') }
    end
    xit 'has free option with functional sign up button' do
      pricing_mini = page.all(:css, '.pricing-mini')[0]
      pricing_mini.should have_content('Basic')
      pricing_mini.click_link('Sign Up')
      expect(current_path).to eq(new_account_path)
    end
    xit 'has premium option with nonfunctional trial and buy buttons' do
      pricing_mini = page.all(:css, '.pricing-mini')[1]
      pricing_mini.should have_content('Teacher Premium')
      pricing_mini.find_button('Free Trial').click
      accept_alert('You must be logged in to begin your free trial.')
      expect(current_path).to eq('/premium')
      pricing_mini.find_button('Buy Now').click
      accept_alert('You must be logged in to purchase Quill Premium.')
      expect(current_path).to eq('/premium')
    end
    xit 'has school and district premium option with functional learn more button' do
      pricing_mini = page.all(:css, '.pricing-mini')[2]
      pricing_mini.should have_content('School & District Premium')
      pricing_mini.click_link('Learn More')
      expect(current_url).to eq('https://quillpremium.wufoo.com/forms/quill-premium-quote/')
    end
  end

end
