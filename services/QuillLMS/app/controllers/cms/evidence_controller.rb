# frozen_string_literal: true

class Cms::EvidenceController < Cms::CmsController
  def index
    @js_file = 'staff'
    @style_file = 'staff'
  end
end
