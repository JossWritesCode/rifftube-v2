require "bcrypt"

class User < ApplicationRecord
    #validates :password, presence: true
    #validates :password_confirmation, presence: true
    #validates :password, confirmation: true

    has_secure_password :validations => false # (used to) do[...] above validations?
    
    has_many :riffs
    has_many :videos, through: :riffs
    has_one :user_options
end
