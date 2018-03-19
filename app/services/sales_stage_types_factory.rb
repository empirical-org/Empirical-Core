class SalesStageTypesFactory

  STAGE_TYPE_SEEDS = [
    {
      name: 'Basic Subscription',
      order: '1',
      description: 'On Sign Up'
    },
    {
      name: 'Teacher Premium',
      order: '2',
      description: 'Activated By Stripe Credit Card Purchase'
    },
    {
      name: 'In Conversation: Teacher Responds',
      order: '3.1',
      description: 'Teacher schedules a sales call (YouCanBook.me) or responds to sales email (Hiver Gmail Label).'
    },
    {
      name: 'In Conversation: Call Missed',
      order: '3.2',
      description: 'When a teacher does not pick up the call. Sends an email via Sales Machine.'
    },
    {
      name: 'In Conversation: Interested',
      order: '3.3',
      description: 'After a successful call when the teacher wants to purchase Premium. Log call notes in SalesMachine.'
    },
    {
      name: 'Quote Requested',
      order: '4',
      description: 'Fill out the Quote request form in Xero and then mark as complete in Quill. Do this for both email requests and wufoo quotes.'
    },
    {
      name: 'Purchase Order Received',
      order: '5.1',
      description: 'When we get a purchase order, mark it as received and then send an invoice.'
    },
    {
      name: 'Invoice Sent',
      order: '5.2',
      description: 'When we issue an invoice via Xero, Xero will automatically update SalesMachine with Invoice sent. Not in Quill.'
    },
    {
      name: 'School Premium: Needs PD',
      order: '6.1',
      description: 'When we create a subscription manually, or it is created automatically by Credit Card payment, they enter this stage.'
    },
    {
      name: 'School Premium: PD Scheduled',
      order: '6.2',
      description: 'Mark this stage whenever the premium is scheduled.'
    },
    {
      name: 'School Premium: PD Delivered',
      order: '6.3',
      description: 'Mark this stage whenever the premium is delivered.'
    },
    {
      name: 'Not Interested In School Premium',
      order: '7',
      description: 'Whenever a teacher says they are not interested in School Premium, we mark this as complete and they receive no more sales communications.'
    }
  ]

  def build
    STAGE_TYPE_SEEDS.map do |seed|
      SalesStageType.find_or_create_by(
        name:        seed[:name],
        order:       seed[:order],
        description: seed[:description]
      )
    end
  end
end
