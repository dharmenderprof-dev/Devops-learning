🚀 Rocket.Chat on Docker (Ubuntu Server)

This project demonstrates the deployment of Rocket.Chat with MongoDB using Docker Compose on an Ubuntu Server VM.

What initially seemed like a simple “run docker-compose up -d” setup turned into a deep troubleshooting experience involving compatibility issues, hardware limitations, and service orchestration challenges.

🧰 Tech Stack
Ubuntu Server (VM)
Docker
Docker Compose
Rocket.Chat (v5.4.10)
MongoDB (v4.4)
😵 Issues Faced
1. MongoDB Crash (Exit Code 132)

MongoDB initially failed to start and exited with Exit Code 132.
After investigation, the root cause was AVX CPU instruction support. The VM hardware did not support AVX, causing newer MongoDB versions to crash immediately.

2. Version Compatibility Issues

To resolve the crash, MongoDB was downgraded to v4.4.
However, this introduced a new issue where Rocket.Chat was not fully compatible with the older MongoDB version, leading to service instability.

3. Service Startup Race Condition

Even after resolving version issues, Rocket.Chat attempted to connect to MongoDB before it was fully initialized.
This caused repeated connection failures during startup due to improper service readiness timing.

🛠️ Solution
Cleaned up existing Docker volumes to remove corrupted state
Aligned compatible versions:
Rocket.Chat → 5.4.10
MongoDB → 4.4
Implemented a MongoDB readiness check to ensure proper startup order
Health Check Example
until mongo --eval "ping"; do
  echo "Waiting for MongoDB..."
  sleep 2
done
🎉 Final Outcome
Rocket.Chat deployed successfully
No container crashes observed
Application accessible via browser using VM IP:
http://192.168.1.108
Verified successful response with HTTP 200 OK
📚 Key Learnings
Docker deployments depend heavily on underlying hardware compatibility
CPU features (such as AVX) can directly impact containerized applications
Version compatibility is critical in distributed systems
Service orchestration must ensure dependencies are fully ready before startup
Logs (docker logs) are essential for debugging real-world issues
📸 Screenshots
<img width="1662" height="901" alt="Screenshot 2026-05-31 002047" src="https://github.com/user-attachments/assets/df0111a6-3053-4d5b-95c4-2265ee518dcb" /> <img width="1118" height="819" alt="Screenshot 2026-05-31 002200" src="https://github.com/user-attachments/assets/c917e305-c819-464c-9fe4-90ddc0007eb1" /> <img width="1457" height="922" alt="Screenshot 2026-05-31 002304" src="https://github.com/user-attachments/assets/cd41e685-78ff-4147-9dc1-babd3ff8bf48" /> <img width="1888" height="1017" alt="Screenshot 2026-05-31 002726" src="https://github.com/user-attachments/assets/f5a593b8-4d4d-4742-af93-c1c3194c4939" />
💭 Conclusion

This project started as a basic Docker deployment but evolved into a practical learning experience in real-world DevOps troubleshooting.

It highlighted the importance of system compatibility, proper service orchestration, and debugging through logs.
