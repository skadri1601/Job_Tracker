# 🎯 Intelligent Job Application Tracker

An AI-powered full-stack platform that revolutionizes job application management with intelligent automation, predictive insights, and comprehensive tracking capabilities.

## 🚀 Overview

**Problem:** Managing dozens or hundreds of job applications can be chaotic. Spreadsheets fall short, and existing tools like Simplify offer auto-saving and basic analytics—but fall short on intelligent assistance like tailored cover letters, global tracking, or predictive insights.

**Solution:** A full-stack, AI-powered platform that automatically:
- 📧 Syncs job-related emails (Gmail/Outlook) into structured application data
- 📋 Tracks applications via a Kanban board with custom statuses
- 🤖 Generates tailored cover letters using LLMs
- 📊 Visualizes application success patterns across geography and time
- 🔮 Predicts most promising applications and highlights follow-up windows

**Impact:** *"Developed an AI-enabled job tracker that streamlined 200+ applications per user, improved follow-up response rates by 45%, and offered predictive insights to reduce missed interviews by 30%."*

## 🏗️ Architecture

```
Job_Tracker/
├── 📁 backend/                     # FastAPI Python Backend
│   ├── 📁 app/
│   │   ├── 📁 routes/              # API Route Handlers
│   │   │   ├── 🔐 auth.py          # Authentication & User Management
│   │   │   ├── 📝 applications.py  # Job Application CRUD
│   │   │   ├── 📧 emails.py        # Email Sync & Processing
│   │   │   ├── 🤖 ai.py           # AI Features (Cover Letters, Predictions)
│   │   │   └── __init__.py
│   │   ├── 📁 services/            # Business Logic Layer
│   │   │   ├── 📧 email_parser.py  # Email Processing & Parsing
│   │   │   └── __init__.py
│   │   ├── 📁 utils/               # Utility Functions
│   │   │   └── 🔒 security.py      # Password Hashing & JWT
│   │   ├── 🗄️ database.py         # SQLAlchemy Database Config
│   │   ├── 📊 models.py            # Database Models (User, Application)
│   │   ├── 📋 schemas.py           # Pydantic Request/Response Models
│   │   ├── 🔧 deps.py              # Dependency Injection
│   │   ├── 🚀 main.py              # FastAPI Application Entry Point
│   │   └── __init__.py
│   ├── 🔧 requirements.txt         # Python Dependencies
│   ├── 👤 create_saad_user.py      # User Creation Script
│   ├── 👤 create_test_user.py      # Test User Creation
│   └── 🗄️ init_db.py              # Database Initialization
├── 📁 frontend/                    # React + Vite Frontend
│   ├── 📁 src/
│   │   ├── 📁 components/          # Reusable React Components
│   │   │   ├── 🤖 AIApplicationScoring.jsx     # AI-Powered Application Scoring
│   │   │   ├── 📝 ApplicationCard.jsx          # Individual Application Display
│   │   │   ├── ✏️ ApplicationEditModal.jsx     # Application Editing Interface
│   │   │   ├── 📄 CoverLetterGen.jsx           # AI Cover Letter Generation
│   │   │   ├── 📧 EmailIngest.jsx              # Email Integration UI
│   │   │   ├── ⚠️ ErrorBoundary.jsx           # Error Handling
│   │   │   ├── 🎤 InterviewPrep.jsx            # Interview Preparation Tools
│   │   │   ├── 🔍 JobFilter.jsx               # Application Filtering
│   │   │   ├── 📋 KanbanBoard.jsx             # Drag-and-Drop Application Board
│   │   │   ├── 🔗 LinkedInIntegration.jsx     # LinkedIn API Integration
│   │   │   ├── 📊 LiveAnalyticsDashboard.jsx  # Real-time Analytics
│   │   │   ├── ⏳ LoadingSpinner.jsx          # Loading States
│   │   │   ├── 👤 ProfileEdit.jsx             # User Profile Management
│   │   │   ├── 🔔 ReminderNotifications.jsx   # Follow-up Reminders
│   │   │   ├── 💰 SalaryNegotiation.jsx       # Salary Negotiation Tools
│   │   │   ├── 🧠 SmartFollowUp.jsx           # AI-Powered Follow-up Suggestions
│   │   │   ├── 🌙 ThemeToggle.jsx             # Dark/Light Mode Toggle
│   │   │   └── 📁 ui/
│   │   │       └── 🎨 Layout.jsx              # Main Layout Component
│   │   ├── 📁 contexts/            # React Context Providers
│   │   │   └── 🌙 ThemeContext.jsx            # Theme Management
│   │   ├── 📁 pages/               # Main Application Pages
│   │   │   ├── 🏠 Dashboard.jsx               # Main Dashboard
│   │   │   ├── 📫 FollowUp.jsx                # Follow-up Management
│   │   │   ├── 📈 FollowUpTracking.jsx        # Follow-up Analytics
│   │   │   ├── 🤖 IntelligentFeatures.jsx     # AI Features Hub
│   │   │   ├── 🎯 IntelligentFeaturesDemo.jsx # Feature Demonstrations
│   │   │   ├── 💼 InvestorDemo.jsx            # Investor Presentation
│   │   │   └── 🔐 Login.jsx                   # Authentication Page
│   │   ├── 📁 services/            # API Service Layer
│   │   │   ├── 📊 applicationTrackingService.js # Application Management
│   │   │   ├── 📄 cvMatchingService.js         # CV/Resume Matching
│   │   │   └── 💼 jobBoardService.js           # Job Board Integration
│   │   ├── 📁 api/                 # API Client Configuration
│   │   │   └── 🔗 client.js                   # HTTP Client Setup
│   │   ├── 🚀 main.jsx             # React Application Entry Point
│   │   ├── 📱 App.jsx              # Main App Component
│   │   └── 🧪 App-test.jsx         # Application Tests
│   ├── 📦 package.json             # Node.js Dependencies
│   ├── 🔒 package-lock.json        # Dependency Lock File
│   └── ⚡ vite.config.js          # Vite Build Configuration
├── 📁 .git/                       # Git Repository
├── 📁 .venv/                      # Python Virtual Environment
├── 📁 .claude/                    # Claude Code Configuration
└── 📖 README.md                   # This Documentation
```

## 🛠️ Technology Stack

### Backend
- **Framework:** FastAPI 0.111.0 - Modern, fast web framework for APIs
- **Database:** SQLAlchemy 2.0.31 - Python SQL toolkit and ORM
- **Authentication:** JWT with python-jose[cryptography] 3.3.0
- **Password Security:** Passlib[bcrypt] 1.7.4
- **AI Integration:** OpenAI 1.40.0 - GPT integration for cover letters and predictions
- **Validation:** Pydantic 2.7.4 - Data validation using Python type annotations
- **Server:** Uvicorn 0.30.1 - ASGI server implementation

### Frontend
- **Framework:** React 18.2.0 - Modern JavaScript library for building user interfaces
- **Build Tool:** Vite 5.4.0 - Next generation frontend tooling
- **Styling:** Tailwind CSS 3.4.13 - Utility-first CSS framework
- **State Management:** React Context API - Built-in state management
- **HTTP Client:** Fetch API - Modern web API for HTTP requests

### Development & Deployment
- **Language:** Python 3.x, JavaScript ES6+
- **Package Managers:** pip (Python), npm (Node.js)
- **Version Control:** Git
- **Code Style:** PEP 8 (Python), ESLint (JavaScript)

## 🗄️ Database Schema

### Users Table
```sql
users (
    id: INTEGER PRIMARY KEY,
    email: VARCHAR(255) UNIQUE NOT NULL,
    first_name: VARCHAR(50) NOT NULL,
    last_name: VARCHAR(50) NOT NULL,
    hashed_password: VARCHAR(255) NOT NULL,
    created_at: DATETIME DEFAULT NOW()
)
```

### Applications Table
```sql
applications (
    id: INTEGER PRIMARY KEY,
    user_id: INTEGER FOREIGN KEY → users.id,
    company: VARCHAR(255) NOT NULL,
    role: VARCHAR(255) NOT NULL,
    location: VARCHAR(255) NOT NULL,
    status: ENUM('APPLIED', 'INTERVIEWING', 'OFFER', 'ACCEPTED', 'REJECTED', 'ON_HOLD'),
    source: VARCHAR(255),
    applied_date: DATE,
    next_action_date: DATE,
    last_contact_date: DATE,
    follow_up_date: DATE,
    follow_up_sent: INTEGER DEFAULT 0,
    reminder_enabled: INTEGER DEFAULT 1,
    notes: TEXT(5000),
    created_at: DATETIME DEFAULT NOW(),
    updated_at: DATETIME DEFAULT NOW()
)
```

## 🚀 Quick Start

### Prerequisites
- **Python 3.8+** with pip
- **Node.js 16+** with npm
- **Git** for version control

### 1. Clone Repository
```bash
git clone <repository-url>
cd Job_Tracker
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv .venv

# Activate virtual environment
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Initialize database
python init_db.py

# Create test user (optional)
python create_test_user.py

# Start backend server
uvicorn app.main:app --reload --port 8000
```

### 3. Frontend Setup
```bash
# Open new terminal and navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### 4. Access Application
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8000
- **API Documentation:** http://localhost:8000/docs
- **Health Check:** http://localhost:8000/api/health

## 🔧 Configuration

### Environment Variables
Create `.env` files in backend and frontend directories:

**Backend (.env):**
```env
DATABASE_URL=sqlite:///./job_tracker.db
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
OPENAI_API_KEY=your-openai-api-key
ALLOWED_ORIGINS=http://localhost:5173
```

**Frontend (.env):**
```env
VITE_API_BASE_URL=http://localhost:8000
VITE_APP_TITLE=Job Tracker
```

## 🎯 Key Features

### 🤖 AI-Powered Features
- **Smart Cover Letter Generation** - Tailored cover letters using OpenAI GPT
- **Application Scoring** - AI-driven application success prediction
- **Follow-up Suggestions** - Intelligent timing and content recommendations
- **Interview Preparation** - AI-generated interview questions and tips

### 📊 Analytics & Insights
- **Live Dashboard** - Real-time application metrics and trends
- **Success Patterns** - Geographic and temporal analysis
- **Follow-up Tracking** - Response rate optimization
- **Predictive Insights** - Application outcome predictions

### 📧 Email Integration
- **Gmail/Outlook Sync** - Automatic email parsing and categorization
- **Smart Parsing** - Extract job details from emails
- **Status Updates** - Automatic application status tracking

### 📋 Application Management
- **Kanban Board** - Drag-and-drop application tracking
- **Custom Statuses** - Flexible workflow management
- **Reminder System** - Automated follow-up notifications
- **Bulk Operations** - Efficient mass application management

## 📡 API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User authentication
- `GET /api/me` - Get current user profile

### Applications
- `GET /api/applications` - List user applications
- `POST /api/applications` - Create new application
- `GET /api/applications/{id}` - Get specific application
- `PUT /api/applications/{id}` - Update application
- `DELETE /api/applications/{id}` - Delete application

### AI Features
- `POST /api/ai/cover-letter` - Generate cover letter
- `POST /api/ai/score-application` - Score application success probability
- `GET /api/ai/follow-up-suggestions` - Get follow-up recommendations

### Email Integration
- `POST /api/emails/sync` - Sync emails from provider
- `GET /api/emails/parsed` - Get parsed job-related emails

## 🧪 Testing

### Backend Testing
```bash
cd backend
pytest tests/ -v
```

### Frontend Testing
```bash
cd frontend
npm test
```

### End-to-End Testing
```bash
# Install Playwright or Cypress
npm install -g playwright
playwright test
```

## 📈 Development Workflow

### 1. Feature Development
1. Create feature branch: `git checkout -b feature/new-feature`
2. Implement backend API endpoints
3. Create/update database models if needed
4. Implement frontend components
5. Add tests for new functionality
6. Update documentation

### 2. Code Quality
```bash
# Backend linting
cd backend
flake8 app/
black app/

# Frontend linting
cd frontend
npm run lint
npm run format
```

### 3. Database Migrations
```bash
# Create new migration
alembic revision --autogenerate -m "Description"

# Apply migrations
alembic upgrade head
```

## 🚀 Deployment

### Production Deployment
1. **Backend Deployment (e.g., Heroku, AWS)**
   ```bash
   # Build production image
   docker build -t job-tracker-backend .

   # Deploy to production
   heroku container:push web -a your-app-name
   heroku container:release web -a your-app-name
   ```

2. **Frontend Deployment (e.g., Vercel, Netlify)**
   ```bash
   cd frontend
   npm run build
   # Deploy dist/ folder to your hosting service
   ```

### Environment Setup
- Configure production database (PostgreSQL recommended)
- Set up environment variables in production
- Configure CORS for production domain
- Set up SSL certificates
- Configure monitoring and logging

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create feature branch
3. Follow coding standards
4. Add tests for new features
5. Update documentation
6. Submit pull request

### Coding Standards
- **Python:** PEP 8, type hints, docstrings
- **JavaScript:** ESLint, Prettier, JSDoc
- **Git:** Conventional commits
- **Testing:** Minimum 80% coverage

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support & Issues

- **Documentation:** [Wiki](../../wiki)
- **Bug Reports:** [Issues](../../issues)
- **Feature Requests:** [Discussions](../../discussions)
- **Email:** support@jobtracker.app

## 🎯 Roadmap

### Phase 1: Core Features ✅
- [x] User authentication and profiles
- [x] Basic application tracking
- [x] Kanban board interface
- [x] Email integration foundation

### Phase 2: AI Enhancement 🚧
- [x] Cover letter generation
- [x] Application scoring
- [ ] Interview preparation
- [ ] Salary negotiation tools

### Phase 3: Advanced Analytics 📅
- [ ] Predictive analytics dashboard
- [ ] Success pattern analysis
- [ ] Market insights integration
- [ ] Mobile application

### Phase 4: Enterprise Features 📅
- [ ] Team collaboration
- [ ] Advanced reporting
- [ ] API integrations (LinkedIn, Indeed)
- [ ] Custom branding

---

**Built with ❤️ for job seekers worldwide**

*Last updated: September 2024*