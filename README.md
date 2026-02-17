# 🏰 Sovereign Estate - The Elite Real Estate Platform

> **"Find Your Legacy."**

Sovereign Estate is a next-generation real estate platform engineered for the ultra-luxury market. It combines the data intelligence of **Zillow**, the seamless booking experience of **Airbnb**, and the immersive discovery of **TikTok** into a single, high-performance "Super App".

![Sovereign Estate Banner](https://images.unsplash.com/photo-1600596542815-2a4d9fdb2529)

## 🚀 Key Features

### 💎 For Sovereign Members (Buyers/Renters)
*   **🌍 Interactive Global Map**: Explore properties with a dark-mode, geospatial map interface powered by **Leaflet**.
*   **📅 Direct Booking Engine**: instant reservations with date conflict handling and dynamic pricing.
*   **📱 "Sovereign Feed"**: A **TikTok-style**, vertical snap-scroll video feed for immersive property tours.
*   **🔍 AI-Ready Search**: Advanced filtering by price, amenities, and location.

### 💼 For Agents (The Command Center)
*   **Asset Management**: Register high-value properties with 3D Matterport integration.
*   **Real-time Analytics**: Monitor asset performance and lead generation.

## 🛠️ The "Iron Bank" Tech Stack

Re-platformed for enterprise scale and performance:

*   **Frontend**: [Next.js 15](https://nextjs.org/) (App Router), TypeScript, Tailwind CSS, Redux Toolkit, Framer Motion.
*   **Backend**: Node.js, Express.js (REST API).
*   **Database**: [SQL Server 2022](https://www.microsoft.com/en-us/sql-server) (The Vault).
*   **ORM**: [Prisma](https://www.prisma.io/) (Type-safe database access).
*   **Infrastructure**: Docker, Kubernetes, Jenkins CI/CD.

## 📦 Installation & Setup

### Prerequisites
*   [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Required)
*   Node.js 18+ (Optional, for local dev without Docker)

### 🚀 Quick Start (Recommended)
Launch the entire stack (Database, Backend, Frontend) with one command:

```bash
# Clone the repository
git clone https://github.com/your-username/sovereign-estate.git
cd sovereign-estate

# Ignite the engines
docker-compose up --build
```

Access the platform:
*   **Frontend**: [http://localhost:3000](http://localhost:3000)
*   **Backend API**: [http://localhost:5000](http://localhost:5000)
*   **SQL Server**: Port `1433`

### 🔧 Manual Setup (Dev Mode)

**1. Database (SQL Server)**
Ensure you have a SQL Server instance running. Update `.env` with your credentials.

**2. Backend**
```bash
cd backend
npm install
npx prisma generate
npx prisma db push  # Sync schema with DB
npm run dev
```

**3. Frontend**
```bash
cd frontend-next
npm install
npm run dev
```

## 🤝 Contributing
1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.
