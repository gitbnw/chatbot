require 'sinatra'
require 'json'
require 'bundler/setup'
require 'uri'
require 'open-uri'
require 'httparty'

get '/' do
  erb :'index.html'
end

#enable :sessions
post '/' do
  content_type('application/json')

end


  


