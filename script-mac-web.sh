mkdir -p /tmp/tmate
brew install tmate
TMATE=tmate
$TMATE -S /tmp/tmate.sock  new-session -d

echo "tmate session created - wait 5 seconds for session to be ready "
sleep 5

url=`$TMATE -S /tmp/tmate.sock display -p '#{tmate_web}'`
echo "web url is $url"

if [ -n "$response_id" ]; then
  url_encoded=`echo "$url" | jq -sRr @uri | sed 's/%0A$//'`
  curl -X GET "https://helloworld-3khoexoznq-uw.a.run.app/set?key=$response_id&value=$url_encoded"
fi