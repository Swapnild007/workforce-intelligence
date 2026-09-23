# Workforce Intelligence Academy

A futuristic, local-first learning interface for mastering Workforce Management, mathematics, statistics, analytics, Python, data science, machine learning, optimization, generative AI, MLOps and automation.

## Current milestone

This repository contains the **Workforce Intelligence learning system and its integrated WFM simulation lab**. The WFM Lab is part of this repository and is not a future standalone project.

### Included

- Futuristic light glass interface
- Responsive desktop/mobile layouts
- Learning-focused landing page
- Curriculum explorer
- Unified Learn experience: journey + curriculum + lessons
- Learning progress and mastery surfaces
- Integrated WFM Lab: queueing, forecasting, capacity, scheduling, intraday and what-if analysis
- Decision Lab
- Projects
- Resources
- Interactive modal/lesson shell
- Search interaction
- Mobile liquid-style bottom navigation
- No external runtime dependency
- No API key or company data
- Works as a static local page

## Run locally

Open `index.html` directly in a browser, or serve the folder with:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Engineering direction

The UI is deliberately separated conceptually from the future learning engines. Engineering direction:

`Learn → WFM Lab → Decision Lab → Projects → Analytics/ML → Optimization → GenAI/Automation`

The WFM Lab is intentionally dependency-free and offline-first. It uses synthetic scenarios and transparent calculations so the learning environment remains portable and safe for corporate environments.

No corporate data or credentials belong in this public repository.
