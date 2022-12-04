# == Route Map
#
#     Prefix Verb   URI Pattern                Controller#Action
#     boards GET    /boards(.:format)          boards#index
#            POST   /boards(.:format)          boards#create
#  new_board GET    /boards/new(.:format)      boards#new
# edit_board GET    /boards/:id/edit(.:format) boards#edit
#      board GET    /boards/:id(.:format)      boards#show
#            PATCH  /boards/:id(.:format)      boards#update
#            PUT    /boards/:id(.:format)      boards#update
#            DELETE /boards/:id(.:format)      boards#destroy

Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  resources :boards
  resources :comments, only: %i[create destroy]
end
