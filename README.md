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
- WFM Project Studio: browser implementations of Erlang staffing, capacity planning, forecasting, schedule adherence, KPI dashboard and multichannel simulation workflows
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

`Learn → WFM Lab (including Toolbox) → Decision Lab → Projects → Analytics/ML → Optimization → GenAI/Automation`

The WFM Lab is intentionally dependency-free and offline-first. It uses synthetic scenarios and transparent calculations so the learning environment remains portable and safe for corporate environments.

No corporate data or credentials belong in this public repository.

## WFM Project Studio

The Project Studio converts the core practical WFM workflows found in widely used spreadsheet and calculator exercises into browser-native projects. The current suite includes:

1. Erlang Staffing Calculator — interval volume, AHT, service level, threshold, occupancy, shrinkage and Erlang-A patience analysis.
2. Capacity Planner — workload, productive hours, FTE and shrinkage sensitivity.
3. Forecasting Studio — historical series input, level/trend/seasonality modelling and multi-period forecast diagnostics.
4. Schedule Adherence — scheduled vs adherent minutes with team and individual calculations.
5. KPI Dashboard — editable WFM scorecard with target status.
6. Multichannel Simulator — blended voice/chat/email workload and staffing scenarios.

These are original web implementations for learning. They do not copy third-party workbook code or assets. Source concepts are credited in the application and used as curriculum/reference material.


## Product relationship

The navigation intentionally separates functions that are easy to confuse:

- **Learn** = knowledge: curriculum, lessons, explanations, examples and assessments.
- **WFM Lab** = experimentation: queueing, forecasting, capacity, scheduling, intraday, what-if and the integrated **WFM Toolbox**.
- **WFM Toolbox** = practical browser conversions of spreadsheet/calculator workflows such as Erlang staffing, forecasting, capacity, adherence, KPI dashboard and multichannel workload.
- **Decision Lab** = judgement: diagnose a WFM situation and defend the operational decision.
- **Projects** = end-to-end portfolio builds that connect Learn + WFM Lab + Decision Lab.
- **Home** = the single progress/momentum dashboard. There is no separate Progress navigation page.
- **Resources** = reference material and formula/library support.

This avoids maintaining separate pages for the same learning state or calculator functionality.
