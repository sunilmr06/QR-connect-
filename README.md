# QRConnect - Your Digital Identity in One Scan

QRConnect is a Smart Digital Business Card SaaS Platform optimized for quick digital profile generation at networking events. It features an **offline-first hybrid QR technology** that embeds a full VCard offline contact card inside the QR code, while dynamically linking to a premium online landing page when scanned with internet access.

---

## 🌟 KEY FEATURES

1. **Hybrid QR Technology**:
   - **Offline Mode**: Native camera scanners parse contact details (Name, Title, Org, Phone, Email) instantly and display a "Save Contact" prompt without requiring internet access.
   - **Online Mode**: Logs the scan to backend analytics and redirects to the public profile page.
2. **Dynamic Social Card (PNG)**: Renders a beautiful 1080x1080 social media share card based on selected themes.
3. **Print-Ready PDF**: Generates standard business cards (85.6mm x 53.98mm) and an A4 template sheet with cut lines and fold guides.
4. **Interactive Dashboard**: Displays real-time scan events, profile views, file downloads, and registration trends.

---

## 🛠️ TECH STACK

- **Backend**: Django 5.0+, Django REST Framework, Django CORS Headers
- **Frontend**: React (Vite), Tailwind CSS, Framer Motion, Lucide Icons
- **Python Libraries**: `qrcode`, `pillow` (PIL), `reportlab`, `vobject`
- **Database**: SQLite (Local Dev) / PostgreSQL (Production ready)

---

## 🚀 SETUP INSTRUCTIONS

### Prerequisites
- Python 3.10+
- Node.js v18+ & npm

---

### 1. Backend Setup

1. Open a terminal and navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   .\venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Perform database migrations:
   ```bash
   python manage.py makemigrations cards
   python manage.py migrate
   ```
5. Start the development server:
   ```bash
   python manage.py runserver 0.0.0.0:8000
   ```
   *The backend will run on `http://localhost:8000`.*

---

### 2. Frontend Setup

1. Open a new terminal and navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```
2. Install package dependencies:
   ```bash
   npm install
   ```
3. Run the Vite developer server:
   ```bash
   npm run dev
   ```
   *The frontend will run on `http://localhost:5173`.*

---

## ⚙️ ENVIRONMENT VARIABLES

Create a `.env` file in the root of `backend/` for production configuration:

```env
# Django Settings
DEBUG=False
SECRET_KEY=your-secure-django-secret-key
ALLOWED_HOSTS=yourdomain.com,localhost,127.0.0.1

# Database Configuration (PostgreSQL Production)
DATABASE_URL=postgres://user:password@localhost:5432/qrconnect

# CORS Settings
CORS_ALLOWED_ORIGINS=https://yourdomain.com,http://localhost:5173

# Frontend URL mapping (used for QR redirections)
FRONTEND_BASE_URL=https://yourdomain.com
```

---

## 🐳 PRODUCTION DEPLOYMENT GUIDE

For a robust, production-ready SaaS environment, follow this architectural setup:

```
[ Scan QR ] ─► [ Nginx Reverse Proxy ]
                     │
         ┌───────────┴───────────┐
         ▼                       ▼
  [ React SPA ]          [ Gunicorn WSGI ]
(Vercel/Static Host)             │
                                 ▼
                         [ Django REST API ]
                                 │
                         [ PostgreSQL DB ]
```

### 1. Frontend Hosting
The React application compiles to static HTML/JS/CSS assets.
- **Vercel / Netlify / Cloudflare Pages**: Connect your repository and select Vite build settings (`npm run build`, output folder `dist/`).
- **Nginx Static Files**: Place the `dist/` build files in `/var/www/html` and route root traffic to it.

### 2. Backend API Hosting
- **Docker Deployment**: Run Gunicorn bound to the application inside a container.
- **Systemd Service**: Create a systemd unit file for Gunicorn to manage the server process:
  ```ini
  [Unit]
  Description=gunicorn daemon for QRConnect
  After=network.target

  [Service]
  User=ubuntu
  WorkingDirectory=/home/ubuntu/qrconnect_v3/backend
  ExecStart=/home/ubuntu/qrconnect_v3/backend/venv/bin/gunicorn --workers 3 --bind unix:/home/ubuntu/qrconnect_v3/backend/qrconnect.sock qrconnect.wsgi:application

  [Install]
  WantedBy=multi-user.target
  ```

### 3. Database Migration (PostgreSQL)
Configure settings for production PostgreSQL:
```python
DATABASES = {
    'default': dj_database_url.config(
        default='postgresql://user:password@localhost:5432/qrconnect'
    )
}
```

---

## 🧪 BACKEND SANITY TESTING

To verify that the asset generation pipelines (PDF drawing, PIL PNG styling, QR vCard encoding) are fully functional on your current host, run the custom integration test suite:

```bash
cd backend
# With virtual environment active
python test_card_flow.py
```
