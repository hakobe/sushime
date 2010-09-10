require 'oauth'
require 'json'
require 'pp'

class AuthController < ApplicationController
  def self.consumer
    OAuth::Consumer.new(
      "om1i4JMQdgdwnbmokDBkNg",
      "5T71pRJGQAyvStMHqlFil14HXk6rHW1RnBqY0EGtc",
      { :site => "http://twitter.com/" }
    )
  end

  def index
  end

  def oauth
    request_token = AuthController.consumer.get_request_token(
      #:oauth_callback => "http://#{request.host_with_port}/oauth_callback"
      :oauth_callback => "http://localhost:3000/auth/oauth_callback"
    )
    logger.info 'hogeee'
    session[:request_token] = request_token.token
    session[:request_token_secret] = request_token.secret
    redirect_to request_token.authorize_url
    return
  end
 
  def oauth_callback
    consumer = AuthController.consumer
    request_token = OAuth::RequestToken.new(
      consumer,
      session[:request_token],
      session[:request_token_secret]
    )
 
    access_token = request_token.get_access_token(
      {},
      :oauth_token => params[:oauth_token],
      :oauth_verifier => params[:oauth_verifier]
    )
 
    response = consumer.request(
      :get,
      '/account/verify_credentials.json',
      access_token, { :scheme => :query_string }
    )
    case response
    when Net::HTTPSuccess
      user = User.new(
        :screen_name  => access_token.params[:screen_name],
        :token        => access_token.params[:oauth_token],
        :token_secret => access_token.params[:oauth_token_secret]
      )
      user.new_session
      user.save
      session[:sid] = user.session_id
     # @user_info = JSON.parse(response.body)
#      unless @user_info['screen_name']
#        flash[:notice] = "Authentication failed"
#        redirect_to :action => :index
#        return
#      end
    else
#      RAILS_DEFAULT_LOGGER.error "Failed to get user info via OAuth"
#      flash[:notice] = "Authentication failed"
#      redirect_to :action => :index
#      return
    end

    resirect_to :controller => :main, :action => :index
  end
end
