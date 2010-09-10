class MainController < ApplicationController

  def index
  end
  
  def register
    file = params[:image_file]
    @user.twitter_update_profile_image(file)

    redirect_to :action => :index
  end
end
