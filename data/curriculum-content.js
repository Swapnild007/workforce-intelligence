/* Research-backed lesson content layer for the four-track Academy.
   Sources:
   WFM: Call Centre Helper WFM reference/training material.
   Excel: Microsoft Support for Excel, Power Query, Power Pivot and DAX.
   Power BI: Microsoft Learn Power BI learning paths and semantic-model/DAX guidance.
   Python: Python 3.14 official tutorial.
   The lesson generator is deliberately conservative: where organisations use different
   definitions or operating rules, the lesson tells the learner to verify the local definition. */

(function(){
  const sourceMap = {
    "02": [
      {label:"Call Centre Helper — Workforce Management Reference Guide", url:"https://www.callcentrehelper.com/workforce-management-reference-guide-57260.htm"},
      {label:"Call Centre Helper — WFM in BPO", url:"https://www.callcentrehelper.com/what-is-workforce-management-57249.htm"}
    ],
    "05": [
      {label:"Microsoft Support — Excel / Power Query / PivotTables / Power Pivot", url:"https://support.microsoft.com/en-us/excel"},
      {label:"Microsoft Support — DAX in Power Pivot", url:"https://support.microsoft.com/en-us/excel/data-analysis-expressions-dax-in-power-pivot"}
    ],
    "08": [
      {label:"Microsoft Learn — Prepare data for Power BI", url:"https://learn.microsoft.com/en-us/training/paths/prepare-data-power-bi/"},
      {label:"Microsoft Learn — Model data with Power BI", url:"https://learn.microsoft.com/en-us/training/paths/model-power-bi/"},
      {label:"Microsoft Learn — DAX in semantic models", url:"https://learn.microsoft.com/en-us/training/paths/dax-power-bi/"}
    ],
    "07": [
      {label:"Python 3.14 Documentation — The Python Tutorial", url:"https://docs.python.org/3/tutorial/index.html"},
      {label:"Python 3.14 Documentation — Errors and Exceptions", url:"https://docs.python.org/3/tutorial/errors.html"}
    ]
  };

  const domainFrames = {
    "02": "WFM is the discipline of matching expected workload and service objectives with available capacity over time. Treat every metric as a defined operational measurement, not just a number.",
    "05": "Excel is used here as an analytical tool: structure the data, make calculations auditable, transform repeatably, model relationships when needed, and present a decision-ready result.",
    "08": "Power BI separates data preparation, semantic modelling, calculations and report interaction. Good reports begin with trustworthy data and a coherent model, not with visual formatting.",
    "07": "Python is taught as a practical analytical programming language. Learn the language first, then use it to load, validate, transform, analyse and automate workforce data."
  };

  const commonMistakes = {
    "02": [
      "Mixing units or time grains without explicitly converting them.",
      "Using a KPI without checking its numerator, denominator and local definition.",
      "Treating an average as if it describes every interval.",
      "Changing an assumption without recording the impact on the downstream plan."
    ],
    "05": [
      "Hard-coding values that should be driven by a cell, table or parameter.",
      "Using inconsistent data types or hidden whitespace in operational exports.",
      "Building formulas before deciding the required grain and business rule.",
      "Overwriting source data instead of keeping a repeatable transformation path."
    ],
    "08": [
      "Building visuals before confirming the model grain and relationships.",
      "Using a calculated column where a measure is required, or vice versa.",
      "Allowing ambiguous relationships or duplicate keys to drive incorrect totals.",
      "Treating refresh, security and performance as afterthoughts."
    ],
    "07": [
      "Skipping data validation because the code runs without a syntax error.",
      "Writing one large script instead of separating reusable functions and responsibilities.",
      "Ignoring data types, missing values, duplicate rows or time-zone assumptions.",
      "Handling exceptions by hiding errors rather than making failures diagnosable."
    ]
  };

  function clean(s){ return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }

  function focusFor(domain, module, lesson){
    const t = lesson.toLowerCase();
    if(domain==="02"){
      if(/service level|asa|abandon|offered|handled|aht|occupancy|utilization|adherence|conformance|shrinkage|fte|staffing|erlang/.test(t))
        return "Define the metric first, write the unit and denominator, then connect the result to the staffing or service decision it is meant to support.";
      if(/forecast|trend|seasonality|moving|smoothing|holt|arima|regression|accuracy|bias|error|tracking/.test(t))
        return "Separate demand history, forecast method, assumptions and forecast error. A forecast is a planning input, not a promise that the future will equal the estimate.";
      if(/schedule|shift|break|coverage|multi-skilled|intraday|real-time|queue|capacity/.test(t))
        return "Work at interval level whenever the decision is interval-sensitive. Compare requirement, scheduled capacity and actual state before choosing an intervention.";
      return "Start with the operational question, establish definitions and grain, identify constraints, then calculate and interpret the result.";
    }
    if(domain==="05"){
      if(/lookup|xlookup|vlookup|index|match/.test(t)) return "A lookup is a relationship between a search key and a return value. Validate key uniqueness, data type and missing-match behaviour before trusting the result.";
      if(/date|time|workday|networkdays|calendar/.test(t)) return "Excel stores dates and times as numeric values. Make the intended grain explicit before calculating elapsed time, working time or interval labels.";
      if(/power query|merge|append|pivot|unpivot|m language|refresh/.test(t)) return "Power Query should be treated as a repeatable transformation pipeline: connect, profile, transform, validate, then load.";
      if(/pivot|power pivot|dax|measure|relationship|fact|dimension|model/.test(t)) return "Model the data at a clear grain and separate stored attributes from calculations. A good model makes downstream analysis simpler and more reliable.";
      if(/what-if|solver|sensitivity|scenario/.test(t)) return "A scenario model changes explicit assumptions and measures the resulting output. Keep assumptions separate from formulas so the model remains auditable.";
      return "Build the smallest correct workbook first, then add structure, controls and analysis. Every important output should be traceable to its source and rule.";
    }
    if(domain==="08"){
      if(/power query|transform|merge|append|pivot|unpivot|data type|refresh/.test(t)) return "Prepare data before visual design. Profile columns, correct data types, remove unnecessary complexity and preserve a clear transformation sequence.";
      if(/model|relationship|fact|dimension|calendar|semantic|granularity/.test(t)) return "The semantic model defines how fields relate and how calculations evaluate. Confirm grain, keys, cardinality and filter direction before building measures.";
      if(/dax|calculate|context|iterator|time intelligence|measure/.test(t)) return "DAX calculations depend on model context. Learn the difference between row context, filter context and context transition before using advanced patterns.";
      if(/report|visual|drill|tooltip|dashboard|kpi/.test(t)) return "A report should answer a decision question. Use hierarchy, interaction and visual encoding to move from status to diagnosis without hiding the underlying definition.";
      if(/security|governance|publish|refresh|performance|automation/.test(t)) return "A production report is more than a PBIX file: ownership, refresh, permissions, model size, performance and change control all affect reliability.";
      return "Follow the Power BI workflow: connect, prepare, model, calculate, visualise, validate, publish and maintain.";
    }
    if(domain==="07"){
      if(/collection|list|tuple|set|dictionary|loop|condition/.test(t)) return "Learn the data structure and its operations first. Then choose the structure that matches the problem rather than forcing every problem into a list.";
      if(/function|module|package|software engineering|testing/.test(t)) return "Good Python code separates responsibilities, exposes clear inputs and outputs, and can be tested independently.";
      if(/file|json|csv|api|automation|data engineering/.test(t)) return "Treat external data as untrusted input: validate structure, types, encoding, missing values and failure modes before using it in calculations.";
      if(/numpy|pandas|time-series|statistics|forecast|visualization/.test(t)) return "The analytical workflow is load → inspect → clean → transform → calculate → validate → communicate. Do not skip validation simply because a library returned a result.";
      if(/exception|error/.test(t)) return "Distinguish syntax errors from runtime exceptions and handle only failures you can meaningfully recover from. Preserve diagnostic information.";
      return "Learn the Python construct, practise it on a small example, then apply it to a realistic workforce-data task.";
    }
  }

  function lessonSpecific(domain, module, lesson){
    const t=lesson.toLowerCase();
    const out={notes:[],highlights:[],qa:[],practice:"",workedExample:"",assessment:""};
    if(domain==="02"){
      if(t.includes("service level")){
        out.notes=["Write the organisation's exact service-level definition before calculating it.","State the answer threshold and the eligible contact population.","Do not assume that two platforms with the same label use identical inclusion rules."];
        out.highlights=["Service level is definition-dependent.","A daily percentage can hide interval failures.","Reconcile the source counts before reporting the KPI."];
        out.qa=[["Why can two systems show different SLA values?","They may use different eligible populations, thresholds, exclusions or calculation rules."],["Why is interval analysis important?","Because staffing and customer waiting are time-dependent; a daily average can conceal periods of poor service."]];
        out.practice="Take one day of interval data and document the SLA numerator, denominator, threshold and exclusions before calculating the percentage.";
        out.workedExample="If 900 contacts are in the eligible denominator and 810 are answered within the defined threshold, the resulting service level is 810 ÷ 900 = 90%. The lesson is to verify that both counts use the same population.";
      } else if(t.includes("aht")){
        out.notes=["AHT is commonly decomposed into talk/handling and after-contact work, but the exact components depend on the platform definition.","Keep seconds and minutes consistent.","AHT changes workload even when contact volume is unchanged."];
        out.highlights=["Workload is driven by both volume and handling time.","AHT is an average; inspect its distribution when possible.","Never mix platform AHT definitions in one trend line without reconciliation."];
        out.qa=[["What happens to workload when AHT rises?","For the same volume, required handling time rises, increasing workload and potentially staffing need."],["Should AHT be reduced at any cost?","No. A lower AHT is only useful when it does not damage quality, resolution or customer outcomes."]];
        out.practice="Calculate workload for 600 contacts at 300 seconds AHT, then recalculate it at 330 seconds and quantify the change.";
        out.workedExample="600 × 300 seconds = 180,000 seconds = 3,000 minutes = 50 workload hours before occupancy, shrinkage or queueing effects.";
      } else if(t.includes("shrinkage")){
        out.notes=["Separate planned and unplanned shrinkage where the operation can measure them.","Clarify whether the rate is applied to paid hours, scheduled hours or another defined base.","Use a documented assumption rather than silently embedding a percentage in a formula."];
        out.highlights=["Shrinkage reduces deployable capacity.","Small assumption changes can materially change FTE requirements.","Actual shrinkage should be compared with the planning assumption."];
        out.qa=[["Why is shrinkage not simply absenteeism?","Shrinkage can include multiple unavailable or non-production activities; absenteeism is only one component."],["Why document the denominator?","Because the same percentage can produce different capacity results if applied to different bases."]];
        out.practice="Build a shrinkage bridge showing paid hours → planned offline → unplanned absence → productive hours.";
        out.workedExample="If 100 paid hours are available and the defined shrinkage assumption is 25%, planned productive capacity is 75 hours before any additional operational constraints.";
      } else if(t.includes("erlang")){
        out.notes=["Erlang models are queueing approximations, not universal replacements for operational judgement.","Erlang C assumes no abandonment and therefore can overstate waiting behaviour when abandonment is material.","Use Erlang A or simulation when abandonment and patience behaviour matter."];
        out.highlights=["Traffic intensity is workload expressed in Erlangs.","Queueing results depend on assumptions.","Always state the model and assumptions used."];
        out.qa=[["Why does an Erlang result change with interval length?","Arrival rate and service time are tied to the observation period; changing the period changes the input traffic intensity."],["Why can real operations differ from Erlang C?","Real centres have abandonment, non-stationary arrivals, skill routing, breaks, shrinkage and other effects that may violate model assumptions."]];
        out.practice="For a fixed volume and AHT, calculate workload in Erlangs for two different interval lengths and explain why the result changes.";
        out.workedExample="Traffic intensity is workload time divided by interval duration. 30 calls in 30 minutes with 5-minute AHT produce 150 handling minutes ÷ 30 minutes = 5 Erlangs.";
      } else if(/forecast|moving average|smoothing|holt|arima|regression|trend|seasonality/.test(t)){
        out.notes=["Keep forecast grain aligned with the planning decision.","Separate baseline history from event adjustments.","Backtest methods on historical periods rather than selecting a method only because it fits one chart."];
        out.highlights=["Forecasts should be reproducible.","Error must be measured on unseen periods.","Business events may require explicit overrides or causal inputs."];
        out.qa=[["Why backtest?","To estimate how the method behaves on data that was not used to fit or choose it."],["Is the most complex model always best?","No. Complexity should be justified by measurable improvement, stability and operational usefulness."]];
        out.practice="Create a simple baseline forecast, hold out the latest periods, calculate error, then compare with a second method.";
        out.workedExample="A naive forecast can use the previous comparable period as the next estimate. It is a valid baseline because more complex methods should demonstrate improvement against it.";
      } else if(/schedule|shift|break|coverage/.test(t)){
        out.notes=["Start from interval staffing requirements, then map them to feasible shifts.","Break placement must respect policy and coverage requirements.","Measure schedule inefficiency as excess or misplaced capacity, not simply as a visual preference."];
        out.highlights=["A schedule is a constrained coverage plan.","A mathematically adequate total headcount can still fail interval coverage.","Agent preferences and labour rules are constraints, not decoration."];
        out.qa=[["Why is total daily staffing insufficient?","Service objectives are time-sensitive, so the operation needs the right capacity when demand arrives."],["What makes a schedule inefficient?","Capacity may exist but be positioned in the wrong intervals, skills or channels."]];
        out.practice="Overlay a simple interval requirement curve with shift coverage and identify under-covered and over-covered periods.";
        out.workedExample="If requirement is 20 agents from 10:00–11:00 and the schedule supplies 17, the interval has a 3-agent shortfall even if the daily headcount is adequate.";
      } else {
        out.notes=["Define the operational question and the grain.","List required inputs and assumptions before calculating.","Reconcile source data before interpreting the output.","Record the rule used so another analyst can reproduce the result."];
        out.highlights=["Definition precedes calculation.","Granularity matters.","A correct formula can still support a poor decision if assumptions are wrong."];
        out.qa=[["What should be checked first?","Definition, unit, grain, source and business rule."],["What is a common failure mode?","Producing a precise number from inconsistent or poorly defined inputs."]];
        out.practice="Write a one-page calculation specification for the lesson topic: definition, inputs, formula/process, exclusions, validation and decision use.";
        out.workedExample="Use a small three-interval dataset and show the input, transformation and final decision rather than reporting only the final number.";
      }
    } else if(domain==="05"){
      if(t.includes("sumifs")) {
        out.notes=["SUMIFS adds values from a sum range when multiple criteria are satisfied.","Criteria ranges must align with the sum range.","Keep criteria logic readable; helper columns can be preferable to deeply nested formulas."];
        out.highlights=["Criteria are evaluated against corresponding rows.","Data type mismatches can produce unexpected results.","Use structured references when working with Excel Tables."];
        out.qa=[["What is SUMIFS useful for in WFM?","Filtering operational measures by date, LOB, skill, interval or other dimensions while aggregating a numeric field."],["What must align?","The dimensions of the criteria ranges and the sum range must correspond."]];
        out.practice='Build a SUMIFS that returns handled contacts for one LOB and one date from an interval table.';
        out.workedExample='=SUMIFS(Handled,LOB,"CountyCare",Date,A2) aggregates the rows matching both conditions when the named ranges/columns are correctly defined.';
      } else if(/xlookup|vlookup|index|match/.test(t)){
        out.notes=["Choose a key that represents the intended relationship.","Test whether the key is unique on the lookup side.","Decide what should happen when no match exists."];
        out.highlights=["Lookup correctness depends on key quality.","Approximate matching requires sorted/appropriate data and an explicit reason.","Returning a blank can hide data-quality problems."];
        out.qa=[["Why can a lookup return the wrong agent?","Duplicate or malformed keys can make the relationship ambiguous or match an unintended record."],["What should a missing match mean?","It should be an explicit exception to investigate unless a missing value is genuinely expected."]];
        out.practice="Create an employee-to-skill mapping and deliberately introduce one missing and one duplicate key; explain the results.";
        out.workedExample="Use a unique EmployeeID as the lookup key and return the assigned LOB. Validate uniqueness before using the result in a staffing calculation.";
      } else if(/power query|merge|append|unpivot|pivot|m language/.test(t)){
        out.notes=["Profile source columns before transforming.","Prefer deterministic steps that can refresh against the next export.","Keep source, transformation and output responsibilities separate."];
        out.highlights=["Merge joins tables on keys; append stacks rows.","Unpivot converts repeated period columns into attribute-value rows.","Step order affects the final result and refresh cost."];
        out.qa=[["When should you merge?","When you need to bring attributes or measures from one table into another using a relationship key."],["When should you append?","When multiple tables have the same logical columns and should become one longer table."]];
        out.practice="Take two monthly operational exports, append them, standardise data types, remove duplicates and load the result.";
        out.workedExample="January and February tables with the same columns should normally be appended; an employee master table should usually be merged by EmployeeID when adding attributes.";
      } else if(/pivot|power pivot|dax|measure|relationship|fact|dimension|model/.test(t)){
        out.notes=["Define table grain before creating relationships.","Use dimensions for descriptive slicing and facts for events/measures.","Prefer measures for context-dependent analytical results."];
        out.highlights=["Relationships are part of the calculation logic.","A duplicate key on a supposed one-side relationship is a data-quality problem.","DAX operates over model tables rather than ordinary worksheet cell references."];
        out.qa=[["Why does grain matter?","If one row represents an interval while another represents an agent-day, joining them without care can multiply values."],["Why use a measure?","A measure evaluates in the current filter context, making it suitable for dynamic reporting."]];
        out.practice="Sketch a star-style WFM model with Date, LOB, Agent and Interval dimensions plus a fact table of operational observations.";
        out.workedExample="A fact table at interval × LOB grain should not be joined directly to an agent-level table unless the relationship reflects a valid key and grain.";
      } else {
        out.notes=["Start with the data structure, not the formatting.","Use explicit assumptions and named inputs for important business rules.","Test the model with small known examples before scaling it."];
        out.highlights=["Traceability is part of spreadsheet quality.","A refreshable model is more reliable than repeated manual copy/paste.","Keep raw inputs separate from calculation and presentation layers."];
        out.qa=[["What makes a workbook auditable?","Clear inputs, formulas, assumptions, checks and a readable calculation path."],["What should be automated first?","Repeatable, high-volume transformations and checks that have stable rules."]];
        out.practice="Build the lesson concept on a small WFM dataset and add at least two validation checks.";
        out.workedExample="Create a small interval table, calculate one KPI, validate it against a manually computed row, then expand the model.";
      }
    } else if(domain==="08"){
      if(/power query|transform|merge|append|unpivot|data type|refresh/.test(t)){
        out.notes=["Power Query is used to extract and transform data before it enters the model.","Profile columns and set appropriate data types early.","Keep transformation steps readable and testable."];
        out.highlights=["Preparation reduces downstream model complexity.","Import and query design affect refresh and performance.","A successful refresh does not prove the business logic is correct."];
        out.qa=[["Why set data types deliberately?","Types affect sorting, calculations, joins and interpretation."],["What should be validated after refresh?","Row counts, key uniqueness, date coverage, totals and important business rules."]];
        out.practice="Load a CSV of interval WFM data, profile it, correct types, remove a known duplicate and document the transformation.";
        out.workedExample="After loading a CSV, compare source row count with transformed row count and explain every intentional difference.";
      } else if(/relationship|fact|dimension|calendar|semantic|granularity|model/.test(t)){
        out.notes=["Choose a grain for each table.","Use stable keys for relationships.","Validate cardinality and filter direction rather than accepting defaults blindly."];
        out.highlights=["A semantic model is the analytical contract between data and report.","Ambiguous relationships can produce incorrect totals.","Date dimensions are foundational for consistent time analysis."];
        out.qa=[["What is a fact table?","A table that records events or measurable observations at a defined grain."],["What is a dimension?","A descriptive table used to filter, group or label facts."]];
        out.practice="Model Date, LOB, Agent and Interval dimensions around a WFM fact table and test a total against the source.";
        out.workedExample="If a fact row represents one LOB × interval, a Date dimension should filter that fact through a valid date key without multiplying rows.";
      } else if(/dax|calculate|context|iterator|time intelligence|measure/.test(t)){
        out.notes=["DAX is a formula language for model calculations.","Measures evaluate in filter context; calculated columns are evaluated row by row during model processing.","CALCULATE changes filter context and is central to many advanced measures."];
        out.highlights=["Context is the core DAX idea.","An expression can be syntactically valid and still semantically wrong.","Validate measures against small, known totals."];
        out.qa=[["Why can a measure change when a slicer changes?","Because the filter context changes the rows included in the calculation."],["Why use DIVIDE rather than raw division in many models?","It provides a controlled way to handle division-by-zero or blank denominators."]];
        out.practice="Create a measure for handled contacts and a second measure for SLA percentage; validate both against a manually calculated sample.";
        out.workedExample="A simple measure such as [Handled] := SUM(FactWFM[Handled]) responds to the current report filters without storing a separate value for every possible combination.";
      } else if(/report|visual|drill|tooltip|dashboard|kpi/.test(t)){
        out.notes=["Start from the decision the report must support.","Use consistent definitions and hierarchy across pages.","Provide a route from summary to diagnosis."];
        out.highlights=["Visual polish cannot repair an incorrect model.","Every KPI should have a visible or accessible definition.","Interaction should reduce investigation time, not add novelty."];
        out.qa=[["What should the first page answer?","The primary operational question, current state and material exceptions."],["Why provide drillthrough or tooltips?","To let users investigate detail without overcrowding the main view."]];
        out.practice="Design one executive page and one diagnostic page for the same WFM dataset; document the questions each page answers.";
        out.workedExample="Executive page: SLA, AHT, volume and staffing variance. Diagnostic page: interval trend, LOB comparison and root-cause detail.";
      } else {
        out.notes=["Connect, prepare, model, calculate, visualise and validate in that order.","Keep business definitions separate from cosmetic formatting.","Test the report with known totals and filters."];
        out.highlights=["A report is an analytical product.","Model quality determines many report behaviours.","Validation is part of development, not the final step only."];
        out.qa=[["What should happen before visual design?","Source profiling, transformation, modelling and metric definition."],["What is a useful validation test?","Compare a report result to an independently calculated known result under the same filter."]];
        out.practice="Implement the concept on a small WFM model and record one expected result before building the visual.";
        out.workedExample="Use three LOBs and two dates, calculate a known total outside Power BI, then confirm the model reproduces it under the same filters.";
      }
    } else {
      if(/exception|error/.test(t)){
        out.notes=["Python distinguishes syntax errors from exceptions raised during execution.","Catch exceptions only when you can handle or add useful context.","Use finally/with patterns when resources require cleanup."];
        out.highlights=["An error message is diagnostic evidence.","Broad exception handling can hide real defects.","Input validation and clear error messages reduce downstream failures."];
        out.qa=[["What is a SyntaxError?","A parsing error that prevents Python from interpreting the source code as valid syntax."],["What is an exception?","An error condition raised during execution, such as TypeError, NameError or FileNotFoundError."]];
        out.practice="Write a small file-reading function that reports a missing file clearly and does not silently return fabricated data.";
        out.workedExample="Use try/except FileNotFoundError around an external file operation and preserve the original problem in the diagnostic message.";
      } else if(/collection|list|tuple|set|dictionary|loop|condition/.test(t)){
        out.notes=["Choose data structures according to required operations and semantics.","Lists preserve order and allow duplicates; sets model unique elements; dictionaries map keys to values; tuples are immutable sequences.","Use clear iteration rather than clever one-liners when readability matters."];
        out.highlights=["Data structure choice affects clarity and operations.","Dictionary keys should represent stable identifiers.","Set operations are useful for uniqueness and membership checks."];
        out.qa=[["When is a dictionary useful in WFM?","For mappings such as EmployeeID → LOB or Skill → priority."],["Why use a set?","When uniqueness or fast membership testing is the main requirement."]];
        out.practice="Represent an employee-to-LOB mapping and produce a list of employees missing from the master mapping.";
        out.workedExample="A dictionary such as {'E101':'CountyCare','E102':'Premera'} expresses a key-to-value relationship directly and can be validated for missing keys.";
      } else if(/function|module|package|software engineering|testing/.test(t)){
        out.notes=["Functions should have clear inputs, outputs and responsibilities.","Modules separate related code and reduce duplication.","Tests should verify behaviour with representative and edge-case inputs."];
        out.highlights=["Readable code is part of analytical reliability.","Small functions are easier to test.","A passing test suite does not prove business logic is correct; tests must encode the intended rules."];
        out.qa=[["Why avoid one giant script?","It is harder to test, reuse, review and troubleshoot."],["What makes a useful test?","It checks an expected behaviour with controlled inputs and a clear expected result."]];
        out.practice="Extract one calculation from a script into a function and write tests for normal, boundary and invalid inputs.";
        out.workedExample="A calculate_workload(volume,aht_seconds) function can validate non-negative inputs and return workload seconds, making the rule reusable.";
      } else if(/pandas|numpy|time-series|statistics|forecast|visualization/.test(t)){
        out.notes=["Inspect shape, columns, types and missingness before transformation.","Keep transformations explicit and reproducible.","Validate analytical results against known examples or independent calculations."];
        out.highlights=["Libraries accelerate work but do not define your business rules.","Time-series analysis requires correct ordering and time representation.","A chart is evidence only when the underlying aggregation is correct."];
        out.qa=[["What should you inspect first in a new dataframe?","Shape, column names, data types, missing values, duplicates and a small sample."],["Why validate a library result?","Because a technically correct operation can still implement the wrong business definition."]];
        out.practice="Load a small interval dataset, profile it, clean one issue, calculate one KPI and validate the result independently.";
        out.workedExample="Group interval records by LOB and date, calculate total handled, then compare one group with a manual sum from the source.";
      } else if(/file|json|csv|api|automation|data engineering/.test(t)){
        out.notes=["Treat external files and APIs as variable inputs.","Validate schema and required fields before calculations.","Log enough information to reproduce failures without exposing sensitive data."];
        out.highlights=["Automation should fail visibly when assumptions are broken.","Idempotent transformations are safer to rerun.","Separate acquisition, validation, transformation and output stages."];
        out.qa=[["What should happen when an input schema changes?","The pipeline should detect the change and stop or route it for review rather than silently producing incorrect output."],["Why separate stages?","Each stage has a distinct responsibility and can be tested independently."]];
        out.practice="Build a small pipeline: read CSV → validate columns → clean data → calculate KPI → write output.";
        out.workedExample="Require Date, LOB, Volume and AHT columns before processing; if one is missing, raise a clear validation error instead of guessing a replacement.";
      } else {
        out.notes=["Understand the Python construct before applying it to a large dataset.","Use small examples to confirm behaviour.","Document assumptions that are not encoded directly in the code.","Validate outputs independently."];
        out.highlights=["Code that runs is not necessarily code that is correct.","Data quality is part of programming.","Simple, testable code is preferable to opaque cleverness."];
        out.qa=[["What is the first practical step?","Create the smallest example that demonstrates the concept."],["How do you know the result is trustworthy?","You can explain the transformation, validate key cases and reproduce the output."]];
        out.practice="Apply the concept to a three-row WFM example, then add one edge case and one validation check.";
        out.workedExample="Keep the input tiny enough that you can calculate the expected result by hand, then compare Python's result with that expectation.";
      }
    }
    return out;
  }


  function deepLesson(domain,module,title,index){
    const t=title.toLowerCase();
    const family =
      domain==="02" ? (
        /forecast|moving average|smoothing|holt|arima|regression|trend|seasonality|accuracy|bias|error/.test(t) ? "forecast" :
        /erlang|queue|arrival|service rate|traffic/.test(t) ? "queue" :
        /schedule|shift|break|coverage|multi-skilled/.test(t) ? "schedule" :
        /intraday|real-time|queue and service|recovery|escalation/.test(t) ? "intraday" :
        /shrinkage|adherence|attendance|absenteeism|conformance/.test(t) ? "people" :
        /service level|asa|abandon|offered|handled|aht|occupancy|utilization|fte|staffing|capacity/.test(t) ? "metric" : "foundation"
      ) :
      domain==="05" ? (
        /lookup|xlookup|vlookup|index|match/.test(t) ? "lookup" :
        /date|time|workday|networkdays|calendar/.test(t) ? "time" :
        /power query|merge|append|unpivot|m language|refresh/.test(t) ? "query" :
        /pivot|power pivot|dax|measure|relationship|fact|dimension|model/.test(t) ? "model" :
        /what-if|solver|sensitivity|scenario/.test(t) ? "scenario" :
        /text|clean|trim|substitute|replace/.test(t) ? "cleaning" :
        /dynamic array|filter|sort|unique|sequence/.test(t) ? "arrays" : "excel"
      ) :
      domain==="08" ? (
        /power query|transform|merge|append|unpivot|data type|refresh/.test(t) ? "query" :
        /relationship|fact|dimension|calendar|semantic|granularity|model/.test(t) ? "model" :
        /dax|calculate|context|iterator|time intelligence|measure/.test(t) ? "dax" :
        /report|visual|drill|tooltip|dashboard|kpi/.test(t) ? "report" :
        /security|governance|publish|refresh|performance|automation/.test(t) ? "production" : "powerbi"
      ) :
      (
        /collection|list|tuple|set|dictionary|loop|condition/.test(t) ? "python-core" :
        /function|module|package|software engineering|testing/.test(t) ? "engineering" :
        /file|json|csv|api|automation|data engineering/.test(t) ? "io" :
        /pandas|numpy|time-series|statistics|forecast|visualization/.test(t) ? "analytics" :
        /exception|error/.test(t) ? "errors" : "python"
      );

    const packs={
      foundation:{
        zero:"Imagine you have a workforce problem but only a spreadsheet of numbers. This lesson teaches you what the numbers mean before you try to calculate anything.",
        mental:"The core chain is demand → work → capacity → outcome. A WFM decision is only as good as the definition and time grain behind each link.",
        build:["Define the business question in one sentence.","List every input and its unit.","Choose the time grain at which the decision must work.","Calculate or classify the measure.","Reconcile it against the source.","Explain what action the result supports."],
        hero:"Take an unfamiliar operational extract, define its fields and produce a one-page calculation specification that another analyst could reproduce."
      },
      metric:{
        zero:"A metric is a measurement with a definition. The same word can produce different numbers when the population, threshold, exclusions or time grain changes.",
        mental:"Think numerator ÷ denominator, plus the rules that decide which rows enter each side. Then connect the metric to workload, capacity or customer outcome.",
        build:["Write the exact metric definition.","Identify numerator and denominator.","Confirm units and time grain.","Calculate a small known example by hand.","Compare the result with the source system.","Interpret the operational consequence."],
        hero:"Create a metric specification with definition, formula, inputs, exclusions, validation test and decision threshold. Then challenge it with one edge case."
      },
      queue:{
        zero:"A queue forms when work arrives faster than it can be completed at that moment. Queueing theory gives you a mathematical way to reason about waiting and capacity.",
        mental:"Volume becomes workload through handling time. Workload relative to available service capacity drives delay; the queue model adds the waiting behaviour.",
        build:["Convert arrivals and handling time into a common unit.","Calculate offered workload.","State the queueing model and assumptions.","Estimate capacity or delay.","Compare the theoretical result with an operational scenario.","Document where the assumptions break."],
        hero:"Solve a small queueing case, change one assumption, and explain why the result changes rather than simply reporting the new number."
      },
      forecast:{
        zero:"A forecast is an estimate of future demand made from information available before the future happens. It is a planning input, not a guarantee.",
        mental:"Separate history, pattern, model, adjustment and error. A good forecast process makes each of those visible.",
        build:["Define the forecast target and grain.","Create a simple baseline.","Identify trend, recurring patterns and events.","Fit or calculate the candidate method.","Backtest on periods not used for selection.","Measure error and bias.","Document overrides and assumptions."],
        hero:"Build two forecasts for the same history, backtest both, explain the error difference, and state when a human override would be justified."
      },
      schedule:{
        zero:"A schedule is a coverage plan: people are placed into time periods, skills and activities so that available capacity lines up with requirements.",
        mental:"Start with interval requirement, then add real-world constraints such as shift length, breaks, days off, skills and labour rules.",
        build:["Create the interval requirement curve.","Define shift and labour constraints.","Place feasible shift patterns.","Overlay coverage against requirement.","Locate under- and over-coverage.","Test skill compatibility.","Measure schedule quality.","Document trade-offs."],
        hero:"Take a 30-minute requirement curve and create a feasible schedule that covers the critical intervals while respecting stated constraints."
      },
      intraday:{
        zero:"Intraday management is what happens after the plan meets reality. The question is not only 'what is happening?' but 'what can we safely change now?'",
        mental:"Compare actual demand, actual handling, scheduled capacity and service state. Then choose an intervention with a measurable expected effect.",
        build:["Establish the start-of-day baseline.","Compare actual with forecast.","Compare actual staffing with schedule.","Identify the material gap.","Estimate the service/capacity effect.","Choose an intervention.","Set a recovery checkpoint.","Escalate when the defined threshold is crossed."],
        hero:"Diagnose an interval with a service miss, identify the likely driver, choose two possible interventions and explain the trade-off between them."
      },
      people:{
        zero:"People capacity is affected by attendance, breaks, meetings, training and other non-production activities. WFM models these effects rather than pretending every paid hour is deployable.",
        mental:"Paid capacity → unavailable time → productive capacity → coverage. The exact categories and denominators must be defined locally.",
        build:["Define the capacity base.","Separate planned and unplanned loss.","Calculate productive hours.","Compare plan with actual.","Locate the largest variance.","Trace the operational cause.","Feed the learning back into planning."],
        hero:"Build a shrinkage/adherence bridge for one week and explain which variance should change the forecast, schedule, staffing assumption or coaching action."
      },
      lookup:{
        zero:"A lookup answers a simple question: 'Given this key, which value belongs to it?' It is the spreadsheet equivalent of following a relationship between two tables.",
        mental:"Key → matching row → returned field. Correctness depends on key quality, data types, uniqueness and missing-match handling.",
        build:["Identify the lookup key.","Check uniqueness on the lookup side.","Normalise data types and text.","Choose the appropriate lookup method.","Define missing-match behaviour.","Test duplicates and edge cases.","Reconcile a sample manually."],
        hero:"Create a two-table employee mapping, deliberately introduce a duplicate and a missing key, and diagnose both instead of hiding them."
      },
      time:{
        zero:"Excel dates and times are stored as numeric values, which is why subtraction can measure elapsed time. The display format is not the underlying value.",
        mental:"Separate calendar date, clock time, duration and business-day logic. WFM calculations often fail when those concepts are mixed.",
        build:["Inspect the source type.","Convert text dates/times when required.","Choose the correct grain.","Calculate elapsed duration.","Apply business-day rules when needed.","Format only after the calculation is correct.","Test midnight and boundary cases."],
        hero:"Build an interval timestamp model that correctly handles a shift crossing midnight and prove the elapsed duration independently."
      },
      cleaning:{
        zero:"Data cleaning means turning messy source values into consistent analytical values without destroying the original evidence.",
        mental:"Profile first, transform second, validate third. Every cleaning rule should be explainable and repeatable.",
        build:["Profile values and data types.","Identify whitespace, case, nulls and duplicates.","Define the intended canonical value.","Apply the smallest deterministic transformation.","Check row counts and key uniqueness.","Keep the raw source unchanged.","Document exceptions."],
        hero:"Clean a deliberately messy operational export and produce a validation report showing what changed and why."
      },
      arrays:{
        zero:"Dynamic arrays let one formula return a range of results that can spill into neighbouring cells. This changes how you design reports and intermediate calculations.",
        mental:"Think in arrays of values rather than one-cell-at-a-time formulas. The formula becomes the source of a dynamic result set.",
        build:["Define the desired output set.","Choose the array function.","Control the source range or table.","Test empty and duplicate cases.","Check spill space and errors.","Combine functions only after each part works.","Use the result in a downstream calculation."],
        hero:"Build a dynamic WFM exception list that updates automatically when new interval records are added."
      },
      query:{
        zero:"Power Query is a repeatable data-preparation pipeline. Instead of cleaning the same export manually every week, you describe the transformation once and refresh it.",
        mental:"Source → profile → transform → combine → validate → load. The sequence matters because later steps operate on the output of earlier steps.",
        build:["Connect to the source.","Inspect structure and data types.","Remove or transform unnecessary fields.","Combine sources when required.","Apply business rules.","Validate row counts and keys.","Load the result.","Refresh using a changed input."],
        hero:"Build a refreshable pipeline from two monthly exports, introduce a controlled source change, and make the pipeline detect or handle it."
      },
      model:{
        zero:"A data model is a structured map of facts and descriptive information. Relationships tell the analytical engine how filters should travel.",
        mental:"Fact table = events/measures at a defined grain. Dimension = descriptive context. Relationship = the path connecting them.",
        build:["State the grain of every table.","Identify candidate keys.","Separate facts from dimensions.","Create relationships deliberately.","Check cardinality and filter direction.","Test a known total.","Add calculations only after the model is sound."],
        hero:"Design a small star schema for interval WFM data and prove that filtering by date and LOB produces the expected totals."
      },
      scenario:{
        zero:"Scenario analysis changes an explicit assumption and observes how the result changes. It is a controlled experiment, not a guess.",
        mental:"Base case → assumption change → recalculation → delta → decision. Keep assumptions visible so the result can be audited.",
        build:["Create a stable base case.","Move assumptions into input cells.","Define the output measure.","Change one assumption at a time.","Record the delta.","Run combined scenarios.","Explain the operational trade-off."],
        hero:"Model three staffing scenarios and show how volume, AHT and shrinkage assumptions change required capacity."
      },
      report:{
        zero:"A report is a decision interface. Its job is to help someone understand status, find exceptions and decide what to do next.",
        mental:"Question → metric → visual → interaction → diagnosis → action. Remove anything that does not support that chain.",
        build:["Write the decision questions.","Define KPI calculations and grain.","Choose the visual that matches each question.","Create hierarchy from summary to detail.","Add controlled interactions.","Test with a user who did not build it.","Validate numbers against source data."],
        hero:"Build an executive page and a diagnostic page from the same model, then explain why every visual exists."
      },
      dax:{
        zero:"DAX is the calculation language used by Power BI semantic models. Its most important idea is that calculations evaluate under a context.",
        mental:"Measure expression + current filter context = result. CALCULATE can modify that context; row context and filter context are different ideas.",
        build:["Define the business calculation in plain language.","Identify the model table and grain.","Write the simplest valid measure.","Test it without filters.","Add one filter.","Add a second filter or iterator only when needed.","Compare against an independent result."],
        hero:"Build a KPI measure, slice it by date and LOB, then explain exactly which filters changed the result."
      },
      production:{
        zero:"A production analytical solution must remain trustworthy after you publish it. Refresh, permissions, performance, ownership and change control are part of the product.",
        mental:"Build → validate → publish → refresh → monitor → change safely. A report that works only on the author's laptop is not a finished solution.",
        build:["Define ownership and audience.","Validate model and measures.","Configure refresh or connectivity.","Apply security rules where required.","Test performance with realistic volume.","Document dependencies.","Monitor failures and changes.","Revalidate after updates."],
        hero:"Create a production-readiness checklist for a WFM report and identify the evidence required before release."
      },
      "python-core":{
        zero:"Python starts with values, names, collections and control flow. The goal is to make the computer follow a rule you can explain.",
        mental:"Input → transformation → output. Data structures hold information; conditions choose paths; loops repeat work.",
        build:["Write the smallest example.","Inspect the value and type.","Add the required operation.","Handle one edge case.","Refactor repeated logic.","Test the result.","Explain the code in plain language."],
        hero:"Solve the same small WFM problem first with basic Python constructs, then refactor it for readability and testability."
      },
      engineering:{
        zero:"Software engineering is how you turn working code into code that another person can understand, test and safely change.",
        mental:"Small responsibility → clear interface → test → refactor. Reliability comes from structure as much as syntax.",
        build:["Define the function/module responsibility.","Choose explicit inputs and outputs.","Implement the smallest behaviour.","Add normal and edge-case tests.","Handle expected failures.","Remove duplication.","Document the interface.","Run the full test set."],
        hero:"Take a working analytical script and refactor it into small testable components without changing its validated output."
      },
      io:{
        zero:"Files, APIs and external datasets are boundaries between your program and the outside world. Assume their structure can change or contain bad values.",
        mental:"Acquire → validate schema → validate values → transform → calculate → output → log.",
        build:["Define the expected schema.","Read the source.","Validate required fields.","Validate types and ranges.","Handle missing/duplicate records.","Transform to the internal model.","Write the output.","Record success or failure."],
        hero:"Build a small ingestion pipeline that refuses an invalid schema and produces a traceable output when the input is valid."
      },
      analytics:{
        zero:"Analytical libraries make calculations fast, but they do not decide what the calculation means. You still own the definition, grain and validation.",
        mental:"Dataframe/array → inspect → transform → aggregate/model → validate → communicate.",
        build:["Inspect shape and types.","Define the analytical grain.","Clean the minimum required fields.","Perform the calculation.","Check the result on a small subset.","Compare with an independent calculation.","Scale the operation.","Present the result."],
        hero:"Take a small workforce dataset from raw rows to a validated analytical result, then explain every transformation."
      },
      errors:{
        zero:"An error is information about a broken assumption, invalid input or program state. Good Python makes the failure understandable instead of hiding it.",
        mental:"Detect → classify → handle or propagate → preserve evidence. Do not catch an error merely to make the program look successful.",
        build:["Reproduce the failure.","Identify the exception type.","Inspect the failing input.","Decide whether recovery is valid.","Handle the narrow case.","Preserve useful diagnostic context.","Add a regression test.","Re-run the normal path."],
        hero:"Introduce a controlled failure into a data pipeline, diagnose it, handle it correctly and add a test so the same defect cannot silently return."
      },
      python:{
        zero:"Python becomes powerful when you combine language fundamentals with data and automation workflows. Start small and make every transformation observable.",
        mental:"Read → understand → transform → validate → automate. Each stage should have a clear responsibility.",
        build:["Define the task and expected output.","Create a tiny example.","Implement the transformation.","Inspect intermediate results.","Validate edge cases.","Wrap reusable logic in functions.","Automate only after correctness is proven."],
        hero:"Turn a manual WFM calculation into a reproducible Python workflow and show the evidence that the automated result matches the known result."
      },
      excel:{
        zero:"Excel is a grid for storing values, expressing calculations and building analytical models. The professional skill is not knowing more buttons; it is designing a model that stays correct.",
        mental:"Inputs → calculations → checks → outputs. References, formulas and tables connect the layers.",
        build:["Define the required output.","Create a small structured input table.","Build one calculation at a time.","Use references instead of hard-coded constants.","Add validation checks.","Test a changed input.","Separate presentation from calculation."],
        hero:"Build a small operational workbook from raw inputs through calculations and checks, then change one assumption and trace the effect."
      },
      powerbi:{
        zero:"Power BI turns prepared data into a semantic model and interactive report. The visual is the final layer, not the starting point.",
        mental:"Source → Power Query → model → DAX → visual → interaction → validation.",
        build:["Connect to a small source.","Profile and prepare it.","Model relationships.","Create one measure.","Build one visual.","Add a filter interaction.","Validate the result against source data.","Expand only after correctness is proven."],
        hero:"Build a miniature WFM report end-to-end and explain how the same number travels from source row to semantic model to visual."
      }
    };

    const topic=title.toLowerCase();
    const topicOverrides={
      "cell references":{
        zero:"A cell reference is the address Excel uses to locate a value or formula input. You will learn how A1-style references behave when a formula is copied, and why relative, absolute and mixed references produce different results.",
        mental:"Think of a formula as a small program with addresses. Relative references move with the formula; absolute references stay fixed; mixed references lock either the row or the column.",
        build:["Enter a small input table and identify the address of each value.","Write a formula using a relative reference.","Copy the formula down and observe the reference movement.","Change the reference to absolute with $ and copy again.","Test a mixed reference such as A$1 or $A1.","Use the reference pattern in a small WFM calculation."],
        hero:"Build a staffing table where the same fixed assumption is applied across changing intervals, then explain why each $ symbol is necessary."
      },
      "number formats":{
        zero:"Number format changes how Excel displays a value; it does not normally change the underlying numeric value. This distinction matters when a WFM workbook shows minutes, percentages, dates or currency.",
        mental:"Value and display are separate layers. A value such as 0.25 can display as 25%, 0.3 can display as 18:00 when interpreted as time, and an integer can display with separators without changing the stored number.",
        build:["Enter known numeric values.","Apply General, Number and Percentage formats.","Inspect the formula bar to distinguish value from display.","Format time and duration separately.","Test a formula after formatting.","Create a consistent format standard for a WFM sheet."],
        hero:"Take a KPI sheet containing counts, percentages, seconds and durations and create a display standard that does not alter the underlying calculations."
      },
      "formula evaluation":{
        zero:"Excel evaluates a formula by resolving references, functions and operators into a result. Understanding that sequence makes debugging much easier than guessing why a cell shows an unexpected number.",
        mental:"Input values → references → operators/functions → intermediate results → final value. Excel's precedence rules determine the order of operations.",
        build:["Start with a formula containing one operation.","Add a second operation and predict the result.","Use parentheses to make the intended order explicit.","Replace a literal with a cell reference.","Add a function.","Trace the result using Excel's auditing tools."],
        hero:"Take a deliberately ambiguous formula, predict two possible results, then rewrite it so the intended evaluation order is unambiguous."
      },
      "xlookup":{
        zero:"XLOOKUP finds a value in one range and returns the corresponding value from another range. It is especially useful when operational data has a stable key such as EmployeeID, SkillID or LOB code.",
        mental:"Search key → lookup array → matching position → return array. The lookup key must be prepared and the missing-match behaviour must be intentional.",
        build:["Create a unique key column.","Write a basic XLOOKUP.","Add a missing-match result.","Test a duplicate key.","Test a key with different data type or whitespace.","Use the lookup result in a downstream WFM calculation."],
        hero:"Build an EmployeeID-to-LOB lookup, test missing and duplicate IDs, and produce an exception list rather than hiding bad mappings."
      },
      "power query architecture":{
        zero:"Power Query is a transformation engine built around a sequence of recorded steps. You can refresh the same logic when the next source file arrives instead of repeating manual cleaning.",
        mental:"Source → query steps → transformed table → load destination. Each step consumes the previous step's result.",
        build:["Connect to a small source.","Inspect the generated steps.","Rename steps so their purpose is clear.","Change a data type and observe the step.","Add a transformation.","Refresh after replacing the source with a new period.","Inspect the final output and validation checks."],
        hero:"Create a refreshable query with named steps, then replace the input with a second month's file and prove the same transformation still works."
      },
      "filter context":{
        zero:"Filter context is the set of filters currently affecting a DAX calculation. Slicers, rows, columns and DAX expressions can change that context.",
        mental:"A measure is evaluated over the rows visible under the current filter context. CALCULATE can modify that context before evaluating an expression.",
        build:["Create a base measure.","Place it in a visual by LOB.","Add a date filter and observe the result.","Add a second filter.","Use CALCULATE to change one filter.","Explain the result using the exact active filters."],
        hero:"Build a measure that changes under Date and LOB filters, then explain the final number without referring to the visual as a black box."
      },
      "row context":{
        zero:"Row context means DAX is evaluating an expression with a current row in view, most commonly in calculated columns and iterator functions. It is different from filter context.",
        mental:"Row context answers 'which row am I evaluating?' Filter context answers 'which rows are currently included?' Confusing them is a common source of incorrect DAX.",
        build:["Create a calculated column with a row-level expression.","Inspect the result row by row.","Create an iterator such as SUMX.","Compare the iterator with a simple SUM.","Explain where the current row comes from.","Validate the result against a hand calculation."],
        hero:"Build a row-level calculation and an iterator-based measure over the same data, then explain why their evaluation contexts differ."
      },
      "python foundations":{
        zero:"Python foundations begin with values, names, expressions and statements. The objective is to make the language predictable before introducing data libraries.",
        mental:"A variable gives a value a name; an expression produces a value; a statement performs an action or controls execution.",
        build:["Open a Python interpreter or script.","Create variables with different types.","Inspect them with type().","Perform arithmetic and comparisons.","Use a conditional statement.","Print the result and verify it by hand."],
        hero:"Write a small WFM calculation using only Python fundamentals, then explain every variable, operator and control-flow decision."
      },
      "pandas foundations":{
        zero:"A pandas DataFrame is a tabular data structure with labelled rows and columns. It is useful for workforce datasets because you can inspect, filter, transform and aggregate structured records.",
        mental:"Think of a DataFrame as a table plus programmable operations. The most important early skill is understanding its shape, columns, index and data types.",
        build:["Create or load a small DataFrame.","Inspect shape and columns.","Inspect data types and missing values.","Select rows and columns.","Create a derived column.","Group the data and validate one result manually."],
        hero:"Load a small interval dataset, profile it, create one derived KPI field and reconcile one grouped result by hand."
      }
    };
    let tp=null;
    Object.keys(topicOverrides).forEach(k=>{if(topic===k)tp=topicOverrides[k];});
    const titleAware = tp || {
      zero:"This lesson teaches “"+title+"”. Start by identifying exactly what the term means, what problem it solves, what inputs it needs and what a correct result looks like.",
      mental:"For “"+title+"”, think in four parts: definition → inputs → method → decision. Do not move to advanced use until you can explain each part without the interface.",
      build:["Define “"+title+"” in plain language.","Identify the required inputs and their units or data types.","Work through a tiny controlled example.","Change one input and predict the effect.","Validate the result independently.","Apply the concept to a workforce-intelligence case."],
      hero:"Teach “"+title+"” to another learner using one simple example, one realistic example and one edge case; then defend the result."
    };
    const p=packs[family]||packs.foundation;
    const previous=index>0 ? "The previous lesson in this module is your immediate prerequisite. Revisit it if any term here feels unfamiliar." : "No prior lesson is required. Start with the Zero level and do not skip the vocabulary.";
    const next="After mastery, continue to the next lesson in this module and carry forward the same dataset/project so the skills compound.";
    return {
      zero:titleAware.zero,
      mentalModel:titleAware.mental,
      buildSteps:titleAware.build,
      mastery:titleAware.hero,
      prerequisites:previous,
      transfer:"Use the concept twice: first on the controlled example, then on a slightly different workforce-intelligence case. If the answer changes, explain why.",
      levelPlan:[
        {level:"01 · Zero",goal:"Understand the idea without jargon.",task:"Explain the lesson in your own words and identify its real-world purpose."},
        {level:"02 · Foundation",goal:"Learn the vocabulary, inputs and rules.",task:"Write the definition, units, assumptions and expected output."},
        {level:"03 · Build",goal:"Perform the method yourself.",task:"Follow the numbered build steps on the controlled example."},
        {level:"04 · Apply",goal:"Use it on realistic data.",task:"Repeat the method with a changed input or second scenario."},
        {level:"05 · Diagnose",goal:"Handle mistakes and edge cases.",task:"Break one assumption deliberately and explain the resulting failure."},
        {level:"06 · Hero",goal:"Teach and defend the result.",task:"Complete the mastery task and explain every important decision."}
      ],
      sourceNote:"The lesson is grounded in the official/industry references listed below. Where terminology or implementation varies by organisation or product version, the learner must verify the local definition rather than memorise a universal rule."
    };
  }

  const authoredWfmModule01 = {};
  Object.assign(authoredWfmModule01, {
  "02.1.01": {
    "understanding": "A contact center is an operation designed to receive, route, handle and resolve customer or business interactions across one or more channels. WFM sits inside that operating system: it translates expected demand and service objectives into the people, skills and time required to handle the work.",
    "notes": [
      "Separate the customer interaction from the work required to complete it. One contact can create talk time, hold time, after-contact work or deferred follow-up.",
      "Identify the channel, queue or work type before comparing volumes. A voice contact and an email case are not automatically equivalent units of work.",
      "Understand the operating chain: customer demand → routing → agent activity → outcome → operational data.",
      "Service objectives are business rules, not universal mathematical constants. The target and measurement definition must be documented.",
      "Every WFM calculation should eventually answer a business question about demand, capacity, service, cost or risk."
    ],
    "highlights": [
      "A contact center is a system of demand, routing, people, technology and outcomes—not simply a room full of agents.",
      "WFM is concerned with matching capacity to demand at the time and skill where the work occurs.",
      "Different channels create different workload patterns and therefore require different planning assumptions.",
      "Definitions come before calculations."
    ],
    "qa": [
      [
        "What makes a contact center different from a simple help desk?",
        "A contact center can manage multiple interaction types, queues, skills, routing rules, service objectives and operational channels at scale."
      ],
      [
        "Where does WFM fit?",
        "WFM plans and manages workforce capacity so the operation has the right number and mix of available people for expected work."
      ],
      [
        "Why can two contacts require different amounts of capacity?",
        "Their handling time, channel, complexity, skill requirement, concurrency and follow-up work can differ."
      ],
      [
        "What should I document before analysing a contact-center metric?",
        "The population, channel or queue, time window, unit, formula, exclusions and source system."
      ]
    ],
    "practice": "Draw the operating model for a fictional 100-agent contact center. Include customers, channels, queues, routing, agents, outcomes and the data generated at each stage. Then mark where forecasting, scheduling and intraday management act on the system.",
    "workedExample": "Suppose a center receives 1,200 voice calls and 300 chat sessions in a day. The first WFM question is not 'How many agents?' It is 'What work does each channel create, when does it arrive, what skills are required, and what service objective applies?' The answer determines which demand and capacity measures can be compared.",
    "assessment": "Submit a one-page contact-center operating map with at least two channels, two queues or work types, three skills, one service objective and the WFM decision affected by each component.",
    "commonMistakes": [
      "Treating every contact as the same unit of workload.",
      "Jumping directly from daily volume to agent count without time grain or handling time.",
      "Assuming the label 'service level' has the same definition in every platform."
    ],
    "sources": [
      {
        "label": "NiCE — What is Workforce Management? https://www.nice.com/glossary/what-is-contact-center-workforce-management-wfm"
      },
      {
        "label": "NiCE — Workforce Management for Contact Centers https://www.nice.com/guide/wfo/workforce-management-for-call-centers"
      },
      {
        "label": "Call Centre Helper — Workforce Management Reference Guide https://www.callcentrehelper.com/workforce-management-reference-guide-57260.htm"
      }
    ],
    "depth": {
      "zero": "Think of a contact center as a place where work arrives, gets routed to the right capability, is handled by people or technology, and produces an outcome. WFM makes sure enough capable people are available when that work arrives.",
      "mentalModel": "Demand enters through channels. Routing decides where it goes. Skills determine who can handle it. Handling creates workload. Service objectives define how quickly or successfully it should be handled. WFM connects these pieces to capacity.",
      "buildSteps": [
        "List every customer/work channel.",
        "Define each queue, work type or routing destination.",
        "List the skills required for each work type.",
        "Describe the handling lifecycle from arrival to completion.",
        "Identify the service objective for each major work type.",
        "Identify the operational data produced.",
        "Map each data element to a WFM decision."
      ],
      "mastery": "Explain the complete operating model to a new analyst using a diagram and defend why volume alone is insufficient for staffing.",
      "prerequisites": "None. This is the entry point to Module 01.",
      "transfer": "Use the same operating map later when learning forecasting, staffing, scheduling and intraday management.",
      "levelPlan": [
        {
          "level": "01 · Zero",
          "goal": "Recognize a contact-center system.",
          "task": "Explain demand, routing, skills, people and outcomes in plain language."
        },
        {
          "level": "02 · Foundation",
          "goal": "Build the vocabulary.",
          "task": "Classify channels, queues, skills, service objectives and operational data."
        },
        {
          "level": "03 · Build",
          "goal": "Map the operation.",
          "task": "Create the contact-center operating model from demand to outcome."
        },
        {
          "level": "04 · Apply",
          "goal": "Connect the model to WFM.",
          "task": "Identify where forecasting, staffing, scheduling and intraday decisions occur."
        },
        {
          "level": "05 · Diagnose",
          "goal": "Spot definition errors.",
          "task": "Challenge a staffing analysis that uses only daily contact volume."
        },
        {
          "level": "06 · Hero",
          "goal": "Defend the operating model.",
          "task": "Teach the model and explain every assumption and boundary."
        }
      ]
    }
  }
});
  Object.assign(authoredWfmModule01, {
  "02.1.02": {
    "title": "Demand, Work and Capacity",
    "understanding": "Demand is the amount of work arriving or expected to arrive. Work is the effort required to process that demand. Capacity is the usable amount of workforce time available to process that work. WFM connects these three concepts before staffing or scheduling.",
    "notes": [
      "Measure demand at the same time grain at which capacity must respond.",
      "Workload normally combines demand with handling effort; volume alone is not a capacity requirement.",
      "Capacity depends on available time, skills, productivity assumptions and constraints.",
      "Paid headcount is not the same as deployable capacity.",
      "Compare demand and capacity using consistent units before calculating a gap."
    ],
    "highlights": [
      "Volume answers 'how much arrived'; workload answers 'how much effort did it create'.",
      "Capacity is time- and skill-dependent.",
      "A daily capacity surplus can coexist with an interval-level shortage.",
      "Always reconcile units before comparing demand with capacity."
    ],
    "qa": [
      [
        "Why is volume alone insufficient?",
        "Two intervals can have identical volume but different handling times, creating different workload and staffing requirements."
      ],
      [
        "What is capacity?",
        "Capacity is the usable amount of work the available workforce can process under stated assumptions and constraints."
      ],
      [
        "Can a center be overstaffed and understaffed on the same day?",
        "Yes. Aggregate daily capacity can exceed demand while specific intervals or skills have shortages."
      ],
      [
        "What is the first calculation check?",
        "Confirm that demand and capacity are expressed in compatible units and at the same time grain."
      ]
    ],
    "practice": "Create a 30-minute demand table with volume and AHT for eight intervals. Convert each interval to workload minutes, compare it with available agent minutes, and mark the intervals with a capacity gap.",
    "workedExample": "An interval has 40 contacts and a 6-minute average handling time. Workload is 240 handling minutes. If 10 agents are available for the full 30-minute interval, gross available time is 300 agent-minutes. Before queueing and occupancy assumptions, there is 60 agent-minutes of gross headroom. At 8-minute AHT, workload becomes 320 minutes and the headroom disappears.",
    "assessment": "Produce a demand-work-capacity table for eight intervals, show all units, identify the largest gap and explain at least two reasons gross capacity may overstate usable capacity.",
    "commonMistakes": [
      "Comparing contacts directly with agent count.",
      "Using daily averages for interval staffing decisions.",
      "Ignoring skills and assuming all capacity is interchangeable."
    ],
    "sources": [
      {
        "label": "NiCE — Workforce Management for Contact Centers https://www.nice.com/guide/wfo/workforce-management-for-call-centers"
      },
      {
        "label": "NiCE — What is WFM Software https://www.nice.com/glossary/what-is-wfm-software"
      },
      {
        "label": "Call Centre Helper — Workforce Management Reference Guide https://www.callcentrehelper.com/workforce-management-reference-guide-57260.htm"
      }
    ],
    "depth": {
      "zero": "Demand is the amount of work arriving or expected to arrive. Work is the effort required to process that demand. Capacity is the usable amount of workforce time available to process that work. WFM connects these three concepts before staffing or scheduling.",
      "mentalModel": "Carry the demand → workload → capacity chain into forecasting and staffing. The core chain is demand → work → capacity → decision → feedback.",
      "buildSteps": [
        "Define the planning interval.",
        "Record volume.",
        "Record the handling-time assumption.",
        "Convert volume and handling time into workload.",
        "Calculate usable capacity.",
        "Compare workload with capacity.",
        "Investigate each material gap."
      ],
      "mastery": "Build an interval-level demand/work/capacity model and explain why the same daily volume can require different staffing plans.",
      "prerequisites": "02.1.01",
      "transfer": "Carry the demand → workload → capacity chain into forecasting and staffing.",
      "levelPlan": [
        {
          "level": "01 · Zero",
          "goal": "Understand the idea.",
          "task": "Explain the lesson in plain language without relying on software."
        },
        {
          "level": "02 · Foundation",
          "goal": "Learn the vocabulary and rules.",
          "task": "Write the definitions, units, assumptions and boundaries."
        },
        {
          "level": "03 · Build",
          "goal": "Perform the method.",
          "task": "Complete the controlled exercise and show your working."
        },
        {
          "level": "04 · Apply",
          "goal": "Use it in operations.",
          "task": "Apply the concept to a changed workforce scenario."
        },
        {
          "level": "05 · Diagnose",
          "goal": "Handle failure and edge cases.",
          "task": "Break one assumption and explain the operational consequence."
        },
        {
          "level": "06 · Hero",
          "goal": "Defend the capability.",
          "task": "Complete the assessment and teach the reasoning to another analyst."
        }
      ]
    }
  }
});
  Object.assign(authoredWfmModule01, {
  "02.1.03": {
    "title": "Voice, Digital and Back-Office Channels",
    "understanding": "Contact-center work is not limited to synchronous voice calls. Voice, chat, messaging, email and back-office tasks differ in arrival behaviour, handling pattern, concurrency, urgency and service measurement. WFM must classify those differences before comparing demand.",
    "notes": [
      "Voice is generally immediate and queue-based.",
      "Chat can support concurrency, subject to policy and capability.",
      "Email and asynchronous work create backlog and ageing dynamics.",
      "Back-office work may be deadline-based rather than live-queue based.",
      "Blended planning requires explicit rules for shared capacity."
    ],
    "highlights": [
      "Channel is a planning dimension, not just a reporting label.",
      "Concurrency changes the relationship between contacts and agent capacity.",
      "Asynchronous work introduces backlog and ageing.",
      "Do not force every channel into a voice-only staffing formula."
    ],
    "qa": [
      [
        "Why can't chat always use voice staffing logic?",
        "Chat can support multiple active sessions per agent, so contact count and capacity are related differently."
      ],
      [
        "What changes with email?",
        "Work can be deferred, creating backlog, ageing and deadline-based capacity decisions."
      ],
      [
        "Can channels share agents?",
        "Yes, when skills, tooling, policy and service objectives permit it; the shared-capacity rule must be explicit."
      ],
      [
        "What should a WFM analyst document?",
        "Arrival pattern, handling effort, concurrency or backlog assumptions, service objective, skills and capacity rules."
      ]
    ],
    "practice": "Build a channel matrix for voice, chat, email and back-office work. Include arrival pattern, urgency, handling model, concurrency, service measure, skills and planning unit.",
    "workedExample": "A 30-minute period contains 20 voice calls at 6 minutes AHT and 15 chats with an assumed concurrency of 2. The raw contact counts cannot simply be added. Voice creates 120 handling minutes; chat capacity depends on the organisation's concurrency and handling assumptions.",
    "assessment": "Create a four-channel planning matrix and propose a shared-capacity rule for one blended team. State when that rule would be invalid.",
    "commonMistakes": [
      "Adding channel volumes as if contacts were identical.",
      "Assuming a fixed chat concurrency is universally valid.",
      "Ignoring backlog and ageing for asynchronous work."
    ],
    "sources": [
      {
        "label": "NiCE — Workforce Management for Contact Centers https://www.nice.com/guide/wfo/workforce-management-for-call-centers"
      },
      {
        "label": "NiCE — What is WFM Software https://www.nice.com/glossary/what-is-wfm-software"
      },
      {
        "label": "Call Centre Helper — Workforce Management Reference Guide https://www.callcentrehelper.com/workforce-management-reference-guide-57260.htm"
      }
    ],
    "depth": {
      "zero": "Contact-center work is not limited to synchronous voice calls. Voice, chat, messaging, email and back-office tasks differ in arrival behaviour, handling pattern, concurrency, urgency and service measurement. WFM must classify those differences before comparing demand.",
      "mentalModel": "Reuse the matrix later for multi-channel and blended WFM. The core chain is demand → work → capacity → decision → feedback.",
      "buildSteps": [
        "List channels.",
        "Describe arrival behaviour.",
        "Define the work unit.",
        "Document concurrency or backlog behaviour.",
        "Define service objectives.",
        "Map required skills.",
        "Define shared-capacity rules."
      ],
      "mastery": "Explain why four channels cannot safely be collapsed into one contact-volume number and defend the planning matrix.",
      "prerequisites": "02.1.02",
      "transfer": "Reuse the matrix later for multi-channel and blended WFM.",
      "levelPlan": [
        {
          "level": "01 · Zero",
          "goal": "Understand the idea.",
          "task": "Explain the lesson in plain language without relying on software."
        },
        {
          "level": "02 · Foundation",
          "goal": "Learn the vocabulary and rules.",
          "task": "Write the definitions, units, assumptions and boundaries."
        },
        {
          "level": "03 · Build",
          "goal": "Perform the method.",
          "task": "Complete the controlled exercise and show your working."
        },
        {
          "level": "04 · Apply",
          "goal": "Use it in operations.",
          "task": "Apply the concept to a changed workforce scenario."
        },
        {
          "level": "05 · Diagnose",
          "goal": "Handle failure and edge cases.",
          "task": "Break one assumption and explain the operational consequence."
        },
        {
          "level": "06 · Hero",
          "goal": "Defend the capability.",
          "task": "Complete the assessment and teach the reasoning to another analyst."
        }
      ]
    }
  }
});
  Object.assign(authoredWfmModule01, {
  "02.1.04": {
    "title": "Queues, Skills and Routing",
    "understanding": "A queue is a waiting or work destination; a skill describes the capability required to handle work; routing determines where and to whom work is offered. WFM must understand this structure because staffing the wrong skill does not solve a demand gap.",
    "notes": [
      "Define the actual work behind each queue rather than relying on queue names.",
      "Skills can represent language, product, certification or process knowledge.",
      "Routing determines which agents are eligible.",
      "Multi-skilled agents create shared capacity but competing demand can constrain it.",
      "Distinguish total headcount from skill-specific capacity."
    ],
    "highlights": [
      "Headcount is not the same as skill capacity.",
      "Routing can create a shortage even when total headcount looks sufficient.",
      "Skill matrices are essential for multi-skill planning.",
      "Trace a demand gap to the eligible agent population."
    ],
    "qa": [
      [
        "Why can 20 agents be insufficient for a queue?",
        "Only a subset may possess the required skill or be available in the required interval."
      ],
      [
        "What is routing?",
        "The logic determining which eligible resource receives or works an interaction."
      ],
      [
        "What is a skill matrix?",
        "A mapping of agents to the skills or eligibility required for work."
      ],
      [
        "What should staffing analysis ask after finding a gap?",
        "Which work has the gap, which agents are eligible, and whether routing or skills limit capacity."
      ]
    ],
    "practice": "Create a six-agent skill matrix covering Billing, Technical and Spanish. Design three queues and identify which agents are eligible. Then find one queue where total headcount appears healthy but effective capacity is not.",
    "workedExample": "Six agents exist: four are Billing-skilled, three Technical-skilled and two Spanish-skilled. A Spanish Technical queue can only use agents with both skills. Effective capacity is therefore based on the intersection of skills, not total headcount.",
    "assessment": "Submit a queue-skill-routing diagram and skill matrix. Identify one scenario where total headcount looks healthy but the queue is under-capacity.",
    "commonMistakes": [
      "Counting every agent as available for every queue.",
      "Ignoring simultaneous demand for shared skills.",
      "Treating every skill as binary when proficiency or certification matters."
    ],
    "sources": [
      {
        "label": "NiCE — Workforce Management for Contact Centers https://www.nice.com/guide/wfo/workforce-management-for-call-centers"
      },
      {
        "label": "NiCE — What is WFM Software https://www.nice.com/glossary/what-is-wfm-software"
      },
      {
        "label": "Call Centre Helper — Workforce Management Reference Guide https://www.callcentrehelper.com/workforce-management-reference-guide-57260.htm"
      }
    ],
    "depth": {
      "zero": "A queue is a waiting or work destination; a skill describes the capability required to handle work; routing determines where and to whom work is offered. WFM must understand this structure because staffing the wrong skill does not solve a demand gap.",
      "mentalModel": "Reuse the skill matrix later for scheduling and intraday reallocation. The core chain is demand → work → capacity → decision → feedback.",
      "buildSteps": [
        "List work types.",
        "Define required skills.",
        "Create the agent-skill matrix.",
        "Define queue eligibility.",
        "Document routing rules.",
        "Calculate eligible capacity.",
        "Test shared-skill conflicts."
      ],
      "mastery": "Diagnose a queue shortage by proving whether the root cause is headcount, unavailable skills or routing constraints.",
      "prerequisites": "02.1.03",
      "transfer": "Reuse the skill matrix later for scheduling and intraday reallocation.",
      "levelPlan": [
        {
          "level": "01 · Zero",
          "goal": "Understand the idea.",
          "task": "Explain the lesson in plain language without relying on software."
        },
        {
          "level": "02 · Foundation",
          "goal": "Learn the vocabulary and rules.",
          "task": "Write the definitions, units, assumptions and boundaries."
        },
        {
          "level": "03 · Build",
          "goal": "Perform the method.",
          "task": "Complete the controlled exercise and show your working."
        },
        {
          "level": "04 · Apply",
          "goal": "Use it in operations.",
          "task": "Apply the concept to a changed workforce scenario."
        },
        {
          "level": "05 · Diagnose",
          "goal": "Handle failure and edge cases.",
          "task": "Break one assumption and explain the operational consequence."
        },
        {
          "level": "06 · Hero",
          "goal": "Defend the capability.",
          "task": "Complete the assessment and teach the reasoning to another analyst."
        }
      ]
    }
  }
});
  Object.assign(authoredWfmModule01, {
  "02.1.05": {
    "title": "Service Objectives and Customer Promises",
    "understanding": "Service objectives translate customer expectations and business priorities into measurable operating targets. In WFM, those objectives influence staffing requirements, scheduling priorities and intraday decisions. The exact definition matters more than the label.",
    "notes": [
      "Document the target, answer threshold and eligible population.",
      "Different channels can require different service measures.",
      "Service level is meaningful only when numerator, denominator and threshold are defined.",
      "Targets are business decisions; WFM estimates their capacity implications.",
      "Do not optimize service percentage in isolation from cost, quality and customer outcomes."
    ],
    "highlights": [
      "A target is a business requirement; the model estimates resources needed to pursue it.",
      "Service-level definitions must be explicit.",
      "Different work types can require different service objectives.",
      "Interval performance matters because customer waiting is time-dependent."
    ],
    "qa": [
      [
        "Is 80% service level universally good?",
        "No. Appropriateness depends on the operation, customer promise, channel, cost and business requirements."
      ],
      [
        "Why record an answer threshold?",
        "It defines what counts as an interaction answered within the objective."
      ],
      [
        "Can two reports both show 90% SLA and disagree?",
        "Yes. They may use different populations, exclusions, thresholds or time windows."
      ],
      [
        "How does a service target affect WFM?",
        "Changing the target changes the capacity and operating strategy required to pursue it."
      ]
    ],
    "practice": "Write a service-objective specification for a fictional voice queue: target, threshold, denominator, exclusions, reporting grain and escalation rule. Create a separate objective for email and explain the difference.",
    "workedExample": "If 900 eligible contacts exist and 810 meet the defined threshold, service level is 810 ÷ 900 = 90%. The calculation is simple; proving that both counts use identical definitions is the real control.",
    "assessment": "Create a metric specification another analyst could reproduce without asking a question. Include formula, inputs, exclusions, threshold, grain and business purpose.",
    "commonMistakes": [
      "Quoting a target without its definition.",
      "Using a daily average to hide interval failures.",
      "Changing the denominator to improve the reported result."
    ],
    "sources": [
      {
        "label": "NiCE — Workforce Management for Contact Centers https://www.nice.com/guide/wfo/workforce-management-for-call-centers"
      },
      {
        "label": "NiCE — What is WFM Software https://www.nice.com/glossary/what-is-wfm-software"
      },
      {
        "label": "Call Centre Helper — Workforce Management Reference Guide https://www.callcentrehelper.com/workforce-management-reference-guide-57260.htm"
      }
    ],
    "depth": {
      "zero": "Service objectives translate customer expectations and business priorities into measurable operating targets. In WFM, those objectives influence staffing requirements, scheduling priorities and intraday decisions. The exact definition matters more than the label.",
      "mentalModel": "Use this specification in Module 02 when learning service-level formulas. The core chain is demand → work → capacity → decision → feedback.",
      "buildSteps": [
        "Write the customer promise.",
        "Convert it into a measurable objective.",
        "Define threshold and population.",
        "Define exclusions and time grain.",
        "Calculate a known example.",
        "Connect target to staffing implications.",
        "Define reporting and escalation."
      ],
      "mastery": "Build a complete service-objective specification and explain how changing the target changes the planning problem.",
      "prerequisites": "02.1.04",
      "transfer": "Use this specification in Module 02 when learning service-level formulas.",
      "levelPlan": [
        {
          "level": "01 · Zero",
          "goal": "Understand the idea.",
          "task": "Explain the lesson in plain language without relying on software."
        },
        {
          "level": "02 · Foundation",
          "goal": "Learn the vocabulary and rules.",
          "task": "Write the definitions, units, assumptions and boundaries."
        },
        {
          "level": "03 · Build",
          "goal": "Perform the method.",
          "task": "Complete the controlled exercise and show your working."
        },
        {
          "level": "04 · Apply",
          "goal": "Use it in operations.",
          "task": "Apply the concept to a changed workforce scenario."
        },
        {
          "level": "05 · Diagnose",
          "goal": "Handle failure and edge cases.",
          "task": "Break one assumption and explain the operational consequence."
        },
        {
          "level": "06 · Hero",
          "goal": "Defend the capability.",
          "task": "Complete the assessment and teach the reasoning to another analyst."
        }
      ]
    }
  }
});
  Object.assign(authoredWfmModule01, {
  "02.1.06": {
    "title": "Operating Hours, Calendars and Events",
    "understanding": "WFM plans against a calendar, not an abstract 24-hour clock. Operating hours, holidays, closures, campaigns, launches and other business events can change demand or the hours in which work must be covered.",
    "notes": [
      "Separate normal operating hours from exceptions.",
      "Calendar rules should be explicit, versioned and owned.",
      "Events can change volume, handling time, staffing availability or all three.",
      "Time zones can affect interval alignment in multi-site operations.",
      "Forecasting and scheduling should use the same approved calendar unless an exception is documented."
    ],
    "highlights": [
      "Calendar configuration is part of the WFM model.",
      "An unusual day should not automatically be treated as normal history.",
      "Events can affect demand and capacity.",
      "Time-zone mistakes can shift staffing coverage."
    ],
    "qa": [
      [
        "Why do operating hours matter?",
        "They define when demand can arrive and when capacity is expected."
      ],
      [
        "What is a special event?",
        "A condition that can materially change normal demand, handling or workforce availability."
      ],
      [
        "Why are time zones important?",
        "The same instant can belong to different local intervals across sites."
      ],
      [
        "Should holidays always be removed from history?",
        "Not automatically. Classify them according to the forecast purpose and comparable future calendar."
      ]
    ],
    "practice": "Build a four-week calendar containing normal days, one holiday, one closure and one campaign event. Mark which intervals should be forecast normally, adjusted, excluded or separately analysed.",
    "workedExample": "A center normally operates 08:00–20:00, but a campaign extends Friday hours to 22:00. WFM must create demand and staffing assumptions for the extra two hours instead of silently treating them as normal history.",
    "assessment": "Submit a planning calendar with operating hours, exceptions, event tags and ownership. Explain how each exception affects forecasting or scheduling.",
    "commonMistakes": [
      "Treating every date as comparable.",
      "Ignoring time zones.",
      "Changing operating hours without updating staffing assumptions."
    ],
    "sources": [
      {
        "label": "NiCE — Workforce Management for Contact Centers https://www.nice.com/guide/wfo/workforce-management-for-call-centers"
      },
      {
        "label": "NiCE — What is WFM Software https://www.nice.com/glossary/what-is-wfm-software"
      },
      {
        "label": "Call Centre Helper — Workforce Management Reference Guide https://www.callcentrehelper.com/workforce-management-reference-guide-57260.htm"
      }
    ],
    "depth": {
      "zero": "WFM plans against a calendar, not an abstract 24-hour clock. Operating hours, holidays, closures, campaigns, launches and other business events can change demand or the hours in which work must be covered.",
      "mentalModel": "Use the calendar later for forecasting baselines and event adjustments. The core chain is demand → work → capacity → decision → feedback.",
      "buildSteps": [
        "Define standard hours.",
        "Define time zone and interval convention.",
        "Create holiday rules.",
        "Create closure and event rules.",
        "Tag historical events.",
        "Map future events to assumptions.",
        "Validate the planning calendar."
      ],
      "mastery": "Create a calendar that a forecasting analyst can use without manually interpreting dates.",
      "prerequisites": "02.1.05",
      "transfer": "Use the calendar later for forecasting baselines and event adjustments.",
      "levelPlan": [
        {
          "level": "01 · Zero",
          "goal": "Understand the idea.",
          "task": "Explain the lesson in plain language without relying on software."
        },
        {
          "level": "02 · Foundation",
          "goal": "Learn the vocabulary and rules.",
          "task": "Write the definitions, units, assumptions and boundaries."
        },
        {
          "level": "03 · Build",
          "goal": "Perform the method.",
          "task": "Complete the controlled exercise and show your working."
        },
        {
          "level": "04 · Apply",
          "goal": "Use it in operations.",
          "task": "Apply the concept to a changed workforce scenario."
        },
        {
          "level": "05 · Diagnose",
          "goal": "Handle failure and edge cases.",
          "task": "Break one assumption and explain the operational consequence."
        },
        {
          "level": "06 · Hero",
          "goal": "Defend the capability.",
          "task": "Complete the assessment and teach the reasoning to another analyst."
        }
      ]
    }
  }
});
  Object.assign(authoredWfmModule01, {
  "02.1.07": {
    "title": "WFM Roles and Decision Rights",
    "understanding": "WFM is a cross-functional operating discipline. Forecasting, capacity planning, scheduling, intraday management, operations, HR and finance can own different decisions. Clear decision rights prevent conflicting changes and make assumptions auditable.",
    "notes": [
      "Separate accountability for forecast, staffing requirement, schedule and intraday action.",
      "Document who supplies inputs, approves assumptions and executes changes.",
      "RTA/intraday teams generally focus on current-day control; responsibilities vary by organization.",
      "Operations often executes actions while WFM provides evidence and recommendations.",
      "Escalation paths should be defined before a service or staffing issue occurs."
    ],
    "highlights": [
      "Role clarity is part of WFM control.",
      "Decision rights should follow the time horizon and decision type.",
      "Owning a model does not automatically mean owning the business decision.",
      "Governance makes assumptions traceable."
    ],
    "qa": [
      [
        "Who owns the forecast?",
        "The organization should explicitly assign ownership; there is no universal title that must own it."
      ],
      [
        "What does an intraday analyst typically do?",
        "Monitor actuals against plan, identify material gaps, coordinate interventions and escalate using defined thresholds."
      ],
      [
        "Why involve operations?",
        "Operations executes many actions and supplies context not visible in historical data."
      ],
      [
        "Why does governance matter?",
        "It prevents conflicting changes to assumptions, targets and actions and creates an audit trail."
      ]
    ],
    "practice": "Create a RACI-style decision map for forecast, staffing requirement, schedule publication, intraday intervention, overtime approval and service escalation.",
    "workedExample": "Forecasting identifies a volume increase, while operations controls overtime approval and supervisors control same-day offline activity. WFM can quantify the gap and recommend an action, but approval and execution rights remain with the defined owners.",
    "assessment": "Submit a decision-rights matrix covering at least six WFM decisions, their inputs, accountable owner, approver, execution team and escalation path.",
    "commonMistakes": [
      "Assuming the analyst can change operational policy.",
      "Allowing multiple people to overwrite assumptions independently.",
      "Escalating without defining a threshold or requested decision."
    ],
    "sources": [
      {
        "label": "NiCE — Workforce Management for Contact Centers https://www.nice.com/guide/wfo/workforce-management-for-call-centers"
      },
      {
        "label": "NiCE — What is WFM Software https://www.nice.com/glossary/what-is-wfm-software"
      },
      {
        "label": "Call Centre Helper — Workforce Management Reference Guide https://www.callcentrehelper.com/workforce-management-reference-guide-57260.htm"
      }
    ],
    "depth": {
      "zero": "WFM is a cross-functional operating discipline. Forecasting, capacity planning, scheduling, intraday management, operations, HR and finance can own different decisions. Clear decision rights prevent conflicting changes and make assumptions auditable.",
      "mentalModel": "Reuse the decision-rights map throughout the remaining WFM modules. The core chain is demand → work → capacity → decision → feedback.",
      "buildSteps": [
        "List recurring decisions.",
        "Identify required inputs.",
        "Assign accountable owners.",
        "Define approval rights.",
        "Define execution responsibility.",
        "Set escalation thresholds.",
        "Document the audit trail."
      ],
      "mastery": "Build a decision-rights map that removes ambiguity from six common WFM decisions.",
      "prerequisites": "02.1.06",
      "transfer": "Reuse the decision-rights map throughout the remaining WFM modules.",
      "levelPlan": [
        {
          "level": "01 · Zero",
          "goal": "Understand the idea.",
          "task": "Explain the lesson in plain language without relying on software."
        },
        {
          "level": "02 · Foundation",
          "goal": "Learn the vocabulary and rules.",
          "task": "Write the definitions, units, assumptions and boundaries."
        },
        {
          "level": "03 · Build",
          "goal": "Perform the method.",
          "task": "Complete the controlled exercise and show your working."
        },
        {
          "level": "04 · Apply",
          "goal": "Use it in operations.",
          "task": "Apply the concept to a changed workforce scenario."
        },
        {
          "level": "05 · Diagnose",
          "goal": "Handle failure and edge cases.",
          "task": "Break one assumption and explain the operational consequence."
        },
        {
          "level": "06 · Hero",
          "goal": "Defend the capability.",
          "task": "Complete the assessment and teach the reasoning to another analyst."
        }
      ]
    }
  }
});
  Object.assign(authoredWfmModule01, {
  "02.1.08": {
    "title": "The End-to-End WFM Cycle",
    "understanding": "The WFM cycle turns business demand into workforce decisions and feeds actual performance back into the next planning cycle. The core sequence is forecast demand, calculate requirements, build schedules, manage the day, measure outcomes and improve assumptions.",
    "notes": [
      "Forecasting estimates future demand; staffing translates workload and service objectives into required capacity.",
      "Scheduling converts requirements into feasible coverage under skills, shifts, breaks and availability constraints.",
      "Intraday management compares actual conditions with plan and coordinates controlled interventions.",
      "Post-period analysis measures forecast error, service, staffing, adherence and other outcomes.",
      "Feedback should improve future assumptions rather than merely explain the past."
    ],
    "highlights": [
      "WFM is a closed learning cycle, not a one-time forecast.",
      "Each stage has different inputs, decisions and owners.",
      "Bad definitions or data propagate into later stages.",
      "Actual outcomes should improve future planning."
    ],
    "qa": [
      [
        "What is the WFM cycle?",
        "Forecast demand → calculate requirements → schedule capacity → manage intraday → measure outcomes → improve the next plan."
      ],
      [
        "Why does scheduling follow staffing requirements?",
        "Requirements describe needed coverage; scheduling attempts to satisfy them under real employee and business constraints."
      ],
      [
        "What happens when actual demand differs from forecast?",
        "Intraday management assesses the gap and chooses interventions; the event should also inform later review."
      ],
      [
        "How does the cycle improve?",
        "Actual results, errors and exceptions feed back into assumptions, models, calendars and operating rules."
      ]
    ],
    "practice": "Build an end-to-end WFM flow. For every stage write input, activity, output, owner, decision and feedback signal. Then introduce a forecast miss and trace the response from intraday action through post-day review.",
    "workedExample": "Forecast says 100 contacts per 30-minute interval, but actual demand reaches 130 while two scheduled agents are absent. Intraday compares demand and staffing with plan, estimates service risk, coordinates an approved intervention, records the cause and feeds the event into forecast and attendance review.",
    "assessment": "Complete a one-page WFM cycle map and a case walkthrough showing how a forecast miss travels through staffing, schedule, intraday action, reporting and future planning.",
    "commonMistakes": [
      "Treating forecasting as the end of WFM.",
      "Changing the schedule without checking skill and service impact.",
      "Failing to feed actual outcomes into future planning."
    ],
    "sources": [
      {
        "label": "NiCE — Workforce Management for Contact Centers https://www.nice.com/guide/wfo/workforce-management-for-call-centers"
      },
      {
        "label": "NiCE — What is WFM Software https://www.nice.com/glossary/what-is-wfm-software"
      },
      {
        "label": "Call Centre Helper — Workforce Management Reference Guide https://www.callcentrehelper.com/workforce-management-reference-guide-57260.htm"
      }
    ],
    "depth": {
      "zero": "The WFM cycle turns business demand into workforce decisions and feeds actual performance back into the next planning cycle. The core sequence is forecast demand, calculate requirements, build schedules, manage the day, measure outcomes and improve assumptions.",
      "mentalModel": "This cycle becomes the backbone for the remaining 17 WFM modules. The core chain is demand → work → capacity → decision → feedback.",
      "buildSteps": [
        "Define the planning horizon and demand.",
        "Translate demand into required capacity.",
        "Build a feasible schedule.",
        "Compare actual with forecast and schedule.",
        "Intervene when material gaps appear.",
        "Measure outcomes and root causes.",
        "Feed validated learning into the next planning cycle."
      ],
      "mastery": "Run a complete WFM case from forecast through intraday recovery and explain how the evidence improves the next planning cycle.",
      "prerequisites": "02.1.07",
      "transfer": "This cycle becomes the backbone for the remaining 17 WFM modules.",
      "levelPlan": [
        {
          "level": "01 · Zero",
          "goal": "Understand the idea.",
          "task": "Explain the lesson in plain language without relying on software."
        },
        {
          "level": "02 · Foundation",
          "goal": "Learn the vocabulary and rules.",
          "task": "Write the definitions, units, assumptions and boundaries."
        },
        {
          "level": "03 · Build",
          "goal": "Perform the method.",
          "task": "Complete the controlled exercise and show your working."
        },
        {
          "level": "04 · Apply",
          "goal": "Use it in operations.",
          "task": "Apply the concept to a changed workforce scenario."
        },
        {
          "level": "05 · Diagnose",
          "goal": "Handle failure and edge cases.",
          "task": "Break one assumption and explain the operational consequence."
        },
        {
          "level": "06 · Hero",
          "goal": "Defend the capability.",
          "task": "Complete the assessment and teach the reasoning to another analyst."
        }
      ]
    }
  }
});

  const wfmModule01Depth = {
    "02.1.01": {
      concepts:["contact center","interaction","channel","queue","routing","skill","workload","service objective","WFM"],
      firstPrinciples:["Customer demand creates work.","Routing determines where work is offered.","Skills determine which resources are eligible.","Handling work consumes capacity.","Service objectives define the operating response expected."],
      glossary:[["Contact center","An operation that receives, routes, handles and resolves customer or business interactions."],["Queue","A logical destination or waiting/work population."],["Skill","A capability or eligibility attribute used to determine who can handle work."],["WFM","Forecasting workload, planning capacity, scheduling resources and managing changes against the plan."]],
      deepDive:["Use the chain Demand → Routing → Work → Capacity → Outcome → Data. WFM uses evidence from this chain to make planning decisions.","A contact count is not automatically a workload measure. Channel, handling effort, concurrency, backlog and skill requirements can change capacity needs.","Definition control comes first: confirm what the source counts, at what grain, and under which inclusion rules."],
      caseAnalysis:"A 100-seat center handles voice, chat and email. Management asks for one staffing number for tomorrow. Classify the work by channel, arrival pattern, handling model, skills and service objective before discussing headcount.",
      caseQuestions:["Which work is synchronous or asynchronous?","Which skills are exclusive?","Which measures need interval treatment?","What source definitions must be confirmed?"],
      guidedPractice:["Draw the demand-to-outcome chain.","Add two channels and two queues.","Map three skills.","Add one service objective per work type.","Mark the WFM decision affected by each component."],
      independentPractice:"Create an operating model for a fictional healthcare contact center with voice, chat and back-office work. Explain why one staffing formula cannot safely cover all three.",
      takeaways:["A contact center is a system, not merely headcount.","WFM begins with definitions and operating structure.","Volume, workload and capacity are different.","Channel and skill structure must be visible before staffing."],
      assessmentRubric:["Operating model is complete.","Definitions are explicit.","Channel/skill differences are correct.","WFM decisions are connected to components.","Assumptions and unknowns are labelled."],
      reflection:"If an executive gave you only daily contact volume, what additional information would you request before discussing staffing?"
    },
    "02.1.02": {
      concepts:["demand","workload","handling time","capacity","deployable capacity","interval","headroom","shortfall"],
      firstPrinciples:["Demand describes arriving work.","Workload converts demand into effort.","Capacity is usable workforce time under stated constraints.","A gap exists only when workload and capacity use compatible units and grain."],
      glossary:[["Demand","Observed or forecast work entering the operation."],["Workload","Effort required to process demand."],["Capacity","Usable processing capability in a defined period."],["Headroom","Capacity remaining after planned requirement."]],
      deepDive:["For voice, a basic workload bridge is volume × handling time. That produces handling minutes; queueing and operating assumptions may require additional modelling.","Capacity is not paid hours. Breaks, training, absence, skills and schedule placement reduce usable capacity.","Daily totals can conceal interval shortages."],
      caseAnalysis:"Eight 30-minute intervals have the same total daily volume, but AHT rises from 5 to 8 minutes in the afternoon. A daily volume-only plan misses the afternoon pressure.",
      caseQuestions:["Where does workload change if volume is flat?","Which capacity losses are planned?","Why can daily capacity exceed workload while an interval is short?","What evidence confirms the cause?"],
      guidedPractice:["Create eight 30-minute intervals.","Enter volume and AHT.","Calculate workload minutes.","Enter agents and interval length.","Calculate gross capacity.","Flag gaps.","Add an availability assumption and reassess."],
      independentPractice:"Build a demand-work-capacity model for a 50-agent center and identify whether the largest gap is driven by demand, AHT, availability or skills.",
      takeaways:["Volume is not workload.","Paid headcount is not deployable capacity.","Units and grain must match.","Interval gaps matter.","Diagnose before recommending staffing."],
      assessmentRubric:["Units are explicit.","Workload reconciles.","Capacity basis is clear.","A gap is correctly diagnosed.","Arithmetic and assumptions are separated."],
      reflection:"When someone says 'we have enough agents today', what evidence would you ask for?"
    },
    "02.1.03": {
      concepts:["voice","chat","messaging","email","back office","concurrency","backlog","ageing","synchronous","asynchronous","blended capacity"],
      firstPrinciples:["Channels create different arrival and completion patterns.","Synchronous work competes for immediate capacity.","Asynchronous work accumulates backlog and ageing.","Shared capacity requires eligibility, tooling, proficiency and operating rules."],
      glossary:[["Concurrency","Active interactions handled simultaneously under a defined rule."],["Backlog","Arrived work not yet completed."],["Ageing","Time outstanding work has remained unresolved."],["Blended capacity","Capacity intentionally shared across work types."]],
      deepDive:["Voice is usually immediate. Chat may permit controlled concurrency. Email and back-office work can be backlog-driven.","Do not add voice, chat and email contacts into one number without converting them to comparable planning units.","A blended team creates an allocation problem: moving capacity can relieve one shortage while creating another."],
      caseAnalysis:"A blended team supports voice and chat. Voice volume is below forecast, but chat concurrency falls because contacts are unusually complex. Raw contact counts suggest spare capacity; workload does not.",
      caseQuestions:["Did volume, handling effort or concurrency change?","Which channel has the tighter service requirement?","Can agents move without violating skills?","What measurement validates the reallocation?"],
      guidedPractice:["Build a four-channel matrix.","Define each work unit.","Document arrival and service measures.","Define handling/concurrency assumptions.","Map skills and shared-capacity rules.","Test one blended scenario.","Explain the boundary."],
      independentPractice:"Design a blended voice/chat/email team and write the rules under which an agent may move between channels during a 30-minute interval.",
      takeaways:["Channel is a planning dimension.","Concurrency changes capacity relationships.","Backlog introduces ageing.","Blended capacity needs explicit rules."],
      assessmentRubric:["Channel differences are correct.","Planning units are explicit.","Concurrency/backlog assumptions are stated.","Shared-capacity rules are feasible.","A model limitation is identified."],
      reflection:"Which channel would you refuse to model with a simple voice staffing ratio, and why?"
    },
    "02.1.04": {
      concepts:["queue","skill","routing","eligibility","skill matrix","multi-skill","proficiency","shared capacity"],
      firstPrinciples:["Work can only be handled by eligible resources.","Eligibility depends on skills, proficiency, policy and availability.","Multi-skilled agents create shared capacity across competing queues.","Total headcount can look healthy while a skill queue remains short."],
      glossary:[["Eligibility","Conditions under which a resource may handle work."],["Skill matrix","Mapping of employees to skills or certifications."],["Skills-based routing","Routing work using required capabilities."],["Multi-skill","A resource qualified for more than one work type."]],
      deepDive:["Ask 'How many eligible agents can serve this work now?' rather than 'How many agents exist?'","A Billing + Spanish queue requires the intersection of those skills.","Shared skills create opportunity cost when one agent can serve competing queues."],
      caseAnalysis:"A center has 20 agents. Queue A needs Billing, Queue B Technical, Queue C Technical + Spanish. Total headcount looks adequate, but only two agents qualify for Queue C.",
      caseQuestions:["Which skills are required?","Which agents are eligible?","Where do shared skills compete?","Could routing or cross-training change effective capacity?"],
      guidedPractice:["Create a six-agent skill matrix.","Define three queues.","Map required skills.","Calculate eligible headcount.","Identify shared agents.","Test a simultaneous spike.","Explain the trade-off."],
      independentPractice:"Build a 10-agent, five-skill matrix and find one queue protected by dedicated capacity and one dependent on shared capacity.",
      takeaways:["Headcount and skill capacity differ.","Routing creates actual eligibility.","Multi-skill planning requires conflict analysis.","Training can change effective capacity."],
      assessmentRubric:["Skill matrix is consistent.","Eligibility is correct.","Shared conflicts are identified.","Headcount versus effective capacity is clear.","A bounded mitigation is proposed."],
      reflection:"If a queue is short by three agents but 20 people are available elsewhere, what questions come first?"
    },
    "02.1.05": {
      concepts:["service objective","service level","threshold","eligible population","denominator","customer promise","target","trade-off"],
      firstPrinciples:["A customer promise must become a measurable definition.","A metric requires population, numerator, denominator, threshold and grain.","The target is a business requirement; WFM models its capacity implications.","Changing the target changes the planning problem."],
      glossary:[["Service objective","A defined performance expectation for a work type."],["Answer threshold","Maximum response time qualifying for the criterion."],["Eligible population","Interactions included in the denominator."],["Target","Desired performance level set by the business."]],
      deepDive:["Never treat 'SLA' as self-defining. The measurement rule determines the denominator and what counts as in-target.","Different channels may use different service units.","Service is one dimension of the trade-off alongside cost, quality and employee constraints."],
      caseAnalysis:"Two reports both show 90% service level, but one excludes abandoned interactions and the other includes them. Reconcile definitions before comparing performance.",
      caseQuestions:["What is each denominator?","What threshold is used?","What exclusions apply?","What grain should be managed?","What staffing implication follows?"],
      guidedPractice:["Write a voice service specification.","Define denominator and threshold.","Create a 10-contact example.","Calculate it.","Add an exclusion and recalculate.","Explain the change.","State the business interpretation."],
      independentPractice:"Create service definitions for voice, chat and email in a fictional operation and explain why their units need not be identical.",
      takeaways:["Definitions control KPI meaning.","Targets are business decisions.","Interval performance matters.","Service cannot be interpreted without population and threshold."],
      assessmentRubric:["Definition is reproducible.","Population and threshold are explicit.","Example calculation is correct.","Exclusions are controlled.","Operational impact is explained."],
      reflection:"What could make two teams honestly report 90% service while disagreeing about performance?"
    },
    "02.1.06": {
      concepts:["operating hours","calendar","holiday","closure","event","campaign","time zone","exception day","comparable history"],
      firstPrinciples:["WFM plans on a calendar.","Operating hours define when work can arrive and capacity is expected.","Events can change demand, handling time, operating hours or availability.","Historical comparability requires classification, not just date filtering."],
      glossary:[["Operating hours","Approved periods in which a work type is open."],["Exception day","A day with conditions different from normal."],["Event","A known occurrence expected to alter demand or capacity."],["Comparable day","A historical period judged sufficiently similar for a planning purpose."]],
      deepDive:["Calendar configuration affects forecasting, scheduling and reporting. A campaign extension should not silently become part of the normal baseline.","Time zones matter when sources, sites or employees use different local clocks.","Events should be classified consistently so normal variation is separated from known structural change."],
      caseAnalysis:"A center normally closes at 20:00 but stays open until 22:00 during a campaign. Historical Fridays have no comparable late hours. Create an explicit future demand and staffing assumption.",
      caseQuestions:["Which history is comparable?","Which intervals are new?","What event metadata should be retained?","What staffing changes are needed?"],
      guidedPractice:["Create a four-week calendar.","Add a holiday.","Add a closure.","Add a campaign extension.","Tag historical events.","Define forecast treatment.","Define staffing treatment."],
      independentPractice:"Design a planning calendar for two time zones, one holiday calendar and three annual campaigns, with ownership and change control.",
      takeaways:["Calendar is part of the model.","Exception days need classification.","Events affect demand and capacity.","Time-zone consistency matters."],
      assessmentRubric:["Normal and exception periods are separated.","Time zone is explicit.","Events have defined treatment.","Operating hours map to staffing.","Ownership is documented."],
      reflection:"When is deleting an unusual day defensible, and when is it safer to classify and model it?"
    },
    "02.1.07": {
      concepts:["WFM roles","decision rights","RACI","forecast owner","scheduler","intraday","operations","approval","escalation","governance"],
      firstPrinciples:["A model can inform a decision without owning it.","Different horizons need different responsibilities.","Inputs, assumptions, approvals and execution must be traceable.","Escalation needs thresholds and owners defined before the incident."],
      glossary:[["Decision right","Authority to approve, change or execute a defined decision."],["RACI","Responsibility model for responsible, accountable, consulted and informed roles."],["Intraday","Current operating period where actuals are compared with plan."],["Governance","Controls that make definitions, assumptions and changes traceable."]],
      deepDive:["Forecasting, staffing, scheduling and intraday are connected but distinct responsibilities. Organizations assign them differently.","A good decision-rights matrix identifies evidence, accountable owner, approver, execution team and escalation threshold.","Governance prevents multiple teams from independently changing assumptions."],
      caseAnalysis:"Forecasting identifies a volume increase. Operations controls overtime approval. Supervisors control same-day offline activity. Intraday quantifies the gap and coordinates action but does not silently change policy.",
      caseQuestions:["Who owns the forecast assumption?","Who approves overtime?","Who can change today's schedule?","What evidence triggers escalation?","How is the decision recorded?"],
      guidedPractice:["List six WFM decisions.","Assign RACI roles.","Add required evidence.","Set approval boundaries.","Define escalation thresholds.","Add an audit field.","Test one ambiguous scenario."],
      independentPractice:"Create a decision-rights matrix for a 500-agent center covering forecast, staffing, schedule publication, overtime, intraday reallocation and service escalation.",
      takeaways:["Role clarity is operational control.","Decision ownership varies by organization.","Evidence and approval boundaries should be explicit.","Governance makes WFM reproducible."],
      assessmentRubric:["Six decisions are mapped.","Accountability is unambiguous.","Approval and execution are separated.","Escalation thresholds are measurable.","One governance failure is explained."],
      reflection:"What happens when an analyst owns the calculation but nobody owns the decision?"
    },
    "02.1.08": {
      concepts:["forecast","staffing requirement","schedule","intraday","adherence","actuals","variance","feedback","continuous improvement"],
      firstPrinciples:["Forecasting estimates future demand.","Staffing translates demand and service objectives into capacity.","Scheduling turns requirements into feasible coverage.","Intraday responds when reality departs from plan.","Measurement feeds validated learning into the next cycle."],
      glossary:[["Forecast","Estimate of future workload using information available before the period."],["Staffing requirement","Capacity needed under stated workload and service assumptions."],["Intraday management","Comparing actual conditions with plan and coordinating controlled responses."],["Feedback loop","Using outcomes and root causes to improve future inputs and decisions."]],
      deepDive:["Use the loop Forecast → Requirement → Schedule → Execute → Observe → Intervene → Measure → Improve.","A miss is not automatically a forecast problem; it may come from volume, AHT, absence, adherence, routing, skills, events or an incorrect assumption.","Post-day analysis should connect root cause to the planning layer that should change."],
      caseAnalysis:"Forecast is 100 contacts per 30 minutes. Actual is 130, AHT is 10% higher, and two scheduled agents are absent. Separate demand variance from capacity variance before choosing an action.",
      caseQuestions:["Which variance is demand-driven?","Which is capacity-driven?","What can be changed today?","What belongs in the next forecast or staffing assumption?","What evidence should be retained?"],
      guidedPractice:["Draw the WFM cycle.","Create forecast-versus-actual.","Add scheduled-versus-actual staffing.","Separate gap drivers.","Choose an intraday action.","Set a recovery checkpoint.","Write post-day learning."],
      independentPractice:"Run a full case from forecast through intraday recovery and post-day review. Produce a one-page evidence pack showing root cause, action and future planning change.",
      takeaways:["WFM is a cycle, not a one-time forecast.","Different layers solve different problems.","Actual outcomes must feed future assumptions.","A good review changes something measurable."],
      assessmentRubric:["All stages are connected.","Demand and capacity variance are separated.","Action is bounded and evidence-based.","Future change is specific.","Reasoning can be defended."],
      reflection:"If both forecast and schedule were wrong, how would you avoid blaming the wrong layer?"
    }
  };
  Object.keys(wfmModule01Depth).forEach(key=>{
    if(authoredWfmModule01[key]) Object.assign(authoredWfmModule01[key],wfmModule01Depth[key]);
  });


  /*
   * WFM FULL AUTHORING LAYER
   * Every one of the 144 WFM lessons receives a topic-specific mini-course record.
   * Module 01 can override these fields with its separately authored material.
   */
  const WFM_MODULE_CONTEXT={
    "02.1":["contact-center operating model","demand, channels, queues, skills and service objectives","define how work enters, routes and consumes capacity","Create a contact-center operating map and identify the WFM decision affected by each component."],
    "02.2":["WFM mathematics","units, workload, service, occupancy, shrinkage and FTE arithmetic","convert operational observations into reproducible calculations","Build a calculation sheet with explicit units, formulas, assumptions and reconciliation checks."],
    "02.3":["KPI architecture","definitions, numerators, denominators, grain, reconciliation and governance","make every KPI reproducible and decision-ready","Write a KPI specification and reconcile it against a controlled sample."],
    "02.4":["queueing theory","arrival rate, service rate, traffic intensity and Erlang models","estimate delay/capacity while stating queueing assumptions","Solve a small queueing case, then change one assumption and explain the effect."],
    "02.5":["WFM data preparation","sources, grain, definitions, missingness, duplicates, anomalies and reconciliation","turn raw operational exports into a trusted planning dataset","Build a data-quality checklist and reconcile a synthetic interval extract."],
    "02.6":["forecasting fundamentals","baseline history, time grain, patterns, trend, seasonality and events","create a transparent demand forecast before adding model complexity","Build a baseline forecast and document every adjustment."],
    "02.7":["advanced forecasting","moving averages, smoothing, regression, ARIMA concepts and backtesting","compare methods using out-of-sample evidence rather than visual fit","Backtest two candidate methods and document model selection."],
    "02.8":["forecast governance","error, bias, aggregation, overrides, assumptions and version control","measure forecast performance and control changes to the planning baseline","Create a forecast review pack with error, bias, cause and action."],
    "02.9":["staffing and capacity planning","workload, queueing, occupancy, shrinkage, interval requirements and scenarios","translate forecast demand into required capacity","Build an interval staffing requirement and test sensitivity to key assumptions."],
    "02.10":["scheduling and shift planning","coverage curves, shifts, breaks, days off, skills and schedule efficiency","turn staffing requirements into feasible employee coverage","Overlay schedules on interval requirements and diagnose coverage gaps/excess."],
    "02.11":["people capacity control","adherence, conformance, attendance, shrinkage, offline work and coaching","explain how planned and actual workforce availability change capacity","Build a shrinkage/adherence bridge and identify controllable root causes."],
    "02.12":["intraday management","start-of-day readiness, forecast variance, staffing variance, queues, interventions and recovery","control the current operating period without confusing symptoms with causes","Run an intraday scenario and document trigger, action, owner and recovery checkpoint."],
    "02.13":["multi-channel WFM","voice, asynchronous work, concurrency, blended capacity, skills and priority","plan shared capacity across different work mechanics","Create a multi-channel capacity matrix and test one competing-demand scenario."],
    "02.14":["WFM reporting and analytics","KPI layers, interval views, variance, root cause and executive communication","turn operational data into decisions rather than dashboard decoration","Build an evidence-to-decision reporting page with one root-cause narrative."],
    "02.15":["WFM technology and integration","spreadsheets, calculators, WFM platforms, ACD/CRM/HR data, APIs and controls","understand the data and system architecture behind a WFM process","Map source systems to a governed WFM data pipeline."],
    "02.16":["workforce optimization","objective functions, constraints, cost, service, what-if and sensitivity","evaluate trade-offs without hiding constraints","Run a scenario matrix and explain the decision boundary."],
    "02.17":["WFM governance and strategy","roles, stakeholder management, cadence, change control, long-term planning and maturity","connect operational planning to governance and workforce strategy","Create a WFM operating cadence and decision-rights map."],
    "02.18":["integrated WFM case work","diagnosis, evidence, root cause, intervention, executive decision and end-to-end design","integrate the full WFM cycle into defensible case decisions","Complete the case from evidence through action, validation and executive communication."]
  };

  function wfmTopicType(title){
    const t=title.toLowerCase();
    if(/erlang|queueing|arrival rate|service rate|traffic intensity|probability of delay/.test(t))return"queue";
    if(/forecast|moving average|smoothing|holt|arima|regression|trend|seasonality|backtest|bias|error/.test(t))return"forecast";
    if(/schedule|shift|coverage|break|days off|multi-skilled|scheduling/.test(t))return"schedule";
    if(/intraday|real-time|start-of-day|recovery|escalation|intervention|queue and service/.test(t))return"intraday";
    if(/adherence|attendance|absenteeism|shrinkage|offline|conformance|coaching/.test(t))return"people";
    if(/service level|asa|abandon|aht|occupancy|utilization|fte|staffing|capacity|offered|handled|workload|variance/.test(t))return"metric";
    if(/data|reconciliation|missing|duplicate|outlier|anomal|granularity|source/.test(t))return"data";
    if(/report|heatmap|analytics|executive|kpi/.test(t))return"analytics";
    if(/tool|spreadsheet|calculator|application|acd|crm|hr|api|pipeline|cloud|automation/.test(t))return"technology";
    if(/optimization|objective|constraint|scenario|sensitivity|trade-off/.test(t))return"optimization";
    if(/role|stakeholder|governance|cadence|audit|planning team|strategy|maturity|transformation|attrition|hiring/.test(t))return"governance";
    if(/case|diagnos|capstone|complete/.test(t))return"case";
    return"foundation";
  }

  function wfmExpansion(domain,module,title,index){
    if(domain!=="02")return null;
    const ctx=WFM_MODULE_CONTEXT[module]||["WFM practice","operational concepts and decision evidence","connect the lesson to a measurable WFM decision","Apply the lesson to a controlled synthetic workforce scenario."];
    const type=wfmTopicType(title);
    const typeFrame={
      foundation:["Start with the operating meaning of the topic before using a formula or tool.","Definition → inputs → mechanism → evidence → decision.","Define the term, identify its boundaries, build a small example, validate it and explain the operational consequence."],
      metric:["Treat the topic as a measurement problem: definition, population, numerator, denominator, grain and interpretation.","Metric → data population → calculation → validation → decision.","Reconcile a small sample manually before trusting the dashboard result."],
      queue:["Treat the topic as a queueing problem: arrivals, service capacity, waiting and assumptions.","Arrival → workload → capacity → waiting → service outcome.","Change one queueing assumption and explain why the output moves."],
      forecast:["Treat the topic as a forecasting problem: target, history, pattern, model, error and decision.","History → baseline → pattern/model → forecast → error → action.","Hold out historical periods and evaluate the method rather than judging it only from the fitted series."],
      schedule:["Treat the topic as a constrained coverage problem.","Requirement curve → feasible shifts → coverage → constraints → quality.","Overlay coverage against interval requirement and identify both shortage and excess."],
      people:["Treat the topic as a workforce-availability problem.","Planned workforce → actual availability → productive capacity → variance → action.","Separate planned assumptions from observed exceptions before coaching or escalation."],
      intraday:["Treat the topic as a control-loop problem.","Plan → actual → variance → threshold → intervention → recovery → review.","Choose an action only after separating demand variance from capacity variance."],
      data:["Treat the topic as a data-quality problem.","Source → definition → grain → validation → transformation → trusted dataset.","Create a reconciliation test that can fail loudly when source data changes."],
      analytics:["Treat the topic as an evidence-to-decision problem.","Question → KPI → variance → root cause → implication → decision.","Build one narrative where every conclusion can be traced to a measured input."],
      technology:["Treat the topic as a system-control problem.","Source → integration → transformation → calculation → user → control.","Map dependencies and identify where a bad input can propagate into a WFM decision."],
      optimization:["Treat the topic as a constrained decision problem.","Objective → variables → constraints → scenarios → trade-off → decision.","Change one constraint and explain why the solution space changes."],
      governance:["Treat the topic as an accountability problem.","Decision → owner → evidence → approval → execution → audit.","Define who can change an assumption and how the change is recorded."],
      case:["Treat the topic as an analyst case, not a theory question.","Evidence → diagnosis → root cause → options → decision → validation.","Defend the conclusion and state what evidence would change it."]
    }[type]||null;
    const concepts=title.split(/\s+(?:and|&|for|to|vs\.?|in|of)\s+/i).filter(Boolean).slice(0,8);
    const firstPrinciples=[
      title+" is useful only when its definition and operating boundary are explicit.",
      ctx[1]+".",
      "The result should be expressed at the same time grain and population as the decision it supports.",
      "Observed facts, planning assumptions and business rules must be kept separate.",
      "A strong WFM analyst validates the result before turning it into an action."
    ];
    const glossary=[
      [title,"The specific WFM concept being studied in this lesson, defined by its operational use and measurement boundary."],
      ["Decision grain","The time, population, channel, skill or organisational level at which the decision must be made."],
      ["Planning assumption","A stated input used when the future value cannot yet be observed."],
      ["Validation","A check that confirms the calculation, transformation or interpretation is consistent with trusted evidence."]
    ];
    const deepDive=[
      typeFrame?.[0]||"Start with the operating meaning of the topic before applying it.",
      typeFrame?.[1]||ctx[1],
      "The lesson belongs to "+ctx[0]+". Do not isolate the calculation from the upstream inputs and downstream decision."
    ];
    const caseAnalysis="Synthetic WFM case: "+title+". A planning team sees a change in performance or capacity and must determine whether the signal is real, how it should be measured, what assumptions matter, and what action is justified. The analyst must distinguish evidence from inference before making the recommendation.";
    const caseQuestions=[
      "What exactly is being measured or decided?",
      "Which source fields, assumptions and time grain are required?",
      "What alternative explanation could produce the same observed result?",
      "What evidence would change the decision?"
    ];
    const guidedPractice=[
      "Write the operational question in one sentence.",
      "List the required inputs and units.",
      "Build a three-to-eight-row controlled example.",
      "Apply the lesson method and show intermediate steps.",
      "Reconcile the result against an independent check.",
      "Interpret the result for service, capacity, cost or risk.",
      "State the action, owner and validation checkpoint."
    ];
    const independentPractice="Create a small synthetic WFM scenario for '"+title+"'. Produce the calculation or analytical output, document assumptions, identify one failure mode, and write the operational decision that follows.";
    const takeaways=[
      "Definitions and grain are part of the answer.",
      "WFM decisions require both quantitative evidence and operational context.",
      "Assumptions should be visible and testable.",
      "Validation should happen before escalation or recommendation.",
      "The same method should be reproducible by another analyst."
    ];
    const assessmentRubric=[
      "The topic is defined precisely.",
      "Inputs, units and grain are explicit.",
      "The worked example is reproducible.",
      "At least one validation or reconciliation check is shown.",
      "The operational consequence and limitation are explained."
    ];
    const formulaByType={
      metric:"Where applicable, express the metric as a clearly defined numerator divided by denominator; document exclusions and threshold rules.",
      queue:"Where applicable, convert arrival volume × handling time into workload and state the queueing assumptions before applying Erlang or another model.",
      forecast:"Compare the forecast with held-out actuals using an appropriate error measure and inspect bias before accepting the method.",
      schedule:"Compare scheduled coverage with interval requirement and quantify under-coverage and over-coverage separately.",
      people:"Bridge planned workforce time to productive/available capacity and separate planned from unplanned losses.",
      data:"Reconcile row counts, keys, totals, time grain and required fields before using the dataset for planning.",
      analytics:"Trace every headline KPI to its source, definition, filter context and supporting evidence.",
      technology:"Document source, interface, transformation, refresh, failure handling and ownership.",
      optimization:"State objective, decision variables, constraints and scenario assumptions before interpreting a solution.",
      governance:"Document decision owner, approver, evidence standard, change record and escalation threshold.",
      case:"Structure the diagnosis as symptom → evidence → root cause → options → trade-off → action → validation.",
      intraday:"Separate forecast variance, AHT/workload variance, staffing variance and routing/skill variance before selecting an intervention.",
      forecast:"Separate baseline, adjustment and actual outcome; evaluate on periods not used to choose the method.",
      foundation:"Define the concept, its inputs, its boundary and the downstream WFM decision before calculating."
    };
    const workedExample={
      metric:"Example: create a 10-row interval sample, calculate the topic manually, then compare the result with the system value. If the numbers differ, reconcile definitions and population before changing the formula.",
      queue:"Example: 30 contacts arrive in 30 minutes and average handling time is 5 minutes. Offered workload is 150 handling minutes, or 5 Erlangs, before queueing effects. The lesson is to state the interval and assumptions explicitly.",
      forecast:"Example: use the previous comparable period as a naive baseline, forecast the next period, compare it with actual demand, calculate error, and only then test a more complex method.",
      schedule:"Example: an interval requires 20 agents and the schedule provides 17. The interval has a three-agent coverage shortfall even if the daily headcount looks sufficient.",
      people:"Example: begin with 100 paid hours, remove defined planned and unplanned losses, and compare the resulting productive capacity with the planning assumption.",
      data:"Example: reconcile expected versus received interval rows, check duplicate keys, verify time-zone handling, and compare aggregate totals with the source before loading the planning table.",
      analytics:"Example: start with one KPI variance, drill into the interval/LOB/skill dimension that explains it, and write the decision evidence in the same order a manager would review it.",
      technology:"Example: trace one WFM number from ACD/CRM/HR source through transformation to the report. Mark each hand-off where definition or data quality could change the result.",
      optimization:"Example: run a baseline scenario, change one constraint, compare service/cost/coverage outcomes, and document the trade-off instead of treating the solver output as automatically correct.",
      governance:"Example: record a forecast override with owner, reason, evidence, timestamp, expected impact and post-period review. The control is incomplete if the change cannot be reconstructed.",
      case:"Example: a KPI deteriorates. Reconcile the data, isolate the affected intervals and skills, separate demand from capacity causes, test options and document what evidence would confirm recovery.",
      intraday:"Example: forecast is 100 contacts/30 minutes and actual is 130 while two scheduled agents are absent. Separate demand variance from capacity variance before choosing overtime, reallocation or another response.",
      foundation:"Example: create a three-interval table, define every field, perform the lesson method step by step, reconcile the output, then state the operational action it supports."
    }[type]||"Use a small controlled example and show every intermediate step.";
    return {
      concepts:concepts.concat([type,ctx[0]]).slice(0,10),
      firstPrinciples,
      glossary,
      deepDive,
      caseAnalysis,
      caseQuestions,
      guidedPractice,
      independentPractice,
      takeaways,
      assessmentRubric,
      reflection:"What assumption in "+title+" would you challenge first if the operational result looked wrong?",
      formulaNote:formulaByType[type]||formulaByType.foundation,
      topicType:type,
      workedExampleExpansion:workedExample
    };
  }

  function buildLesson(domain,module,title,index){
    const focus=focusFor(domain,module,title);
    const s=lessonSpecific(domain,module,title);
    const wfmGenerated=domain==="02" ? wfmExpansion(domain,module,title,index) : null;
    const authoredLesson=(domain==="02" && module==="02.1") ? authoredWfmModule01[module+"."+String(index+1).padStart(2,"0")] : null;
    const mistakes=commonMistakes[domain];
    const understanding=domainFrames[domain]+" "+focus+" This lesson is intentionally tied to the module sequence: "+module+".";
    const notes=s.notes.length?s.notes:[
      "Define the lesson's terms and expected unit before doing the calculation or build.",
      "Identify the source fields and assumptions required.",
      "Apply the concept to a small controlled example.",
      "Validate the result before using it in a decision."
    ];
    const highlights=s.highlights.length?s.highlights:[
      "Definitions and assumptions are part of the result.",
      "Use the smallest example that proves the logic.",
      "Validate important outputs independently."
    ];
    const qa=s.qa.length?s.qa:[
      ["What should I check first?","Definition, inputs, unit, grain and expected output."],
      ["What is the common mistake?","Producing a precise result from an incorrect or incomplete input."],
      ["How should I validate it?","Use a small known example and reconcile the result with an independent calculation."]
    ];
    return {
      ...(wfmGenerated || {}),
      ...(authoredLesson || {}),
      id: domain+"."+module.split(".")[1]+"."+String(index+1).padStart(2,"0"),
      title:title,
      understanding:authoredLesson?.understanding || understanding,
      notes:authoredLesson?.notes || notes,
      highlights:authoredLesson?.highlights || highlights,
      qa:authoredLesson?.qa || qa,
      practice:authoredLesson?.practice || s.practice,
      workedExample:authoredLesson?.workedExample || s.workedExample,
      commonMistakes:authoredLesson?.commonMistakes || mistakes,
      assessment:authoredLesson?.assessment || s.assessment || "Submit the worked example, explain the assumptions, and show one validation check.",
      sources:authoredLesson?.sources || sourceMap[domain],
      depth:authoredLesson?.depth || deepLesson(domain,module,title,index)
    };
  }

  const curriculum=window.WI_CURRICULUM;
  if(!curriculum?.domains)return;
  const content={};
  curriculum.domains.forEach(d=>{
    const modules=d.modules.map(m=>({
      id:m.id,
      title:m.name,
      executivePoint:focusFor(d.id,m.name,m.lessons[0]||m.name),
      lessons:m.lessons.map((lesson,i)=>buildLesson(d.id,m.id,lesson,i))
    }));
    content[d.id]={
      executiveFrame:domainFrames[d.id],
      researchBasis:sourceMap[d.id],
      modules
    };
  });
  window.WI_CURRICULUM_CONTENT=content;
  window.WI_CURRICULUM_CONTENT_META={
    version:"2.0.0",
    standard:"Research-backed, source-attributed, practical lesson layer",
    totals: curriculum.domains.reduce((n,d)=>n+d.modules.reduce((a,m)=>a+m.lessons.length,0),0)
  };
})();