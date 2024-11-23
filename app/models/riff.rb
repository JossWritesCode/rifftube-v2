class Riff < ApplicationRecord
    belongs_to :user
    belongs_to :video
    has_and_belongs_to_many :riff_sets

    # all unneeded, maybe:
    # (because to_json gets correct value)

    attribute :riff_kind, :integer

    after_initialize :update_riff_kind
    after_touch :update_riff_kind

    # not needed?:
    #def riff_kind
    #    self[:riff_kind]
    #    self[:isText] ? (self[:speak] ? 2 : 3) : 1
    #end
    
    def update_riff_kind
        self[:riff_kind] = self[:isText] ? (self[:speak] ? 2 : 3) : 1
    end
    
    def riff_kind=(value)
        self.inspect
        if value == 1
            self[:isText] = false
            self[:speak] = false
        elsif value == 2
            self[:isText] = true
            self[:speak] = true
        elsif value == 3
            self[:isText] = true
            self[:speak] = false
        end
        update_riff_kind
    end
      
end
