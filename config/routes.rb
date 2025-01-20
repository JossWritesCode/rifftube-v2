Rails.application.routes.draw do
  
  # Serve websocket cable requests in-process
  mount ActionCable.server => '/cable'
  
  #get 'rifftube/index' # remove?
  #get 'rifftube/riff' # remove?
  #get 'riff/:video_id', to: "rifftube#riff" # remove?
  
  #resources :user_options

  get 'user_options', to: "user_options#show"
  get 'user_options/edit', to: "user_options#edit"
  get 'user_options/view_edit', to: "user_options#view_edit"
  patch 'user_options', to: "user_options#update"
  
  #get 'user_options/local/:id', to: "user_options#local"
  # what was that last one?

  resources :riffs

  
  '''
  GET	/photos	photos#index	display a list of all photos
  GET	/photos/new	photos#new	return an HTML form for creating a new photo
  POST	/photos	photos#create	create a new photo
  GET	/photos/:id	photos#show	display a specific photo
  GET	/photos/:id/edit	photos#edit	return an HTML form for editing a photo
  PATCH	/photos/:id	photos#update	update a specific photo
  DELETE	/photos/:id	photos#destroy	delete a specific photo
  '''
  
  get 'riffs/:id/meta', to: "riffs#showmeta"
  get 'riffs/:id/modify_start', to: "riffs#modify_start"

  # URL: GET /riffs?video_id=xxx[&user_id={"self", yyy}]
  # riffs#index
  # Replaces:
  # get 'get-view-riffs/:video_id', to: "rifftube#riffs_for_video" # TODO: remove
  # get 'get-riffs/:video_id', to: "rifftube#riffs_for_video_current_user" # change URL?
  # get 'riffs?video_id=xxx&user_id=yyy' may not be implemented

  # URL: PATCH /riffs/xxx[?fields=yyy[,zzz]]
  # riffs#update
  # Replaces:
  # post 'update-riff-time'
  # post 'save-riff'

  # change to:
  # e.g. riffs/zip?video_id=xxx&user_id=yyy
  get 'riffs/zip', to: "rifftube#riff_zip"
  #get 'riffs/video/:video_id/user/:user_id/zip', to: "rifftube#riff_zip"
  
  # e.g. riffs/mp4?video_id=xxx&user_id=yyy
  get 'riffs/mp4', to: "rifftube#riff_single_file"
  #get 'riffs/video/:video_id/user/:user_id/mp4', to: "rifftube#riff_single_file"
  
  get 'download/:id', to: "rifftube#download"

  get "signup", to: "users#new"
  post "signup-with-google", to: "users#create_with_token"
  get "login", to: "sessions#new"
  post "login", to: "sessions#create"
  post "login-with-google", to: "sessions#create_with_token"
  delete "logout", to: "sessions#destroy"

  get "user-status", to: "users#status"

  get "send_email", to: "rifftube#send_email" # just for testing

  post "user/confirm/reissue", to: "users#reissue_confirm"
  get "user/confirm/:uuid", to: "users#confirm"

  get "riffer-pic/:id(.:format)", to: "users#get_pic"
  patch "riffer-pic", to: "users#set_pic"

  patch "riffer-name", to: "users#set_name"

  # URL: /videos?host=www.youtube.com
  get "videos", to: "rifftube#video_list"

  # URL: /users/1/videos?host=www.youtube.com
  get "user/:id/videos", to: "users#video_list"

  get "grade/:id", to: "users#grade"
  patch "grade/:id", to: "users#set_grade"

  resources :users, except: [:new]

  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  root "rifftube#index"

  #get '*path', to: 'rifftube#index'

  if ENV["RAILS_SERVE_STATIC_FILES"].present?
    get "*path", to: static("index.html")
    post "*path", to: static("index.html")
  end
  
end
