import os
import subprocess
try:
    import slack
except ImportError:
    subprocess.check_call(['python3', '-m', 'pip', 'install', 'slackclient'])
    import slack

client = slack.WebClient(token=os.environ['SLACK_API_TOKEN'])
username = os.environ['USER']
project_name = os.environ['PROJECT_NAME']

response = client.chat_postMessage(
    channel='#quill-developer',
    text=username + " deployed " + project_name + " to production")
