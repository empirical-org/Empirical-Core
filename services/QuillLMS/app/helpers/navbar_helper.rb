# frozen_string_literal: true

module NavbarHelper
  def determine_active_tab(current_path)
    if current_path.include?('tools')
	    'Learning Tools'
    elsif ['about', 'announcements', 'mission', 'impact', 'press', 'team', 'pathways', 'careers'].any? { |str| current_path.include?(str)}
	    'About Us'
    elsif ['activities', 'ap', 'preap', 'springboard'].any? { |str| current_path.include?(str)}
	    'Explore Curriculum'
    elsif ['teacher-center', 'faq', 'premium'].any? { |str| current_path.include?(str)}
	    'Teacher Center'
    else
	    'Home'
    end
  end
end
