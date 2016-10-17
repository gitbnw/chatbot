require 'sinatra'
require 'json'
require 'bundler/setup'
require 'uri'
require 'open-uri'
require 'httparty'
require 'wit'
require "sinatra/config_file"

config_file '../config.yml'

access_token = settings.wit["client_token"]
get '/' do
  @greeting = settings.greeting
  p @greeting
send_file File.expand_path('pages/index.html', settings.public_folder)
end

actions = {
  send: -> (request, response) {
    puts("sending... #{response['text']}")
  },
  getJobHistory: -> (request) {
    context = request['context']
    entities = request['entities']
    context['jobHistory'] = getJobSummaryString()
    return context
  },
}

client = Wit.new(access_token: access_token, actions: actions)
client.logger.level = Logger::DEBUG
# time = ""
# time = Time.now.to_i
# user_session = "user-session-#{time}"
# role = "bot"
# rsp = client.converse(user_session, 'default greeting', {})


get '/chat.json' do
  content_type :json
  { 
    :cnv => {
      :rsp => rsp,
      :session => user_session,
      :sentAt => time,
      :role => role
    }
  }.to_json
end

post '/converse' do
  @v = params[:v]
  @session_id = params[:session_id]
  @q = params[:q]
  @intent = params[:intent]
rsp = client.converse(@session_id, @q, {"intent" => @intent}, true)
puts rsp["confidence"]
j_rsp = rsp.to_json
return j_rsp
end


class Job
  attr_accessor :company, :position, :span, :summary
  def initialize(company, position, span, summary)  
    @company = company  
    @position = position
    @span = span
    @summary = summary
  end

end

it_supp = Job.new('Investors Title Company', 'IT Support person', '2008 - 2011', 'IT support for real estate title agency.  Recreated the company web site with php and html.  Created a report generator of company activity using php and SQL.')  
sys_adm = Job.new('Stellar Manufacturing', 'Systems Administrator', '2011 - 2014', 'Administered and supported Windows environment.  Back-end and SQL work.')  
data_analys = Job.new('JDA eHealth Systems', 'Data Analyst', '2014 - 2015', 'Monitoring and troubleshooting multiple ETL processes of healthcare billing data. Application programmed in Foxpro and SQL.')  
sys_analys = Job.new('the Village of Oak Park', 'Systems Analyst', '2015 - 2016', 'Developed web application with javascript front-end (ExtJS) and Coldfusion/SQL backend.  Supported various applications with SQL programming.')  

@work_history = [it_supp, sys_adm, data_analys, sys_analys]

def getJobSummaryString
  jobSummaryStr = "Byron's last 4 jobs were as "
    @work_history.each do |job|
      if @work_history.last == job
        jobSummaryStr += "and "
      end
      jobSummaryStr += "a #{job.position} at #{job.company}"
      if @work_history.last != job
        jobSummaryStr += ", "
      else
      	jobSummaryStr += "."
      end      
    end

      return jobSummaryStr
end

@pumpkinDances = [
  {
  "band" => "21 Pilots",
  "link" => "https://www.youtube.com/watch?v=aaHw8QfemHk"
  },{
    "band" => "Ke$ha",
    "link" => "https://www.youtube.com/watch?v=J_6aIPbQht4"
  },{
    "band" => "Wii Music",
    "link" => "https://www.youtube.com/watch?v=7MGsaN5eDfc"
  }]

def getDances
  randomDance = @pumpkinDances[rand(0..2)]
  band = randomDance["band"]
  link = randomDance["link"]
end
