/* Workforce Intelligence curriculum data. UI presentation remains frozen. */
window.WI_CURRICULUM = {
  "version": "1.0.0",
  "title": "Workforce Intelligence Curriculum",
  "status": "blueprint",
  "principle": "The visible six-domain UI is a frozen presentation layer. This catalog is the deeper academic hierarchy behind it.",
  "hierarchy": [
    "Domain",
    "Module",
    "Lesson",
    "Concept",
    "Example",
    "Practice",
    "Lab",
    "Assessment",
    "Project"
  ],
  "domains": [
    {
      "id": "01",
      "name": "Mathematics & Computational Foundations",
      "modules": [
        {
          "id": "01.1",
          "name": "Numeracy, Ratios & Algebra",
          "lessons": [
            "Arithmetic and order of operations",
            "Fractions, decimals and percentages",
            "Ratios, proportions and rates",
            "Linear equations and inequalities",
            "Systems of equations",
            "Exponents, roots and logarithms",
            "Sequences and series",
            "Units, dimensions and conversions"
          ]
        },
        {
          "id": "01.2",
          "name": "Functions & Mathematical Modeling",
          "lessons": [
            "Variables and functions",
            "Linear and nonlinear functions",
            "Piecewise functions",
            "Growth and decay models",
            "Optimization intuition",
            "Model assumptions and constraints",
            "Reading mathematical notation",
            "Translating business problems into equations"
          ]
        },
        {
          "id": "01.3",
          "name": "Probability Foundations",
          "lessons": [
            "Sample spaces and events",
            "Counting principles",
            "Conditional probability",
            "Independence",
            "Bayes theorem",
            "Random variables",
            "Expectation and variance",
            "Law of total probability"
          ]
        },
        {
          "id": "01.4",
          "name": "Statistics Foundations",
          "lessons": [
            "Population and sample",
            "Descriptive statistics",
            "Quantiles and dispersion",
            "Covariance and correlation",
            "Sampling distributions",
            "Central limit theorem",
            "Standardization and z-scores",
            "Statistical interpretation"
          ]
        },
        {
          "id": "01.5",
          "name": "Calculus & Change",
          "lessons": [
            "Limits and continuity",
            "Derivatives",
            "Rates of change",
            "Optimization with derivatives",
            "Integrals",
            "Accumulation and area",
            "Partial derivatives",
            "Gradient intuition"
          ]
        },
        {
          "id": "01.6",
          "name": "Linear Algebra",
          "lessons": [
            "Vectors",
            "Matrices",
            "Matrix operations",
            "Linear systems",
            "Linear transformations",
            "Eigenvalues and eigenvectors",
            "Dot products and projections",
            "Least-squares intuition"
          ]
        },
        {
          "id": "01.7",
          "name": "Discrete Math & Computational Thinking",
          "lessons": [
            "Logic and propositions",
            "Sets and relations",
            "Graphs and networks",
            "Combinatorics",
            "Recursion",
            "Algorithms and complexity",
            "Decomposition and abstraction",
            "Problem-solving patterns"
          ]
        }
      ]
    },
    {
      "id": "02",
      "name": "WFM & Contact-Center Systems",
      "modules": [
        {
          "id": "02.1",
          "name": "Contact-Center & WFM Foundations",
          "lessons": [
            "What a Contact Center Is",
            "Demand, Work and Capacity",
            "Voice, Digital and Back-Office Channels",
            "Queues, Skills and Routing",
            "Service Objectives and Customer Promises",
            "Operating Hours, Calendars and Events",
            "WFM Roles and Decision Rights",
            "The End-to-End WFM Cycle"
          ]
        },
        {
          "id": "02.2",
          "name": "WFM Mathematics & Core Formulas",
          "lessons": [
            "Time, Intervals and Units",
            "Contact Volume and Workload",
            "AHT and Handling Components",
            "Service Level and Answer Thresholds",
            "ASA and Abandonment",
            "Occupancy and Utilization",
            "Shrinkage and Productive Capacity",
            "FTE, Staffing Gap and Variance"
          ]
        },
        {
          "id": "02.3",
          "name": "WFM Metrics & KPI Architecture",
          "lessons": [
            "Offered, Handled and Abandoned",
            "Service Level",
            "ASA",
            "AHT",
            "Occupancy",
            "Utilization and Productivity",
            "Adherence, Conformance and Schedule Efficiency",
            "Metric Definitions, Reconciliation and Governance"
          ]
        },
        {
          "id": "02.4",
          "name": "Queueing Theory & Erlang",
          "lessons": [
            "Queueing Theory Intuition",
            "Arrival Rate, Service Rate and Traffic Intensity",
            "Erlang Units",
            "Erlang B",
            "Erlang C",
            "Erlang A",
            "Probability of Delay and Service Level",
            "Erlang Assumptions, Limits and Simulation"
          ]
        },
        {
          "id": "02.5",
          "name": "Historical Data & WFM Data Preparation",
          "lessons": [
            "WFM Data Sources",
            "Interval Granularity",
            "Historical Demand Profiling",
            "Data Types and Definitions",
            "Missing Data and Duplicates",
            "Outliers and Anomalies",
            "Data Reconciliation and Validation",
            "Building a Planning Dataset"
          ]
        },
        {
          "id": "02.6",
          "name": "Forecasting Fundamentals",
          "lessons": [
            "Purpose of a WFM Forecast",
            "Forecast Horizons and Granularity",
            "Historical Baselines",
            "Day-of-Week Patterns",
            "Intraday Distribution",
            "Trend",
            "Seasonality",
            "Calendar and Business Events"
          ]
        },
        {
          "id": "02.7",
          "name": "Advanced Forecasting Methods",
          "lessons": [
            "Naive and Moving-Average Forecasts",
            "Weighted Moving Average",
            "Exponential Smoothing",
            "Holt Forecasting",
            "Holt-Winters",
            "Regression for Demand Forecasting",
            "ARIMA Concepts",
            "Model Selection and Backtesting"
          ]
        },
        {
          "id": "02.8",
          "name": "Forecast Accuracy, Bias & Governance",
          "lessons": [
            "Forecast Error",
            "MAE, MAPE, WAPE and RMSE",
            "Forecast Bias",
            "Tracking Signal",
            "Accuracy by Interval and Aggregation",
            "Forecast Overrides",
            "Assumptions and Version Control",
            "Forecast Review and Governance"
          ]
        },
        {
          "id": "02.9",
          "name": "Staffing & Capacity Planning",
          "lessons": [
            "From Workload to Required Staff",
            "Gross and Net Staffing",
            "Shrinkage Application",
            "Occupancy and Efficiency Assumptions",
            "Interval Staffing Requirements",
            "Daily and Weekly Capacity",
            "Hiring, Overtime and Contingent Capacity",
            "Capacity Scenarios and Sensitivity"
          ]
        },
        {
          "id": "02.10",
          "name": "Scheduling & Shift Planning",
          "lessons": [
            "From Requirement to Schedule",
            "Shift Length and Start Times",
            "Coverage Curves",
            "Break and Lunch Placement",
            "Days Off and Operating Constraints",
            "Shift Patterns and Flexible Schedules",
            "Multi-Skilled Agent Scheduling",
            "Schedule Quality and Inefficiency"
          ]
        },
        {
          "id": "02.11",
          "name": "Adherence, Attendance & Shrinkage",
          "lessons": [
            "Schedule Adherence",
            "Conformance",
            "Attendance and Absenteeism",
            "Planned Shrinkage",
            "Unplanned Shrinkage",
            "Offline Activities",
            "Adherence Exceptions and Root Cause",
            "Improvement and Coaching Loops"
          ]
        },
        {
          "id": "02.12",
          "name": "Intraday & Real-Time Management",
          "lessons": [
            "Purpose of Intraday Management",
            "Start-of-Day Readiness",
            "Actual vs Forecast",
            "Actual vs Scheduled",
            "Queue and Service Monitoring",
            "Intraday Staffing Gaps",
            "Interventions and Thresholds",
            "Reforecast, Recovery and Escalation"
          ]
        },
        {
          "id": "02.13",
          "name": "Multi-Channel & Blended WFM",
          "lessons": [
            "Voice Forecasting and Staffing",
            "Email and Asynchronous Work",
            "Chat and Concurrency",
            "Social and Messaging Work",
            "Back-Office Work",
            "Blended Agents and Shared Capacity",
            "Cross-Skill and Channel Prioritization",
            "Multi-Channel Intraday Management"
          ]
        },
        {
          "id": "02.14",
          "name": "WFM Reporting & Operational Analytics",
          "lessons": [
            "Operational Reporting Foundations",
            "Forecast Reporting",
            "Staffing and Coverage Reporting",
            "Schedule Reporting",
            "Adherence Reporting",
            "Interval Heatmaps and Variance",
            "Root-Cause Analysis",
            "Executive WFM Reporting"
          ]
        },
        {
          "id": "02.15",
          "name": "WFM Tools, Technology & Data Integration",
          "lessons": [
            "Spreadsheet-Based WFM",
            "Erlang and Forecasting Calculators",
            "WFM Application Architecture",
            "Forecasting and Scheduling Systems",
            "ACD, CRM and HR Data",
            "APIs and Data Pipelines",
            "Cloud WFM and Platform Governance",
            "Automation and Operational Controls"
          ]
        },
        {
          "id": "02.16",
          "name": "Workforce Optimization & Scenario Planning",
          "lessons": [
            "What Workforce Optimization Means",
            "Objective Functions and Constraints",
            "Cost vs Service Trade-offs",
            "Schedule Optimization",
            "Staffing Optimization",
            "What-If Analysis",
            "Sensitivity and Risk Analysis",
            "Optimization Decision Case"
          ]
        },
        {
          "id": "02.17",
          "name": "WFM Team, Governance & Strategic Planning",
          "lessons": [
            "Planning Team Structure",
            "Forecasting, Scheduling and RTA Responsibilities",
            "Stakeholder Management",
            "Planning Cadence and Governance",
            "Assumptions, Change Control and Auditability",
            "Long-Term Workforce Planning",
            "Attrition, Growth and Hiring Strategy",
            "WFM Maturity and Transformation"
          ]
        },
        {
          "id": "02.18",
          "name": "WFM Case Studies & Capstone",
          "lessons": [
            "Diagnosing an SLA Failure",
            "Diagnosing a Forecast Failure",
            "Diagnosing a Staffing Gap",
            "Diagnosing a Schedule Problem",
            "Intraday Recovery Case",
            "Multi-Channel Capacity Case",
            "Executive Decision Case",
            "Build the Complete WFM System"
          ]
        }
      ]
    },
    {
      "id": "03",
      "name": "Forecasting & Capacity Planning",
      "modules": [
        {
          "id": "03.1",
          "name": "Forecasting Principles",
          "lessons": [
            "Forecasting objectives",
            "Forecast horizons",
            "Granularity",
            "Aggregation and disaggregation",
            "Baseline models",
            "Forecast workflow",
            "Forecast ownership",
            "Forecast risk"
          ]
        },
        {
          "id": "03.2",
          "name": "Time-Series Foundations",
          "lessons": [
            "Time-series components",
            "Trend",
            "Seasonality",
            "Autocorrelation",
            "Stationarity",
            "Lag features",
            "Differencing",
            "Decomposition"
          ]
        },
        {
          "id": "03.3",
          "name": "Statistical Forecasting",
          "lessons": [
            "Naive forecasts",
            "Moving averages",
            "Weighted moving averages",
            "Exponential smoothing",
            "Holt method",
            "Holt-Winters",
            "Prediction intervals",
            "Forecast selection"
          ]
        },
        {
          "id": "03.4",
          "name": "Forecast Evaluation",
          "lessons": [
            "MAE",
            "MSE and RMSE",
            "MAPE and sMAPE",
            "WAPE",
            "Bias",
            "Tracking signal",
            "Backtesting",
            "Error decomposition"
          ]
        },
        {
          "id": "03.5",
          "name": "Capacity & Scenario Modeling",
          "lessons": [
            "Workload scenarios",
            "Volume sensitivity",
            "AHT sensitivity",
            "Service-level sensitivity",
            "Shrinkage scenarios",
            "Hiring scenarios",
            "Attrition scenarios",
            "What-if analysis"
          ]
        },
        {
          "id": "03.6",
          "name": "Forecast Governance",
          "lessons": [
            "Forecast versioning",
            "Override policy",
            "Judgmental adjustments",
            "Assumption tracking",
            "Forecast reconciliation",
            "Accuracy reporting",
            "Model monitoring",
            "Forecast review cadence"
          ]
        }
      ]
    },
    {
      "id": "04",
      "name": "Statistics & Statistical Inference",
      "modules": [
        {
          "id": "04.1",
          "name": "Descriptive Statistics",
          "lessons": [
            "Central tendency",
            "Dispersion",
            "Distribution shape",
            "Outliers",
            "Robust statistics",
            "Grouped summaries",
            "Weighted statistics",
            "Business interpretation"
          ]
        },
        {
          "id": "04.2",
          "name": "Probability Distributions",
          "lessons": [
            "Bernoulli and binomial",
            "Poisson",
            "Geometric",
            "Normal",
            "Exponential",
            "Gamma",
            "Lognormal",
            "Distribution selection"
          ]
        },
        {
          "id": "04.3",
          "name": "Sampling & Estimation",
          "lessons": [
            "Sampling methods",
            "Bias and variance",
            "Point estimates",
            "Standard errors",
            "Confidence intervals",
            "Bootstrap intuition",
            "Sample-size planning",
            "Margin of error"
          ]
        },
        {
          "id": "04.4",
          "name": "Hypothesis Testing",
          "lessons": [
            "Null and alternative hypotheses",
            "p-values",
            "Type I and II errors",
            "Power",
            "t-tests",
            "Chi-square tests",
            "Nonparametric tests",
            "Multiple testing"
          ]
        },
        {
          "id": "04.5",
          "name": "Regression & Experimental Analysis",
          "lessons": [
            "Simple regression",
            "Multiple regression",
            "Residuals",
            "Model assumptions",
            "Interactions",
            "ANOVA",
            "A/B testing",
            "Causal interpretation"
          ]
        },
        {
          "id": "04.6",
          "name": "Statistical Communication",
          "lessons": [
            "Effect size",
            "Uncertainty communication",
            "Statistical versus practical significance",
            "Confidence language",
            "Chart selection",
            "Misleading statistics",
            "Executive summaries",
            "Reproducible analysis"
          ]
        }
      ]
    },
    {
      "id": "05",
      "name": "Excel, Power Query, Power Pivot & DAX",
      "modules": [
        {
          "id": "05.1",
          "name": "Excel Foundations",
          "lessons": [
            "Workbook architecture",
            "Tables and structured references",
            "Core formulas",
            "Logical functions",
            "Lookup functions",
            "Date and time functions",
            "Dynamic arrays",
            "Error handling"
          ]
        },
        {
          "id": "05.2",
          "name": "Advanced Excel Analytics",
          "lessons": [
            "PivotTables",
            "PivotCharts",
            "Conditional formatting",
            "Data validation",
            "What-if analysis",
            "Scenario Manager",
            "Goal Seek",
            "Model auditing"
          ]
        },
        {
          "id": "05.3",
          "name": "Power Query",
          "lessons": [
            "Query architecture",
            "Connectors",
            "Data types",
            "Transformations",
            "Joins and appends",
            "Grouping and aggregation",
            "Parameters",
            "Refresh design"
          ]
        },
        {
          "id": "05.4",
          "name": "Power Pivot & Data Modeling",
          "lessons": [
            "Star schemas",
            "Fact and dimension tables",
            "Relationships",
            "Keys",
            "Date tables",
            "Model granularity",
            "Calculated columns",
            "Model performance"
          ]
        },
        {
          "id": "05.5",
          "name": "DAX",
          "lessons": [
            "Measures versus columns",
            "Filter context",
            "Row context",
            "CALCULATE",
            "Time intelligence",
            "Iterators",
            "Variables",
            "Advanced evaluation context"
          ]
        },
        {
          "id": "05.6",
          "name": "Workforce BI Delivery",
          "lessons": [
            "WFM dashboard design",
            "KPI definitions",
            "Drill-through",
            "Tooltips",
            "RLS concepts",
            "Refresh pipelines",
            "Performance optimization",
            "Executive storytelling"
          ]
        }
      ]
    },
    {
      "id": "06",
      "name": "SQL & Databases",
      "modules": [
        {
          "id": "06.1",
          "name": "SQL Foundations",
          "lessons": [
            "SELECT and FROM",
            "Filtering",
            "Sorting",
            "CASE",
            "NULL handling",
            "Aggregations",
            "GROUP BY",
            "HAVING"
          ]
        },
        {
          "id": "06.2",
          "name": "Relational Data",
          "lessons": [
            "Tables and keys",
            "Primary and foreign keys",
            "Normalization",
            "Constraints",
            "Relationships",
            "Transactions",
            "Indexes",
            "Data integrity"
          ]
        },
        {
          "id": "06.3",
          "name": "Joins & Analytical SQL",
          "lessons": [
            "INNER JOIN",
            "LEFT JOIN",
            "Anti-joins",
            "Self-joins",
            "Subqueries",
            "CTEs",
            "Window functions",
            "Conditional aggregation"
          ]
        },
        {
          "id": "06.4",
          "name": "Advanced SQL",
          "lessons": [
            "Date-time analytics",
            "Rolling metrics",
            "Ranking",
            "Sessionization concepts",
            "Recursive CTEs",
            "Query plans",
            "Performance tuning",
            "Reusable views"
          ]
        },
        {
          "id": "06.5",
          "name": "Data Engineering with SQL",
          "lessons": [
            "ETL versus ELT",
            "Staging layers",
            "Dimensional modeling",
            "Incremental loads",
            "Data quality checks",
            "Slowly changing dimensions",
            "Lineage",
            "Warehouse design"
          ]
        },
        {
          "id": "06.6",
          "name": "Workforce Analytics SQL",
          "lessons": [
            "Interval workload analysis",
            "Agent performance datasets",
            "Schedule adherence queries",
            "Forecast accuracy queries",
            "Staffing analysis",
            "Attrition analysis",
            "Quality datasets",
            "Portfolio SQL projects"
          ]
        }
      ]
    },
    {
      "id": "07",
      "name": "Python & Data Engineering",
      "modules": [
        {
          "id": "07.1",
          "name": "Python Foundations",
          "lessons": [
            "Variables and types",
            "Control flow",
            "Functions",
            "Collections",
            "Comprehensions",
            "Modules and packages",
            "Exceptions",
            "File handling"
          ]
        },
        {
          "id": "07.2",
          "name": "Python Software Engineering",
          "lessons": [
            "Virtual environments",
            "Project structure",
            "Type hints",
            "Logging",
            "Configuration",
            "Testing",
            "Packaging",
            "Dependency management"
          ]
        },
        {
          "id": "07.3",
          "name": "NumPy & pandas",
          "lessons": [
            "Arrays",
            "Vectorization",
            "Series and DataFrames",
            "Filtering",
            "Groupby",
            "Merge and join",
            "Reshaping",
            "Time-series indexing"
          ]
        },
        {
          "id": "07.4",
          "name": "Data Engineering",
          "lessons": [
            "CSV and JSON",
            "Parquet",
            "Schema validation",
            "ETL pipelines",
            "Data profiling",
            "Data quality rules",
            "Partitioning",
            "Pipeline orchestration concepts"
          ]
        },
        {
          "id": "07.5",
          "name": "Visualization & Analysis",
          "lessons": [
            "Matplotlib",
            "Statistical plots",
            "Time-series plots",
            "Distribution plots",
            "Dashboard-ready datasets",
            "Annotation",
            "Reproducibility",
            "Analytical narratives"
          ]
        },
        {
          "id": "07.6",
          "name": "APIs & Automation",
          "lessons": [
            "HTTP fundamentals",
            "REST APIs",
            "Authentication concepts",
            "Pagination",
            "Retries",
            "Rate limits",
            "Automation scripts",
            "Safe credential handling"
          ]
        }
      ]
    },
    {
      "id": "08",
      "name": "Data Science & Analytical Modeling",
      "modules": [
        {
          "id": "08.1",
          "name": "Data Science Workflow",
          "lessons": [
            "Problem framing",
            "Data requirements",
            "EDA",
            "Feature definitions",
            "Baseline analysis",
            "Validation design",
            "Experiment tracking",
            "Reproducibility"
          ]
        },
        {
          "id": "08.2",
          "name": "Feature Engineering",
          "lessons": [
            "Categorical encoding",
            "Scaling",
            "Aggregations",
            "Lag features",
            "Rolling features",
            "Calendar features",
            "Leakage prevention",
            "Feature selection"
          ]
        },
        {
          "id": "08.3",
          "name": "Business & Workforce Analytics",
          "lessons": [
            "Driver analysis",
            "Segmentation",
            "Cohort analysis",
            "Productivity analysis",
            "Attrition analytics",
            "Demand drivers",
            "Scenario analytics",
            "Decision support"
          ]
        },
        {
          "id": "08.4",
          "name": "Visualization & Storytelling",
          "lessons": [
            "Analytical questions",
            "Chart grammar",
            "Small multiples",
            "Distribution visualization",
            "Uncertainty visualization",
            "Dashboard hierarchy",
            "Executive communication",
            "Narrative integrity"
          ]
        },
        {
          "id": "08.5",
          "name": "R for Statistics & Research",
          "lessons": [
            "R fundamentals",
            "Vectors and data frames",
            "Tidy data",
            "Statistical modeling",
            "Visualization",
            "Reproducible notebooks",
            "Package ecosystem",
            "Python/R interoperability"
          ]
        }
      ]
    },
    {
      "id": "09",
      "name": "Machine Learning & Time Series",
      "modules": [
        {
          "id": "09.1",
          "name": "ML Foundations",
          "lessons": [
            "Problem types",
            "Train validation test",
            "Bias and variance",
            "Overfitting",
            "Underfitting",
            "Baseline models",
            "Cross-validation",
            "Reproducibility"
          ]
        },
        {
          "id": "09.2",
          "name": "Supervised Learning",
          "lessons": [
            "Linear regression",
            "Logistic regression",
            "Decision trees",
            "Random forests",
            "Gradient boosting",
            "Nearest neighbors",
            "Support vector machines",
            "Model comparison"
          ]
        },
        {
          "id": "09.3",
          "name": "Unsupervised Learning",
          "lessons": [
            "Clustering",
            "k-means",
            "Hierarchical clustering",
            "Dimensionality reduction",
            "PCA",
            "Anomaly detection",
            "Cluster validation",
            "Workforce applications"
          ]
        },
        {
          "id": "09.4",
          "name": "Time-Series ML",
          "lessons": [
            "Lag features",
            "Rolling windows",
            "Direct forecasting",
            "Recursive forecasting",
            "Backtesting",
            "Temporal validation",
            "Feature leakage",
            "Model monitoring"
          ]
        },
        {
          "id": "09.5",
          "name": "Model Evaluation & Explainability",
          "lessons": [
            "Regression metrics",
            "Classification metrics",
            "Calibration",
            "Thresholds",
            "Confusion matrices",
            "Feature importance",
            "SHAP concepts",
            "Error analysis"
          ]
        },
        {
          "id": "09.6",
          "name": "Applied Workforce ML",
          "lessons": [
            "Volume prediction",
            "AHT prediction",
            "Absence prediction",
            "Attrition-risk modeling concepts",
            "Schedule-risk prediction",
            "Intraday anomaly detection",
            "Forecast ensembles",
            "Responsible model use"
          ]
        }
      ]
    },
    {
      "id": "10",
      "name": "Optimization & Operations Research",
      "modules": [
        {
          "id": "10.1",
          "name": "OR Foundations",
          "lessons": [
            "Decision variables",
            "Objectives",
            "Constraints",
            "Feasible regions",
            "Linear programming",
            "Integer programming",
            "Sensitivity analysis",
            "Optimization modeling"
          ]
        },
        {
          "id": "10.2",
          "name": "Scheduling Optimization",
          "lessons": [
            "Shift assignment",
            "Coverage constraints",
            "Break constraints",
            "Skill constraints",
            "Availability",
            "Preferences",
            "Fairness constraints",
            "Objective design"
          ]
        },
        {
          "id": "10.3",
          "name": "Advanced Optimization",
          "lessons": [
            "Mixed-integer programming",
            "Constraint programming",
            "Network flows",
            "Assignment problems",
            "Set covering",
            "Multi-objective optimization",
            "Decomposition concepts",
            "Solver behavior"
          ]
        },
        {
          "id": "10.4",
          "name": "Simulation",
          "lessons": [
            "Discrete-event simulation",
            "Monte Carlo",
            "Queue simulation",
            "Scenario generation",
            "Random seeds",
            "Confidence intervals",
            "Sensitivity analysis",
            "Simulation validation"
          ]
        },
        {
          "id": "10.5",
          "name": "Optimization Engineering",
          "lessons": [
            "OR-Tools",
            "SciPy optimization",
            "Pyomo concepts",
            "Model validation",
            "Infeasibility diagnosis",
            "Solver tuning",
            "Benchmarking",
            "Production optimization"
          ]
        }
      ]
    },
    {
      "id": "11",
      "name": "Generative AI, Agents & Automation",
      "modules": [
        {
          "id": "11.1",
          "name": "GenAI Foundations",
          "lessons": [
            "LLM fundamentals",
            "Tokens and context",
            "Embeddings",
            "Inference concepts",
            "Prompt structure",
            "Structured outputs",
            "Hallucination modes",
            "Model limitations"
          ]
        },
        {
          "id": "11.2",
          "name": "Prompt Engineering & Evaluation",
          "lessons": [
            "Instruction design",
            "Few-shot examples",
            "Reasoning task design",
            "Output schemas",
            "Prompt versioning",
            "Evaluation datasets",
            "Quality rubrics",
            "Regression testing"
          ]
        },
        {
          "id": "11.3",
          "name": "RAG",
          "lessons": [
            "Document ingestion",
            "Chunking",
            "Embeddings",
            "Vector search",
            "Metadata filtering",
            "Retrieval evaluation",
            "Grounding",
            "Citation strategies"
          ]
        },
        {
          "id": "11.4",
          "name": "Tool Calling & Agents",
          "lessons": [
            "Tool schemas",
            "Function calling",
            "Planning loops",
            "State",
            "Memory concepts",
            "Human approval",
            "Failure recovery",
            "Agent evaluation"
          ]
        },
        {
          "id": "11.5",
          "name": "Workforce AI Applications",
          "lessons": [
            "WFM copilot",
            "Forecast explanation",
            "Schedule assistant",
            "Analyst assistant",
            "SQL assistant",
            "Incident triage",
            "Automated reporting",
            "Knowledge assistant"
          ]
        },
        {
          "id": "11.6",
          "name": "AI Safety & Governance",
          "lessons": [
            "Prompt injection",
            "Data leakage",
            "Access control",
            "PII handling",
            "Audit trails",
            "Model risk",
            "Human-in-the-loop",
            "AI governance"
          ]
        }
      ]
    },
    {
      "id": "12",
      "name": "MLOps, Production, Governance & Engineering",
      "modules": [
        {
          "id": "12.1",
          "name": "Production Software",
          "lessons": [
            "Git workflows",
            "Code review",
            "CI/CD",
            "Testing strategy",
            "Linting and formatting",
            "Configuration management",
            "Observability",
            "Release management"
          ]
        },
        {
          "id": "12.2",
          "name": "MLOps",
          "lessons": [
            "Experiment tracking",
            "Model registry",
            "Data versioning",
            "Feature pipelines",
            "Deployment patterns",
            "Model monitoring",
            "Drift",
            "Rollback"
          ]
        },
        {
          "id": "12.3",
          "name": "Data & System Security",
          "lessons": [
            "Secrets management",
            "Least privilege",
            "Input validation",
            "Dependency security",
            "Threat modeling",
            "Secure APIs",
            "Audit logging",
            "Incident response"
          ]
        },
        {
          "id": "12.4",
          "name": "Reliability & Performance",
          "lessons": [
            "SLIs and SLOs",
            "Latency",
            "Throughput",
            "Caching",
            "Resource limits",
            "Fault tolerance",
            "Backpressure",
            "Capacity testing"
          ]
        },
        {
          "id": "12.5",
          "name": "Governance & Responsible Analytics",
          "lessons": [
            "Data governance",
            "Lineage",
            "Retention",
            "Access controls",
            "Model documentation",
            "Bias assessment",
            "Decision accountability",
            "Audit readiness"
          ]
        },
        {
          "id": "12.6",
          "name": "Portable Local-First Architecture",
          "lessons": [
            "Offline-first design",
            "Synthetic datasets",
            "Local execution",
            "Optional external connectors",
            "Environment portability",
            "Dependency minimization",
            "Reproducible builds",
            "Corporate-safe deployment"
          ]
        }
      ]
    },
    {
      "id": "13",
      "name": "Enterprise Workforce Intelligence Capstone",
      "modules": [
        {
          "id": "13.1",
          "name": "Discovery & Architecture",
          "lessons": [
            "Business problem definition",
            "Stakeholder mapping",
            "Requirements",
            "Architecture",
            "Data contracts",
            "Success metrics",
            "Risk register",
            "Delivery plan"
          ]
        },
        {
          "id": "13.2",
          "name": "Data Platform",
          "lessons": [
            "Synthetic workforce dataset",
            "Ingestion",
            "Validation",
            "Warehouse model",
            "Data quality",
            "Metric layer",
            "Data lineage",
            "Refresh orchestration"
          ]
        },
        {
          "id": "13.3",
          "name": "WFM Intelligence Engine",
          "lessons": [
            "Workload calculations",
            "Erlang staffing",
            "Forecasting",
            "Capacity planning",
            "Scheduling",
            "Intraday analytics",
            "Scenario engine",
            "Decision rules"
          ]
        },
        {
          "id": "13.4",
          "name": "Analytics & ML",
          "lessons": [
            "Executive dashboard",
            "Diagnostic analytics",
            "Forecast models",
            "Prediction models",
            "Model evaluation",
            "Explainability",
            "Monitoring",
            "Experimentation"
          ]
        },
        {
          "id": "13.5",
          "name": "Optimization & AI",
          "lessons": [
            "Schedule optimizer",
            "Scenario optimization",
            "AI mentor",
            "RAG knowledge base",
            "Tool calling",
            "Agent workflows",
            "Evaluation",
            "Human approval"
          ]
        },
        {
          "id": "13.6",
          "name": "Production Delivery",
          "lessons": [
            "Testing",
            "CI/CD",
            "Security review",
            "Performance testing",
            "Documentation",
            "User acceptance",
            "Release candidate",
            "Portfolio presentation"
          ]
        }
      ]
    }
  ]
};
