require 'sinatra'
require 'json'

require_relative 'compile'

compilers = [{
  name: 'system',
  path: '/usr/bin/gcc'
}]

set :public_folder, File.dirname(__FILE__) + '/../frontend'

get '/' do
  send_file File.expand_path('index.html', settings.public_folder)
end

post '/compile' do
  content_type :json

  path = compilers.detect { |c| c[:name] == params[:name] }
  compile('/usr/bin/gcc', params[:code]).to_json
end

post '/compilers' do
  content_type :json

  compilers.map(&:name).to_json
end
