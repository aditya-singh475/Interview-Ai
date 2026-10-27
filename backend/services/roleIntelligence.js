const ROLE_BLUEPRINTS = {
  'Frontend Developer': {
    coreSkills: ['JavaScript', 'React', 'HTML/CSS', 'DOM Manipulation', 'Browser APIs'],
    secondarySkills: ['TypeScript', 'Next.js', 'Web Performance', 'State Management', 'Testing'],
    topicWeights: { JavaScript: 25, React: 25, 'HTML/CSS': 15, Browser: 10, Performance: 10, APIs: 10, Behavioral: 5 },
    scenarioTopics: ['State duplication across components', 'Rendering virtualized lists', 'CSS Grid vs Flexbox overflow', 'API polling vs WebSockets'],
    behavioralFocus: ['Cross-team design handoff', 'Debugging edge cases', 'Refactoring legacy UI']
  },
  'Backend Developer': {
    coreSkills: ['Node.js', 'Python', 'Java', 'REST APIs', 'Databases', 'SQL', 'Authentication'],
    secondarySkills: ['System Design', 'Redis', 'Docker', 'Microservices', 'GraphQL', 'Message Queues'],
    topicWeights: { TechStack: 20, REST_APIs: 15, Databases: 20, SystemDesign: 15, Authentication: 10, Caching: 10, Behavioral: 10 },
    scenarioTopics: ['Handling 10k concurrent requests', 'Database connection pooling exhaustion', 'Idempotent payment endpoints', 'JWT revocation strategy'],
    behavioralFocus: ['Handling API breaking changes', 'Database outage recovery', 'Mentoring junior devs']
  },
  'Full Stack Developer': {
    coreSkills: ['JavaScript/TypeScript', 'React', 'Node.js', 'SQL/NoSQL', 'REST/GraphQL APIs'],
    secondarySkills: ['DevOps', 'Docker', 'State Management', 'System Design', 'CI/CD'],
    topicWeights: { Frontend: 30, Backend: 30, Databases: 15, SystemDesign: 15, Behavioral: 10 },
    scenarioTopics: ['Full-stack expense tracker architecture', 'Handling image upload pipeline', 'End-to-end authentication flow'],
    behavioralFocus: ['Prioritizing feature tradeoffs', 'Fixing production deployment bugs']
  },
  'React Developer': {
    coreSkills: ['React', 'JavaScript', 'Hooks', 'Context API', 'Redux/Zustand', 'Virtual DOM'],
    secondarySkills: ['Next.js', 'Webpack/Vite', 'Tailwind', 'Jest/RTL', 'TypeScript'],
    topicWeights: { ReactHooks: 35, JavaScript: 25, Performance: 15, Architecture: 15, Behavioral: 10 },
    scenarioTopics: ['Optimizing re-renders in deep component tree', 'Custom hook for infinite scrolling', 'SSR hydration mismatches'],
    behavioralFocus: ['Migrating class components to hooks', 'Handling UI UX feedback']
  },
  'Node.js Developer': {
    coreSkills: ['Node.js', 'Event Loop', 'Express/Fastify', 'Async Programming', 'Streams', 'MongoDB/PostgreSQL'],
    secondarySkills: ['Microservices', 'WebSockets', 'Redis', 'Worker Threads', 'Security'],
    topicWeights: { EventLoop: 25, APIs: 25, Databases: 20, AsyncPerformance: 20, Behavioral: 10 },
    scenarioTopics: ['Memory leak in event emitter listeners', 'Non-blocking file processing pipeline', 'Rate limiting middleware architecture'],
    behavioralFocus: ['Debugging production CPU spikes', 'Designing API contracts']
  },
  'Java Developer': {
    coreSkills: ['Java', 'Spring Boot', 'OOP', 'Collections', 'Multithreading', 'Hibernate/JPA'],
    secondarySkills: ['Kafka', 'Microservices', 'Maven/Gradle', 'JUnit', 'Docker'],
    topicWeights: { CoreJava: 25, SpringFramework: 25, Concurrency: 20, Databases: 20, Behavioral: 10 },
    scenarioTopics: ['JVM Garbage Collection tuning', 'Spring Transactional propagation', 'Thread-safe singleton implementation'],
    behavioralFocus: ['Legacy Java codebase migration', 'Refactoring monolithic enterprise apps']
  },
  'Python Developer': {
    coreSkills: ['Python', 'Django/FastAPI', 'OOP', 'Data Structures', 'Asyncio', 'SQLAlchemy'],
    secondarySkills: ['Celery', 'Redis', 'Docker', 'PyTest', 'REST Framework'],
    topicWeights: { CorePython: 30, WebFramework: 25, DatabaseORM: 20, Concurrency: 15, Behavioral: 10 },
    scenarioTopics: ['GIL limitations in CPU-bound tasks', 'Celery async task queue backpressure', 'FastAPI dependency injection pattern'],
    behavioralFocus: ['Code style standardization', 'Building high-throughput API services']
  },
  'C++ Developer': {
    coreSkills: ['C++', 'Pointers & Memory Management', 'STL', 'RAII', 'Templates', 'Multithreading'],
    secondarySkills: ['Boost', 'CMake', 'Valgrind', 'Embedded Systems', 'Data Structures'],
    topicWeights: { MemoryManagement: 30, STL_Templates: 25, OOP_RAII: 20, Concurrency: 15, Behavioral: 10 },
    scenarioTopics: ['Dangling pointers vs smart pointers', 'Cache locality in contiguous vectors', 'Custom memory allocator design'],
    behavioralFocus: ['Resolving segfaults under tight deadlines', 'Optimizing low-latency loops']
  },
  'Data Analyst': {
    coreSkills: ['SQL', 'Excel', 'Statistics', 'Python/Pandas', 'PowerBI/Tableau', 'Data Visualization'],
    secondarySkills: ['ETL', 'Data Cleaning', 'A/B Testing', 'Business Metrics'],
    topicWeights: { SQL: 30, Excel: 15, Statistics: 15, Python_Pandas: 15, DataViz: 10, BusinessReasoning: 10, Behavioral: 5 },
    scenarioTopics: ['Analyzing customer churn spikes', 'Complex SQL window functions', 'Dealing with missing & skewed survey data'],
    behavioralFocus: ['Presenting insights to non-technical stakeholders', 'Data quality disputes']
  },
  'Data Scientist': {
    coreSkills: ['Python', 'Machine Learning', 'Statistics', 'Pandas/NumPy', 'Scikit-Learn', 'SQL'],
    secondarySkills: ['Deep Learning', 'PyTorch/TensorFlow', 'Model Deployment', 'Feature Engineering'],
    topicWeights: { ML_Algorithms: 25, Statistics: 20, FeatureEngineering: 20, Python_SQL: 25, Behavioral: 10 },
    scenarioTopics: ['Class imbalance in fraud detection', 'Preventing model overfitting', 'Evaluating precision vs recall in medical diagnostics'],
    behavioralFocus: ['Explaining model predictions to executives', 'Iterative hypothesis testing']
  },
  'Machine Learning Engineer': {
    coreSkills: ['Python', 'PyTorch/TensorFlow', 'ML Pipeline', 'Model Serving', 'Docker', 'Kubernetes'],
    secondarySkills: ['MLOps', 'ONNX', 'GPU Optimization', 'Feature Stores', 'CI/CD for ML'],
    topicWeights: { ModelArchitecture: 25, MLOps_Deployment: 25, Python_C: 20, Scalability: 20, Behavioral: 10 },
    scenarioTopics: ['Serving LLM model latency reduction', 'Data drift detection pipeline', 'Distributed training multi-GPU sync'],
    behavioralFocus: ['Productionizing research models', 'Managing compute cost trade-offs']
  },
  'DevOps Engineer': {
    coreSkills: ['Linux', 'Docker', 'Kubernetes', 'CI/CD (GitHub Actions/Jenkins)', 'Terraform', 'AWS/GCP'],
    secondarySkills: ['Bash/Python', 'Prometheus/Grafana', 'Networking', 'Security'],
    topicWeights: { Containerization_K8s: 25, IaC_Terraform: 20, CICD: 20, Cloud_AWS: 20, Behavioral: 15 },
    scenarioTopics: ['Zero-downtime blue-green deployment', 'Kubernetes pod crashloop backoff triage', 'Securing Terraform state files'],
    behavioralFocus: ['Production incident response', 'Automating manual release processes']
  },
  'QA Engineer': {
    coreSkills: ['Test Planning', 'Manual Testing', 'Regression Testing', 'Bug Tracking (Jira)', 'API Testing (Postman)'],
    secondarySkills: ['Selenium', 'Cypress', 'SQL', 'Load Testing'],
    topicWeights: { TestDesign: 30, APITesting: 25, DefectManagement: 25, Behavioral: 20 },
    scenarioTopics: ['Testing edge cases in payment gateway', 'Creating test matrix for cross-browser support', 'Boundary value analysis'],
    behavioralFocus: ['Pushing back against premature release deadlines', 'Collaborating with developers']
  },
  'Automation Tester': {
    coreSkills: ['Selenium/Cypress/Playwright', 'Java/JavaScript/Python', 'Test Frameworks (TestNG/Jest)', 'API Automation', 'CI/CD Integration'],
    secondarySkills: ['Docker', 'Appium', 'Performance Testing (JMeter)', 'Page Object Model'],
    topicWeights: { TestAutomation: 35, Programming: 25, FrameworkDesign: 20, CICD: 10, Behavioral: 10 },
    scenarioTopics: ['Designing Page Object Model framework', 'Handling flaky async UI tests', 'Parallel execution in CI pipelines'],
    behavioralFocus: ['Transitioning team from manual to automated testing', 'Automating legacy suites']
  },
  'Android Developer': {
    coreSkills: ['Kotlin', 'Android SDK', 'Jetpack Compose', 'MVVM/MVI Architecture', 'Coroutines/Flow', 'Retrofit/Room'],
    secondarySkills: ['Java', 'Dagger/Hilt', 'Clean Architecture', 'Unit Testing'],
    topicWeights: { Kotlin_Jetpack: 30, Architecture: 25, Coroutines_Async: 20, Storage_APIs: 15, Behavioral: 10 },
    scenarioTopics: ['Preventing memory leaks in Fragment lifecycle', 'Offline caching with Room & Retrofit', 'Optimizing APK build size'],
    behavioralFocus: ['Adapting to Android OS API deprecations', 'Designing smooth UI animations']
  },
  'iOS Developer': {
    coreSkills: ['Swift', 'SwiftUI', 'UIKit', 'Combine/Async-Await', 'CoreData/SwiftData', 'VIPER/MVVM'],
    secondarySkills: ['Objective-C', 'XCTest', 'CocoaPods/SPM', 'GCD'],
    topicWeights: { Swift_SwiftUI: 30, Architecture: 25, Concurrency_Memory: 20, Networking_Storage: 15, Behavioral: 10 },
    scenarioTopics: ['ARC retain cycles in closures', 'Migrating UIKit views to SwiftUI', 'CoreData background context concurrency'],
    behavioralFocus: ['Navigating Apple App Store review rejections', 'Designing accessible iOS interfaces']
  },
  'UI/UX Designer': {
    coreSkills: ['Figma', 'User Research', 'Wireframing', 'Prototyping', 'Design Systems', 'Usability Testing'],
    secondarySkills: ['Information Architecture', 'Micro-interactions', 'HTML/CSS Basics', 'Design Thinking'],
    topicWeights: { UserResearch: 25, VisualDesign_Figma: 25, DesignSystems: 25, UsabilityTesting: 15, Behavioral: 10 },
    scenarioTopics: ['Designing accessible checkout flow', 'Standardizing tokens across dark/light mode', 'Resolving user confusion in complex dashboard'],
    behavioralFocus: ['Handling developer pushback on design specs', 'Conducting stakeholder design reviews']
  },
  'Product Manager': {
    coreSkills: ['Product Strategy', 'Roadmapping', 'User Stories & PRDs', 'Prioritization (RICE/Kano)', 'Metrics & Analytics', 'Agile/Scrum'],
    secondarySkills: ['A/B Testing', 'Competitive Analysis', 'UX Principles', 'SQL'],
    topicWeights: { ProductStrategy: 30, Metrics_Execution: 25, Prioritization: 20, StakeholderManagement: 15, Behavioral: 10 },
    scenarioTopics: ['Deciding whether to build vs buy feature', 'Triage falling user retention metric', 'Handling conflicting stakeholder feature requests'],
    behavioralFocus: ['Saying no to executive feature creep', 'Pivoting product direction based on user feedback']
  },
  'Business Analyst': {
    coreSkills: ['Requirements Gathering', 'Process Mapping (BPMN)', 'SQL', 'Use Cases & User Stories', 'Data Analysis', 'Agile'],
    secondarySkills: ['Tableau/PowerBI', 'Jira/Confluence', 'Gap Analysis', 'Stakeholder Management'],
    topicWeights: { RequirementsAnalysis: 35, SQL_DataAnalysis: 25, ProcessMapping: 20, Communication: 20 },
    scenarioTopics: ['Bridging ambiguous business requirements to technical specs', 'Mapping legacy manual workflow to automated ERP system'],
    behavioralFocus: ['Managing scope creep during sprint execution', 'Handling resistant business users']
  },
  'Cybersecurity Analyst': {
    coreSkills: ['Network Security', 'SIEM & Log Analysis', 'Vulnerability Assessment', 'Incident Response', 'OWASP Top 10', 'Threat Modeling'],
    secondarySkills: ['Python/Bash Scripting', 'Wireshark', 'Metasploit', 'SOC Operations', 'Compliance (SOC2/ISO27001)'],
    topicWeights: { ThreatAnalysis: 30, OWASP_Security: 25, IncidentResponse: 20, Networking: 15, Behavioral: 10 },
    scenarioTopics: ['Triaging SQL Injection attempt logs', 'Mitigating credential stuffing attack', 'Creating incident playbook for ransomware breakout'],
    behavioralFocus: ['Conducting post-mortem after security breach', 'Enforcing MFA adoption without frustrating users']
  },
  'Cloud Engineer': {
    coreSkills: ['AWS/GCP/Azure', 'Terraform/CloudFormation', 'Cloud Networking (VPC/Subnets)', 'IAM & Security', 'Serverless (Lambda)', 'Kubernetes'],
    secondarySkills: ['Python/Bash', 'Cost Optimization', 'Monitoring (CloudWatch)', 'Disaster Recovery'],
    topicWeights: { CloudArchitecture: 30, IaC_Security: 25, Networking_IAM: 25, Cost_DR: 10, Behavioral: 10 },
    scenarioTopics: ['Designing multi-region fault-tolerant VPC', 'Auditing ballooning AWS monthly bill', 'Restricting IAM policy principle of least privilege'],
    behavioralFocus: ['Migrating legacy on-prem infrastructure to cloud', 'Resolving CloudFormation rollback failures']
  },
  'Database Developer': {
    coreSkills: ['SQL', 'Query Optimization', 'Database Indexing (B-Tree/Hash)', 'Stored Procedures & Triggers', 'PostgreSQL/MySQL/Oracle', 'Data Modeling'],
    secondarySkills: ['NoSQL (MongoDB)', 'ETL Pipelines', 'Replication & Sharding', 'Database Administration'],
    topicWeights: { SQL_Optimization: 35, DataModeling: 25, Indexing_Transactions: 25, Architecture: 15 },
    scenarioTopics: ['Fixing slow query with 5 table joins', 'Third normal form (3NF) vs denormalization for analytics', 'Handling deadlock in high concurrency transactions'],
    behavioralFocus: ['Zero-downtime database schema migration', 'Resolving database corruption emergency']
  },
  'Technical Support Engineer': {
    coreSkills: ['Troubleshooting', 'Linux/Windows CLI', 'API & Log Inspection', 'SQL Queries', 'Networking Basics (DNS/HTTP)', 'Customer Communication'],
    secondarySkills: ['Postman', 'Zendesk/Jira', 'Scripting (Bash/Python)', 'Documentation'],
    topicWeights: { TroubleshootingMethodology: 35, LogAnalysis_APIs: 25, TechnicalCommunication: 25, Behavioral: 15 },
    scenarioTopics: ['Diagnosing 504 Gateway Timeout error for high-value client', 'Troubleshooting CORS error reported by customer', 'Reproducing silent bug in staging environment'],
    behavioralFocus: ['Handling angry enterprise customer during outage', 'Writing clear internal KB documentation']
  },
  'HR / People Operations': {
    coreSkills: ['Recruitment & Sourcing', 'Behavioral Interviewing', 'Employee Relations', 'Onboarding', 'HR Policies', 'Conflict Resolution'],
    secondarySkills: ['HRIS Systems', 'Performance Management', 'Compensation & Benefits', 'Diversity & Inclusion'],
    topicWeights: { BehavioralAssessment: 35, HRPolicy_Culture: 25, ConflictResolution: 25, Communication: 15 },
    scenarioTopics: ['Resolving interpersonal conflict between senior lead and team', 'Designing structured behavioral interviewing matrix', 'Handling delicate termination conversation'],
    behavioralFocus: ['Improving candidate interview experience', 'Fostering inclusive workplace environment']
  },
  'Software Engineer': {
    coreSkills: ['Data Structures & Algorithms', 'System Design', 'OOP', 'Clean Code', 'Git', 'Testing'],
    secondarySkills: ['Web/Backend Technologies', 'Database Fundamentals', 'Design Patterns'],
    topicWeights: { DSA: 25, SystemDesign: 25, OOP_CleanCode: 20, ProblemSolving: 20, Behavioral: 10 },
    scenarioTopics: ['Designing scalable rate limiter', 'Refactoring monolithic function', 'Choosing between relational vs NoSQL database'],
    behavioralFocus: ['Handling technical debt vs deadline pressure', 'Code review best practices']
  }
};

const getRoleBlueprint = (roleName) => {
  return ROLE_BLUEPRINTS[roleName] || ROLE_BLUEPRINTS['Full Stack Developer'];
};

module.exports = {
  ROLE_BLUEPRINTS,
  getRoleBlueprint
};
