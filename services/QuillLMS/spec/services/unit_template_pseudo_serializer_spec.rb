require 'rails_helper'

describe UnitTemplatePseudoSerializer do
  let(:unit_template) { create(:unit_template, unit_template_category_id: 0 ) }

  it('will have nil values for the unit template category attributes if there is no unit template category') do
    serialized_ut = UnitTemplatePseudoSerializer.new(unit_template)
    expect(serialized_ut.unit_template_category['primary_color']).not_to be
    expect(serialized_ut.unit_template_category['secondary_color']).not_to be
    expect(serialized_ut.unit_template_category['name']).not_to be
    expect(serialized_ut.unit_template_category['id']).not_to be
  end
end
