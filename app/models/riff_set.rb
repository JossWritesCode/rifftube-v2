class RiffSet < ApplicationRecord
  belongs_to :video
  has_and_belongs_to_many :riffs
end
