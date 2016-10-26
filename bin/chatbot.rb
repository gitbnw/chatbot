require 'sinatra'
require 'json'
require 'bundler/setup'
require 'uri'
require 'open-uri'
require 'httparty'
# require 'wit'
require "sinatra/config_file"


config_file '../config.yml'
access_token = settings.wit["client_token"]

get '/' do
#   @greeting = settings.greeting
#   p @greeting
send_file File.expand_path('pages/index.html', settings.public_folder)
end

# actions = {
#   send: -> (request, response) {
#     puts("sending... #{response['text']}")
#     return response
#   },
#   merge: -> (request) {
#     puts 'merge is running'
#     context = request['context']
#     entities = request['entities']

#     # context.delete 'joke'
#     # context.delete 'ack'
    
#     # category = first_entity_value(entities, 'category')
#     choice = first_entity_value(entities, 'choice')
#     context['choice'] = choice unless choice.nil?
#     # sentiment = first_entity_value(entities, 'sentiment')
#     # context['ack'] = sentiment == 'positive' ? 'Glad you liked it.' : 'Hmm.' unless sentiment.nil?
#     return context
#   },  
#   :'getProgSkills' => -> (request) {
#     context = request['context']
    
#     context['progString'] = 'some skills' #getProgSkillsString
#     return context
#   }
# }

class WitWeb
  
  include HTTParty

  debug_output $stdout # <= this is it!

  base_uri 'https://api.wit.ai'

  def initialize access_token
    @access_token = access_token
    @auth = "Bearer " + @access_token
  end
  
  def converse version, session_id, query, options = {}
    @v = version
    @s = session_id
    @q = query
    

    self.class.post("/converse?v=#{@v}&session_id=#{@s}&q=#{@q}", :headers => { "Authorization" => @auth},)
    
  end

end

# client = Wit.new(access_token: access_token, actions: actions)
# client.logger.level = Logger::DEBUG

client = WitWeb.new(access_token)
rsp = client.converse('20160526','user-1', 'hey')
p rsp


# get '/chat.json' do
#   content_type :json
#   { 
#     :cnv => {
#       :rsp => rsp,
#       :session => user_session,
#       :sentAt => time,
#       :role => role
#     }
#   }.to_json
# end

# post '/converse/msg' do
  
#   @v = params[:v]
#   @session_id = params[:session_id]
#   @q = params[:q]
#   @context = {}
#   @context["option"] = params[:option]
#   @context["intent"] = params[:intent]
  
# response = HTTParty.post('https://api.wit.ai/converse?v=20160526&session_id=123abc&q=weather%20in%20Brussels')
# rsp = client.converse(@session_id, @q, @context)

# return rsp.to_json

# end

# post '/converse/action' do
# raise
#   @session_id = params[:session_id]
#   @q = nil
#   @rsp = {}
#   puts 'client run actions 1'
#   @rsp = client.run_actions(@session_id, @q, @rsp)
  
#   puts 'client run actions 2'
#   return @rsp
  
# end


# class Job
#   attr_accessor :company, :position, :span, :summary
#   def initialize(company, position, span, summary)  
#     @company = company  
#     @position = position
#     @span = span
#     @summary = summary
#   end

# end

# it_supp = Job.new('Investors Title Company', 'IT Support person', '2008 - 2011', 'IT support for real estate title agency.  Recreated the company web site with php and html.  Created a report generator of company activity using php and SQL.')  
# sys_adm = Job.new('Stellar Manufacturing', 'Systems Administrator', '2011 - 2014', 'Administered and supported Windows environment.  Back-end and SQL work.')  
# data_analys = Job.new('JDA eHealth Systems', 'Data Analyst', '2014 - 2015', 'Monitoring and troubleshooting multiple ETL processes of healthcare billing data. Application programmed in Foxpro and SQL.')  
# sys_analys = Job.new('the Village of Oak Park', 'Systems Analyst', '2015 - 2016', 'Developed web application with javascript front-end (ExtJS) and Coldfusion/SQL backend.  Supported various applications with SQL programming.')  

# @work_history = [it_supp, sys_adm, data_analys, sys_analys]

# def getJobSummaryString
#   jobSummaryStr = "Byron's last 4 jobs were as "
#     @work_history.each do |job|
#       if @work_history.last == job
#         jobSummaryStr += "and "
#       end
#       jobSummaryStr += "a #{job.position} at #{job.company}"
#       if @work_history.last != job
#         jobSummaryStr += ", "
#       else
#       	jobSummaryStr += "."
#       end      
#     end

#       return jobSummaryStr
# end

# @pumpkinDances = [
#   {
#   "band" => "21 Pilots",
#   "link" => "https://www.youtube.com/watch?v=aaHw8QfemHk"
#   },{
#     "band" => "Ke$ha",
#     "link" => "https://www.youtube.com/watch?v=J_6aIPbQht4"
#   },{
#     "band" => "Wii Music",
#     "link" => "https://www.youtube.com/watch?v=7MGsaN5eDfc"
#   }]

# def getDances
#   randomDance = @pumpkinDances[rand(0..2)]
#   band = randomDance["band"]
#   link = randomDance["link"]
# end

# def getProgSkillsString
#   puts 'getProgSkillsString running'
#   explainStr = "Byron has been working with "
#   javascriptStr = "javascript for #{MyTime.new(1430429574).calculate} including Angular 1 and Sencha/ExtJS."
#   rubyStr = "He has been using ruby for #{MyTime.new(1442854914).calculate}  Ask again and the times will update ;)"
#   puts "#{explainStr} #{javascriptStr} #{rubyStr}"
#   return "#{explainStr} #{javascriptStr} #{rubyStr}"
# end

# class MyTime

#   attr_accessor :starttime
#   def initialize starttime
#     @starttime = starttime
#   end

# def calculate
#     now = Time.now 
#     seconds = (now.to_i - starttime.to_i)
#     days = seconds / 86400;
#     hours = seconds / 3600;
#     minutes = (seconds - (hours * 3600)) / 60;
#     seconds = (seconds - (hours * 3600) - (minutes * 60));  
#     return "#{days} days, #{hours} hours, #{minutes} minutes, and #{seconds} seconds."
# end
  

# end


