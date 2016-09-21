module TabsHelper

    def premium_tab_copy
       case current_user.premium_state
         when 'trial'
           "Premium  <i class='fa fa-star'></i> #{current_user.trial_days_remaining} Days Left"
         when 'locked'
          "Premium  <i class='fa fa-star'></i> Trial Expired"
         else
           "Try Premium for Free <i class='fa fa-star'></i>"
         end
     end

    def mobile_premium_tab_copy
       case current_user.premium_state
         when 'trial'
           "Premium  <i class='fa fa-star'></i> #{current_user.trial_days_remaining} Days Left"
         when 'locked'
          "Premium  <i class='fa fa-star'></i> Trial Expired"
         else
           "Try Premium for Free <i class='fa fa-star'></i>"
         end
     end


end
