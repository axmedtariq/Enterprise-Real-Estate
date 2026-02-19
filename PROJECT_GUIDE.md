# 🗺️ Project Endpoints & Credentials Guide

## 🔐 Credentials

### 1. **Super Admin (Website)**
   - **Email:** `admin@sovereign.com`
   - **Password:** `admin123`
   - **Role:** ADMIN (Full Access)

### 2. **SQL Server Database**
   - **Host:** `localhost,1433`
   - **User:** `Tariq`
   - **Password:** `abc123`
   - **Database:** `RealEstate`

### 3. **HashiCorp Vault**
   - **Address:** `http://127.0.0.1:8200`
   - **Root Token:** `root` (Development Mode)
   - **Unseal Key:** (Not needed in dev mode, but check logs if required)

---

## 🚀 How to Run the Project

### **1. Start the Backend**
1. Open a terminal in `d:\Software\Real Estate Enterprise\backend`
2. Run:
   ```bash
   npx ts-node server.ts
   ```
   *The server will start on port **5000**.*

### **2. Start the Frontend**
1. Open a new terminal in `d:\Software\Real Estate Enterprise\frontend-next`
2. Run:
   ```bash
   npm run dev
   ```
   *The app will be available at imports `http://localhost:3000`.*

---

## 📡 API Endpoints List

Base URL: `http://localhost:5000/api/v1`

### **Authentication**
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/auth/register` | Register a new user | Public |
| `POST` | `/auth/login` | Login user | Public |
| `POST` | `/auth/forgot-password` | Request password reset | Public |
| `POST` | `/auth/reset-password/:token` | Reset password | Public |
| `GET` | `/auth/me` | Get current user details | Protected |
| `POST` | `/auth/2fa/enable` | Enable 2FA (Start) | Protected |
| `POST` | `/auth/2fa/verify` | Verify 2FA (Finish) | Protected |
| `GET` | `/auth/admin` | Test Admin Access | Admin Only |

### **Properties**
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/properties` | Get all properties (with filters) | Public |
| `GET` | `/property/:id` | Get single property details | Public |
| `POST` | `/admin/property/new` | Create a new property | **Admin Only** |
| `POST` | `/admin/assets/upload` | Upload images to Cloudinary | **Admin Only** |

### **Bookings**
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/bookings` | Create a booking | Public (Auth) |
| `GET` | `/bookings/:propertyId` | Get bookings for a property | Public |

### **System**
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/health` | API Health Check | Public |
| `GET` | `/metrics` | Prometheus Metrics | Public |

---

## 🛠️ Useful Scripts

- **Seed Database:** `.\backend\seed-db.bat` (Populate with 2,000+ random records)
- **Check Data:** `cd backend && npx ts-node check-data.ts`
