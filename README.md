# Welcome to React Router!

A modern, production-ready template for building full-stack React applications using React Router.

## Features

- 🚀 Server-side rendering
- ⚡️ Hot Module Replacement (HMR)
- 📦 Asset bundling and optimization
- 🔄 Data loading and mutations
- 🔒 TypeScript by default
- 🎉 TailwindCSS for styling
- 📖 [React Router docs](https://reactrouter.com/)

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:3000`.

## Building for Production

Create a production build:

```bash
npm run build
```

## Running Backend
### Virtual Environment : 
1. [Python Docs](https://docs.python.org/3/library/venv.html)

2. Create a new environment : `python -m venv .venv`

3. Activate environment : `source .venv/bin/activate` MacOS `.venv\Scripts\activate` Windows

4. De-activate environment  : `deactivate`

### Dependencies :
1. Install dependencies : `pip install -r requirements.txt` MacOS `npm install "fastapi[standard]"` Windows

2. Updating dependencies : `pip freeze > requirements.txt`

### Run/Test :
1. Run FastAPI backend server : `fastapi dev app/main.py` MacOS `uvicorn app.main:app --reload` Windows

2. Default server location : http://127.0.0.1:8000

3. API Endpoint Test : http://127.0.0.1:8000/docs


## Deployment

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fremix-run%2Freact-router-templates%2Ftree%2Fmain%2Fvercel&project-name=my-react-router-app&repository-name=my-react-router-app)

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.

---

Built with ❤️ using React Router.
