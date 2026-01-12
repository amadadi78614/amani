# DBE Exam Bank - Static Version (No Database Required!)

A simplified web application that organizes South African DBE exam papers by topic using **JSON files only** - no Firebase, no database, no backend needed!

## ✨ What's Different from the Firebase Version?

- ✅ **No Database Setup** - Uses local JSON files
- ✅ **No Firebase Configuration** - Zero external dependencies
- ✅ **Faster Development** - Just edit JSON and deploy
- ✅ **Completely Free** - No hosting costs
- ✅ **Easier to Deploy** - Works as a static site
- ✅ **Simpler Codebase** - 50% less code

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run development server
npm run dev

# 3. Open browser
# Visit http://localhost:3000
```

That's it! No Firebase setup, no environment variables, no database seeding!

## 📊 How Data Works

All questions are stored in simple JSON files:

```
data/
├── questions.json    # All questions organized by subject/grade/topic
└── subjects.json     # Subject metadata
```

### Sample Data Structure

```json
{
  "Mathematics": {
    "12": {
      "Algebra": [
        {
          "id": "math-12-alg-001",
          "questionText": "Simplify: (3x + 2)(2x - 5)",
          "marks": 3,
          "year": 2023
        }
      ]
    }
  }
}
```

## 📝 Adding Your Own Questions

### Option 1: Manually Edit JSON

Edit `data/questions.json`:

```json
{
  "Mathematics": {
    "12": {
      "Algebra": [
        {
          "id": "math-12-alg-003",
          "subject": "Mathematics",
          "grade": 12,
          "year": 2024,
          "questionNumber": "1.1",
          "questionText": "Your question here...",
          "topics": ["Algebra"],
          "marks": 5
        }
      ]
    }
  }
}
```

### Option 2: Use the Scrapers (Advanced)

```bash
# 1. Scrape exam papers from web
npm run scrape

# 2. Parse PDFs and extract questions
npm run parse

# 3. The parsed data will be in data/questions/all-questions.json
# 4. Copy it to data/questions.json
cp data/questions/organized-by-topic.json data/questions.json
```

## 🎯 Features

- **Topic-Based Practice** - Select specific topics to practice
- **Year Filtering** - Filter questions by year
- **Search** - Search within questions
- **No Login Required** - Completely public access
- **Responsive Design** - Works on mobile, tablet, desktop
- **Fast Loading** - All data loads instantly

## 📱 Deployment

### Deploy to Vercel (Easiest)

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Deploy
vercel

# Done! Your site is live at https://your-project.vercel.app
```

### Deploy to Netlify

```bash
# 1. Build the site
npm run build

# 2. Drag the .next folder to Netlify
# Or connect your GitHub repo
```

### Deploy to GitHub Pages

```bash
# 1. Update next.config.js
module.exports = {
  output: 'export',
  images: { unoptimized: true }
}

# 2. Build
npm run build

# 3. Deploy the out/ folder to GitHub Pages
```

## 🔧 Customization

### Add a New Subject

1. **Add to `data/subjects.json`:**
```json
{
  "accounting": {
    "id": "accounting",
    "name": "Accounting",
    "grades": [11, 12],
    "topics": ["Financial Statements", "Cash Flow", "VAT"]
  }
}
```

2. **Add questions to `data/questions.json`:**
```json
{
  "Accounting": {
    "12": {
      "Financial Statements": [...]
    }
  }
}
```

3. **Update home page** (`app/page.js`) to include the new subject card

### Change Colors

Edit `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: '#your-color'
    }
  }
}
```

## 📊 Data Management

### Question Schema

```json
{
  "id": "unique-id",
  "subject": "Mathematics",
  "grade": 12,
  "year": 2023,
  "source": "DBE Official",
  "questionNumber": "1.1",
  "questionText": "Full question...",
  "topics": ["Algebra", "Equations"],
  "marks": 5
}
```

### Performance

- Sample data includes ~15 questions
- Can handle 1000s of questions without issues
- All data loads on initial page load
- Filtering happens client-side (instant)

## 🐛 Troubleshooting

### "Cannot find module 'data/questions.json'"

Make sure the `data` folder is in your project root with both JSON files.

### Questions not showing

1. Check `data/questions.json` is formatted correctly
2. Verify subject/grade/topic hierarchy matches
3. Check browser console for errors

### Build fails

```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

## 🆚 Static vs Firebase Version

| Feature | Static (This) | Firebase |
|---------|--------------|----------|
| Setup Time | 2 minutes | 30 minutes |
| Database | JSON files | Firestore |
| Cost | Free | Free tier (limited) |
| Scalability | Good (1000s) | Better (millions) |
| User Features | ❌ | ✅ (progress, favorites) |
| Best For | Read-only content | Interactive apps |

## 📈 When to Upgrade to Firebase?

Consider Firebase when you need:
- User accounts and authentication
- Progress tracking
- Favorites/bookmarks
- Comments
- Real-time updates
- More than 10,000 questions

## 🎓 Perfect For

- Student projects
- School websites
- Study groups
- Personal use
- Quick deployments
- Learning Next.js

## 📄 License

Educational purposes only. All exam papers are property of DBE South Africa.

## 🤝 Contributing

1. Fork the repo
2. Add questions to `data/questions.json`
3. Create a pull request

## 📧 Support

Having issues? Check that:
1. Node.js version is 18+
2. All dependencies installed: `npm install`
3. JSON files are valid (use JSONLint)
4. Development server is running: `npm run dev`

---

**Built with ❤️ for South African students**

*No database, no problem!* 🚀
