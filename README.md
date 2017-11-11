# Ping Stats

![image](https://i.snag.gy/MiZK2r.jpg)

Shows stats for `ping 8.8.8.8`.
That's all it does.
Really.

I was just learning how to make a react app is all.


## Development setup
```bash
yarn install
npm run start-all
```

## NGROK usage
```bash
ngrok start --all --config ./ngrok-conf.yml
# Then in a browser, visit
# http://<port3000-url>?ws=<port8888-url>
# Don't add the protocol for the port 8888 url.
# Example (using image below):
# http://70219c1b.ngrok.io?ws=12115b68.ngrok.io
```

**Example image:**
![image](https://i.snag.gy/Jws5I3.jpg)

## Why does this exist?
Well, being a frequent online gamer, knowing how my internet connection is performing is important to me. And normally me or my friends just ping a public IP to see how our internet connection is doing. We keep it running for a while, all day sometimes, just so we know how it's been upto the time we decide to log in. 

Let me give you an example.  
We want to play a game at 6:30pm. I know my internet connection suffers some ping losses around 6pm and continues for an hour. If I have my program running and decide to check it at 6:30pm, then I can see if today I'm facing the same issues since the last half an hour, or if it's all good and I can bring in the clan to go guns blazing and what not.

All gamers use some form of ping testing tool every now and then, this is something I made for that purpose.

Also I wanted to learn React, so, that works.
