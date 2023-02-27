# frozen_string_literal: true

class SalesStageTypesFactory

  STAGE_TYPE_SEEDS = [
    {
      name: 'Basic Subscription',
      order: '1',
      description: 'On Sign Up',
      trigger: 'auto'
    },
    {
      name: 'Teacher Premium',
      order: '2',
      description: 'Activated By Stripe Credit Card Purchase',
      trigger: 'auto'
    },
    {
      name: 'In Conversation: Teacher Responds',
      order: '3.1',
      description: 'Teacher responds to sales email (Hiver Gmail Label).',
      trigger: 'auto'
    },
    {
      name: 'In Conversation: Call Scheduled',
      order: '3.1.1',
      description: 'Teacher schedules a sales call (YouCanBook.me)',
      trigger: 'auto'
    },
    {
      name: 'In Conversation: Call Missed',
      order: '3.2',
      description: 'When a teacher does not pick up the call. Sends an email via Sales Machine.',
      trigger: 'user'
    },
    {
      name: 'In Conversation: Interested',
      order: '3.3',
      description: 'After a successful call when the teacher wants to purchase Premium. Log call notes in Vitally.',
      trigger: 'user'
    },
    {
      name: 'Quote Requested',
      order: '4',
      description: 'Fill out the Quote request form in Xero and then mark as complete in Quill. Do this for both email requests and salesmate quotes.',
      trigger: 'user'
    },
    {
      name: 'Purchase Order Received',
      order: '5.1',
      description: 'When we get a purchase order, mark it as received and then send an invoice.',
      trigger: 'user'
    },
    {
      name: 'Invoice Sent',
      order: '5.2',
      description: 'When we issue an invoice via Xero, Xero will automatically update Vitally with Invoice sent. Not in Quill.',
      trigger: 'auto'
    },
    {
      name: 'School Premium: Needs PD',
      order: '6.1',
      description: 'When we create a subscription manually, or it is created automatically by Credit Card payment, they enter this stage.',
      trigger: 'auto'
    },
    {
      name: 'School Premium: PD Scheduled',
      order: '6.2',
      description: 'Mark this stage whenever the premium is scheduled.',
      trigger: 'user'
    },
    {
      name: 'School Premium: PD Delivered',
      order: '6.3',
      description: 'Mark this stage whenever the premium is delivered.',
      trigger: 'user'
    },
    {
      name: 'Not Interested In School Premium',
      order: '7',
      description: 'Whenever a teacher says they are not interested in School Premium, we mark this as complete and they receive no more sales communications.',
      trigger: 'user'
    }
  ]

  def build
    STAGE_TYPE_SEEDS.map do |seed|
      begin
        SalesStageType.find_or_create_by!(name: seed[:name]) do |type|
          type.order       = seed[:order]
          type.description = seed[:description]
          type.trigger     = seed[:trigger]
        end
      rescue ActiveRecord::RecordInvalid
        retry
      end
    end
  end
end
