/* Workforce Intelligence Academy curriculum — focused four-track architecture. */
window.WI_CURRICULUM = {
  "version": "1.0.0",
  "title": "Workforce Intelligence Academy Curriculum",
  "status": "active",
  "principle": "Four focused professional tracks: WFM, Excel, Power BI and Python. Every lesson connects learning to practical workforce-intelligence work.",
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
      "id": "05",
      "name": "Excel for Workforce Intelligence",
      "modules": [
        {
          "id": "05.1",
          "name": "Excel Foundations",
          "lessons": [
            "Workbook architecture",
            "Worksheets, ranges and tables",
            "Cell references",
            "Number formats",
            "Formula evaluation",
            "Relative and absolute references",
            "Named ranges",
            "Workbook design standards"
          ]
        },
        {
          "id": "05.2",
          "name": "Core Formulas",
          "lessons": [
            "SUM, AVERAGE and aggregation",
            "COUNT and conditional counting",
            "IF and nested logic",
            "AND, OR and NOT",
            "ROUND and precision",
            "MIN, MAX and MEDIAN",
            "Text functions",
            "Error handling functions"
          ]
        },
        {
          "id": "05.3",
          "name": "Lookup & Reference",
          "lessons": [
            "XLOOKUP",
            "VLOOKUP and HLOOKUP",
            "INDEX and MATCH",
            "XMATCH",
            "Two-way lookups",
            "Approximate matching",
            "Multiple-criteria lookup",
            "Lookup error strategy"
          ]
        },
        {
          "id": "05.4",
          "name": "Dates & Time",
          "lessons": [
            "Excel date serials",
            "TODAY and NOW",
            "DATE construction",
            "YEAR, MONTH and DAY",
            "WORKDAY and NETWORKDAYS",
            "EOMONTH and calendar logic",
            "Time intervals",
            "WFM date-time calculations"
          ]
        },
        {
          "id": "05.5",
          "name": "Text & Data Cleaning",
          "lessons": [
            "Text extraction",
            "TRIM and CLEAN",
            "SUBSTITUTE and REPLACE",
            "Case conversion",
            "Text-to-columns",
            "Pattern detection",
            "Duplicate handling",
            "Cleaning operational exports"
          ]
        },
        {
          "id": "05.6",
          "name": "Conditional Logic",
          "lessons": [
            "Nested IF design",
            "IFS",
            "SWITCH",
            "Conditional aggregation",
            "SUMIFS",
            "COUNTIFS",
            "AVERAGEIFS",
            "Decision-rule modelling"
          ]
        },
        {
          "id": "05.7",
          "name": "Dynamic Arrays",
          "lessons": [
            "Spill behavior",
            "FILTER",
            "SORT and SORTBY",
            "UNIQUE",
            "SEQUENCE",
            "Dynamic ranges",
            "Combining array functions",
            "Dynamic WFM reporting"
          ]
        },
        {
          "id": "05.8",
          "name": "Excel Tables",
          "lessons": [
            "Structured references",
            "Calculated columns",
            "Table expansion",
            "Table totals",
            "Table-based formulas",
            "Data validation with tables",
            "Table design for refresh",
            "Operational data models"
          ]
        },
        {
          "id": "05.9",
          "name": "PivotTables",
          "lessons": [
            "PivotTable architecture",
            "Rows, columns and values",
            "Grouping dates",
            "Calculated fields",
            "Show values as",
            "Slicers",
            "PivotCharts",
            "WFM KPI Pivot models"
          ]
        },
        {
          "id": "05.10",
          "name": "Advanced Excel Analytics",
          "lessons": [
            "Variance analysis",
            "Contribution analysis",
            "Pareto analysis",
            "Cohort-style summaries",
            "Weighted averages",
            "Rolling calculations",
            "Sensitivity tables",
            "Analytical model review"
          ]
        },
        {
          "id": "05.11",
          "name": "What-If Analysis",
          "lessons": [
            "Goal Seek",
            "Scenario Manager",
            "Data Tables",
            "Solver introduction",
            "Parameter cells",
            "Sensitivity analysis",
            "Capacity scenarios",
            "WFM decision modelling"
          ]
        },
        {
          "id": "05.12",
          "name": "Power Query Basics",
          "lessons": [
            "Power Query architecture",
            "Connecting to CSV",
            "Connecting to Excel",
            "Data types",
            "Column transformations",
            "Filtering and sorting",
            "Replacing values",
            "Query naming standards"
          ]
        },
        {
          "id": "05.13",
          "name": "Power Query Transformation",
          "lessons": [
            "Merge queries",
            "Append queries",
            "Group By",
            "Pivot and unpivot",
            "Fill and split",
            "Conditional columns",
            "Custom columns",
            "Transformation sequencing"
          ]
        },
        {
          "id": "05.14",
          "name": "Power Query Advanced",
          "lessons": [
            "Parameters",
            "Functions",
            "Reusable transformations",
            "M language basics",
            "Query dependencies",
            "Error handling",
            "Performance considerations",
            "Refresh troubleshooting"
          ]
        },
        {
          "id": "05.15",
          "name": "Power Pivot & Data Models",
          "lessons": [
            "Data model concepts",
            "Fact tables",
            "Dimension tables",
            "Relationships",
            "Keys",
            "Granularity",
            "Date dimensions",
            "Model validation"
          ]
        },
        {
          "id": "05.16",
          "name": "DAX Foundations",
          "lessons": [
            "Measures versus columns",
            "CALCULATE",
            "Filter context",
            "Row context",
            "Basic aggregations",
            "DIVIDE",
            "Variables",
            "Measure naming standards"
          ]
        },
        {
          "id": "05.17",
          "name": "DAX Analytics",
          "lessons": [
            "CALCULATE patterns",
            "FILTER",
            "Iterators",
            "Time intelligence",
            "Rolling metrics",
            "Year-to-date analysis",
            "Period comparisons",
            "Context transition"
          ]
        },
        {
          "id": "05.18",
          "name": "WFM Excel Solutions",
          "lessons": [
            "Forecast workbook",
            "Staffing calculator",
            "Shrinkage model",
            "Schedule coverage model",
            "Adherence tracker",
            "Intraday tracker",
            "SLA analysis",
            "Executive WFM workbook"
          ]
        },
        {
          "id": "05.19",
          "name": "Excel Automation & Quality",
          "lessons": [
            "Reusable templates",
            "Formula auditing",
            "Data validation controls",
            "Protection strategy",
            "Refresh controls",
            "Error checks",
            "Documentation",
            "Version management"
          ]
        },
        {
          "id": "05.20",
          "name": "Excel Capstone",
          "lessons": [
            "Design an operational dataset",
            "Build the calculation layer",
            "Build the analytical layer",
            "Build a WFM model",
            "Validate outputs",
            "Create management views",
            "Document assumptions",
            "Present the final solution"
          ]
        }
      ]
    },
    {
      "id": "08",
      "name": "Power BI for Workforce Intelligence",
      "modules": [
        {
          "id": "08.1",
          "name": "Power BI Foundations",
          "lessons": [
            "What Power BI does",
            "Desktop, Service and Mobile",
            "Report versus dashboard",
            "Workspace concepts",
            "PBIX architecture",
            "Import versus DirectQuery",
            "Semantic model basics",
            "End-to-end workflow"
          ]
        },
        {
          "id": "08.2",
          "name": "Data Connection",
          "lessons": [
            "Connect to Excel",
            "Connect to CSV",
            "Connect to databases",
            "Connect to web sources",
            "Data source credentials",
            "Import settings",
            "Refresh implications",
            "Source governance"
          ]
        },
        {
          "id": "08.3",
          "name": "Power Query in Power BI",
          "lessons": [
            "Power Query interface",
            "Data types",
            "Column transformations",
            "Filtering",
            "Merging",
            "Appending",
            "Pivot and unpivot",
            "Query dependencies"
          ]
        },
        {
          "id": "08.4",
          "name": "Power Query Advanced",
          "lessons": [
            "Parameters",
            "Custom functions",
            "M language fundamentals",
            "Conditional logic",
            "Error handling",
            "Query folding",
            "Performance tuning",
            "Reusable ingestion patterns"
          ]
        },
        {
          "id": "08.5",
          "name": "Data Modeling",
          "lessons": [
            "Star schema",
            "Fact and dimension tables",
            "Relationships",
            "Cardinality",
            "Filter direction",
            "Keys",
            "Granularity",
            "Model validation"
          ]
        },
        {
          "id": "08.6",
          "name": "Date & Calendar Modeling",
          "lessons": [
            "Date table principles",
            "Calendar attributes",
            "Fiscal calendars",
            "Week logic",
            "Working days",
            "Holiday tables",
            "Relative periods",
            "Date model validation"
          ]
        },
        {
          "id": "08.7",
          "name": "DAX Foundations",
          "lessons": [
            "Measures and calculated columns",
            "Basic aggregations",
            "CALCULATE",
            "Filter context",
            "Row context",
            "DIVIDE",
            "Variables",
            "Measure organization"
          ]
        },
        {
          "id": "08.8",
          "name": "DAX Context",
          "lessons": [
            "Context transition",
            "FILTER",
            "ALL",
            "REMOVEFILTERS",
            "KEEPFILTERS",
            "VALUES",
            "SELECTEDVALUE",
            "Context debugging"
          ]
        },
        {
          "id": "08.9",
          "name": "Time Intelligence",
          "lessons": [
            "YTD",
            "MTD",
            "QTD",
            "Previous period",
            "Same period last year",
            "Rolling periods",
            "Period-over-period change",
            "Custom fiscal periods"
          ]
        },
        {
          "id": "08.10",
          "name": "Advanced DAX",
          "lessons": [
            "Iterators",
            "SUMX",
            "AVERAGEX",
            "RANKX",
            "TOPN",
            "Virtual tables",
            "Calculation patterns",
            "Performance-aware DAX"
          ]
        },
        {
          "id": "08.11",
          "name": "KPI Architecture",
          "lessons": [
            "KPI definitions",
            "Targets and thresholds",
            "Variance measures",
            "SLA measures",
            "AHT measures",
            "Forecast accuracy measures",
            "Adherence measures",
            "Metric governance"
          ]
        },
        {
          "id": "08.12",
          "name": "Report Design",
          "lessons": [
            "Visual hierarchy",
            "Page composition",
            "Chart selection",
            "Tables and matrices",
            "Cards and KPI visuals",
            "Conditional formatting",
            "Tooltips",
            "Interaction design"
          ]
        },
        {
          "id": "08.13",
          "name": "Drill & Exploration",
          "lessons": [
            "Drill-through",
            "Bookmarks",
            "Buttons",
            "Page navigation",
            "Report tooltips",
            "Cross-filtering",
            "Sync slicers",
            "Exploration workflows"
          ]
        },
        {
          "id": "08.14",
          "name": "WFM Dashboards",
          "lessons": [
            "Forecast dashboard",
            "Staffing dashboard",
            "Schedule dashboard",
            "Adherence dashboard",
            "Intraday dashboard",
            "SLA dashboard",
            "Executive dashboard",
            "WFM command-center layout"
          ]
        },
        {
          "id": "08.15",
          "name": "Advanced Analytics",
          "lessons": [
            "Variance decomposition",
            "Trend analysis",
            "Distribution views",
            "Pareto analysis",
            "Segmentation",
            "What-if parameters",
            "Scenario analysis",
            "Analytical storytelling"
          ]
        },
        {
          "id": "08.16",
          "name": "Security & Governance",
          "lessons": [
            "Row-level security",
            "Roles",
            "Workspace permissions",
            "Sensitivity labels",
            "Data ownership",
            "Certified semantic models",
            "Deployment governance",
            "Audit considerations"
          ]
        },
        {
          "id": "08.17",
          "name": "Publishing & Refresh",
          "lessons": [
            "Publishing reports",
            "Workspaces",
            "Semantic model refresh",
            "Gateway concepts",
            "Refresh failures",
            "Incremental refresh",
            "Deployment pipelines",
            "Release management"
          ]
        },
        {
          "id": "08.18",
          "name": "Performance Optimization",
          "lessons": [
            "Model size",
            "Cardinality",
            "Relationship performance",
            "DAX performance",
            "Visual query load",
            "Performance Analyzer",
            "Aggregation concepts",
            "Optimization workflow"
          ]
        },
        {
          "id": "08.19",
          "name": "Power BI Automation",
          "lessons": [
            "Power BI REST concepts",
            "Dataset refresh automation",
            "Deployment automation",
            "Metadata concepts",
            "Monitoring refreshes",
            "Operational alerts",
            "Export workflows",
            "Automation controls"
          ]
        },
        {
          "id": "08.20",
          "name": "Power BI Capstone",
          "lessons": [
            "Design the source model",
            "Build Power Query layer",
            "Build semantic model",
            "Create DAX measures",
            "Build WFM report",
            "Validate KPIs",
            "Publish and govern",
            "Present executive insight"
          ]
        }
      ]
    },
    {
      "id": "07",
      "name": "Python for Workforce Intelligence",
      "modules": [
        {
          "id": "07.1",
          "name": "Python Foundations",
          "lessons": [
            "Python runtime and scripts",
            "Variables and types",
            "Operators",
            "Input and output",
            "Control flow",
            "Functions",
            "Scope",
            "Writing readable Python"
          ]
        },
        {
          "id": "07.2",
          "name": "Collections",
          "lessons": [
            "Lists",
            "Tuples",
            "Dictionaries",
            "Sets",
            "Nested structures",
            "Comprehensions",
            "Sorting and custom keys",
            "Collection patterns for WFM"
          ]
        },
        {
          "id": "07.3",
          "name": "Functions & Modules",
          "lessons": [
            "Function design",
            "Arguments and defaults",
            "Return values",
            "Lambda functions",
            "Modules",
            "Imports",
            "Reusable utilities",
            "Package organization"
          ]
        },
        {
          "id": "07.4",
          "name": "Exceptions & Files",
          "lessons": [
            "Exceptions",
            "Try/except design",
            "Custom exceptions",
            "Text files",
            "CSV files",
            "JSON files",
            "Path handling",
            "Safe file workflows"
          ]
        },
        {
          "id": "07.5",
          "name": "Python Software Engineering",
          "lessons": [
            "Virtual environments",
            "Project structure",
            "Configuration",
            "Environment variables",
            "Type hints",
            "Docstrings",
            "Logging",
            "Code quality"
          ]
        },
        {
          "id": "07.6",
          "name": "Testing",
          "lessons": [
            "Why test analytics code",
            "Assertions",
            "Unit tests",
            "Fixtures",
            "Test data",
            "Edge cases",
            "Regression testing",
            "Testing data pipelines"
          ]
        },
        {
          "id": "07.7",
          "name": "NumPy",
          "lessons": [
            "Arrays",
            "Shapes and dimensions",
            "Indexing",
            "Vectorization",
            "Broadcasting",
            "Aggregation",
            "Numerical operations",
            "Performance basics"
          ]
        },
        {
          "id": "07.8",
          "name": "pandas Foundations",
          "lessons": [
            "Series",
            "DataFrames",
            "Reading data",
            "Selecting data",
            "Filtering",
            "Sorting",
            "Missing values",
            "Data types"
          ]
        },
        {
          "id": "07.9",
          "name": "pandas Transformation",
          "lessons": [
            "Assigning columns",
            "String operations",
            "Datetime operations",
            "Groupby",
            "Aggregation",
            "Merge",
            "Join",
            "Concatenation"
          ]
        },
        {
          "id": "07.10",
          "name": "pandas Advanced",
          "lessons": [
            "Pivot tables",
            "Melt",
            "Reshape",
            "Window calculations",
            "Rolling metrics",
            "MultiIndex",
            "Categorical data",
            "Efficient transformations"
          ]
        },
        {
          "id": "07.11",
          "name": "Time-Series Analytics",
          "lessons": [
            "Datetime indexing",
            "Resampling",
            "Frequency conversion",
            "Lag features",
            "Rolling windows",
            "Intraday profiles",
            "Time-zone handling",
            "WFM time-series datasets"
          ]
        },
        {
          "id": "07.12",
          "name": "Data Quality",
          "lessons": [
            "Profiling",
            "Completeness",
            "Uniqueness",
            "Validity",
            "Consistency",
            "Outlier checks",
            "Reconciliation",
            "Quality reports"
          ]
        },
        {
          "id": "07.13",
          "name": "Visualization",
          "lessons": [
            "Matplotlib foundations",
            "Line charts",
            "Bar charts",
            "Histograms",
            "Scatter plots",
            "Distribution analysis",
            "Time-series visualization",
            "Executive analytical charts"
          ]
        },
        {
          "id": "07.14",
          "name": "Statistics with Python",
          "lessons": [
            "Descriptive statistics",
            "Probability concepts",
            "Sampling",
            "Confidence intervals",
            "Correlation",
            "Regression",
            "Hypothesis testing",
            "Statistical interpretation"
          ]
        },
        {
          "id": "07.15",
          "name": "Forecasting with Python",
          "lessons": [
            "Baseline forecasts",
            "Moving averages",
            "Exponential smoothing",
            "Forecast features",
            "Backtesting",
            "Forecast metrics",
            "Forecast bias",
            "Forecast comparison"
          ]
        },
        {
          "id": "07.16",
          "name": "Data Engineering",
          "lessons": [
            "ETL concepts",
            "Pipeline stages",
            "Schema management",
            "Parquet",
            "Partitioning",
            "Incremental processing",
            "Data validation",
            "Pipeline monitoring"
          ]
        },
        {
          "id": "07.17",
          "name": "APIs & Automation",
          "lessons": [
            "HTTP fundamentals",
            "REST APIs",
            "Requests",
            "Authentication concepts",
            "Pagination",
            "Retries",
            "Rate limits",
            "API data ingestion"
          ]
        },
        {
          "id": "07.18",
          "name": "WFM Automation",
          "lessons": [
            "Automated WFM data preparation",
            "Daily KPI pipeline",
            "Forecast pipeline",
            "Staffing calculation automation",
            "Adherence automation",
            "Intraday alert logic",
            "Report generation",
            "Operational scheduling"
          ]
        },
        {
          "id": "07.19",
          "name": "Production Python",
          "lessons": [
            "Configuration management",
            "Structured logging",
            "Secrets handling",
            "CLI applications",
            "Packaging",
            "Dependency pinning",
            "Monitoring",
            "Deployment patterns"
          ]
        },
        {
          "id": "07.20",
          "name": "Python Capstone",
          "lessons": [
            "Build the data pipeline",
            "Validate source data",
            "Create WFM analytics",
            "Build forecast workflow",
            "Automate calculations",
            "Generate outputs",
            "Test the solution",
            "Present the final system"
          ]
        }
      ]
    }
  ]
};
