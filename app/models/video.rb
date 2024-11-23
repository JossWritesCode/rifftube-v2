class Video < ApplicationRecord
    has_many :riffs
    has_many :users, through: :riffs
end
