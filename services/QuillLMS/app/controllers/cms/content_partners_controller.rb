class Cms::ContentPartnersController < Cms::CmsController
  def index
    content_partners = ContentPartner.includes(content_partner_activities: :activity).all.map do |s|
      content_partner = s.attributes
      content_partner[:activity_count] = s.activities.count
      content_partner
    end

    render json: { content_partners: content_partners }
  end

  def create
    new_content_partner = ContentPartner.create!(content_partner_params)

    render json: { content_partner: new_content_partner }
  end

  def update
    updated_content_partner = ContentPartner.find_by_id(params[:id]).update(content_partner_params)

    render json: { content_partner: updated_content_partner }
  end

  def content_partner_params
    params.require(:content_partner).permit(
      :name,
      :id,
      :visible,
      :description
    )
  end
end
