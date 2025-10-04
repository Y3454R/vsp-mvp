# Quick Setup Guide

Follow these steps to get your Virtual Mental Health Patient Chatbot running in minutes!

## Step 1: Get Your OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the key (you won't be able to see it again!)

## Step 2: Set Up Environment Variables

1. Copy the example environment file:

   ```bash
   cp env.example .env
   ```

2. Edit `.env` and add your OpenAI API key:

   ```env
   OPENAI_API_KEY=sk-your-actual-key-here
   ```

3. Create frontend environment file:
   ```bash
   cd frontend
   echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
   cd ..
   ```

## Step 3: Choose Your Setup Method

### Option A: Using Docker (Easiest)

```bash
docker-compose up --build
```

Then visit http://localhost:3000

### Option B: Local Development

#### Terminal 1 - Backend:

```bash
# Create virtual environment
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run backend
cd ..
python -m uvicorn backend.main:app --reload --port 8000
```

#### Terminal 2 - Frontend:

```bash
cd frontend
npm install
npm run dev
```

Then visit http://localhost:3000

## Step 4: Start Practicing!

1. Select a mental health case from the home page
2. Conduct a psychiatric interview with the virtual patient
3. End the interview to get your evaluation on psychiatric interviewing skills

## Troubleshooting

### "Module not found" errors

Make sure you're running commands from the project root directory.

### Backend won't start

- Check your OpenAI API key is valid
- Ensure Python 3.11+ is installed
- Try: `pip install -r backend/requirements.txt` again

### Frontend won't start

- Make sure Node.js 20+ is installed
- Delete `node_modules` and run `npm install` again
- Check `.env.local` exists in the frontend directory

### "Failed to load cases" error

- Ensure the backend is running on port 8000
- Check `NEXT_PUBLIC_API_URL` in `frontend/.env.local`

## Need Help?

Check the full README.md for detailed documentation.
