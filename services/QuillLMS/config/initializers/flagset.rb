
module Flagset
  class Flag
    attr_accessor :name, :display_name
    def initialize(name:, display_name:)
      @name, @display_name = name, display_name
    end
  end


  self.flagsets = {
    alpha: {
      display_name: 'Alpha',
      flags: [
        Flag.new(name: 'alpha', display_name: 'Alpha')
      ]
    }
  }

end



alpha:
flags:


**Alpha - User Group**

- Alpha
- Evidence Beta 1
- Evidence Beta 2
- Beta
- College Board (Formerly Gamma)
- Production

**Evidence Beta 1 - User Group**

- Evidence Beta 1
- Evidence Beta 2
- Production

**Evidence Beta 2 - User Group**

- Evidence Beta 2
- Production

**Beta - User Group**

- Beta
- Production

**College Board (Formerly Gamma)  - User Group**

- College Board (Formerly Gamma)
- Production

**Production**

- Production