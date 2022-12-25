class Tag < ApplicationRecord
  has_many :board_tag_relations, dependent: :delete_all
  has_many :boards, through: :board_tag_relations
end
