class UserGrade < ApplicationRecord
    belongs_to :gradee, class_name: "User"
    belongs_to :grader, class_name: "User"
end
