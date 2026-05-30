🚀 Rocket.Chat on Docker (Ubuntu Server)

This project is about deploying Rocket.Chat with MongoDB using Docker Compose on an Ubuntu Server VM.

What started as a simple “just run docker-compose” idea quickly turned into a full debugging session 😅
It ended up being a great hands-on DevOps learning experience.

🧰 Tech Used
Ubuntu Server (inside VM)
Docker
Docker Compose
Rocket.Chat (5.4.10)
MongoDB (4.4)
😵 What Went Wrong
MongoDB kept crashing

At first, MongoDB refused to start and kept exiting with Exit Code 132.
After some digging, I found out the issue was AVX support — my VM CPU didn’t support it, so newer MongoDB versions just wouldn’t run.

Version mismatch chaos

To fix the crash, I downgraded MongoDB to 4.4.
That solved one problem… but created another. Rocket.Chat didn’t fully play nice with older MongoDB versions, so things broke again.

Services starting too early

Even when versions were correct, Rocket.Chat was trying to connect to MongoDB before it was ready.
Basically, everything was starting too fast and nothing was synced properly.

🛠️ How I fixed it
Cleaned up old Docker volumes (to remove broken state)
Matched compatible versions:
Rocket.Chat → 5.4.10
MongoDB → 4.4
Added a simple wait/health check so Rocket.Chat only starts when MongoDB is ready

Example fix:

until mongo --eval "ping"; do
  echo "Waiting for MongoDB..."
  sleep 2
done
🎉 Final Result

Finally, everything worked 🎯

Rocket.Chat started successfully
No more container crashes

Accessed it from browser using VM IP:

http://192.168.1.108
Saw that sweet HTTP 200 OK response
📖 What I learned
Docker isn’t just “run and forget” — dependencies matter a lot
Hardware limitations (like AVX support) can break software in surprising ways
Version compatibility is EVERYTHING in DevOps setups
Logs are your best friend (docker logs saved me multiple times)
Services need to be ready, not just running
📸 Screenshots

(Add your screenshots here)

💭 Final thoughts

This project looked simple at first, but turned into a real-world troubleshooting experience.
A lot of trial, error, and reading logs — but that’s where the real learning happened.
