# Offshore Wind Farm App

## About The Project

**Short Description:**  
OffshoreWindFarmApp is a full-stack application created monitor and manage the "physical" windmill systems in real-time.
The system allows the operators to monitor the current state of the windmills using the gui, which contains multiple graphs and also 
execute commands that impact the windmills. 

## Setup

### Prerequisites
- .NET 9.0 SDK
- Node.js 18+
- PostgreSQL database 
- MQTT Broker

- ### Development Environment
- **Database**: PostgreSQL (hosted on Neon)
- **Backend**: ASP.NET Core 10.0 with OpenAPI/Swagger documentation
- **Frontend**: React 18 with TypeScript, Vite, Tailwind CSS
- **Package Managers**: NuGet (backend), npm (frontend)
- **MQTT Broker**: HiveMQ Public Broker
- **Stateless Library**: StateleSSE.AspNetCore

#### 1. Clone the Repository
```bash
git clone https://github.com/pawel-easv/OffshoreWindFarmApp
cd OffshoreWindFarmApp
```

#### 2. Backend Setup

**Navigate to the server directory:**
```bash
cd server
```

**Create `appsettings.json` in the API project root:**

```json
  "ConnectionStrings": {
    "DbConnectionString": "YOUR_CONNECTION_STRING",
    "Redis": "YOUR_REDIS_CONNECTION_STRING",
    "MqttBroker": "broker.hivemq.com",
    "MqttPort": 1883,
  }
```

**Access Swagger UI:**
Navigate to `https://localhost:5233/swagger` to view and test all API endpoints interactively.

#### 3. Frontend Setup

**Navigate to the client directory:**
```bash
cd ../client
```

**Install dependencies:**
```bash
npm install
```

**Run the development server:**
```bash
npm run dev
```

## Authorization

### Security Implementation

The application uses JWT (JSON Web Tokens) for authorization with a blacklist approach.

**Key Security Features:**
- All endpoints require authorization by default
- Only methods marked with `[AllowAnonymous]` are publicly accessible
- JWT tokens expire after a configured period
- Secure password hashing using Argon2 Hashing Algorithm

### Deployment

Both front-end and back-end are deployed to cloud infrastructure using fly.io.

- **Client**: https://windfarm-app.fly.dev/
- **Server**: https://windfarm-server.fly.dev/
- **IOT System**: https://sea-fullstack.web.app/

### Known Bugs and Issues
- It takes long time for the data to flow from the broker to the backend, at first it seems as if the app wasn't responding in realtime,
  but after some time the data starts flowing smoothly
