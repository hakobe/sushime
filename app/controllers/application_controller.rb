class ApplicationController < ActionController::Base
  #protect_from_forgery
  #
  before_filter :setup_user

  def setup_user
    session_id = session[:sid]
    @user = User.find(:first, :conditions => {:session_id => session_id})
  end
end
