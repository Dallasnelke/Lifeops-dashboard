/* LifeOps application bundle
   Phase 2 keeps behavior intact by moving the existing script out of the HTML file.
   Later phases can extract state, storage, Atlas, and modules from this bundle. */
const appVersion = "2.10.0";
const storageKey = window.LifeOpsStorage?.STORAGE_KEYS?.primary || "lifeops-dashboard-v1";
const initialStateLoad = loadState();
const stateStore = window.LifeOpsState.createStore(initialStateLoad);
const state = stateStore.getState();
const chatMessages = [];
const startupSteps = [
  "Money signals ready",
  "Health and habits ready",
  "Goals and calendar ready",
  "Life Score ready",
  "Atlas ready",
  "Opening LifeOps"
];
let availableVoices = [];
let startupHasFinished = false;
let entranceHasPlayed = false;
let audioContext = null;
let activeStartupOscillators = [];
let lastFocusedBeforeModal = null;
let lifeReplayIndex = 0;
let lifeReplayTimer = null;
let barcodeScannerStream = null;
let barcodeScannerTimer = null;

const primaryRoutes = window.LifeOpsNavigation.primaryRoutes;
const sectionPrimary = window.LifeOpsNavigation.sectionPrimary;

function defaultCompanionSettings() {
  return {
    name: "LifeOps",
    initials: "LO",
    form: "Core companion",
    avatarStyle: "sage",
    color: "Gold",
    accessory: "Guidance ring",
    environment: "Quiet command room",
    animationStyle: "Calm pulse",
    tone: "Balanced",
    personality: "Steady",
    style: "Daily Coach",
    focus: "Next best action"
  };
}

function defaultVoiceSettings() {
  return {
    displayName: "",
    startupAnimation: true,
    startupSound: true,
    startupAudioUnlocked: false,
    startupVolume: 0.35,
    mode: "both",
    voiceModeUserSet: false,
    voiceName: "",
    rate: 0.95
  };
}

function defaultAppearanceSettings() {
  return {
    theme: "premium",
    mode: "dark",
    density: "comfortable",
    reducedEffects: false,
    gamificationEnabled: true,
    sidebarCollapsed: false
  };
}

function defaultOnboardingSettings() {
  return {
    completed: false,
    skipped: false,
    mode: "text",
    path: "essential",
    currentStep: 0,
    muted: false,
    transcript: "",
    answers: {},
    recommendedModules: [],
    deepCompleted: false,
    completedAt: ""
  };
}

function defaultPersonalizationSettings() {
  return {
    displayName: "",
    initials: "LO",
    pronouns: "",
    avatarColor: "sage",
    avatarIcon: "spark",
    personalTitle: "Life Architect",
    currentFocus: "Build a stable LifeOps routine"
  };
}

function defaultPrivacySettings() {
  return {
    defaultSharing: "Only me",
    voiceSensitiveData: false,
    socialSensitiveData: false,
    exportWarningAcknowledged: false
  };
}

function defaultIntegrationPreferences() {
  return {
    selectedIntegrationId: "",
    csvImportReady: true,
    oauthEnabled: false,
    secureAccountSystem: false
  };
}

function defaultModulePreferences() {
  return {
    order: ["education", "career", "calendar", "documents", "connections", "integrations", "privacy", "reports", "history", "timeline", "memory", "graph", "coach", "reflection"],
    enabled: {
      education: true,
      career: true,
      calendar: true,
      documents: true,
      connections: true,
      integrations: true,
      privacy: true,
      reports: true,
      history: true,
      timeline: true,
      memory: true,
      graph: true,
      coach: true,
      reflection: false,
      travel: false,
      home: false,
      pets: false,
      family: false,
      reading: false,
      projects: false
    },
    reflectionName: "Faith and Reflection"
  };
}

function defaultDashboardSettings() {
  return {
    categoryOrder: ["Finance", "Health", "Education", "Career", "Goals", "Connections"],
    visibleCategoryCards: ["Finance", "Health", "Education", "Career", "Goals"],
    quickActions: ["expense", "meal", "task", "workout", "goal", "invite"],
    showLifeScore: true,
    showMissions: true,
    showRewards: true,
    showStreaks: true,
    layoutDensity: "comfortable"
  };
}

function defaultState() {
  return {
    schemaVersion: window.LifeOpsStorage?.CURRENT_SCHEMA_VERSION || 1,
    profile: {
      income: 3600,
      savingsGoal: 500,
      currentSavings: 1200,
      emergencyTarget: 3000,
      workoutGoal: 4,
      workoutsDone: 2,
      stepGoal: 8000,
      stepsToday: 5200,
      calorieGoal: 2200,
      proteinGoal: 160,
      carbGoal: 220,
      fatGoal: 70,
      foodBudget: 125,
      waterGoal: 8,
      sleepGoal: 8,
      sleepHours: 7,
      waterCups: 5,
      mood: 4,
      stress: 2,
      energy: 3,
      tomorrowFocus: "Protect sleep, hit protein, and keep food spending planned.",
      priority: "Build the first LifeOps app version",
      notes: "Keep the first version simple, useful, and easy to improve."
    },
    checks: { budget: false, workout: false, water: false, sleep: false },
    tasks: [
      { id: crypto.randomUUID(), name: "Review monthly budget", area: "Money", done: false },
      { id: crypto.randomUUID(), name: "30 minute walk", area: "Fitness", done: false },
      { id: crypto.randomUUID(), name: "Update portfolio notes", area: "Career", done: false }
    ],
    expenses: [
      { id: crypto.randomUUID(), name: "Rent", amount: 1200, type: "Bill", dueDate: "2026-07-15" },
      { id: crypto.randomUUID(), name: "Utilities", amount: 180, type: "Bill", dueDate: "2026-07-20" },
      { id: crypto.randomUUID(), name: "Groceries", amount: 450, type: "Variable", dueDate: "" },
      { id: crypto.randomUUID(), name: "Debt payment", amount: 300, type: "Debt Payment", dueDate: "2026-07-22" }
    ],
    workouts: [
      { id: crypto.randomUUID(), name: "Strength training", minutes: 40, intensity: "Moderate" },
      { id: crypto.randomUUID(), name: "Evening walk", minutes: 30, intensity: "Easy" }
    ],
    meals: [
      { id: crypto.randomUUID(), name: "Chicken rice bowl", source: "Home", calories: 620, protein: 48, carbs: 62, fat: 18, cost: 5.75 },
      { id: crypto.randomUUID(), name: "Protein shake", source: "Home", calories: 260, protein: 32, carbs: 18, fat: 6, cost: 2.50 },
      { id: crypto.randomUUID(), name: "Lunch out", source: "Restaurant", calories: 850, protein: 38, carbs: 92, fat: 31, cost: 16.25 }
    ],
    savedMeals: [
      { id: crypto.randomUUID(), name: "Chicken rice bowl", source: "Home", calories: 620, protein: 48, carbs: 62, fat: 18, cost: 5.75 },
      { id: crypto.randomUUID(), name: "Protein shake", source: "Home", calories: 260, protein: 32, carbs: 18, fat: 6, cost: 2.50 },
      { id: crypto.randomUUID(), name: "Turkey wrap", source: "Home", calories: 430, protein: 35, carbs: 42, fat: 12, cost: 4.25 },
      { id: crypto.randomUUID(), name: "Greek yogurt bowl", source: "Home", calories: 360, protein: 30, carbs: 44, fat: 8, cost: 3.75 }
    ],
    recipes: [],
    barcodeCaptures: [],
    goals: [
      { id: crypto.randomUUID(), name: "Build a career-ready LifeOps portfolio app", area: "Career", targetDate: "2026-09-30", progress: 20 },
      { id: crypto.randomUUID(), name: "Reach emergency fund milestone", area: "Money", targetDate: "2026-12-31", progress: 40 },
      { id: crypto.randomUUID(), name: "Hit weekly workout and protein routine", area: "Health", targetDate: "2026-08-31", progress: 35 }
    ],
    planActions: [
      { id: crypto.randomUUID(), name: "Meal prep 3 lunches", area: "Nutrition", deadline: "2026-07-12", goal: "Protein routine", impact: "High", done: false },
      { id: crypto.randomUUID(), name: "Move $50 toward emergency fund", area: "Money", deadline: "2026-07-13", goal: "Emergency fund milestone", impact: "High", done: false },
      { id: crypto.randomUUID(), name: "Walk 30 minutes 4 times", area: "Fitness", deadline: "2026-07-15", goal: "Workout routine", impact: "Medium", done: false }
    ],
    history: [
      { date: "2026-07-03", lifeScore: 48, money: 62, nutrition: 58, fitness: 42, wellness: 55, goals: 24, calories: 2350, protein: 116, foodCost: 38, sleep: 6.5, water: 4, completedActions: 1 },
      { date: "2026-07-04", lifeScore: 51, money: 64, nutrition: 61, fitness: 48, wellness: 58, goals: 26, calories: 2200, protein: 130, foodCost: 31, sleep: 7, water: 5, completedActions: 1 },
      { date: "2026-07-05", lifeScore: 50, money: 60, nutrition: 55, fitness: 52, wellness: 62, goals: 28, calories: 2450, protein: 108, foodCost: 44, sleep: 7.5, water: 6, completedActions: 2 },
      { date: "2026-07-06", lifeScore: 54, money: 65, nutrition: 63, fitness: 55, wellness: 64, goals: 30, calories: 2100, protein: 145, foodCost: 24, sleep: 7, water: 6, completedActions: 2 },
      { date: "2026-07-07", lifeScore: 57, money: 66, nutrition: 68, fitness: 57, wellness: 65, goals: 31, calories: 2050, protein: 152, foodCost: 22, sleep: 7.5, water: 7, completedActions: 2 },
      { date: "2026-07-08", lifeScore: 55, money: 64, nutrition: 62, fitness: 60, wellness: 63, goals: 32, calories: 2300, protein: 138, foodCost: 34, sleep: 6.5, water: 6, completedActions: 1 }
    ],
    atlasHistory: [],
    atlasMemory: [],
    graphNodes: [],
    graphEdges: [],
    atlasCandidateState: {},
    commandCenter: window.LifeOpsCommandTypes?.defaultCommandCenter?.() || {
      activeCommand: null,
      lastCompletedCommand: null,
      currentSession: null,
      availableMinutes: 30,
      energyPreference: "Medium",
      lastGeneratedAt: "",
      lastViewedAt: "",
      plansByCommandId: {}
    },
    commandHistory: [],
    timeline: [
      { id: crypto.randomUUID(), title: "LifeOps version released", date: "2026-07-10", category: "Personal", note: "Local-first dashboard reached a polished portfolio version.", relatedGoal: "LifeOps portfolio app", privacy: "Private" },
      { id: crypto.randomUUID(), title: "Emergency fund milestone started", date: "2026-07-08", category: "Money", note: "Savings progress is now visible on the dashboard.", relatedGoal: "Emergency fund milestone", privacy: "Private" }
    ],
    timelineProposals: [],
    connections: [
      { connectionId: crypto.randomUUID(), displayName: "Accountability partner", relationshipType: "Accountability partner", groupIds: [], permissions: { view: "Selected people", edit: "Only me", comment: "Selected people", hidden: "Financial amounts, private notes, sensitive records" }, sharedGoalIds: [], sharedListIds: [], sharedChallengeIds: [], status: "Prototype", createdAt: "2026-07-10", lastSyncedAt: "" }
    ],
    connectionGroups: [
      { id: crypto.randomUUID(), name: "Household", description: "Prototype group for shared tasks, groceries, and plans.", memberIds: [], privacy: "Only me" }
    ],
    sharedLists: [
      { id: crypto.randomUUID(), name: "Groceries", category: "Household", items: ["Protein options", "Meal prep basics"], privacy: "Only me", connectionIds: [], groupIds: [] }
    ],
    sharedGoals: [
      { id: crypto.randomUUID(), name: "Weekly walking goal", category: "Health", progress: 25, privacy: "Only me", connectionIds: [], groupIds: [] }
    ],
    sharedChallenges: [
      { id: crypto.randomUUID(), name: "Water consistency challenge", category: "Wellness", target: "Drink water daily", progress: 20, privacy: "Only me", connectionIds: [], groupIds: [] }
    ],
    sharedPlans: [
      { id: crypto.randomUUID(), title: "Sunday planning check-in", date: "2026-07-12", category: "Personal", privacy: "Only me", note: "Local calendar preview only." }
    ],
    educationCourses: [
      { id: crypto.randomUUID(), name: "Business Analytics Portfolio", code: "SELF-101", instructor: "Independent study", credits: 0, term: "Summer 2026", startDate: "2026-07-01", endDate: "2026-09-30", method: "Independent study", grade: "", status: "In progress", privacy: "Private", notes: "Build career-ready dashboard projects." }
    ],
    educationAssignments: [
      { id: crypto.randomUUID(), title: "Document LifeOps roadmap", course: "Business Analytics Portfolio", dueDate: "2026-07-18", priority: "High", status: "Not started", privacy: "Private", notes: "Keep roadmap clear and employer-ready." }
    ],
    educationExams: [],
    educationGoals: [
      { id: crypto.randomUUID(), title: "Complete portfolio case study", category: "Independent study", targetDate: "2026-08-15", progress: 25, privacy: "Private", notes: "Show product thinking and dashboard skills." }
    ],
    educationCosts: [],
    careerApplications: [
      { id: crypto.randomUUID(), company: "Portfolio Demo", position: "Business Analyst", location: "Remote", salaryRange: "", applicationDate: "2026-07-10", status: "Preparing", contact: "", nextStep: "Polish LifeOps demo", followUpDate: "2026-07-17", privacy: "Private", notes: "Use LifeOps as a portfolio project." }
    ],
    careerInterviews: [],
    careerContacts: [],
    careerGoals: [
      { id: crypto.randomUUID(), title: "Build a portfolio-ready dashboard story", targetDate: "2026-08-31", progress: 30, privacy: "Private", notes: "Focus on clear business value and usability." }
    ],
    careerSkills: [
      { id: crypto.randomUUID(), name: "Dashboard design", category: "Analytics", progress: 45, privacy: "Private", notes: "Keep improving layout, hierarchy, and testing." }
    ],
    careerAchievements: [],
    calendarEvents: [
      { id: crypto.randomUUID(), title: "LifeOps weekly review", date: "2026-07-12", category: "Goals", source: "Manual", privacy: "Private", notes: "Review wins, weak area, and next actions." }
    ],
    documents: [
      { id: crypto.randomUUID(), title: "LifeOps portfolio notes", category: "Career", date: "2026-07-10", description: "Project summary and roadmap notes.", related: "LifeOps portfolio app", privacy: "Private", sensitivity: "Personal", localNote: "No file uploaded. Local metadata only." }
    ],
    companion: defaultCompanionSettings(),
    voice: defaultVoiceSettings(),
    appearance: defaultAppearanceSettings(),
    personalization: defaultPersonalizationSettings(),
    privacySettings: defaultPrivacySettings(),
    integrationPreferences: defaultIntegrationPreferences(),
    modulePreferences: defaultModulePreferences(),
    dashboardSettings: defaultDashboardSettings(),
    onboarding: defaultOnboardingSettings()
  };
}

function emptyState() {
  const blank = defaultState();
  blank.profile = {
    ...blank.profile,
    income: 0,
    savingsGoal: 0,
    currentSavings: 0,
    emergencyTarget: 0,
    workoutGoal: 0,
    workoutsDone: 0,
    stepGoal: 0,
    stepsToday: 0,
    calorieGoal: 0,
    proteinGoal: 0,
    carbGoal: 0,
    fatGoal: 0,
    foodBudget: 0,
    sleepHours: 0,
    waterCups: 0,
    priority: "",
    notes: "",
    tomorrowFocus: ""
  };
  blank.checks = { budget: false, workout: false, water: false, sleep: false };
  blank.tasks = [];
  blank.expenses = [];
  blank.workouts = [];
  blank.meals = [];
  blank.recipes = [];
  blank.barcodeCaptures = [];
  blank.goals = [];
  blank.planActions = [];
  blank.history = [];
  blank.atlasHistory = [];
  blank.atlasMemory = [];
  blank.graphNodes = [];
  blank.graphEdges = [];
  blank.atlasCandidateState = {};
  blank.commandCenter = window.LifeOpsCommandTypes?.defaultCommandCenter?.() || {};
  blank.commandHistory = [];
  blank.timeline = [];
  blank.timelineProposals = [];
  blank.connections = [];
  blank.connectionGroups = [];
  blank.sharedLists = [];
  blank.sharedGoals = [];
  blank.sharedChallenges = [];
  blank.sharedPlans = [];
  blank.educationCourses = [];
  blank.educationAssignments = [];
  blank.educationExams = [];
  blank.educationGoals = [];
  blank.educationCosts = [];
  blank.careerApplications = [];
  blank.careerInterviews = [];
  blank.careerContacts = [];
  blank.careerGoals = [];
  blank.careerSkills = [];
  blank.careerAchievements = [];
  blank.calendarEvents = [];
  blank.documents = [];
  return blank;
}

function loadState() {
  const result = window.LifeOpsStorage.loadState({ defaultState, mergeState, sanitizeState });
  if (result.message) console.warn(result.message);
  return result.state;
}

function persistState(options = {}) {
  const normalized = sanitizeState(state);
  const result = window.LifeOpsStorage.saveState(normalized, options);
  window.LifeOpsState.notifySubscribers({ type: "persist", state: normalized, result });
  return result;
}

function mergeState(base, saved) {
  return {
    ...base,
    ...saved,
    profile: { ...base.profile, ...(saved.profile || {}) },
    checks: { ...base.checks, ...(saved.checks || {}) },
    tasks: Array.isArray(saved.tasks) ? saved.tasks : base.tasks,
    expenses: Array.isArray(saved.expenses) ? saved.expenses : base.expenses,
    workouts: Array.isArray(saved.workouts) ? saved.workouts : base.workouts,
    meals: Array.isArray(saved.meals) ? saved.meals : base.meals,
    savedMeals: Array.isArray(saved.savedMeals) ? saved.savedMeals : base.savedMeals,
    recipes: Array.isArray(saved.recipes) ? saved.recipes : base.recipes,
    barcodeCaptures: Array.isArray(saved.barcodeCaptures) ? saved.barcodeCaptures : base.barcodeCaptures,
    goals: Array.isArray(saved.goals) ? saved.goals : base.goals,
    planActions: Array.isArray(saved.planActions) ? saved.planActions : base.planActions,
    history: Array.isArray(saved.history) ? saved.history : base.history,
    atlasHistory: Array.isArray(saved.atlasHistory) ? saved.atlasHistory : base.atlasHistory,
    atlasMemory: Array.isArray(saved.atlasMemory) ? saved.atlasMemory : base.atlasMemory,
    graphNodes: Array.isArray(saved.graphNodes) ? saved.graphNodes : base.graphNodes,
    graphEdges: Array.isArray(saved.graphEdges) ? saved.graphEdges : base.graphEdges,
    atlasCandidateState: { ...base.atlasCandidateState, ...(saved.atlasCandidateState || {}) },
    commandCenter: { ...base.commandCenter, ...(saved.commandCenter || {}) },
    commandHistory: Array.isArray(saved.commandHistory) ? saved.commandHistory : base.commandHistory,
    timeline: Array.isArray(saved.timeline) ? saved.timeline : base.timeline,
    timelineProposals: Array.isArray(saved.timelineProposals) ? saved.timelineProposals : base.timelineProposals,
    connections: Array.isArray(saved.connections) ? saved.connections : base.connections,
    connectionGroups: Array.isArray(saved.connectionGroups) ? saved.connectionGroups : base.connectionGroups,
    sharedLists: Array.isArray(saved.sharedLists) ? saved.sharedLists : base.sharedLists,
    sharedGoals: Array.isArray(saved.sharedGoals) ? saved.sharedGoals : base.sharedGoals,
    sharedChallenges: Array.isArray(saved.sharedChallenges) ? saved.sharedChallenges : base.sharedChallenges,
    sharedPlans: Array.isArray(saved.sharedPlans) ? saved.sharedPlans : base.sharedPlans,
    educationCourses: Array.isArray(saved.educationCourses) ? saved.educationCourses : base.educationCourses,
    educationAssignments: Array.isArray(saved.educationAssignments) ? saved.educationAssignments : base.educationAssignments,
    educationExams: Array.isArray(saved.educationExams) ? saved.educationExams : base.educationExams,
    educationGoals: Array.isArray(saved.educationGoals) ? saved.educationGoals : base.educationGoals,
    educationCosts: Array.isArray(saved.educationCosts) ? saved.educationCosts : base.educationCosts,
    careerApplications: Array.isArray(saved.careerApplications) ? saved.careerApplications : base.careerApplications,
    careerInterviews: Array.isArray(saved.careerInterviews) ? saved.careerInterviews : base.careerInterviews,
    careerContacts: Array.isArray(saved.careerContacts) ? saved.careerContacts : base.careerContacts,
    careerGoals: Array.isArray(saved.careerGoals) ? saved.careerGoals : base.careerGoals,
    careerSkills: Array.isArray(saved.careerSkills) ? saved.careerSkills : base.careerSkills,
    careerAchievements: Array.isArray(saved.careerAchievements) ? saved.careerAchievements : base.careerAchievements,
    calendarEvents: Array.isArray(saved.calendarEvents) ? saved.calendarEvents : base.calendarEvents,
    documents: Array.isArray(saved.documents) ? saved.documents : base.documents,
    companion: { ...base.companion, ...(saved.companion || {}) },
    voice: { ...base.voice, ...(saved.voice || {}) },
    appearance: { ...base.appearance, ...(saved.appearance || {}) },
    personalization: { ...base.personalization, ...(saved.personalization || {}) },
    privacySettings: { ...base.privacySettings, ...(saved.privacySettings || {}) },
    integrationPreferences: { ...base.integrationPreferences, ...(saved.integrationPreferences || {}) },
    modulePreferences: { ...base.modulePreferences, ...(saved.modulePreferences || {}) },
    dashboardSettings: { ...base.dashboardSettings, ...(saved.dashboardSettings || {}) },
    onboarding: { ...base.onboarding, ...(saved.onboarding || {}), answers: { ...base.onboarding.answers, ...(saved.onboarding?.answers || {}) } }
  };
}

function save() {
  persistState();
  render();
}

function allAtlasOnboardingQuestions() {
  return [
    { key: "mode", section: "Voice option", question: "How would you like to talk with Atlas?", type: "single", options: ["Voice Conversation", "Text Conversation", "Traditional Forms"] },
    { key: "name", section: "Identity", question: "What name should LifeOps use for you?", type: "text", placeholder: "Example: Dallas" },
    { key: "preferredName", section: "Identity", question: "Do you have a preferred name Atlas should use?", type: "text", placeholder: "Optional" },
    { key: "age", section: "Identity", question: "What is your age? This is optional.", type: "number", placeholder: "Optional" },
    { key: "country", section: "Identity", question: "What country are you in?", type: "text", placeholder: "United States" },
    { key: "timezone", section: "Identity", question: "What timezone should LifeOps plan around?", type: "text", placeholder: "America/Chicago" },
    { key: "occupation", section: "Identity", question: "What is your current occupation or main role?", type: "text", placeholder: "Example: Retail leader, student, analyst" },
    { key: "studentStatus", section: "Identity", question: "Are you currently a student?", type: "single", options: ["Yes", "No", "Part-time", "Planning to study"] },
    { key: "priorities", section: "Life priorities", question: "What would you most like to improve? Choose up to three.", type: "multi", options: ["Money", "Health", "Career", "Education", "Productivity", "Relationships", "Mental Wellness", "Fitness", "Organization", "Other"] },
    { key: "monthlyIncome", section: "Finance", question: "What is your approximate monthly income? You can skip this.", type: "number", placeholder: "Optional" },
    { key: "monthlyExpenses", section: "Finance", question: "What are your approximate monthly expenses?", type: "number", placeholder: "Optional" },
    { key: "savings", section: "Finance", question: "How much do you currently have saved?", type: "number", placeholder: "Optional" },
    { key: "emergencyFund", section: "Finance", question: "What emergency fund target feels realistic right now?", type: "number", placeholder: "Optional" },
    { key: "debt", section: "Finance", question: "Do you want LifeOps to track debt payoff?", type: "single", options: ["Yes", "Not right now", "Later"] },
    { key: "budgetStyle", section: "Finance", question: "What budgeting style fits you best?", type: "single", options: ["Simple weekly check", "Detailed categories", "Cash flow first", "Not sure yet"] },
    { key: "height", section: "Health", question: "Do you want to add height for health planning? Optional.", type: "text", placeholder: "Optional" },
    { key: "weight", section: "Health", question: "Do you want to add weight for health planning? Optional.", type: "text", placeholder: "Optional" },
    { key: "workoutFrequency", section: "Health", question: "How often do you want to work out each week?", type: "single", options: ["1-2 days", "3-4 days", "5+ days", "Not sure yet"] },
    { key: "nutritionGoals", section: "Health", question: "What is your main nutrition goal?", type: "single", options: ["Hit protein", "Lose weight", "Gain muscle", "Eat on budget", "Improve consistency"] },
    { key: "sleepGoal", section: "Health", question: "How many hours of sleep do you want to aim for?", type: "number", placeholder: "Example: 8" },
    { key: "medicalReminders", section: "Health", question: "Do you need LifeOps to remember medical or wellness reminders? Optional.", type: "text", placeholder: "Optional local note" },
    { key: "school", section: "Education", question: "Are you in school, training, or working on certifications?", type: "text", placeholder: "Optional" },
    { key: "currentClasses", section: "Education", question: "What classes, courses, or training should LifeOps track?", type: "textarea", placeholder: "Optional" },
    { key: "learningGoals", section: "Education", question: "What learning goal matters most right now?", type: "text", placeholder: "Optional" },
    { key: "currentRole", section: "Career", question: "What is your current role?", type: "text", placeholder: "Optional" },
    { key: "targetRole", section: "Career", question: "What role or career direction are you aiming for?", type: "text", placeholder: "Optional" },
    { key: "salaryGoal", section: "Career", question: "Do you have a salary goal? Optional.", type: "text", placeholder: "Optional" },
    { key: "resumeStatus", section: "Career", question: "What is your resume status?", type: "single", options: ["Needs work", "In progress", "Ready", "Not needed yet"] },
    { key: "professionalGoals", section: "Career", question: "What professional goal should Atlas remember?", type: "textarea", placeholder: "Optional" },
    { key: "energyRhythm", section: "Lifestyle", question: "Are you more of a morning person or night owl?", type: "single", options: ["Morning person", "Night owl", "Depends on the day"] },
    { key: "workHours", section: "Lifestyle", question: "What work or focus hours fit your life best?", type: "text", placeholder: "Example: mornings, evenings, after work" },
    { key: "productivityStyle", section: "Lifestyle", question: "What productivity style do you prefer?", type: "single", options: ["Short checklists", "Time blocks", "Deep work sessions", "Flexible reminders"] },
    { key: "dailyStruggle", section: "Lifestyle", question: "What is your biggest daily struggle right now?", type: "textarea", placeholder: "Example: staying consistent, money stress, sleep, planning" },
    { key: "privacy", section: "Privacy", question: "Before I build your dashboard, confirm your privacy preference.", type: "single", options: ["Keep everything local and private", "Show sharing previews only", "Review privacy settings first"] }
  ];
}

function atlasEssentialQuestions() {
  return [
    { key: "mode", section: "Core Setup", question: "How would you like to use Atlas during setup?", type: "single", options: ["Text Conversation", "Voice Conversation", "Traditional Forms"] },
    { key: "name", section: "Core Setup", question: "What name should LifeOps use for you?", type: "text", placeholder: "Example: Dallas" },
    { key: "priorities", section: "Core Setup", question: "What should LifeOps help you improve first? Choose up to three.", type: "multi", options: ["Money", "Health", "Career", "Education", "Productivity", "Relationships", "Mental Wellness", "Fitness", "Organization", "Other"] },
    { key: "currentRole", section: "Core Setup", question: "What best describes your current role or life situation?", type: "text", placeholder: "Example: retail leader, student, job seeker, builder" },
    { key: "studentStatus", section: "Core Setup", question: "Are you currently a student or in training?", type: "single", options: ["Yes", "No", "Part-time", "Planning to study"] },
    { key: "dailyStruggle", section: "Core Setup", question: "What is the biggest challenge you want LifeOps to help with right now?", type: "textarea", placeholder: "Example: staying consistent, money stress, sleep, planning" },
    { key: "financialGoal", section: "Finance", question: "What is your primary money goal right now?", type: "single", options: ["Build emergency savings", "Lower monthly spending", "Pay down debt", "Track bills", "Plan cash flow", "Not sure yet"] },
    { key: "nutritionGoals", section: "Health", question: "What is your primary health goal right now?", type: "single", options: ["Hit protein", "Improve sleep", "Work out consistently", "Drink more water", "Eat on budget", "Improve consistency"] },
    { key: "learningGoals", section: "Education", question: "What education or learning goal matters most right now?", type: "text", placeholder: "Optional" },
    { key: "targetRole", section: "Career", question: "What career direction or role are you aiming for?", type: "text", placeholder: "Optional" },
    { key: "atlasInvolvement", section: "Atlas Style", question: "How involved should Atlas be?", type: "single", options: ["Light guidance", "Daily coaching", "Weekly review", "Only when I ask"] },
    { key: "privacy", section: "Final Review", question: "Confirm your privacy preference before LifeOps builds your first dashboard.", type: "single", options: ["Keep everything local and private", "Show sharing previews only", "Review privacy settings first"] }
  ];
}

function atlasDeepPersonalizationQuestions() {
  const essentialKeys = new Set(atlasEssentialQuestions().map(question => question.key));
  return allAtlasOnboardingQuestions().filter(question => !essentialKeys.has(question.key));
}

function atlasOnboardingQuestions() {
  return state.onboarding?.path === "deep" ? atlasDeepPersonalizationQuestions() : atlasEssentialQuestions();
}

function atlasOnboarding() {
  const defaults = defaultOnboardingSettings();
  if (!state.onboarding || typeof state.onboarding !== "object" || Array.isArray(state.onboarding)) {
    state.onboarding = { ...defaults };
  }
  const onboarding = state.onboarding;
  Object.entries(defaults).forEach(([key, value]) => {
    if (!(key in onboarding)) {
      onboarding[key] = Array.isArray(value) ? [...value] : value && typeof value === "object" ? { ...value } : value;
    }
  });
  if (!onboarding.answers || typeof onboarding.answers !== "object" || Array.isArray(onboarding.answers)) {
    onboarding.answers = {};
  }
  if (!Array.isArray(onboarding.recommendedModules)) {
    onboarding.recommendedModules = [];
  }
  if (!["essential", "deep"].includes(onboarding.path)) {
    onboarding.path = "essential";
  }
  onboarding.currentStep = Math.max(0, Math.min(atlasOnboardingQuestions().length - 1, cleanNumber(onboarding.currentStep, 0, atlasOnboardingQuestions().length - 1)));
  return state.onboarding;
}

function onboardingSpeechRecognitionSupported() {
  return Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
}

let atlasRecognition = null;

function currentAtlasQuestion() {
  return atlasOnboardingQuestions()[Math.min(atlasOnboarding().currentStep, atlasOnboardingQuestions().length - 1)];
}

function showAtlasOnboardingScreen(screen) {
  ["atlasOnboardingWelcome", "atlasOnboardingInterview", "atlasOnboardingFinal"].forEach(id => {
    const element = document.getElementById(id);
    if (element) element.hidden = id !== screen;
  });
  if (screen === "atlasOnboardingWelcome") setAtlasOnboardingVisualState("idle");
  if (screen === "atlasOnboardingInterview") setAtlasOnboardingVisualState("thinking");
  if (screen === "atlasOnboardingFinal") setAtlasOnboardingVisualState("success");
}

function setAtlasOnboardingVisualState(stateName = "idle") {
  const orb = document.getElementById("atlasOnboardingOrb");
  if (!orb) return;
  orb.classList.remove("is-listening", "is-thinking", "is-speaking", "is-success", "is-attention");
  if (stateName !== "idle") orb.classList.add(`is-${stateName}`);
}

function openAtlasOnboarding(force = false) {
  const onboarding = atlasOnboarding();
  if (!force && (onboarding.completed || onboarding.skipped)) return;
  const overlay = document.getElementById("atlasOnboardingOverlay");
  if (!overlay) return;
  overlay.classList.remove("hidden");
  overlay.setAttribute("aria-hidden", "false");
  showAtlasOnboardingScreen("atlasOnboardingWelcome");
  document.getElementById("beginAtlasOnboardingBtn")?.focus();
}

function closeAtlasOnboarding() {
  stopAtlasRecognition();
  window.speechSynthesis?.cancel?.();
  const overlay = document.getElementById("atlasOnboardingOverlay");
  if (overlay) {
    overlay.classList.add("hidden");
    overlay.setAttribute("aria-hidden", "true");
  }
}

function renderAtlasOnboardingQuestion() {
  const onboarding = atlasOnboarding();
  const questions = atlasOnboardingQuestions();
  const question = currentAtlasQuestion();
  const answerArea = document.getElementById("atlasAnswerArea");
  if (!answerArea || !question) return;
  document.getElementById("atlasOnboardingSection").textContent = question.section;
  document.getElementById("atlasQuestionText").textContent = question.question;
  const pathLabel = onboarding.path === "deep" ? "Deep Personalization" : "Essential Setup";
  document.getElementById("atlasProgressText").textContent = `${question.section} ${onboarding.currentStep + 1}/${questions.length}`;
  document.getElementById("atlasTimeRemaining").textContent = onboarding.path === "deep" ? `${Math.max(1, questions.length - onboarding.currentStep)} optional left` : pathLabel;
  document.getElementById("atlasProgressBar").style.width = percent(((onboarding.currentStep + 1) / questions.length) * 100);
  document.getElementById("atlasTranscript").textContent = onboarding.transcript || "Transcript will appear here.";
  document.getElementById("atlasBackBtn").disabled = onboarding.currentStep === 0;
  document.getElementById("atlasVoiceToggleBtn").textContent = onboarding.mode === "voice" ? "Listening" : "Use Voice";
  document.getElementById("atlasVoiceToggleBtn").disabled = !onboardingSpeechRecognitionSupported();
  document.getElementById("atlasMuteBtn").textContent = onboarding.muted ? "Unmute" : "Mute";
  document.getElementById("atlasVoiceWave").hidden = onboarding.mode !== "voice";
  document.getElementById("atlasNextBtn").textContent = onboarding.currentStep >= questions.length - 1 ? "Build Blueprint" : "Next";
  answerArea.innerHTML = "";
  answerArea.className = `onboarding-answer-grid ${question.type === "multi" || question.type === "single" ? "cols" : ""}`;
  const currentValue = onboarding.answers[question.key] || "";
  if (question.type === "single" || question.type === "multi") {
    const selected = Array.isArray(currentValue) ? currentValue : currentValue ? [currentValue] : [];
    question.options.forEach(option => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `onboarding-choice ${selected.includes(option) ? "active" : ""}`;
      button.textContent = option;
      button.addEventListener("click", () => {
        if (question.type === "multi") {
          const next = new Set(Array.isArray(onboarding.answers[question.key]) ? onboarding.answers[question.key] : []);
          if (next.has(option)) next.delete(option);
          else if (next.size < 3) next.add(option);
          onboarding.answers[question.key] = [...next];
        } else {
          onboarding.answers[question.key] = option;
        }
        applyAtlasOnboardingAnswer(question);
        renderAtlasOnboardingQuestion();
      });
      answerArea.appendChild(button);
    });
  } else {
    const input = document.createElement(question.type === "textarea" ? "textarea" : "input");
    input.className = question.type === "textarea" ? "onboarding-textarea" : "onboarding-input";
    input.placeholder = question.placeholder || "";
    input.value = currentValue;
    if (question.type === "number") input.type = "number";
    input.addEventListener("input", event => {
      onboarding.answers[question.key] = event.target.value.slice(0, 500);
      applyAtlasOnboardingAnswer(question);
    });
    answerArea.appendChild(input);
    input.focus();
  }
  if (!onboarding.muted) speakAtlasQuestion(question.question);
}

function beginAtlasInterview() {
  const onboarding = atlasOnboarding();
  onboarding.path = "essential";
  onboarding.currentStep = onboarding.currentStep || 0;
  onboarding.skipped = false;
  showAtlasOnboardingScreen("atlasOnboardingInterview");
  renderAtlasOnboardingQuestion();
}

function speakAtlasQuestion(text) {
  if (!speechSupported() || atlasOnboarding().mode === "text" || atlasOnboarding().muted) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = cleanNumber(state.voice.rate || 0.95, 0.8, 1.2);
  const voice = availableVoices.find(item => item.name === state.voice.selectedVoiceName) || availableVoices.find(item => /english|en-/i.test(`${item.lang} ${item.name}`));
  if (voice) utterance.voice = voice;
  utterance.onstart = () => setAtlasOnboardingVisualState("speaking");
  utterance.onend = () => setAtlasOnboardingVisualState("thinking");
  utterance.onerror = () => setAtlasOnboardingVisualState("attention");
  window.speechSynthesis.speak(utterance);
}

function stopAtlasRecognition() {
  if (atlasRecognition) {
    try { atlasRecognition.stop(); } catch {}
    atlasRecognition = null;
  }
  const wave = document.getElementById("atlasVoiceWave");
  if (wave) wave.hidden = true;
  setAtlasOnboardingVisualState("thinking");
}

function startAtlasRecognition() {
  const onboarding = atlasOnboarding();
  if (!onboardingSpeechRecognitionSupported()) {
    onboarding.transcript = "Voice conversation is not supported in this browser. Text conversation is available.";
    onboarding.mode = "text";
    setAtlasOnboardingVisualState("attention");
    renderAtlasOnboardingQuestion();
    return;
  }
  window.speechSynthesis?.cancel?.();
  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  atlasRecognition = new Recognition();
  atlasRecognition.continuous = false;
  atlasRecognition.interimResults = true;
  atlasRecognition.lang = "en-US";
  atlasRecognition.onresult = event => {
    const transcript = Array.from(event.results).map(result => result[0].transcript).join(" ").trim();
    onboarding.transcript = transcript;
    if (handleAtlasVoiceCommand(transcript)) {
      const transcriptEl = document.getElementById("atlasTranscript");
      if (transcriptEl) transcriptEl.textContent = transcript;
      return;
    }
    const question = currentAtlasQuestion();
    if (question && transcript) {
      onboarding.answers[question.key] = transcript.slice(0, 500);
      applyAtlasOnboardingAnswer(question);
    }
    const transcriptEl = document.getElementById("atlasTranscript");
    if (transcriptEl) transcriptEl.textContent = transcript || "Listening...";
  };
  atlasRecognition.onend = () => {
    const wave = document.getElementById("atlasVoiceWave");
    if (wave && atlasOnboarding().mode !== "voice") wave.hidden = true;
    setAtlasOnboardingVisualState("thinking");
  };
  onboarding.mode = "voice";
  document.getElementById("atlasVoiceWave").hidden = false;
  setAtlasOnboardingVisualState("listening");
  atlasRecognition.start();
}

function handleAtlasVoiceCommand(transcript) {
  const command = String(transcript || "").toLowerCase();
  if (!command) return false;
  if (command.includes("skip this") || command === "skip") {
    atlasOnboardingNext(true);
    return true;
  }
  if (command.includes("ask me later")) {
    atlasOnboardingAskLater();
    return true;
  }
  if (command.includes("finish setup")) {
    completeAtlasOnboarding(false);
    return true;
  }
  if (command.includes("use what you know")) {
    completeAtlasOnboarding(false);
    return true;
  }
  if (command.includes("repeat")) {
    speakAtlasQuestion(currentAtlasQuestion()?.question || "Atlas onboarding is ready.");
    return true;
  }
  if (command.includes("go back") || command === "back") {
    atlasOnboardingBack();
    return true;
  }
  if (command.includes("switch to text")) {
    atlasOnboarding().mode = "text";
    stopAtlasRecognition();
    renderAtlasOnboardingQuestion();
    return true;
  }
  if (command.includes("switch to voice")) {
    startAtlasRecognition();
    return true;
  }
  return false;
}

function applyAtlasOnboardingAnswer(question) {
  const onboarding = atlasOnboarding();
  const value = onboarding.answers[question.key];
  if (question.key === "mode") {
    onboarding.mode = value === "Voice Conversation" ? "voice" : value === "Traditional Forms" ? "forms" : "text";
  }
  if (question.key === "name" || question.key === "preferredName") {
    const name = String(value || "").trim().slice(0, 32);
    if (name) {
      state.voice.displayName = name;
      state.personalization.displayName = name;
      state.personalization.initials = cleanInitials(name.split(/\s+/).map(part => part[0]).join(""));
    }
  }
  if (question.key === "monthlyIncome") state.profile.income = cleanNumber(value);
  if (question.key === "monthlyExpenses" && cleanNumber(value) > 0 && !state.expenses.some(expense => expense.name === "Estimated monthly expenses")) {
    state.expenses.push({ id: crypto.randomUUID(), name: "Estimated monthly expenses", amount: cleanNumber(value), type: "Variable", dueDate: "" });
  }
  if (question.key === "savings") state.profile.currentSavings = cleanNumber(value);
  if (question.key === "emergencyFund") state.profile.emergencyTarget = cleanNumber(value);
  if (question.key === "workoutFrequency") {
    state.profile.workoutGoal = value === "1-2 days" ? 2 : value === "3-4 days" ? 4 : value === "5+ days" ? 5 : state.profile.workoutGoal;
  }
  if (question.key === "nutritionGoals") {
    state.profile.priority = `Improve nutrition: ${value}`;
    if (value === "Hit protein" && !state.profile.proteinGoal) state.profile.proteinGoal = 140;
    if (value === "Improve sleep" && !state.profile.sleepGoal) state.profile.sleepGoal = 8;
  }
  if (question.key === "financialGoal" && String(value || "").trim()) {
    if (value === "Build emergency savings" && !cleanNumber(state.profile.emergencyTarget)) state.profile.emergencyTarget = 1000;
    state.profile.notes = `Primary money goal: ${value}`;
  }
  if (question.key === "atlasInvolvement" && String(value || "").trim()) {
    state.companion = { ...defaultCompanionSettings(), ...(state.companion || {}) };
    state.companion.coachingStyle = value === "Only when I ask" ? "Direct" : value;
  }
  if (question.key === "sleepGoal") state.profile.sleepGoal = cleanNumber(value, 0, 16);
  if (question.key === "learningGoals" && String(value || "").trim()) {
    const title = String(value).trim().slice(0, 80);
    if (!state.educationGoals.some(goal => goal.title === title)) state.educationGoals.push({ id: crypto.randomUUID(), title, category: "Learning", targetDate: "", progress: 0, privacy: "Private", notes: "Created from Atlas onboarding." });
  }
  if (question.key === "targetRole" && String(value || "").trim()) {
    state.personalization.currentFocus = `Move toward ${String(value).trim().slice(0, 48)}`;
  }
  if (question.key === "professionalGoals" && String(value || "").trim()) {
    const title = String(value).trim().slice(0, 80);
    if (!state.careerGoals.some(goal => goal.title === title)) state.careerGoals.push({ id: crypto.randomUUID(), title, targetDate: "", progress: 0, privacy: "Private", notes: "Created from Atlas onboarding." });
  }
  if (question.key === "priorities") {
    const priorities = Array.isArray(value) ? value : [];
    if (priorities.length) {
      state.profile.priority = `Improve ${priorities.join(", ")}`;
      state.profile.notes = "Created from Atlas onboarding priorities.";
      recommendAtlasModules(priorities);
    }
  }
  onboarding.transcript = value ? `You: ${Array.isArray(value) ? value.join(", ") : value}` : onboarding.transcript;
}

function recommendAtlasModules(priorities = []) {
  const prefs = currentModulePreferences();
  const map = {
    Money: ["education", "career", "calendar", "history"],
    Health: ["calendar", "history", "coach"],
    Fitness: ["calendar", "history", "coach"],
    Career: ["career", "documents", "calendar"],
    Education: ["education", "documents", "calendar"],
    Productivity: ["calendar", "projects"],
    Relationships: ["connections"],
    "Mental Wellness": ["reflection", "coach"],
    Organization: ["documents", "calendar", "projects"]
  };
  const modules = new Set(["calendar", "goals", "history", "coach"]);
  priorities.forEach(priority => (map[priority] || []).forEach(module => modules.add(module)));
  modules.forEach(module => {
    if (module in prefs.enabled) prefs.enabled[module] = true;
  });
  state.modulePreferences = prefs;
  atlasOnboarding().recommendedModules = [...modules];
}

function atlasOnboardingNext(skip = false) {
  const onboarding = atlasOnboarding();
  const question = currentAtlasQuestion();
  if (!skip && question) applyAtlasOnboardingAnswer(question);
  if (!skip) {
    const acknowledgements = ["Saved.", "Got it.", "Next."];
    document.getElementById("atlasAcknowledgement").textContent = acknowledgements[onboarding.currentStep % acknowledgements.length];
  }
  if (onboarding.currentStep >= atlasOnboardingQuestions().length - 1) {
    completeAtlasOnboarding(false);
    return;
  }
  onboarding.currentStep += 1;
  persistState({ render: false });
  renderAtlasOnboardingQuestion();
}

function atlasOnboardingAskLater() {
  const onboarding = atlasOnboarding();
  const question = currentAtlasQuestion();
  if (question) {
    onboarding.answers[`${question.key}AskLater`] = true;
    onboarding.transcript = "Atlas will ask this later.";
  }
  atlasOnboardingNext(true);
}

function atlasOnboardingBack() {
  const onboarding = atlasOnboarding();
  onboarding.currentStep = Math.max(0, onboarding.currentStep - 1);
  renderAtlasOnboardingQuestion();
}

function completeAtlasOnboarding(skipped) {
  const onboarding = atlasOnboarding();
  onboarding.completed = !skipped;
  onboarding.skipped = skipped;
  onboarding.completedAt = skipped ? "" : new Date().toISOString();
  if (!skipped && onboarding.path === "deep") onboarding.deepCompleted = true;
  if (!skipped) {
    applyAtlasFinalProfile();
    renderAtlasFinalSummary();
    showAtlasOnboardingScreen("atlasOnboardingFinal");
    save();
  } else {
    persistState({ render: false });
    closeAtlasOnboarding();
  }
}

function applyAtlasFinalProfile() {
  const answers = atlasOnboarding().answers;
  const priorities = Array.isArray(answers.priorities) ? answers.priorities : [];
  recommendAtlasModules(priorities);
  const firstMission = atlasFirstMission(answers);
  if (firstMission && !state.planActions.some(action => action.name === firstMission)) {
    state.planActions.push({ id: crypto.randomUUID(), name: firstMission, area: priorities[0] || "Goals", deadline: "", goal: "Atlas onboarding", impact: "High", done: false });
  }
  if (answers.dailyStruggle && !state.planActions.some(action => action.name === "Build one routine around your biggest daily struggle")) {
    state.planActions.push({ id: crypto.randomUUID(), name: "Build one routine around your biggest daily struggle", area: "Goals", deadline: "", goal: "Atlas onboarding", impact: "High", done: false });
  }
  if (!state.timeline.some(item => item.title === "Atlas onboarding completed")) {
    state.timeline.push({ id: crypto.randomUUID(), title: "Atlas onboarding completed", date: todayKey(), category: "Personal", note: "Atlas built the first personalized LifeOps profile locally.", relatedGoal: "LifeOps setup", privacy: "Private" });
  }
}

function atlasFirstMission(answers = atlasOnboarding().answers) {
  const priorities = Array.isArray(answers.priorities) ? answers.priorities : [];
  if (priorities.includes("Money") || answers.financialGoal) return "Complete one money check";
  if (priorities.includes("Health") || priorities.includes("Fitness") || answers.nutritionGoals) return "Complete one health check";
  if (priorities.includes("Career") || answers.targetRole) return "Write one career step";
  if (priorities.includes("Education") || answers.learningGoals) return "Set one learning step";
  return "Choose one next action";
}

function renderAtlasFinalSummary() {
  const onboarding = atlasOnboarding();
  const answers = onboarding.answers;
  const priorities = Array.isArray(answers.priorities) ? answers.priorities : [];
  const modules = (onboarding.recommendedModules || [])
    .slice(0, 4)
    .map(module => String(module).replace(/-/g, " ").replace(/\b\w/g, letter => letter.toUpperCase()))
    .join(", ") || "Dashboard, Goals, Atlas";
  const coachingStyle = answers.atlasInvolvement || state.companion?.coachingStyle || "Light guidance";
  const firstMission = atlasFirstMission(answers);
  const rows = [
    ["Priority", priorities.slice(0, 3).join(", ") || "Money, Health, Goals"],
    ["Atlas mode", coachingStyle],
    ["Ready", modules]
  ];
  const missionTarget = document.getElementById("atlasFinalFirstMission");
  if (missionTarget) missionTarget.textContent = firstMission;
  const grid = document.getElementById("atlasFinalSummary");
  if (grid) {
    grid.innerHTML = "";
    rows.forEach(([title, text]) => {
      const item = document.createElement("div");
      item.className = "atlas-ready-chip";
      item.innerHTML = `<span></span><strong></strong>`;
      item.querySelector("span").textContent = title;
      item.querySelector("strong").textContent = text;
      grid.appendChild(item);
    });
  }
}

function cleanNumber(value, min = 0, max = Number.MAX_SAFE_INTEGER) {
  return window.LifeOpsUI.cleanNumber(value, min, max);
}

function daysUntil(dateText) {
  return window.LifeOpsUI.daysUntil(dateText);
}

function money(value) {
  return window.LifeOpsUI.money(value);
}

function percent(value) {
  return window.LifeOpsUI.percent(value);
}

function cashLeft() {
  return cleanNumber(state.profile.income) - totalExpenses() - cleanNumber(state.profile.savingsGoal);
}

function daysUntil(dateText) {
  if (!dateText) return null;
  const due = new Date(`${dateText}T00:00:00`);
  if (Number.isNaN(due.getTime())) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((due - today) / 86400000);
}

function upcomingPayments(days = 7) {
  return state.expenses
    .filter(expense => ["Bill", "Debt Payment"].includes(expense.type))
    .map(expense => ({ ...expense, daysUntil: daysUntil(expense.dueDate) }))
    .filter(expense => expense.daysUntil !== null && expense.daysUntil >= 0 && expense.daysUntil <= days)
    .sort((a, b) => a.daysUntil - b.daysUntil);
}

function upcomingPaymentText() {
  const nextPayment = upcomingPayments(7)[0];
  if (!nextPayment) return "No dated bills or debt payments are due in the next 7 days.";
  const timing = nextPayment.daysUntil === 0 ? "due today" : `due in ${nextPayment.daysUntil} day${nextPayment.daysUntil === 1 ? "" : "s"}`;
  return `${nextPayment.name} is ${timing}: ${money(cleanNumber(nextPayment.amount))}.`;
}

function money(value) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value || 0);
}

function percent(value) {
  return `${Math.round(Math.max(0, Math.min(100, value || 0)))}%`;
}

function totalExpenses() {
  return state.expenses.reduce((sum, item) => sum + cleanNumber(item.amount), 0);
}

function mealTotals() {
  return state.meals.reduce((totals, meal) => {
    totals.calories += cleanNumber(meal.calories);
    totals.protein += cleanNumber(meal.protein);
    totals.carbs += cleanNumber(meal.carbs);
    totals.fat += cleanNumber(meal.fat);
    totals.cost += cleanNumber(meal.cost);
    if (meal.source === "Home") totals.homeCost += cleanNumber(meal.cost);
    if (meal.source === "Restaurant") totals.restaurantCost += cleanNumber(meal.cost);
    return totals;
  }, { calories: 0, protein: 0, carbs: 0, fat: 0, cost: 0, homeCost: 0, restaurantCost: 0 });
}

function remainingNutrition() {
  const meals = mealTotals();
  return {
    calories: cleanNumber(state.profile.calorieGoal) - meals.calories,
    protein: cleanNumber(state.profile.proteinGoal) - meals.protein,
    carbs: cleanNumber(state.profile.carbGoal) - meals.carbs,
    fat: cleanNumber(state.profile.fatGoal) - meals.fat,
    foodBudget: cleanNumber(state.profile.foodBudget) - meals.cost
  };
}

function dailyCompletion() {
  const checkValues = Object.values(state.checks);
  const checked = checkValues.filter(Boolean).length;
  const completedTasks = state.tasks.filter(task => task.done).length;
  const total = checkValues.length + state.tasks.length;
  return total ? ((checked + completedTasks) / total) * 100 : 0;
}

function fitnessCompletion() {
  const goal = cleanNumber(state.profile.workoutGoal);
  const done = cleanNumber(state.profile.workoutsDone);
  return goal ? (done / goal) * 100 : 0;
}

function stepsCompletion() {
  const goal = cleanNumber(state.profile.stepGoal);
  const done = cleanNumber(state.profile.stepsToday);
  return goal ? (done / goal) * 100 : 0;
}

function savingsCompletion() {
  const target = cleanNumber(state.profile.emergencyTarget);
  const current = cleanNumber(state.profile.currentSavings);
  return target ? (current / target) * 100 : 0;
}

function macroCompletion(actual, target) {
  if (!target) return 0;
  const ratio = actual / target;
  if (ratio <= 1) return ratio * 100;
  return Math.max(0, 100 - ((ratio - 1) * 80));
}

function foodBudgetCompletion() {
  const budget = Number(state.profile.foodBudget || 0);
  const spent = mealTotals().cost;
  if (!budget) return 0;
  return Math.max(0, 100 - Math.max(0, ((spent - budget) / budget) * 100));
}

function goalCompletion() {
  if (!state.goals.length) return 0;
  return state.goals.reduce((sum, goal) => sum + Number(goal.progress || 0), 0) / state.goals.length;
}

function moneyHealthScore() {
  const remainingCash = cashLeft();
  const moneyScore = remainingCash >= 0 ? 100 : Math.max(0, 100 + (remainingCash / Math.max(1, cleanNumber(state.profile.income, 1))) * 100);
  return Math.round((moneyScore * .45) + (savingsCompletion() * .35) + (dailyCompletion() * .20));
}

function nutritionHealthScore() {
  const meals = mealTotals();
  return Math.round(
    macroCompletion(meals.calories, cleanNumber(state.profile.calorieGoal)) * .25 +
    macroCompletion(meals.protein, cleanNumber(state.profile.proteinGoal)) * .30 +
    foodBudgetCompletion() * .30 +
    macroCompletion(meals.fat, cleanNumber(state.profile.fatGoal)) * .15
  );
}

function fitnessHealthScore() {
  const workoutMinutes = state.workouts.reduce((sum, workout) => sum + Number(workout.minutes || 0), 0);
  const minuteScore = Math.min(100, (workoutMinutes / 150) * 100);
  return Math.round((fitnessCompletion() * .45) + (stepsCompletion() * .35) + (minuteScore * .20));
}

function wellnessHealthScore() {
  const sleepScore = macroCompletion(cleanNumber(state.profile.sleepHours), cleanNumber(state.profile.sleepGoal, 1));
  const waterScore = macroCompletion(cleanNumber(state.profile.waterCups), cleanNumber(state.profile.waterGoal));
  const moodScore = (cleanNumber(state.profile.mood, 0, 5) / 5) * 100;
  const stressScore = ((6 - cleanNumber(state.profile.stress, 0, 5)) / 5) * 100;
  const energyScore = (cleanNumber(state.profile.energy, 0, 5) / 5) * 100;
  return Math.round((sleepScore * .25) + (waterScore * .20) + (moodScore * .20) + (stressScore * .20) + (energyScore * .15));
}

function lifeScore() {
  return Math.round(
    (moneyHealthScore() * .20) +
    (nutritionHealthScore() * .18) +
    (fitnessHealthScore() * .18) +
    (wellnessHealthScore() * .18) +
    (goalCompletion() * .16) +
    (dailyCompletion() * .10)
  );
}

function scoreStatus(score) {
  if (score >= 80) return { label: "On track", className: "status", arrow: "Up" };
  if (score >= 60) return { label: "Watch", className: "status watch", arrow: "Flat" };
  return { label: "Needs attention", className: "status attention", arrow: "Down" };
}

function rewardBreakdown() {
  if (currentAppearance().gamificationEnabled === false) {
    return [{ title: "Rewards disabled", points: 0, done: false, meta: "Turn rewards back on in Settings when you want XP and achievements visible." }];
  }
  const meals = mealTotals();
  const completedTasks = state.tasks.filter(task => task.done).length;
  const completedActions = state.planActions.filter(action => action.done).length;
  const foodBudget = cleanNumber(state.profile.foodBudget);
  const waterGoal = cleanNumber(state.profile.waterGoal);
  const sleepGoal = cleanNumber(state.profile.sleepGoal, 1);
  return [
    { title: "Meals logged", points: Math.min(state.meals.length, 3) * 10, done: state.meals.length > 0, meta: `${state.meals.length} meals today` },
    { title: "Workout logged", points: state.workouts.length ? 25 : 0, done: state.workouts.length > 0, meta: `${state.workouts.length} workouts logged` },
    { title: "Food budget protected", points: foodBudget && state.meals.length && meals.cost <= foodBudget ? 20 : 0, done: foodBudget && state.meals.length && meals.cost <= foodBudget, meta: `${money(meals.cost)} of ${money(foodBudget)} used` },
    { title: "Tasks completed", points: completedTasks * 8, done: completedTasks > 0, meta: `${completedTasks} of ${state.tasks.length} tasks complete` },
    { title: "Water goal met", points: waterGoal && cleanNumber(state.profile.waterCups) >= waterGoal ? 15 : 0, done: waterGoal && cleanNumber(state.profile.waterCups) >= waterGoal, meta: `${state.profile.waterCups || 0} of ${waterGoal} cups` },
    { title: "Sleep goal met", points: cleanNumber(state.profile.sleepHours) >= sleepGoal ? 15 : 0, done: cleanNumber(state.profile.sleepHours) >= sleepGoal, meta: `${state.profile.sleepHours || 0} of ${sleepGoal} hours` },
    { title: "Weekly actions finished", points: completedActions * 20, done: completedActions > 0, meta: `${completedActions} of ${state.planActions.length} actions complete` },
    { title: "Emergency fund progress", points: cleanNumber(state.profile.currentSavings) > 0 ? 15 : 0, done: cleanNumber(state.profile.currentSavings) > 0, meta: `${percent(savingsCompletion())} funded` }
  ];
}

function todayRewardPoints() {
  return rewardBreakdown().reduce((sum, item) => sum + cleanNumber(item.points), 0);
}

function totalRewardPoints() {
  if (currentAppearance().gamificationEnabled === false) return 0;
  const historyPoints = state.history.reduce((sum, item) => {
    return sum + cleanNumber(item.lifeScore) + (cleanNumber(item.completedActions) * 20);
  }, 0);
  return todayRewardPoints() + historyPoints;
}

function rewardLevelInfo() {
  const total = totalRewardPoints();
  const level = Math.floor(total / 250) + 1;
  const currentLevelStart = (level - 1) * 250;
  const nextLevel = level * 250;
  return {
    total,
    level,
    nextLevel,
    progress: ((total - currentLevelStart) / 250) * 100,
    remaining: Math.max(0, nextLevel - total)
  };
}

function savedDayStreak() {
  const days = [...state.history]
    .filter(item => cleanNumber(item.lifeScore) >= 55)
    .map(item => item.date)
    .sort((a, b) => b.localeCompare(a));
  if (!days.length) return dailyCompletion() >= 60 ? 1 : 0;
  let streak = 1;
  let previous = new Date(`${days[0]}T00:00:00`);
  for (let index = 1; index < days.length; index += 1) {
    const current = new Date(`${days[index]}T00:00:00`);
    const gap = Math.round((previous - current) / 86400000);
    if (gap !== 1) break;
    streak += 1;
    previous = current;
  }
  return streak;
}

function rewardBadges() {
  return [
    { title: "First Step", unlocked: missionProgress().complete > 0, meta: "Completed first mission." },
    { title: "Money Check", unlocked: state.checks.budget || state.history.filter(item => cleanNumber(item.money) > 0).length >= 7, meta: "Reviewed money plan seven times." },
    { title: "Health Momentum", unlocked: fitnessCompletion() >= 100, meta: "Completed weekly workout target." },
    { title: "Planner", unlocked: state.history.length > 0, meta: "Completed first weekly review or saved snapshot." },
    { title: "Builder", unlocked: state.goals.length >= 10 || state.goals.filter(goal => cleanNumber(goal.progress) >= 100).length > 0, meta: "Completed ten goals or milestones." },
    { title: "Consistent", unlocked: savedDayStreak() >= 3 || state.history.length >= 14, meta: "Used LifeOps meaningfully across several weeks." }
  ];
}

function nextRewardUnlock() {
  const lockedBadge = rewardBadges().find(badge => !badge.unlocked);
  if (lockedBadge) return `Next badge: ${lockedBadge.title}. ${lockedBadge.meta}`;
  const level = rewardLevelInfo();
  return `Next level: earn ${level.remaining} more XP to reach Level ${level.level + 1}.`;
}

function companionSettings() {
  const defaults = defaultCompanionSettings();
  return { ...defaults, ...(state.companion || {}) };
}

function personalizationSettings() {
  return { ...defaultPersonalizationSettings(), ...(state.personalization || {}) };
}

function avatarIconSymbol(icon) {
  const symbols = { spark: "*", compass: "N", leaf: "L", bolt: "B", target: "T" };
  return symbols[icon] || "*";
}

function cleanInitials(value, fallback = "LO") {
  const cleaned = String(value || "").replace(/[^a-z0-9]/gi, "").slice(0, 3).toUpperCase();
  return cleaned || fallback;
}

function brandAssetMarkup(kind, fallback, altText = "") {
  const source = kind === "atlas" ? "assets/brand/atlas-avatar.svg" : "assets/brand/lifeops-icon.svg";
  const safeFallback = fallback === "AT" ? "AT" : "LO";
  const safeAlt = altText.replace(/"/g, "&quot;");
  const particles = kind === "atlas" ? `<div class="atlas-particles" aria-hidden="true"><span></span><span></span><span></span><span></span></div>` : "";
  return `<span class="brand-fallback" hidden>${safeFallback}</span><img class="brand-img" src="${source}" alt="${safeAlt}" onerror="this.hidden=true; this.previousElementSibling.hidden=false">${particles}`;
}

function companionFocusHint() {
  const { focus } = companionSettings();
  const hints = {
    "Money stability": "Focus lens: protect cash flow, bills, savings, and realistic spending.",
    "Nutrition and fitness": "Focus lens: connect meals, protein, food cost, workouts, and steps.",
    "Wellness and energy": "Focus lens: watch sleep, water, stress, mood, and sustainable energy.",
    "Goals and career": "Focus lens: turn long-term goals into one practical next step.",
    "Next best action": "Focus lens: choose the clearest next action across the whole dashboard."
  };
  return hints[focus] || hints["Next best action"];
}

function companionToneGuidance() {
  const { tone } = companionSettings();
  const guidance = {
    Direct: "I will keep this direct and action-first.",
    Encouraging: "I will keep this supportive while still giving you a clear next step.",
    Analytical: "I will explain the data behind the recommendation.",
    Balanced: "I will keep this practical and balanced."
  };
  return guidance[tone] || guidance.Balanced;
}

function dailyMissions() {
  const meals = mealTotals();
  const waterGoal = cleanNumber(state.profile.waterGoal);
  const todaySnapshotSaved = state.history.some(item => item.date === todayKey());
  const completedHabits = Object.values(state.checks).filter(Boolean).length;
  const completedActions = state.planActions.filter(action => action.done).length;
  const candidates = [
    {
      title: "Log one meal",
      meta: state.meals.length ? `${state.meals.length} meal${state.meals.length === 1 ? "" : "s"} logged today` : "Add breakfast, lunch, dinner, or a snack.",
      xp: 25,
      complete: state.meals.length > 0,
      action: "meal"
    },
    {
      title: "Complete one habit",
      meta: completedHabits ? `${completedHabits} daily habit${completedHabits === 1 ? "" : "s"} checked off` : "Check off one daily habit on the Today tab.",
      xp: 25,
      complete: completedHabits > 0,
      action: "today"
    },
    {
      title: "Finish one money check",
      meta: state.checks.budget ? "Budget check is complete." : "Review budget, bills, or remaining cash flow.",
      xp: 25,
      complete: Boolean(state.checks.budget),
      action: "money"
    },
    {
      title: "Drink water",
      meta: `${cleanNumber(state.profile.waterCups)} of ${waterGoal || 0} cups logged`,
      xp: 20,
      complete: waterGoal ? cleanNumber(state.profile.waterCups) >= waterGoal : cleanNumber(state.profile.waterCups) > 0,
      action: "wellness"
    },
    {
      title: "Save today's snapshot",
      meta: todaySnapshotSaved ? "Today is saved in History." : "Save a snapshot after your main updates.",
      xp: 25,
      complete: todaySnapshotSaved,
      action: "snapshot"
    },
    {
      title: "Complete one weekly action",
      meta: completedActions ? `${completedActions} weekly action${completedActions === 1 ? "" : "s"} complete` : "Finish one action from the Weekly Plan.",
      xp: 30,
      complete: completedActions > 0,
      action: "plan"
    },
    {
      title: "Protect food value",
      meta: `${Math.round(meals.protein)}g protein for ${money(meals.cost)} food cost`,
      xp: 20,
      complete: state.meals.length > 0 && meals.protein >= cleanNumber(state.profile.proteinGoal) * .5,
      action: "food"
    }
  ];
  const open = candidates.filter(mission => !mission.complete);
  const complete = candidates.filter(mission => mission.complete);
  return [...open, ...complete].slice(0, 3);
}

function missionProgress() {
  const missions = dailyMissions();
  const complete = missions.filter(mission => mission.complete).length;
  const xp = missions.reduce((sum, mission) => sum + (mission.complete ? mission.xp : 0), 0);
  return { missions, complete, total: missions.length, xp, percent: missions.length ? (complete / missions.length) * 100 : 0 };
}

function companionLeadMessage() {
  const progress = missionProgress();
  const [area, score] = lowestScoreArea();
  if (progress.complete === progress.total) {
    return `Strong day. Your three missions are complete and ${area} is the next area to watch.`;
  }
  return `${area} is your weakest area at ${Math.round(score)}. Complete ${progress.total - progress.complete} more mission${progress.total - progress.complete === 1 ? "" : "s"} to build momentum today.`;
}

function atlasFreshnessLabel() {
  const latest = recentHistory(1)[0];
  if (!latest?.date) return "Based on current browser data; no saved snapshot yet.";
  const age = daysUntil(latest.date);
  if (age === 0) return "Based on data updated today.";
  if (age !== null && age < 0 && Math.abs(age) <= 7) return "Based on data updated this week.";
  return "Based on older saved snapshot data plus current local entries.";
}

function atlasConfidence(context) {
  let points = 0;
  if (context.profile.hasMoneyTargets) points += 1;
  if (context.finance.hasExpenses) points += 1;
  if (context.nutrition.hasTargets || context.nutrition.mealsLogged > 0) points += 1;
  if (context.fitness.hasWorkoutGoal || context.fitness.workoutsLogged > 0) points += 1;
  if (context.goals.totalGoals || context.goals.openActions) points += 1;
  if (points >= 4) return "High";
  if (points >= 2) return "Medium";
  return "Low";
}

function getAtlasContext() {
  const meals = mealTotals();
  const remaining = remainingNutrition();
  const payments = state.expenses
    .filter(expense => ["Bill", "Debt Payment"].includes(expense.type))
    .map(expense => ({ ...expense, daysUntil: daysUntil(expense.dueDate) }))
    .sort((a, b) => (a.daysUntil ?? 9999) - (b.daysUntil ?? 9999));
  const assignments = [...state.educationAssignments.map(item => ({ title: item.title, date: item.dueDate, kind: "Assignment", course: item.course, privacy: item.privacy })), ...state.educationExams.map(item => ({ title: item.title, date: item.date, kind: "Exam", course: item.course, privacy: item.privacy }))]
    .filter(item => item.date)
    .map(item => ({ ...item, daysUntil: daysUntil(item.date) }))
    .sort((a, b) => (a.daysUntil ?? 9999) - (b.daysUntil ?? 9999));
  const careerItems = [...state.careerInterviews.map(item => ({ title: `${item.company} interview`, date: item.date, kind: "Interview", company: item.company, privacy: item.privacy })), ...state.careerApplications.filter(item => item.followUpDate).map(item => ({ title: `${item.company} follow-up`, date: item.followUpDate, kind: "Follow up", company: item.company, privacy: item.privacy }))]
    .filter(item => item.date)
    .map(item => ({ ...item, daysUntil: daysUntil(item.date) }))
    .sort((a, b) => (a.daysUntil ?? 9999) - (b.daysUntil ?? 9999));
  const calendarEvents = typeof calendarItems === "function" ? calendarItems().slice(0, 8) : state.calendarEvents.map(event => ({ ...event, daysUntil: daysUntil(event.date) }));
  const scores = scoreBreakdown();
  const weakest = lowestScoreArea();
  const strongest = scores.reduce((top, item) => item[1] > top[1] ? item : top, scores[0]);
  const sensitiveDocuments = state.documents.filter(doc => doc.sensitivity === "Sensitive").length;
  const privateDocuments = state.documents.filter(doc => doc.privacy === "Private").length;
  const completedTasks = state.tasks.filter(task => task.done).length;
  const completedActions = state.planActions.filter(action => action.done).length;
  const context = {
    generatedAt: new Date().toLocaleString(),
    today: todayKey(),
    freshness: atlasFreshnessLabel(),
    profile: {
      displayName: displayName() || personalizationSettings().displayName || "",
      priority: state.profile.priority || "",
      notes: state.profile.notes || "",
      hasMoneyTargets: cleanNumber(state.profile.income) > 0 || cleanNumber(state.profile.emergencyTarget) > 0,
      hasNutritionTargets: cleanNumber(state.profile.calorieGoal) > 0 || cleanNumber(state.profile.proteinGoal) > 0,
      hasWorkoutGoal: cleanNumber(state.profile.workoutGoal) > 0
    },
    finance: {
      income: cleanNumber(state.profile.income),
      expenses: totalExpenses(),
      cashLeft: cashLeft(),
      savingsGoal: cleanNumber(state.profile.savingsGoal),
      currentSavings: cleanNumber(state.profile.currentSavings),
      emergencyTarget: cleanNumber(state.profile.emergencyTarget),
      emergencyProgress: savingsCompletion(),
      hasExpenses: state.expenses.length > 0,
      bills: payments,
      overdueBills: payments.filter(item => item.daysUntil !== null && item.daysUntil < 0),
      upcomingBills: payments.filter(item => item.daysUntil !== null && item.daysUntil >= 0 && item.daysUntil <= 7)
    },
    nutrition: {
      mealsLogged: state.meals.length,
      savedMeals: state.savedMeals.length,
      recipes: Array.isArray(state.recipes) ? state.recipes.length : 0,
      barcodeCaptures: Array.isArray(state.barcodeCaptures) ? state.barcodeCaptures.length : 0,
      calories: meals.calories,
      protein: meals.protein,
      cost: meals.cost,
      restaurantCost: meals.restaurantCost,
      homeCost: meals.homeCost,
      foodBudget: cleanNumber(state.profile.foodBudget),
      foodBudgetRemaining: remaining.foodBudget,
      proteinRemaining: remaining.protein,
      caloriesRemaining: remaining.calories,
      hasTargets: cleanNumber(state.profile.proteinGoal) > 0 || cleanNumber(state.profile.foodBudget) > 0
    },
    fitness: {
      workoutGoal: cleanNumber(state.profile.workoutGoal),
      workoutsDone: cleanNumber(state.profile.workoutsDone),
      completion: fitnessCompletion(),
      workoutsLogged: state.workouts.length,
      stepsToday: cleanNumber(state.profile.stepsToday),
      stepGoal: cleanNumber(state.profile.stepGoal),
      hasWorkoutGoal: cleanNumber(state.profile.workoutGoal) > 0
    },
    wellness: {
      sleepHours: cleanNumber(state.profile.sleepHours),
      sleepGoal: cleanNumber(state.profile.sleepGoal),
      waterCups: cleanNumber(state.profile.waterCups),
      waterGoal: cleanNumber(state.profile.waterGoal),
      mood: cleanNumber(state.profile.mood),
      stress: cleanNumber(state.profile.stress),
      energy: cleanNumber(state.profile.energy)
    },
    education: {
      courses: state.educationCourses.length,
      deadlines: assignments,
      nextDeadline: assignments.find(item => item.daysUntil !== null && item.daysUntil >= 0)
    },
    career: {
      applications: state.careerApplications.length,
      followUps: careerItems,
      nextFollowUp: careerItems.find(item => item.daysUntil !== null && item.daysUntil >= 0)
    },
    goals: {
      totalGoals: state.goals.length,
      averageProgress: goalCompletion(),
      openActions: state.planActions.filter(action => !action.done).length,
      completedActions,
      highImpactAction: state.planActions.find(action => !action.done && action.impact === "High") || state.planActions.find(action => !action.done)
    },
    calendar: {
      events: calendarEvents,
      upcoming: calendarEvents.filter(item => daysUntil(item.date) !== null && daysUntil(item.date) >= 0 && daysUntil(item.date) <= 7)
    },
    recentActions: {
      completedTasks,
      totalTasks: state.tasks.length,
      completedPlanActions: completedActions,
      snapshots: state.history.length,
      recentWin: recentWinText()
    },
    lifeScore: {
      score: lifeScore(),
      categoryScores: Object.fromEntries(scores),
      weakestArea: weakest[0],
      weakestScore: Math.round(weakest[1]),
      strongestArea: strongest[0],
      strongestScore: Math.round(strongest[1])
    },
    privacy: {
      dataSource: "This browser",
      remoteAi: "Not connected",
      memory: "Local only",
      defaultSharing: "Private by default",
      sensitiveDocuments,
      privateDocuments
    }
  };
  context.confidence = atlasConfidence(context);
  return context;
}

function currentAtlasDecision(context = getAtlasContext()) {
  if (!window.LifeOpsAtlasEngine?.generateDecision) return null;
  try {
    return window.LifeOpsAtlasEngine.generateDecision(state, context);
  } catch (error) {
    console.warn("Atlas Decision Engine failed; using legacy local rules.", error);
    return null;
  }
}

function atlasCandidateToAction(candidate, decision) {
  const explanation = window.LifeOpsAtlasExplanations?.explainDecision?.(decision) || {};
  const evidence = (candidate.supportingEvidence || []).map(item => `${item.label}: ${item.value}`);
  const confidence = window.LifeOpsAtlasExplanations?.confidenceLabel?.(candidate.confidence) || "Medium";
  const freshness = window.LifeOpsAtlasExplanations?.freshnessLabel?.(candidate.freshness) || atlasFreshnessLabel();
  const risk = window.LifeOpsAtlasExplanations?.riskLabel?.(candidate.risk) || atlasRiskLabel(candidate);
  const contributions = candidate.atlasContributions || {};
  const contributionText = Object.entries(contributions)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([key, value]) => `${key}: ${Math.round(value)}`)
    .join("; ");
  return atlasAction(candidate.title, {
    category: candidate.category,
    urgency: Math.round(cleanNumber(candidate.urgency, 0, 10)),
    tab: candidate.navigationTarget || "dashboard",
    found: candidate.description,
    why: explanation.whyNow || candidate.description,
    action: candidate.title,
    evidence,
    impacts: [candidate.category, candidate.expectedOutcome].filter(Boolean),
    confidence,
    freshness,
    time: `${candidate.estimatedMinutes} minutes`,
    risk,
    candidateId: candidate.id,
    sourceModule: candidate.sourceModule,
    sourceEntityId: candidate.sourceEntityId,
    atlasScore: candidate.atlasScore,
    factorSummary: contributionText,
    chosenOver: explanation.chosenOver,
    expectedOutcome: candidate.expectedOutcome,
    dependency: candidate.blockedReason || candidate.dependencyStatus || "Ready",
    rawCandidate: candidate,
    decision
  });
}

function atlasAction(title, config) {
  return {
    title,
    category: config.category || "Local Intelligence",
    urgency: cleanNumber(config.urgency, 0, 10),
    time: config.time || "5-15 minutes",
    tab: config.tab || "dashboard",
    found: config.found || title,
    why: config.why || "This is the clearest action from current LifeOps data.",
    action: config.action || title,
    evidence: config.evidence || [],
    impacts: config.impacts || ["Life Score"],
    confidence: config.confidence || "Medium",
    freshness: config.freshness || atlasFreshnessLabel(),
    incomplete: config.incomplete || "",
    candidateId: config.candidateId || "",
    sourceModule: config.sourceModule || "",
    sourceEntityId: config.sourceEntityId || "",
    atlasScore: config.atlasScore || 0,
    factorSummary: config.factorSummary || "",
    chosenOver: config.chosenOver || "",
    expectedOutcome: config.expectedOutcome || "",
    dependency: config.dependency || "",
    risk: config.risk || "",
    rawCandidate: config.rawCandidate || null,
    decision: config.decision || null
  };
}

function evaluateAtlasPriorities(context = getAtlasContext()) {
  const decision = currentAtlasDecision(context);
  if (decision?.topAction) {
    return [decision.topAction, ...(decision.alternatives || [])].map(candidate => atlasCandidateToAction(candidate, decision));
  }
  const actions = [];
  const add = (title, config) => actions.push(atlasAction(title, { ...config, freshness: context.freshness, confidence: config.confidence || context.confidence }));
  const overdue = context.finance.overdueBills[0];
  if (overdue) {
    add("Review overdue payment", {
      category: "Finance",
      urgency: 10,
      tab: "money",
      found: `${overdue.name} is overdue based on its due date.`,
      why: "Overdue bills and debt payments are urgent because they can affect cash flow and planning.",
      action: "Open Money and confirm the payment plan before adding new spending.",
      evidence: [`${overdue.name}: ${money(cleanNumber(overdue.amount))}`, `Due date: ${overdue.dueDate}`],
      impacts: ["Finance", "Cash flow", "Planning"],
      time: "5-10 minutes"
    });
  }
  const upcoming = context.finance.upcomingBills[0];
  if (upcoming) {
    add("Prepare for upcoming payment", {
      category: "Finance",
      urgency: upcoming.daysUntil <= 1 ? 9 : 7,
      tab: "money",
      found: `${upcoming.name} is ${upcoming.daysUntil === 0 ? "due today" : `due in ${upcoming.daysUntil} day${upcoming.daysUntil === 1 ? "" : "s"}`}.`,
      why: "Upcoming obligations should be visible before spending, saving, or goal decisions.",
      action: "Confirm the payment plan and protect cash.",
      evidence: [`Payment: ${upcoming.name}`, `Amount: ${money(cleanNumber(upcoming.amount))}`, `Due date: ${upcoming.dueDate}`],
      impacts: ["Finance", "Cash flow"],
      time: "5 minutes"
    });
  }
  if (context.finance.cashLeft < 0) {
    add("Fix negative cash flow", {
      category: "Finance",
      urgency: 9,
      tab: "money",
      found: `Estimated cash left is ${money(context.finance.cashLeft)} after expenses and planned savings.`,
      why: "Negative cash flow can pressure bills, savings, and debt payoff.",
      action: "Review expenses or adjust planned savings before adding new commitments.",
      evidence: [`Income: ${money(context.finance.income)}`, `Expenses: ${money(context.finance.expenses)}`, `Savings goal: ${money(context.finance.savingsGoal)}`],
      impacts: ["Finance", "Goal progress"]
    });
  }
  if (context.nutrition.foodBudget > 0 && context.nutrition.foodBudgetRemaining <= 0 && context.nutrition.proteinRemaining > 0) {
    add("Use a saved home meal", {
      category: "Nutrition",
      urgency: 8,
      tab: "food",
      found: `Food budget is fully used and protein remaining is ${Math.max(0, Math.round(context.nutrition.proteinRemaining))}g.`,
      why: "Eating out again would increase spending and may not close the protein gap efficiently.",
      action: "Use a saved home meal or prepare one lower-cost high-protein meal.",
      evidence: [`Food budget used: ${percent((context.nutrition.cost / Math.max(1, context.nutrition.foodBudget)) * 100)}`, `Protein remaining: ${Math.max(0, Math.round(context.nutrition.proteinRemaining))}g`, `Home meal cost logged: ${money(context.nutrition.homeCost)}`, `Restaurant cost logged: ${money(context.nutrition.restaurantCost)}`],
      impacts: ["Finance improvement", "Nutrition improvement", "Goal progress"]
    });
  } else if (context.nutrition.hasTargets && context.nutrition.proteinRemaining > 25) {
    add("Close protein gap", {
      category: "Nutrition",
      urgency: 6,
      tab: "food",
      found: `${Math.round(context.nutrition.proteinRemaining)}g protein remains against your target.`,
      why: "Protein progress supports the nutrition and fitness parts of the LifeOps score.",
      action: "Log or prepare one high-protein meal.",
      evidence: [`Protein logged: ${Math.round(context.nutrition.protein)}g`, `Protein remaining: ${Math.round(context.nutrition.proteinRemaining)}g`],
      impacts: ["Nutrition", "Fitness"]
    });
  }
  if (context.fitness.hasWorkoutGoal && context.fitness.completion < 100) {
    add("Complete one workout", {
      category: "Fitness",
      urgency: context.fitness.workoutsDone === 0 ? 7 : 5,
      tab: "fitness",
      found: `Workout progress is ${percent(context.fitness.completion)}.`,
      why: "Workout consistency affects the fitness score and weekly momentum.",
      action: "Schedule or log one realistic workout.",
      evidence: [`Workouts: ${context.fitness.workoutsDone} of ${context.fitness.workoutGoal}`, `Logged workout records: ${context.fitness.workoutsLogged}`],
      impacts: ["Fitness", "Wellness"]
    });
  }
  if (context.wellness.sleepGoal > 0 && context.wellness.sleepHours < context.wellness.sleepGoal) {
    add("Protect sleep target", {
      category: "Wellness",
      urgency: 5,
      tab: "wellness",
      found: `Sleep is ${context.wellness.sleepHours}h against a ${context.wellness.sleepGoal}h goal.`,
      why: "Sleep can affect energy, stress, workouts, and planning consistency.",
      action: "Set tonight's sleep window and log energy tomorrow.",
      evidence: [`Sleep logged: ${context.wellness.sleepHours}h`, `Sleep goal: ${context.wellness.sleepGoal}h`, `Energy: ${context.wellness.energy}/5`],
      impacts: ["Wellness", "Fitness", "Focus"]
    });
  }
  if (context.education.nextDeadline) {
    const item = context.education.nextDeadline;
    add("Prepare next education deadline", {
      category: "Education",
      urgency: item.daysUntil <= 1 ? 8 : 5,
      tab: "education",
      found: `${item.title} is due in ${item.daysUntil} day${item.daysUntil === 1 ? "" : "s"}.`,
      why: "Upcoming school or training deadlines should shape today's plan.",
      action: "Open Education and define the next deliverable.",
      evidence: [`${item.kind}: ${item.title}`, `Date: ${item.date}`, `Course: ${item.course || "Not set"}`],
      impacts: ["Education", "Calendar", "Goals"]
    });
  }
  if (context.career.nextFollowUp) {
    const item = context.career.nextFollowUp;
    add("Prepare career follow-up", {
      category: "Career",
      urgency: item.daysUntil <= 1 ? 8 : 5,
      tab: "career",
      found: `${item.title} is due in ${item.daysUntil} day${item.daysUntil === 1 ? "" : "s"}.`,
      why: "Career follow-ups and interviews are time-sensitive and improve with preparation.",
      action: "Open Career and prepare the next follow-up or interview note.",
      evidence: [`Item: ${item.title}`, `Date: ${item.date}`, `Type: ${item.kind}`],
      impacts: ["Career", "Calendar", "Growth"]
    });
  }
  if (context.goals.highImpactAction) {
    const action = context.goals.highImpactAction;
    add("Complete high-impact weekly action", {
      category: action.area || "Goals",
      urgency: action.impact === "High" ? 6 : 4,
      tab: "goals",
      found: `${action.name} is still open.`,
      why: "Open weekly actions convert long-term goals into visible progress.",
      action: "Open Goals and move this action forward.",
      evidence: [`Action: ${action.name}`, `Impact: ${action.impact || "Not set"}`, `Deadline: ${action.deadline || "No deadline set"}`],
      impacts: [action.area || "Goals", "Goal progress"]
    });
  }
  if (context.privacy.sensitiveDocuments > 0) {
    add("Review sensitive document privacy", {
      category: "Privacy",
      urgency: 4,
      tab: "documents",
      found: `${context.privacy.sensitiveDocuments} document reference${context.privacy.sensitiveDocuments === 1 ? "" : "s"} marked sensitive.`,
      why: "Sensitive records should stay out of social previews, voice briefings, and public exports by default.",
      action: "Open Documents and verify privacy labels.",
      evidence: [`Sensitive references: ${context.privacy.sensitiveDocuments}`, `Private references: ${context.privacy.privateDocuments}`],
      impacts: ["Privacy", "Trust"]
    });
  }
  if (!actions.length && context.lifeScore.weakestArea) {
    add("Improve weakest Life Score area", {
      category: context.lifeScore.weakestArea,
      urgency: 3,
      tab: context.lifeScore.weakestArea === "Money" ? "money" : context.lifeScore.weakestArea === "Nutrition" ? "food" : context.lifeScore.weakestArea === "Fitness" ? "fitness" : context.lifeScore.weakestArea === "Wellness" ? "wellness" : "goals",
      found: `${context.lifeScore.weakestArea} is the lowest category at ${context.lifeScore.weakestScore}.`,
      why: "When there is no urgent deadline, the weakest score area is the most explainable next focus.",
      action: recommendedFallbackAction(context.lifeScore.weakestArea),
      evidence: [`Weakest area: ${context.lifeScore.weakestArea}`, `Score: ${context.lifeScore.weakestScore}/100`],
      impacts: [context.lifeScore.weakestArea, "Life Score"],
      confidence: context.confidence
    });
  }
  if (!actions.length) {
    return [atlasAction("Add more LifeOps data", {
      category: "Data",
      urgency: 1,
      tab: "setup",
      found: "I do not have enough information yet. Add or update the relevant LifeOps data first.",
      why: "Atlas Local needs saved values, due dates, goals, or activity logs before it can rank actions honestly.",
      action: "Add one goal, one bill date, one meal, or one workout.",
      evidence: ["No actionable local signals were found."],
      impacts: ["Data quality"],
      confidence: "Low",
      freshness: context.freshness
    })];
  }
  return actions.sort((a, b) => b.urgency - a.urgency).slice(0, 8);
}

function atlasSummaryRows(context = getAtlasContext(), priorities = evaluateAtlasPriorities(context)) {
  const top = priorities[0];
  return [
    ["Mode", "Local Intelligence"],
    ["Data source", context.privacy.dataSource],
    ["Remote AI", context.privacy.remoteAi],
    ["Conversation memory", context.privacy.memory],
    ["Actions", "Require confirmation"],
    ["Privacy", context.privacy.defaultSharing],
    ["Confidence", top?.confidence || context.confidence],
    ["Data freshness", top?.freshness || context.freshness]
  ];
}

function renderTreeCompactRows(id, rows, fallback = "No local data yet.") {
  const target = document.getElementById(id);
  if (!target) return;
  target.innerHTML = "";
  const safeRows = (rows || []).filter(row => row && row[0]);
  (safeRows.length ? safeRows : [["Atlas", fallback]]).forEach(([label, value]) => {
    const row = document.createElement("div");
    row.className = "tree-list-row";
    row.innerHTML = `<span class="tree-check"></span><div><strong></strong><small></small></div>`;
    row.querySelector(".tree-check").textContent = "";
    row.querySelector("strong").textContent = label;
    row.querySelector("small").textContent = value || "";
    target.appendChild(row);
  });
}

function lifeScoreParts() {
  return [
    { label: "Money", score: moneyHealthScore(), weight: .20, source: "Cash flow, savings, emergency fund, and daily money check." },
    { label: "Nutrition", score: nutritionHealthScore(), weight: .18, source: "Calories, protein, fat, and food budget." },
    { label: "Fitness", score: fitnessHealthScore(), weight: .18, source: "Workout target, steps, and logged workout minutes." },
    { label: "Wellness", score: wellnessHealthScore(), weight: .18, source: "Sleep, water, mood, stress, and energy." },
    { label: "Goals", score: goalCompletion(), weight: .16, source: "Average long-term goal progress." },
    { label: "Daily checks", score: dailyCompletion(), weight: .10, source: "Budget, workout, water, and sleep checks." }
  ].map(part => ({
    ...part,
    score: Math.max(0, Math.min(100, Math.round(cleanNumber(part.score)))),
    contribution: cleanNumber(part.score) * part.weight
  }));
}

function renderLifeScoreExplanation(context, top, chartStats) {
  const target = document.getElementById("lifeScoreExplainList");
  if (!target) return;
  const score = context.lifeScore.score;
  const change = cleanNumber(chartStats?.change);
  const changeText = change > 0 ? `up ${Math.round(change)} points across the recent trend` : change < 0 ? `down ${Math.abs(Math.round(change))} points across the recent trend` : "holding steady across the recent trend";
  const parts = lifeScoreParts();
  const strongest = [...parts].sort((a, b) => b.contribution - a.contribution)[0];
  const weakest = [...parts].sort((a, b) => a.score - b.score)[0];
  const summary = document.getElementById("lifeScoreExplainSummary");
  if (summary) summary.textContent = `Why ${score}`;
  const rows = [
    { label: "Formula", value: `${score}/100 from six weighted areas. The bars below show each current area score and weighted point impact.` },
    { label: "Trend", value: `Life Score is ${changeText}.` },
    { label: "Biggest lift", value: `${strongest.label} contributes about ${strongest.contribution.toFixed(1)} points right now.` },
    { label: "Largest drag", value: `${weakest.label} is the lowest area at ${weakest.score}/100.` },
    { label: "Fastest move", value: top?.action || recommendedFallbackAction(context.lifeScore.weakestArea) },
    ...parts.map(part => ({
      label: part.label,
      value: `${part.score}/100`,
      meta: `${Math.round(part.weight * 100)}% weight - ${part.contribution.toFixed(1)} pts`,
      width: part.score,
      factor: true
    }))
  ];
  target.innerHTML = "";
  rows.forEach(rowData => {
    const row = document.createElement("div");
    row.className = rowData.factor ? "tree-score-explain-row score-factor-row" : "tree-score-explain-row";
    if (rowData.factor) {
      row.innerHTML = `<div><span></span><strong></strong></div><em></em><div class="score-factor-bar"><i></i></div>`;
      row.querySelector("span").textContent = rowData.label;
      row.querySelector("strong").textContent = rowData.value;
      row.querySelector("em").textContent = rowData.meta;
      row.querySelector("i").style.setProperty("--score-width", `${Math.max(0, Math.min(100, cleanNumber(rowData.width)))}%`);
    } else {
      row.innerHTML = `<span></span><strong></strong>`;
      row.querySelector("span").textContent = rowData.label;
      row.querySelector("strong").textContent = rowData.value;
    }
    target.appendChild(row);
  });
  const scoreLabel = document.getElementById("todayScoreDelta");
  if (scoreLabel && score < 60) scoreLabel.textContent = "Buildable";
}

function atlasIgnoredSignal(priorities) {
  const ignored = priorities.slice(1, 3).map(item => `${item.category}: ${item.title}`);
  if (!ignored.length) return "No stronger competing signal found.";
  return priorities.length > 3 ? `${ignored.join("; ")}; view all in Atlas.` : ignored.join("; ");
}

function atlasChosenOverLabel(priorities) {
  const top = priorities[0];
  const next = priorities[1];
  if (!top) return "Atlas needs more local records before it can compare priorities.";
  if (top.chosenOver) return top.chosenOver;
  if (!next) return "No other current signal is stronger than this action.";
  const topUrgency = cleanNumber(top.urgency, 0, 10);
  const nextUrgency = cleanNumber(next.urgency, 0, 10);
  return `${top.category} outranks ${next.category} because it is ${topUrgency}/10 urgency versus ${nextUrgency}/10, with clearer evidence right now.`;
}

function atlasDependencyLabel(action) {
  const category = String(action?.category || "").toLowerCase();
  if (action?.dependency && action.dependency !== "Ready") return action.dependency;
  if (action?.incomplete) return action.incomplete;
  if (category.includes("finance")) return "Open Money and confirm the bill, cash flow, or payment plan before adding new commitments.";
  if (category.includes("nutrition")) return "Use a saved meal, grocery option, or food log so the budget and macro impact stays visible.";
  if (category.includes("fitness")) return "Pick a realistic workout window or log the workout already completed.";
  if (category.includes("wellness")) return "Update sleep, energy, stress, or water so Atlas can judge recovery more accurately.";
  if (category.includes("education")) return "Open Education and confirm the next course, assignment, or deadline.";
  if (category.includes("career")) return "Open Career and confirm the application, interview, resume, or follow-up status.";
  if (category.includes("privacy")) return "Review the document label before sharing, exporting, or using voice output.";
  if (category.includes("data")) return "Add one dated record, goal, meal, workout, or task so Atlas has enough local evidence.";
  return "No blocker detected. This can be started from the related section.";
}

function atlasRiskLabel(action) {
  if (typeof action?.risk === "string" && action.risk) return action.risk;
  const urgency = cleanNumber(action?.urgency ?? action?.severity ?? 0);
  if (urgency >= 8) return "High";
  if (urgency >= 5) return "Medium";
  return "Low";
}

function atlasBenefitLabel(context, action) {
  if (action?.factorSummary) return action.factorSummary;
  return Array.isArray(action?.impacts) && action.impacts.length
    ? action.impacts.slice(0, 3).join(", ")
    : `${context.lifeScore.weakestArea || "Momentum"}, planning, focus`;
}

function atlasOutcomeLabel(context, action) {
  if (action?.expectedOutcome) return `This should ${action.expectedOutcome.charAt(0).toLowerCase()}${action.expectedOutcome.slice(1)}`;
  const impacts = Array.isArray(action?.impacts) ? action.impacts.filter(Boolean) : [];
  const cleaned = impacts
    .map(item => String(item).replace(/Life Score/gi, "momentum"))
    .slice(0, 3);
  if (cleaned.length) return `This should improve ${cleaned.join(", ").toLowerCase()} without adding extra noise.`;
  return `This should improve clarity in ${String(context.lifeScore.weakestArea || "today's plan").toLowerCase()}.`;
}

function atlasAttentionReason(action) {
  const found = action?.found || action?.title || "Atlas found one local signal that deserves attention.";
  const why = action?.why || action?.reason || "It has the clearest impact right now.";
  return `${found} ${why}`;
}

function renderAtlasCommandCenter(context, priorities, chartStats) {
  const top = priorities[0] || atlasRecommendation();
  const setText = (id, value) => {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
  };
  const evidence = Array.isArray(top.evidence) && top.evidence.length
    ? top.evidence.slice(0, 3).join("; ")
    : top.meta || top.found || "Atlas is using the strongest available local signal.";
  const confidence = top.confidence || context.confidence || "Medium";
  const chosenOver = atlasChosenOverLabel(priorities);
  const dependency = atlasDependencyLabel(top);
  const outcome = atlasOutcomeLabel(context, top);
  setText("atlasCommandConfidence", `${confidence} confidence`);
  setText("atlasCommandAction", top.action || "Add one LifeOps record so Atlas can rank your next action.");
  setText("atlasCommandReason", atlasAttentionReason(top));
  setText("atlasCommandWhyNow", top.found || top.title || "This is the strongest current LifeOps signal.");
  setText("atlasCommandEvidence", evidence);
  setText("atlasCommandOutcome", outcome);
  setText("atlasCommandChosenOver", chosenOver);
  setText("atlasCommandDependency", dependency);
  setText("atlasThinkingPriority", top.category || context.lifeScore.weakestArea || "Daily focus");
  setText("atlasThinkingReason", top.found || top.title || "This is the strongest current LifeOps signal.");
  setText("atlasThinkingIgnored", atlasIgnoredSignal(priorities));
  setText("atlasThinkingEvidence", evidence);
  setText("atlasThinkingFreshness", top.freshness || context.freshness || "Current local data");
  setText("atlasCommandBenefit", atlasOutcomeLabel(context, top).replace(/^This should /, ""));
  setText("atlasCommandTime", top.time || top.estimate || "8 minutes");
  setText("atlasCommandRisk", atlasRiskLabel(top));
  setText("atlasCommandConfidenceMetric", confidence);
  setText("atlasThinkingBenefit", atlasBenefitLabel(context, top));
  setText("atlasThinkingTime", top.time || top.estimate || "8 minutes");
  setText("atlasThinkingRisk", atlasRiskLabel(top));
  const start = document.getElementById("atlasCommandStartBtn");
  if (start) start.dataset.openAtlasTab = top.tab || "dashboard";
  renderLifeScoreExplanation(context, top, chartStats);
  renderTreeCompactRows("atlasStatusList", atlasStatusRows(context, priorities, chartStats));
  renderTreeCompactRows("atlasDailyBriefList", atlasDailyBriefRows(context, priorities));
  renderTreeCompactRows("atlasDailyDebriefList", atlasDailyDebriefRows(context, priorities, chartStats));
}

function atlasStatusRows(context, priorities = evaluateAtlasPriorities(context), chartStats = scoreTrendStats(scoreTrendValues(14))) {
  const top = priorities[0];
  const change = cleanNumber(chartStats?.change);
  const trend = change > 0 ? "Momentum is improving." : change < 0 ? "Momentum needs attention." : "Momentum is steady.";
  return [
    ["Mode", "Local only. No remote AI connection."],
    ["State", `${top?.confidence || context.confidence || "Medium"} confidence. ${trend}`],
    ["Watching", top?.category || context.lifeScore.weakestArea || "Daily focus"]
  ];
}

function atlasDailyBriefRows(context, priorities = evaluateAtlasPriorities(context)) {
  const top = priorities[0];
  const upcoming = homeUpcomingItems().slice(0, 2);
  const workoutText = context.fitness.hasWorkoutGoal
    ? `${context.fitness.workoutsDone} of ${context.fitness.workoutGoal} workouts complete.`
    : `${context.fitness.workoutsLogged} workout record${context.fitness.workoutsLogged === 1 ? "" : "s"} logged.`;
  const cashText = context.finance.cashLeft < 0
    ? "Cash flow needs attention before new commitments."
    : context.finance.upcomingBills.length
      ? "Cash flow is stable, but upcoming payments should stay visible."
      : "Cash flow is stable based on current local entries.";
  const display = displayName();
  const nameLine = display ? `${timeGreeting()}, ${display}.` : `${timeGreeting()}.`;
  const proteinLine = context.nutrition.hasTargets && context.nutrition.proteinRemaining > 0
    ? `You are about ${Math.round(context.nutrition.proteinRemaining)}g short of your protein target.`
    : "Nutrition is waiting for the next useful meal log.";
  const upcomingLine = upcoming.length ? `Coming up: ${upcoming.map(item => item.title).join("; ")}.` : "No urgent dated items are crowding today.";
  const actionText = String(top?.action || "choosing one realistic action").replace(/[.]+$/, "");
  const reasonText = String(top?.why || "Atlas needs more local data to rank a stronger action.").replace(/[.]+$/, "");
  return [
    ["Brief", `${nameLine} Today's biggest opportunity is ${actionText}. ${reasonText}.`],
    ["Signals", `${cashText} ${proteinLine} ${workoutText}`],
    ["Upcoming", upcomingLine]
  ];
}

function atlasDailyDebriefRows(context, priorities = evaluateAtlasPriorities(context), chartStats = scoreTrendStats(scoreTrendValues(14))) {
  const completedTasks = state.tasks.filter(task => task.done).length;
  const completedHabits = (state.dailyChecks || []).filter(check => check.done).length;
  const change = cleanNumber(chartStats?.change);
  const changeText = change > 0 ? `Life Score improved ${Math.round(change)} points.` : change < 0 ? `Life Score slipped ${Math.abs(Math.round(change))} points.` : "Life Score held steady.";
  return [
    ["Debrief", `You made progress today: ${completedTasks} task${completedTasks === 1 ? "" : "s"} and ${completedHabits} habit check${completedHabits === 1 ? "" : "s"} complete. ${changeText}`],
    ["Recent win", recentWinText()],
    ["Tomorrow", `The next best setup is: ${state.profile.tomorrowFocus || priorities[0]?.action || "set one realistic priority for tomorrow."}`]
  ];
}

function atlasRowsFromAction(action, context = getAtlasContext()) {
  if (action?.decision && window.LifeOpsAtlasExplanations?.rowsFromDecision) {
    return window.LifeOpsAtlasExplanations.rowsFromDecision(action.decision);
  }
  return [
    ["What I found", action.found],
    ["Why it matters", action.why],
    ["Recommended action", action.action],
    ["Evidence from LifeOps", action.evidence.length ? action.evidence.join("; ") : "I do not have enough information yet. Add or update the relevant LifeOps data first."],
    ["Expected impact", action.impacts.join("; ")],
    ["Confidence", action.confidence],
    ["Data freshness", action.freshness],
    ["Optional next step", `Open ${action.category} details or update the related LifeOps data.`]
  ];
}

function atlasUnsupportedRows() {
  return [
    ["What I found", "Atlas Local cannot answer that yet. Full conversational AI requires a secure backend connection."],
    ["Why it matters", "This version only answers supported local questions with deterministic rules and visible evidence."],
    ["Recommended action", "Ask one of the supported local questions or update the relevant LifeOps data first."],
    ["Evidence from LifeOps", "No supported local intent matched the question."],
    ["Confidence", "Low"],
    ["Data freshness", atlasFreshnessLabel()]
  ];
}

function atlasLocalRowsForQuestion(question, context = getAtlasContext()) {
  const q = (question || "").toLowerCase();
  const priorities = evaluateAtlasPriorities(context);
  const top = priorities[0];
  if (!q.trim() || q.includes("next") || q.includes("focus") || q.includes("do now")) return atlasRowsFromAction(top, context);
  if (q.includes("due this week") || q.includes("coming up") || q.includes("due soon")) {
    const items = [
      ...context.finance.upcomingBills.map(item => `${item.name} bill/payment due ${item.dueDate}`),
      ...context.education.deadlines.filter(item => item.daysUntil !== null && item.daysUntil >= 0 && item.daysUntil <= 7).map(item => `${item.title} ${item.kind.toLowerCase()} due ${item.date}`),
      ...context.career.followUps.filter(item => item.daysUntil !== null && item.daysUntil >= 0 && item.daysUntil <= 7).map(item => `${item.title} due ${item.date}`)
    ];
    return [
      ["What I found", items.length ? items.slice(0, 5).join("; ") : "I do not have enough dated items this week."],
      ["Why it matters", "Dated bills, assignments, and follow-ups should shape the current week before lower urgency tasks."],
      ["Recommended action", items.length ? "Handle the earliest dated item first." : "Add due dates to bills, assignments, goals, or follow-ups."],
      ["Evidence from LifeOps", items.length ? `${items.length} dated item${items.length === 1 ? "" : "s"} found for this week.` : "No due-this-week local records found."],
      ["Confidence", items.length ? context.confidence : "Low"],
      ["Data freshness", context.freshness]
    ];
  }
  if (q.includes("life score") || q.includes("score low") || q.includes("weakest")) {
    return [
      ["What I found", `${context.lifeScore.weakestArea} is weakest at ${context.lifeScore.weakestScore}/100. ${context.lifeScore.strongestArea} is strongest at ${context.lifeScore.strongestScore}/100.`],
      ["Why it matters", "The Life Score is built from money, nutrition, fitness, wellness, and goal progress."],
      ["Recommended action", top.action],
      ["Evidence from LifeOps", Object.entries(context.lifeScore.categoryScores).map(([area, score]) => `${area}: ${Math.round(score)}`).join("; ")],
      ["Confidence", context.confidence],
      ["Data freshness", context.freshness]
    ];
  }
  if (q.includes("money") || q.includes("cash") || q.includes("left")) {
    return [
      ["What I found", `Estimated cash left is ${money(context.finance.cashLeft)}.`],
      ["Why it matters", "Cash left is calculated from income minus expenses and planned savings."],
      ["Recommended action", context.finance.cashLeft < 0 ? "Review expenses or savings target before adding commitments." : "Review upcoming bills before deciding what to save or spend next."],
      ["Evidence from LifeOps", `Income: ${money(context.finance.income)}; expenses: ${money(context.finance.expenses)}; planned savings: ${money(context.finance.savingsGoal)}.`],
      ["Confidence", context.profile.hasMoneyTargets ? context.confidence : "Low"],
      ["Data freshness", context.freshness]
    ];
  }
  if (q.includes("assignment") || q.includes("school") || q.includes("education")) {
    const item = context.education.nextDeadline;
    return [
      ["What I found", item ? `${item.title} is the next education deadline on ${item.date}.` : "I do not have enough education deadline information yet."],
      ["Why it matters", "Education deadlines are only reliable when assignments or exams have dates."],
      ["Recommended action", item ? "Open Education and prepare the next deliverable." : "Add an assignment, exam, or course deadline."],
      ["Evidence from LifeOps", item ? `${item.kind}: ${item.title}; course: ${item.course || "Not set"}; days until: ${item.daysUntil}.` : "No dated education records found."],
      ["Confidence", item ? context.confidence : "Low"],
      ["Data freshness", context.freshness]
    ];
  }
  if (q.includes("bill") || q.includes("payment")) {
    const item = context.finance.upcomingBills[0] || context.finance.overdueBills[0];
    return [
      ["What I found", item ? `${item.name} is the most important bill/payment signal.` : "I do not have enough bill due date information yet."],
      ["Why it matters", "Upcoming or overdue payments should be visible before other money decisions."],
      ["Recommended action", item ? "Open Money and confirm the payment plan." : "Add due dates to bills or debt payments."],
      ["Evidence from LifeOps", item ? `${item.name}: ${money(cleanNumber(item.amount))}; due date: ${item.dueDate}.` : "No dated bill or debt payment found."],
      ["Confidence", item ? context.confidence : "Low"],
      ["Data freshness", context.freshness]
    ];
  }
  if (q.includes("eat") || q.includes("meal") || q.includes("protein") || q.includes("food")) {
    const action = priorities.find(item => item.category === "Nutrition") || top;
    return atlasRowsFromAction(action, context);
  }
  if (q.includes("career") || q.includes("follow")) {
    const item = context.career.nextFollowUp;
    return [
      ["What I found", item ? `${item.title} is the next career item on ${item.date}.` : "I do not have enough career follow-up information yet."],
      ["Why it matters", "Career reminders only work when applications, interviews, or follow-up dates are logged."],
      ["Recommended action", item ? "Open Career and prepare the next follow-up." : "Add an application, interview, or follow-up date."],
      ["Evidence from LifeOps", item ? `${item.kind}: ${item.title}; days until: ${item.daysUntil}.` : "No dated career records found."],
      ["Confidence", item ? context.confidence : "Low"],
      ["Data freshness", context.freshness]
    ];
  }
  return atlasUnsupportedRows();
}

function formatAtlasRows(rows) {
  return rows.map(([title, text]) => `${title}: ${text}`).join("\n\n");
}

// Future secure AI interface placeholder:
// Browser code must never contain private model API keys. A future server should handle
// authentication, model requests, rate limits, privacy filtering, and action confirmation.
function sendAtlasRequest(question, context = getAtlasContext()) {
  const decision = currentAtlasDecision(context);
  return {
    mode: "local",
    rows: (!question || /next|focus|do now|recommend|attention/i.test(question))
      ? (window.LifeOpsAtlasExplanations?.rowsFromDecision?.(decision) || atlasLocalRowsForQuestion(question, context))
      : atlasLocalRowsForQuestion(question, context),
    contextGeneratedAt: context.generatedAt
  };
}

function atlasPanelSummary() {
  const context = getAtlasContext();
  const decision = currentAtlasDecision(context);
  const top = decision?.topAction;
  const atlas = atlasRecommendation();
  const upcoming = [
    ...context.finance.upcomingBills.map(item => item.name),
    ...state.calendarEvents.filter(item => daysUntil(item.date) !== null && daysUntil(item.date) >= 0 && daysUntil(item.date) <= 7).map(item => item.title)
  ].slice(0, 3);
  return {
    action: top?.title || atlas.action,
    reason: decision?.explanation?.whyNow || atlas.reason,
    briefing: `Focus: ${top?.category || atlas.category}. Next action: ${top?.title || atlas.action} ${upcoming.length ? `Upcoming: ${upcoming.join(", ")}.` : "No urgent upcoming items are logged."}`
  };
}

function setAtlasCenterPanel(open) {
  const panel = document.getElementById("atlasCenterPanel");
  if (!panel) return;
  if (open) renderAtlasCenterPanel();
  panel.classList.toggle("open", open);
  panel.setAttribute("aria-hidden", open ? "false" : "true");
  if (open) setTimeout(() => document.getElementById("atlasCenterInput")?.focus(), 60);
}

function renderAtlasCenterPanel() {
  const summary = atlasPanelSummary();
  const setText = (id, text) => {
    const element = document.getElementById(id);
    if (element) element.textContent = text;
  };
  setText("atlasCenterNextAction", summary.action);
  setText("atlasCenterReason", summary.reason);
  setText("atlasCenterBriefing", summary.briefing);
}

function askAtlasCenterPanel() {
  const input = document.getElementById("atlasCenterInput");
  const response = document.getElementById("atlasCenterResponse");
  if (!input || !response) return;
  const question = input.value.trim() || "What should I do next?";
  const result = sendAtlasRequest(question);
  const recommended = result.rows.find(row => row[0] === "Recommended action")?.[1] || atlasRecommendation().action;
  const evidence = result.rows.find(row => row[0] === "Evidence from LifeOps")?.[1] || "Local LifeOps data.";
  response.textContent = `${recommended} Evidence: ${evidence}`;
  input.value = "";
}

const treeAreaConfig = {
  mind: {
    title: "Mind",
    category: "Wellness",
    tab: "wellness",
    addAction: "task",
    modules: ["Mood tracking", "Journaling", "Focus sessions", "Stress check-ins"],
    action: "Log mood, stress, energy, and one short reflection."
  },
  finance: {
    title: "Finance",
    category: "Money",
    tab: "money",
    addAction: "expense",
    modules: ["Income", "Expenses", "Bills", "Debt payoff", "Savings goals", "Credit progress"],
    action: "Review upcoming bills and protect cash before new spending."
  },
  education: {
    title: "Education",
    category: "Education",
    tab: "education",
    addAction: "task",
    modules: ["Classes", "Assignments", "Grades", "Degree progress", "Scholarships"],
    action: "Add or review the next assignment, exam, or course deadline."
  },
  career: {
    title: "Career",
    category: "Career",
    tab: "career",
    addAction: "task",
    modules: ["Applications", "Interviews", "Work goals", "Resume", "Promotions", "Certifications"],
    action: "Prepare the next career follow-up or update one application."
  },
  health: {
    title: "Health",
    category: "Health",
    tab: "food",
    addAction: "workout",
    modules: ["Workouts", "Sleep", "Nutrition", "Medications", "Appointments"],
    action: "Log one workout, meal, sleep update, or health appointment."
  },
  relationships: {
    title: "Relationships",
    category: "Relationships",
    tab: "connections",
    addAction: "invite",
    modules: ["Family", "Friends", "Shared goals", "Reminders", "Important dates"],
    action: "Add one trusted connection or shared plan as a local preview."
  },
  growth: {
    title: "Personal Growth",
    category: "Goals",
    tab: "goals",
    addAction: "goal",
    modules: ["Habits", "Reading", "Learning", "Reflection", "Milestones"],
    action: "Complete one weekly action or add a milestone."
  },
  foundation: {
    title: "Foundation",
    category: "Foundation",
    tab: "documents",
    addAction: "task",
    modules: ["Housing", "Documents", "Emergency plan", "Insurance", "Core routines"],
    action: "Review one core document, bill, or emergency routine."
  }
};

function treeAreaScore(area, context = getAtlasContext()) {
  const scores = context.lifeScore.categoryScores || {};
  const lookup = {
    mind: scores.Wellness,
    finance: scores.Money,
    education: state.educationCourses.length || state.educationGoals.length ? Math.round(average([goalCompletion(), 70])) : 58,
    career: state.careerApplications.length || state.careerInterviews.length ? 70 : 56,
    health: Math.round(average([scores.Nutrition || 0, scores.Fitness || 0, scores.Wellness || 0])),
    relationships: state.connections.length || state.sharedGoals.length ? 68 : 54,
    growth: scores.Goals,
    foundation: Math.round(average([scores.Money || 0, scores.Goals || 0, lifeScore()]))
  };
  return Math.max(0, Math.min(100, Math.round(cleanNumber(lookup[area], lifeScore()))));
}

function dateSignal(date, fallback = "No date") {
  const days = daysUntil(date);
  if (!date) return fallback;
  if (days === null) return `Date: ${date}`;
  if (days < 0) return `${Math.abs(days)} day${Math.abs(days) === 1 ? "" : "s"} ago`;
  if (days === 0) return "Today";
  return `In ${days} day${days === 1 ? "" : "s"}`;
}

function areaMatch(value, terms) {
  const text = String(value || "").toLowerCase();
  return terms.some(term => text.includes(term.toLowerCase()));
}

function treeAreaTerms(area) {
  return {
    mind: ["Wellness", "Mind", "Mood", "Stress", "Sleep", "Focus"],
    finance: ["Money", "Finance", "Bill", "Debt", "Savings", "Emergency"],
    education: ["Education", "School", "Course", "Assignment", "Exam", "Learning"],
    career: ["Career", "Job", "Interview", "Resume", "Portfolio", "Application"],
    health: ["Health", "Fitness", "Nutrition", "Workout", "Meal", "Protein", "Steps"],
    relationships: ["Relationships", "Family", "Friend", "Connection", "Shared"],
    growth: ["Goals", "Growth", "Habit", "Reading", "Learning", "Milestone"],
    foundation: ["Foundation", "Documents", "Housing", "Insurance", "Emergency", "Bills"]
  }[area] || [];
}

function scoreBand(score) {
  if (score >= 75) return "Stable";
  if (score >= 60) return "Building";
  if (score >= 45) return "Watch";
  return "Needs attention";
}

function treeAreaRows(area) {
  const config = treeAreaConfig[area] || treeAreaConfig.foundation;
  const terms = treeAreaTerms(area);
  const matchingGoals = state.goals
    .filter(goal => areaMatch(goal.area, terms) || areaMatch(goal.name, terms))
    .slice(0, 4);
  const matchingTasks = state.tasks
    .filter(task => areaMatch(task.area, terms) || areaMatch(task.name, terms))
    .slice(0, 4);
  const matchingActions = state.planActions
    .filter(action => areaMatch(action.area, terms) || areaMatch(action.goal, terms) || areaMatch(action.name, terms))
    .slice(0, 4);
  const billRows = state.expenses
    .filter(item => item.dueDate || ["Bill", "Debt Payment"].includes(item.type))
    .sort((a, b) => (daysUntil(a.dueDate) ?? 9999) - (daysUntil(b.dueDate) ?? 9999))
    .slice(0, 4)
    .map(item => [item.name, `${item.type} / ${money(cleanNumber(item.amount))} / ${dateSignal(item.dueDate, "No due date")}`]);
  const mealTotalsNow = mealTotals();
  const activityByArea = {
    mind: [
      [`${cleanNumber(state.profile.sleepHours)}h sleep`, `Goal ${cleanNumber(state.profile.sleepGoal)}h / Stress ${cleanNumber(state.profile.stress)}/5`],
      [`Mood ${cleanNumber(state.profile.mood)}/5`, `Energy ${cleanNumber(state.profile.energy)}/5 / Water ${cleanNumber(state.profile.waterCups)} cups`]
    ],
    finance: [
      [money(cashLeft()), "Estimated monthly cash remaining"],
      [`${state.expenses.length} expense records`, `${state.expenses.filter(item => item.dueDate).length} dated bill or payment records`],
      ...billRows
    ],
    education: [
      [`${state.educationCourses.length} courses`, "Course and learning path records"],
      ...state.educationAssignments.slice(0, 3).map(item => [item.title, `${item.course || "Course not set"} / ${dateSignal(item.dueDate, "No due date")}`]),
      ...state.educationGoals.slice(0, 2).map(item => [item.title, `${percent(item.progress)} complete / target ${item.targetDate || "not set"}`])
    ],
    career: [
      [`${state.careerApplications.length} applications`, `${state.careerInterviews.length} interviews / ${state.careerSkills.length} skills`],
      ...state.careerApplications.slice(0, 3).map(item => [item.company || item.position || "Career record", `${item.status || "Status not set"} / ${dateSignal(item.followUpDate, "No follow-up date")}`]),
      ...state.careerGoals.slice(0, 2).map(item => [item.title, `${percent(item.progress)} complete / target ${item.targetDate || "not set"}`])
    ],
    health: [
      [`${state.workouts.length} workouts`, `${cleanNumber(state.profile.workoutsDone)} of ${cleanNumber(state.profile.workoutGoal)} weekly target`],
      [`${state.meals.length} meals`, `${Math.round(mealTotalsNow.protein)}g protein / ${money(mealTotalsNow.cost)} food cost`],
      [`${cleanNumber(state.profile.stepsToday)} steps`, `Goal ${cleanNumber(state.profile.stepGoal)} steps today`]
    ],
    relationships: [
      [`${state.connections.length} connection profiles`, "Local preview only"],
      [`${state.sharedGoals.length} shared goals`, `${state.sharedLists.length} shared lists / ${state.sharedChallenges.length} challenges`],
      ...state.sharedPlans.slice(0, 2).map(item => [item.title, `${item.privacy || "Only me"} / ${dateSignal(item.date, "No date")}`])
    ],
    growth: [
      [`${state.goals.length} goals`, `${Math.round(goalCompletion())}% average progress`],
      [`${state.planActions.filter(action => action.done).length} actions complete`, `${state.planActions.filter(action => !action.done).length} open weekly actions`],
      ...state.timeline.slice(-2).reverse().map(item => [item.title, `${item.category || "Milestone"} / ${item.date || "No date"}`])
    ],
    foundation: [
      [`${state.documents.length} document references`, `${state.documents.filter(item => item.sensitivity === "Sensitive").length} marked sensitive`],
      [`${state.expenses.filter(item => item.dueDate).length} dated obligations`, `${contextualUpcomingCount()} important upcoming item${contextualUpcomingCount() === 1 ? "" : "s"}`],
      ...billRows
    ]
  };
  const recent = activityByArea[area] || [];
  const goalRows = [
    ...matchingGoals.map(goal => [goal.name, `${percent(goal.progress)} complete${goal.targetDate ? ` / target ${goal.targetDate}` : ""}`]),
    ...matchingActions.map(action => [action.name, `${action.done ? "Complete" : "Open"} / ${action.impact || "Normal"} impact${action.deadline ? ` / ${dateSignal(action.deadline)}` : ""}`]),
    ...matchingTasks.map(task => [task.name, task.done ? "Complete" : "Open task"])
  ].slice(0, 6);
  const openCount = [...matchingTasks, ...matchingActions].filter(item => !item.done).length + matchingGoals.filter(goal => cleanNumber(goal.progress) < 100).length;
  return {
    activity: recent.length ? recent : [["No recent activity", "Add one update to activate this area"]],
    goals: goalRows,
    openCount,
    recentSignal: recent[0]?.[0] || "No signal yet",
    privacy: area === "relationships" ? "Only me / local preview" : "Private by default"
  };
}

function treeAreaNarrative(area, score, rows) {
  const config = treeAreaConfig[area] || treeAreaConfig.foundation;
  const status = scoreBand(score);
  const signal = rows.recentSignal || "local data";
  const openText = rows.openCount === 1 ? "1 open item" : `${rows.openCount || 0} open items`;
  return `${config.title} is ${status.toLowerCase()} at ${score}/100. Atlas is using ${signal} plus ${openText} to choose the next practical action.`;
}

function renderTreeDetailList(id, rows) {
  const list = document.getElementById(id);
  if (!list) return;
  list.innerHTML = "";
  (rows.length ? rows : [["Nothing here yet", "Use Add to create the first item"]]).forEach(([title, meta]) => {
    const row = document.createElement("div");
    row.innerHTML = `<strong></strong><span></span>`;
    row.querySelector("strong").textContent = title;
    row.querySelector("span").textContent = meta;
    list.appendChild(row);
  });
}

function setTreeDetailPanel(open, area = "foundation") {
  const panel = document.getElementById("treeDetailPanel");
  if (!panel) return;
  if (open) renderTreeDetailPanel(area);
  panel.classList.toggle("open", open);
  panel.setAttribute("aria-hidden", open ? "false" : "true");
  if (open) setTimeout(() => document.getElementById("closeTreeDetailBtn")?.focus(), 60);
}

function renderTreeDetailPanel(area) {
  const config = treeAreaConfig[area] || treeAreaConfig.foundation;
  const rows = treeAreaRows(area);
  const score = treeAreaScore(area);
  const setText = (id, text) => {
    const element = document.getElementById(id);
    if (element) element.textContent = text;
  };
  setText("treeDetailCategory", config.category);
  setText("treeDetailTitle", config.title);
  setText("treeDetailSubtitle", config.modules.join(", "));
  setText("treeDetailNarrative", treeAreaNarrative(area, score, rows));
  setText("treeDetailOpenWork", rows.openCount === 1 ? "1 item" : `${rows.openCount || 0} items`);
  setText("treeDetailRecentSignal", rows.recentSignal || "No signal yet");
  setText("treeDetailPrivacy", rows.privacy || "Private by default");
  setText("treeDetailScore", `${score}%`);
  setText("treeDetailScoreMeta", `${scoreBand(score)} area. ${score >= 70 ? "Keep reinforcing what is working." : score >= 50 ? "One focused update can improve clarity." : "Start with one small action to regain control."}`);
  setText("treeDetailAction", config.action);
  setText("treeDetailActionMeta", `Rule used: ${config.title} uses local score, recent activity, dated records, goals, and open work.`);
  renderTreeDetailList("treeDetailActivity", rows.activity);
  renderTreeDetailList("treeDetailGoals", rows.goals);
  const addBtn = document.getElementById("treeDetailAddBtn");
  if (addBtn) {
    addBtn.dataset.quickAction = config.addAction;
    addBtn.textContent = `Add ${config.title}`;
  }
  const openBtn = document.getElementById("treeDetailOpenBtn");
  if (openBtn) {
    openBtn.dataset.openTabTarget = config.tab;
  }
}

function applyConfirmedAtlasAction(action) {
  if (!action?.tab) return false;
  if (window.LifeOpsCommandActions?.start) {
    const command = window.LifeOpsCommandActions.current(state, { getAtlasContext, evaluateAtlasPriorities });
    if (command) window.LifeOpsCommandActions.start(state, command.id);
  }
  if (action.rawCandidate && window.LifeOpsAtlasActions?.perform) {
    window.LifeOpsAtlasActions.perform(state, action.rawCandidate, "start", { note: "User opened the recommended source area." });
    persistState({ reason: "atlas-action-start", userMessage: false });
  }
  activateTab(action.tab, sectionPrimary[action.tab] || null);
  return true;
}

function updateCurrentAtlasAction(actionName, options = {}) {
  const priority = evaluateAtlasPriorities(getAtlasContext())[0];
  let commandUpdated = false;
  if (window.LifeOpsCommandActions) {
    if (actionName === "complete") commandUpdated = Boolean(window.LifeOpsCommandActions.complete(state));
    if (actionName === "snooze") commandUpdated = Boolean(window.LifeOpsCommandActions.snooze(state, options.days || 1));
    if (actionName === "dismiss") commandUpdated = Boolean(window.LifeOpsCommandActions.dismiss(state));
  }
  if (commandUpdated) {
    persistState({ reason: `atlas-command-${actionName}`, userMessage: false });
    render();
    window.LifeOpsUI?.showStatus?.(`Atlas ${actionName} saved locally.`, "success");
    return true;
  }
  if (!priority?.rawCandidate || !window.LifeOpsAtlasActions?.perform) {
    return false;
  }
  const result = window.LifeOpsAtlasActions.perform(state, priority.rawCandidate, actionName, options);
  if (result.ok) {
    persistState({ reason: `atlas-action-${actionName}`, userMessage: false });
    render();
    window.LifeOpsUI?.showStatus?.(`Atlas ${actionName} saved locally.`, "success");
    return true;
  }
  window.LifeOpsUI?.showStatus?.(result.message || "Atlas could not update that action.", "warning");
  return false;
}

function showAtlasAlternatives() {
  const context = getAtlasContext();
  const decision = currentAtlasDecision(context);
  const alternatives = decision?.alternatives || [];
  const rows = alternatives.length
    ? alternatives.map((item, index) => [`Option ${index + 2}`, `${item.title} (${item.category}, ${Math.round(item.atlasScore || 0)} score)`])
    : [["Alternatives", "No other actionable local signal outranked the current recommendation."]];
  setCompanionDrawer(true);
  addCompanionSystemMessage(`Atlas alternatives\n\n${formatAtlasRows(rows)}`);
}

function recalculateAtlasDecision() {
  window.LifeOpsCommandActions?.recalculate?.(state, { getAtlasContext, evaluateAtlasPriorities });
  render();
  const top = evaluateAtlasPriorities(getAtlasContext())[0];
  window.LifeOpsUI?.showStatus?.(`Atlas recalculated: ${top?.title || "add more data"}.`, "success");
}

function openAtlasCorrectionModal() {
  const decision = currentAtlasDecision();
  const top = decision.topAction;
  openEditModal("Correct Atlas", [
    { name: "title", label: "What should Atlas correct?", value: top ? `Correction for ${top.category}` : "Atlas correction", wide: true },
    { name: "value", label: "Correction", type: "textarea", value: "", wide: true, maxLength: 500, placeholder: "Example: I usually work out after work, not in the morning." },
    { name: "category", label: "Category", type: "select", value: top?.category || "Atlas", options: window.LifeOpsMemoryNormalization?.CATEGORIES || ["Atlas"] },
    { name: "sensitive", label: "This correction is sensitive", type: "checkbox", value: false, wide: true },
    { name: "includeInAtlas", label: "Allow Atlas to use this correction", type: "checkbox", value: true, wide: true }
  ], values => {
    if (!values.value) return;
    window.LifeOpsCommandActions?.correct?.(state, values.value);
    state.atlasMemory = window.LifeOpsMemoryActions.createMemory(state.atlasMemory, {
      type: "correction",
      title: values.title || "Atlas correction",
      value: values.value,
      summary: values.value.slice(0, 220),
      category: values.category || "Atlas",
      source: "atlas-correction",
      sourceEntityId: top?.id || "",
      confidence: 1,
      sensitive: values.sensitive,
      includeInAtlas: values.includeInAtlas && !values.sensitive,
      userConfirmed: true,
      tags: ["correction", top?.category || "atlas"].filter(Boolean)
    });
    addCompanionSystemMessage("Correction saved locally. Atlas will use it on future recommendations when privacy settings allow it.");
    render();
  });
}

function ensureChatMessages() {
  if (chatMessages.length) return;
  const context = getAtlasContext();
  const priorities = evaluateAtlasPriorities(context);
  const top = priorities[0];
  chatMessages.push({
    role: "companion",
    text: `Atlas Local: Mode: Local Intelligence\nData source: This browser\nRemote AI: Not connected\nConversation memory: Local only\nActions: Require confirmation\nPrivacy: Private by default`
  });
  chatMessages.push({
    role: "companion",
    text: `Current Atlas Summary\n\n${formatAtlasRows(atlasRowsFromAction(top, context))}`
  });
}

function coachTextForQuestion(question) {
  const result = sendAtlasRequest(question);
  return `Atlas Local\n\n${formatAtlasRows(result.rows)}`;
}

function addCompanionSystemMessage(text) {
  chatMessages.push({ role: "companion", text });
  renderCompanionChat();
}

function sendCompanionMessage(question) {
  const text = (question || "").trim();
  if (!text) return;
  chatMessages.push({ role: "user", text });
  const typingId = `typing-${Date.now()}`;
  chatMessages.push({ role: "typing", id: typingId, text: "" });
  renderCompanionChat();
  window.setTimeout(() => {
    const typingIndex = chatMessages.findIndex(message => message.id === typingId);
    if (typingIndex !== -1) {
      chatMessages.splice(typingIndex, 1, { role: "companion", text: coachTextForQuestion(text) });
      renderCompanionChat();
    }
  }, 420);
}

function renderMiniTrend(id) {
  const list = document.getElementById(id);
  if (!list) return;
  renderScoreLineChart(id, scoreTrendValues(7), { compact: true });
}

function scoreTrendValues(limit = 14) {
  const saved = sortedHistory().slice(-6).map(item => cleanNumber(item.lifeScore));
  const values = [...saved, lifeScore()].slice(-7);
  while (values.length < 7) values.unshift(values[0] || lifeScore());
  if (limit <= 7) return values;
  const extended = [...sortedHistory().slice(-(limit - 1)).map(item => cleanNumber(item.lifeScore)), lifeScore()].slice(-limit);
  while (extended.length < Math.min(limit, 7)) extended.unshift(extended[0] || lifeScore());
  return extended;
}

function scoreTrendStats(values) {
  const first = cleanNumber(values[0]);
  const last = cleanNumber(values[values.length - 1]);
  const high = Math.max(...values.map(value => cleanNumber(value)));
  const low = Math.min(...values.map(value => cleanNumber(value)));
  const change = last - first;
  return { first, last, high, low, change, direction: change >= 0 ? "up" : "down" };
}

function renderScoreLineChart(id, values, options = {}) {
  const chart = document.getElementById(id);
  if (!chart) return;
  const width = options.compact ? 320 : 640;
  const height = options.compact ? 86 : 190;
  const padding = options.compact ? 10 : 18;
  const cleanValues = values.map(value => Math.max(0, Math.min(100, cleanNumber(value))));
  const stats = scoreTrendStats(cleanValues);
  const min = Math.max(0, Math.min(...cleanValues) - 6);
  const max = Math.min(100, Math.max(...cleanValues) + 6);
  const spread = Math.max(1, max - min);
  const points = cleanValues.map((value, index) => {
    const x = cleanValues.length === 1 ? width / 2 : padding + (index * (width - padding * 2)) / (cleanValues.length - 1);
    const y = padding + ((max - value) / spread) * (height - padding * 2);
    return [Number(x.toFixed(2)), Number(y.toFixed(2))];
  });
  const pointString = points.map(point => point.join(",")).join(" ");
  const areaString = `${padding},${height - padding} ${pointString} ${width - padding},${height - padding}`;
  const lastPoint = points[points.length - 1];
  const trendClass = stats.direction === "down" ? "down" : "";
  chart.innerHTML = `
    <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Life Score trend from ${Math.round(stats.first)} to ${Math.round(stats.last)}">
      <polyline class="score-market-area ${trendClass}" points="${areaString}"></polyline>
      <polyline class="score-market-line ${trendClass}" points="${pointString}"></polyline>
      <circle class="score-market-dot ${trendClass}" cx="${lastPoint[0]}" cy="${lastPoint[1]}" r="${options.compact ? 4 : 6}"></circle>
    </svg>`;
}

function renderMissionCards(id) {
  const list = document.getElementById(id);
  if (!list) return;
  list.innerHTML = "";
  missionProgress().missions.forEach(mission => {
    const card = document.createElement("article");
    card.className = `mission-card ${mission.complete ? "complete" : ""}`;
    card.innerHTML = `
      <div>
        <strong></strong>
        <div class="item-meta"></div>
      </div>
      <div class="${mission.complete ? "status" : "status watch"}"></div>`;
    card.querySelector("strong").textContent = mission.title;
    card.querySelector(".item-meta").textContent = mission.meta;
    card.querySelector(".status").textContent = mission.complete ? `Done +${mission.xp} XP` : `Open +${mission.xp} XP`;
    list.appendChild(card);
  });
}

function renderMissionList(id) {
  const list = document.getElementById(id);
  if (!list) return;
  list.innerHTML = "";
  missionProgress().missions.forEach(mission => {
    const row = document.createElement("div");
    row.className = "item";
    row.innerHTML = `<div><div class="item-title"></div><div class="item-meta"></div></div><span class="${mission.complete ? "status" : "status watch"}"></span>`;
    row.querySelector(".item-title").textContent = mission.title;
    row.querySelector(".item-meta").textContent = mission.meta;
    row.querySelector(".status").textContent = mission.complete ? "Complete" : `+${mission.xp} XP`;
    list.appendChild(row);
  });
}

function renderRewardVisuals(id) {
  const list = document.getElementById(id);
  if (!list) return;
  if (currentAppearance().gamificationEnabled === false) {
    list.innerHTML = `
      <article class="reward-momentum-card">
        <div><div class="item-title">Rewards</div><strong>Off</strong></div>
        <div class="item-meta">XP, levels, and achievement cards are disabled in Settings.</div>
      </article>`;
    return;
  }
  const level = rewardLevelInfo();
  const missions = missionProgress();
  const streak = savedDayStreak();
  list.innerHTML = `
    <article class="reward-momentum-card">
      <div><div class="item-title">Today's XP</div><strong>${todayRewardPoints() + missions.xp}</strong></div>
      <div class="progress"><div style="width:${percent(Math.min(100, level.progress))}"></div></div>
      <div class="item-meta">${level.remaining} XP until Level ${level.level + 1}</div>
    </article>
    <article class="streak-card">
      <div class="split"><div><div class="item-title">Streak</div><strong>${streak} day${streak === 1 ? "" : "s"}</strong></div><div class="streak-mark">${streak || 0}</div></div>
      <div class="item-meta">Save daily snapshots with a 55+ score to grow the streak.</div>
    </article>
    <article class="level-card">
      <div><div class="item-title">Next unlock</div><strong>Level ${level.level}</strong></div>
      <div class="item-meta">${nextRewardUnlock()}</div>
    </article>`;
}

function renderMissionStatus() {
  const progress = missionProgress();
  const summary = `${progress.complete}/${progress.total} missions complete. ${progress.xp} mission XP earned today.`;
  ["homeMissionProgress", "companionMissionProgress"].forEach(id => {
    const bar = document.getElementById(id);
    if (bar) bar.style.width = percent(progress.percent);
  });
  ["homeMissionSummary", "companionMissionSummary"].forEach(id => {
    const element = document.getElementById(id);
    if (element) element.textContent = summary;
  });
  ["homeMissionPrompt", "companionMissionPrompt"].forEach(id => {
    const element = document.getElementById(id);
    if (element) element.textContent = companionLeadMessage();
  });
  renderMissionCards("homeMissionCards");
  renderMissionList("companionMissionList");
}

function scoreDeltaFromHistory() {
  const history = sortedHistory();
  const previous = [...history].reverse().find(item => item.date !== todayKey() && cleanNumber(item.lifeScore) > 0);
  if (!previous) return { value: 0, label: "No saved snapshot" };
  const delta = lifeScore() - cleanNumber(previous.lifeScore);
  return {
    value: delta,
    label: `${delta >= 0 ? "+" : ""}${delta} from ${previous.date.slice(5)}`
  };
}

function missingScoreData(context = getAtlasContext()) {
  const missing = [];
  if (!context.profile.hasMoneyTargets) missing.push("money targets");
  if (!context.nutrition.hasTargets && context.nutrition.mealsLogged === 0) missing.push("nutrition targets or meals");
  if (!context.fitness.hasWorkoutGoal && context.fitness.workoutsLogged === 0) missing.push("workout goal or workout log");
  if (!context.wellness.sleepGoal && !context.wellness.waterGoal) missing.push("wellness targets");
  if (!context.goals.totalGoals && !context.goals.openActions) missing.push("goals or weekly actions");
  if (!context.education.deadlines.length) missing.push("education deadlines");
  if (!context.career.followUps.length) missing.push("career follow-ups");
  return missing;
}

function todaySignalCards(context = getAtlasContext()) {
  const meals = mealTotals();
  const nextEducation = context.education.nextDeadline;
  const nextCareer = context.career.nextFollowUp;
  return [
    {
      title: "Financial status",
      value: context.finance.cashLeft < 0 ? "Needs attention" : money(context.finance.cashLeft),
      meta: context.finance.upcomingBills[0] ? `${context.finance.upcomingBills[0].name} due ${context.finance.upcomingBills[0].dueDate}` : "No bill due in the next 7 days",
      tab: "money"
    },
    {
      title: "Nutrition progress",
      value: `${Math.round(meals.protein)}g protein`,
      meta: `${Math.max(0, Math.round(context.nutrition.proteinRemaining))}g remaining, ${money(meals.cost)} food cost`,
      tab: "food"
    },
    {
      title: "Education",
      value: nextEducation ? nextEducation.kind : "No deadline",
      meta: nextEducation ? `${nextEducation.title} due ${nextEducation.date}` : "Add assignments or exams for deadline tracking",
      tab: "education"
    },
    {
      title: "Career",
      value: nextCareer ? nextCareer.kind : "No follow-up",
      meta: nextCareer ? `${nextCareer.title} on ${nextCareer.date}` : "Add applications or interviews for follow-up tracking",
      tab: "career"
    },
    {
      title: "Goal progress",
      value: percent(context.goals.averageProgress),
      meta: context.goals.highImpactAction ? `Next: ${context.goals.highImpactAction.name}` : "Add one weekly action",
      tab: "goals"
    },
    {
      title: "Recent win",
      value: "Progress",
      meta: context.recentActions.recentWin,
      tab: "timeline"
    },
    {
      title: "Streak",
      value: `${savedDayStreak()} day${savedDayStreak() === 1 ? "" : "s"}`,
      meta: "No penalties for missed days. Use snapshots to track consistency.",
      tab: "history"
    },
    {
      title: "Privacy",
      value: "Local",
      meta: "Atlas mode: Local Intelligence. Remote AI is not connected.",
      tab: "privacy"
    }
  ];
}

function renderLifeTreeDashboard(context, score, chartStats) {
  const scores = context.lifeScore.categoryScores || {};
  const average = values => Math.round(values.reduce((sum, value) => sum + cleanNumber(value), 0) / Math.max(1, values.length));
  const setText = (id, value) => {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
  };
  const moneyHealth = cleanNumber(scores["Money Health"]);
  const nutritionHealth = cleanNumber(scores["Nutrition Health"]);
  const fitnessHealth = cleanNumber(scores["Fitness Health"]);
  const wellnessHealth = cleanNumber(scores["Wellness Health"]);
  const goalProgress = cleanNumber(scores["Goal Progress"]);
  const healthScore = average([nutritionHealth, fitnessHealth, wellnessHealth]);
  const careerScore = context.career.applications || context.career.followUps.length ? 72 : 68;
  const educationScore = context.education.courses || context.education.deadlines.length ? 72 : 69;
  const relationshipScore = state.connections.length || state.sharedGoals.length ? 72 : 64;
  const growthScore = goalProgress || 70;
  const foundationScore = average([score, moneyHealth, healthScore, goalProgress || score]);
  setText("treeFinanceScore", `${Math.round(moneyHealth || score)}%`);
  setText("treeHealthScore", `${Math.round(healthScore || score)}%`);
  setText("treeMindScore", `${Math.round(wellnessHealth || score)}%`);
  setText("treeGrowthScore", `${Math.round(growthScore)}%`);
  setText("treeCareerScore", `${careerScore}%`);
  setText("treeEducationScore", `${educationScore}%`);
  setText("treeRelationshipScore", `${relationshipScore}%`);
  setText("treeFoundationScore", `${Math.round(foundationScore)}%`);
  setText("treeIncome", money(context.finance.income));
  setText("treeExpenses", money(context.finance.expenses));
  setText("treeRemaining", money(context.finance.cashLeft));
  const ring = document.getElementById("treeLifeScoreRing");
  if (ring) ring.style.setProperty("--score-deg", `${Math.max(0, Math.min(100, score)) * 3.6}deg`);
  const userInitial = document.getElementById("treeUserInitial");
  if (userInitial) userInitial.textContent = cleanInitials(context.profile.displayName || personalizationSettings().displayName || "D", "D").slice(0, 1);
  const upcoming = document.getElementById("treeUpcomingList");
  if (upcoming) {
    upcoming.innerHTML = "";
    const items = homeUpcomingItems();
    (items.length ? items : [{ title: "No urgent upcoming items", meta: "Add bills, goals, or events to build your calendar." }]).forEach(item => {
      const row = document.createElement("div");
      row.className = "tree-list-row";
      row.innerHTML = `<span></span><strong></strong><small></small>`;
      row.querySelector("span").textContent = "-";
      row.querySelector("strong").textContent = item.title;
      row.querySelector("small").textContent = item.meta;
      upcoming.appendChild(row);
    });
  }
  const scoreHighLow = document.getElementById("todayScoreChartHighLow");
  if (scoreHighLow) scoreHighLow.textContent = chartStats?.change
    ? `${chartStats.change >= 0 ? "Steady Progress up" : "Watch Trend"}`
    : "You are building a strong foundation. Keep going.";
}

function renderTodayCommand() {
  const context = getAtlasContext();
  const priorities = evaluateAtlasPriorities(context);
  const top = priorities[0];
  const score = context.lifeScore.score;
  const delta = scoreDeltaFromHistory();
  const showScore = currentDashboardSettings().showLifeScore !== false;
  const dateText = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  const scoreOrb = document.getElementById("todayScoreOrb");
  if (scoreOrb) {
    scoreOrb.hidden = !showScore;
    scoreOrb.style.setProperty("--score-deg", `${Math.max(0, Math.min(100, score)) * 3.6}deg`);
  }
  const greetingEl = document.getElementById("todayGreeting");
  if (greetingEl) greetingEl.textContent = "LifeOps";
  const dateEl = document.getElementById("todayDate");
  if (dateEl) dateEl.textContent = dateText;
  const planDateEl = document.getElementById("todayPlanDate");
  if (planDateEl) planDateEl.textContent = dateText;
  const leadEl = document.getElementById("todayLead");
  const companion = companionSettings();
  const companionState = score < 45 ? "Encouraging" : top ? "Curious" : "Calm";
  const companionDisplayName = companion.name && companion.name !== "LifeOps" ? companion.name : "Atlas";
  const topActionText = top ? String(top.action || "").replace(/[.]+$/, "") : "";
  if (leadEl) leadEl.textContent = top ? `${companionDisplayName} is ${companionState.toLowerCase()} today. ${top.found} ${topActionText}.` : `${companionDisplayName} is calm today. Add more LifeOps data so Atlas can rank today's next action.`;
  const companionFormEl = document.getElementById("todayCompanionForm");
  if (companionFormEl) companionFormEl.textContent = companion.form || "Core companion";
  const companionStateEl = document.getElementById("todayCompanionState");
  if (companionStateEl) companionStateEl.textContent = companionState;
  const scoreEl = document.getElementById("todayLifeScore");
  if (scoreEl) scoreEl.textContent = score;
  const deltaEl = document.getElementById("todayScoreDelta");
  if (deltaEl) deltaEl.textContent = delta.label;
  const chartValues = scoreTrendValues(14);
  const chartStats = scoreTrendStats(chartValues);
  renderScoreLineChart("todayScoreMarketChart", chartValues);
  const todayChart = document.getElementById("todayScoreMarketChart");
  if (todayChart) todayChart.hidden = !showScore;
  const todayScoreDirection = document.getElementById("todayScoreDirection");
  if (todayScoreDirection) {
    todayScoreDirection.textContent = chartStats.change > 0 ? "Trending up" : chartStats.change < 0 ? "Pulling back" : "Holding steady";
  }
  const todayChartRange = document.getElementById("todayScoreChartRange");
  if (todayChartRange) todayChartRange.textContent = `${chartValues.length} point Life Score trend`;
  const todayChartHighLow = document.getElementById("todayScoreChartHighLow");
  if (todayChartHighLow) todayChartHighLow.textContent = `High ${Math.round(chartStats.high)} / Low ${Math.round(chartStats.low)}`;
  renderAtlasCommandCenter(context, priorities, chartStats);
  window.LifeOpsModules?.commandCenter?.render?.();
  renderLifeTreeDashboard(context, score, chartStats);

  const priorityList = document.getElementById("todayPriorityList");
  if (priorityList) {
    priorityList.innerHTML = "";
    const treeMode = Boolean(priorityList.closest(".life-tree-shell"));
    priorities.slice(0, 3).forEach((priority, index) => {
      if (treeMode) {
        const row = document.createElement("button");
        row.className = "tree-list-row";
        row.type = "button";
        row.innerHTML = `<span class="tree-check"></span><div><strong></strong><small></small></div><span></span>`;
        row.querySelector(".tree-check").textContent = index === 0 ? "*" : "";
        row.querySelector("strong").textContent = priority.title;
        row.querySelector("small").textContent = `${priority.time} - urgency ${Math.round(cleanNumber(priority.urgency, 0))}/10`;
        row.querySelector("span:last-child").textContent = index === 0 ? "Now" : "";
        row.addEventListener("click", () => activateTab(priority.tab, sectionPrimary[priority.tab] || null));
        priorityList.appendChild(row);
        return;
      }
      const card = document.createElement("article");
      card.className = "priority-card";
      card.innerHTML = `<span class="priority-rank"></span><div><div class="item-title"></div><div class="item-meta"></div></div><span class="status watch"></span>`;
      card.querySelector(".priority-rank").textContent = index + 1;
      card.querySelector(".item-title").textContent = priority.title;
      card.querySelector(".item-meta").textContent = priority.why;
      card.querySelector(".status").textContent = `${priority.category} - ${priority.time}`;
      priorityList.appendChild(card);
    });
  }

  renderTextRows("todayAtlasBriefing", top ? [
    ["What Atlas found", top.found],
    ["Why it matters", top.why],
    ["Recommended action", top.action],
    ["Evidence", top.evidence.length ? top.evidence.join("; ") : "No detailed local evidence yet."],
    ["Expected impact", top.impacts.join("; ")],
    ["Confidence", `${top.confidence} - ${top.freshness}`]
  ] : [["Atlas", "Add one goal, due date, meal, workout, or bill so Atlas can make a grounded recommendation."]]);

  const signalGrid = document.getElementById("todaySignalGrid");
  if (signalGrid) {
    signalGrid.innerHTML = "";
    todaySignalCards(context).forEach(cardData => {
      const card = document.createElement("article");
      card.className = "panel signal-card";
      if (cardData.title === "Monthly cash left") card.classList.add("cash-emphasis");
      card.innerHTML = `<div class="item-title"></div><strong></strong><div class="item-meta"></div><button class="btn small" type="button">View</button>`;
      card.querySelector(".item-title").textContent = cardData.title;
      card.querySelector("strong").textContent = cardData.value;
      card.querySelector(".item-meta").textContent = cardData.meta;
      card.querySelector("button").addEventListener("click", () => activateTab(cardData.tab, sectionPrimary[cardData.tab] || null));
      signalGrid.appendChild(card);
    });
  }

  if (showScore) {
    const breakdownRows = scoreBreakdown().map(([name, value]) => [
      name,
      `${Math.round(value)}/100 - contribution to today's progress indicator`
    ]);
    renderTextRows("todayScoreBreakdown", [
      ["Current score", `${score}/100. This is a transparent progress indicator.`],
      ["Change", delta.label],
      ["Strongest area", `${context.lifeScore.strongestArea}: ${context.lifeScore.strongestScore}/100`],
      ["Weakest area", `${context.lifeScore.weakestArea}: ${context.lifeScore.weakestScore}/100`],
      ["Missing data", missingScoreData(context).join("; ") || "Core score inputs are present."],
      ["Data freshness", context.freshness],
      ...breakdownRows
    ]);
  } else {
    renderTextRows("todayScoreBreakdown", [
      ["Life Score hidden", "The score is turned off in Modules > Dashboard Customization."],
      ["Atlas still works", "Recommendations continue to use transparent local evidence without displaying a score."]
    ]);
  }
}

function renderHomeScreen() {
  const score = lifeScore();
  const status = scoreStatus(score);
  const level = rewardLevelInfo();
  renderCompanionIdentity();
  const scoreEl = document.getElementById("homeLifeScore");
  if (scoreEl) scoreEl.textContent = score;
  const statusEl = document.getElementById("homeScoreStatus");
  if (statusEl) {
    statusEl.className = status.className;
    statusEl.textContent = status.label;
  }
  const messageEl = document.getElementById("homeCompanionMessage");
  if (messageEl) messageEl.textContent = companionLeadMessage();
  const globalStatus = document.getElementById("globalCompanionStatus");
  if (globalStatus) globalStatus.textContent = companionLeadMessage();
  ["homeLevelPill", "companionLevelPill"].forEach(id => {
    const element = document.getElementById(id);
    if (element) element.textContent = `Level ${level.level}`;
  });
  renderMiniTrend("homeTrendLine");
  renderScoreLineChart("metricLifeScoreChart", scoreTrendValues(7), { compact: true });
  const metricScoreChange = document.getElementById("metricLifeScoreChange");
  if (metricScoreChange) {
    const metricStats = scoreTrendStats(scoreTrendValues(7));
    metricScoreChange.textContent = `${metricStats.change >= 0 ? "+" : ""}${Math.round(metricStats.change)}`;
    metricScoreChange.style.color = metricStats.direction === "down" ? "var(--warning)" : "var(--success)";
  }
  renderMissionStatus();
  renderRewardVisuals("homeRewardVisuals");
  renderRewardVisuals("companionRewardVisuals");
  const atlasContext = getAtlasContext();
  const atlasPriorities = evaluateAtlasPriorities(atlasContext);
  renderTextRows("companionDataList", [
    ...atlasSummaryRows(atlasContext, atlasPriorities),
    ["Top priority", atlasPriorities[0]?.action || "I do not have enough information yet. Add or update the relevant LifeOps data first."],
    ["Evidence", atlasPriorities[0]?.evidence?.join("; ") || "No actionable local evidence found."]
  ]);
  renderAtlasDashboard();
  renderTodayCommand();
  renderHomeV2();
}

function renderPersonalizationSettings() {
  const profile = personalizationSettings();
  const preview = document.getElementById("profileAvatarPreview");
  if (preview) {
    preview.textContent = profile.initials || avatarIconSymbol(profile.avatarIcon);
    preview.className = `profile-avatar ${profile.avatarColor}`.trim();
    preview.title = `Avatar icon: ${profile.avatarIcon}`;
  }
  const namePreview = document.getElementById("profileNamePreview");
  if (namePreview) namePreview.textContent = profile.displayName || displayName() || "LifeOps User";
  const titlePreview = document.getElementById("profileTitlePreview");
  if (titlePreview) titlePreview.textContent = `${profile.personalTitle}${profile.pronouns ? ` - ${profile.pronouns}` : ""}`;
  const focusPreview = document.getElementById("profileFocusPreview");
  if (focusPreview) focusPreview.textContent = profile.currentFocus;
  [
    ["profileDisplayNameInput", profile.displayName],
    ["profileInitialsInput", profile.initials],
    ["profilePronounsInput", profile.pronouns],
    ["profileAvatarColorInput", profile.avatarColor],
    ["profileAvatarIconInput", profile.avatarIcon],
    ["profileTitleInput", profile.personalTitle],
    ["profileFocusInput", profile.currentFocus]
  ].forEach(([id, value]) => {
    const input = document.getElementById(id);
    if (input && document.activeElement !== input) input.value = value;
  });
}

function currentAppearance() {
  const appearance = { ...defaultAppearanceSettings(), ...(state.appearance || {}) };
  return { ...appearance, theme: normalizeTheme(appearance.theme) };
}

function normalizeTheme(theme) {
  return theme === "premium" ? "premium" : "premium";
}

function effectiveAppearanceMode() {
  return "dark";
}

function applyAppearanceSettings() {
  const appearance = currentAppearance();
  document.body.dataset.theme = appearance.theme;
  document.body.dataset.appearance = effectiveAppearanceMode();
  document.body.dataset.density = appearance.density;
  document.body.dataset.effects = appearance.reducedEffects ? "reduced" : "standard";
  document.body.dataset.sidebar = appearance.sidebarCollapsed ? "collapsed" : "expanded";
  const toggle = document.getElementById("sidebarToggleBtn");
  if (toggle) {
    toggle.setAttribute("aria-label", appearance.sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar");
    toggle.title = appearance.sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar";
  }
}

function themePreviewData() {
  return [
    ["premium", "LifeOps Premium", ["#08090a", "#d7b56d", "#f7f2e8"]]
  ];
}

function renderAppearanceSettings() {
  const appearance = currentAppearance();
  const fields = [
    ["themeInput", appearance.theme],
    ["appearanceModeInput", appearance.mode],
    ["densityInput", appearance.density],
    ["setupThemeInput", appearance.theme],
    ["setupAppearanceModeInput", appearance.mode],
    ["setupDensityInput", appearance.density]
  ];
  fields.forEach(([id, value]) => {
    const input = document.getElementById(id);
    if (input && document.activeElement !== input) input.value = value;
  });
  const reduced = document.getElementById("reducedEffectsInput");
  if (reduced) reduced.checked = appearance.reducedEffects === true;
  const setupReduced = document.getElementById("setupReducedEffectsInput");
  if (setupReduced) setupReduced.checked = appearance.reducedEffects === true;
  const gamification = document.getElementById("gamificationEnabledInput");
  if (gamification) gamification.checked = appearance.gamificationEnabled !== false;
  const grid = document.getElementById("themePreviewGrid");
  if (!grid) return;
  grid.innerHTML = "";
  themePreviewData().forEach(([value, label, colors]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `theme-preview ${appearance.theme === value ? "active" : ""}`.trim();
    button.setAttribute("aria-label", `Use ${label} theme`);
    button.innerHTML = `<strong></strong><div class="theme-swatches"></div>`;
    button.querySelector("strong").textContent = label;
    const swatches = button.querySelector(".theme-swatches");
    colors.forEach(color => {
      const swatch = document.createElement("span");
      swatch.style.background = color;
      swatches.appendChild(swatch);
    });
    button.addEventListener("click", () => {
      state.appearance.theme = value;
      save();
    });
    grid.appendChild(button);
  });
}

function saveAppearanceSettings(event = null) {
  const source = event?.target?.id?.startsWith("setup") || event?.target?.id === "gamificationEnabledInput" ? "setup" : "more";
  state.appearance = {
    ...currentAppearance(),
    theme: normalizeTheme(document.getElementById(source === "setup" ? "setupThemeInput" : "themeInput").value),
    mode: "dark",
    density: document.getElementById(source === "setup" ? "setupDensityInput" : "densityInput").value,
    reducedEffects: document.getElementById(source === "setup" ? "setupReducedEffectsInput" : "reducedEffectsInput").checked,
    gamificationEnabled: document.getElementById("gamificationEnabledInput") ? document.getElementById("gamificationEnabledInput").checked : currentAppearance().gamificationEnabled
  };
  save();
}

function savePersonalizationSettings() {
  state.personalization = {
    displayName: document.getElementById("profileDisplayNameInput").value.trim().slice(0, 32),
    initials: cleanInitials(document.getElementById("profileInitialsInput").value, "LO"),
    pronouns: document.getElementById("profilePronounsInput").value.trim().slice(0, 32),
    avatarColor: document.getElementById("profileAvatarColorInput").value,
    avatarIcon: document.getElementById("profileAvatarIconInput").value,
    personalTitle: document.getElementById("profileTitleInput").value.trim().slice(0, 48) || "Life Architect",
    currentFocus: document.getElementById("profileFocusInput").value.trim().slice(0, 96) || "Build a stable LifeOps routine"
  };
  save();
}

function scoreChangeFromHistory() {
  const previous = recentHistory(1)[0];
  if (!previous) return { text: "No saved snapshot yet", direction: "flat" };
  const diff = lifeScore() - cleanNumber(previous.lifeScore);
  if (diff > 0) return { text: `Up ${diff} from last snapshot`, direction: "up" };
  if (diff < 0) return { text: `Down ${Math.abs(diff)} from last snapshot`, direction: "down" };
  return { text: "Flat from last snapshot", direction: "flat" };
}

function homeCategoryData() {
  const meals = mealTotals();
  return [
    {
      name: "Finance",
      status: scoreStatus(moneyHealthScore()).label,
      score: moneyHealthScore(),
      sentence: cashLeft() < 0 ? "Cash flow needs attention before new spending." : `${money(Math.max(0, cashLeft()))} estimated cash flow remains.`,
      action: "View finance",
      tab: "money"
    },
    {
      name: "Health",
      status: scoreStatus(Math.round((nutritionHealthScore() + fitnessHealthScore()) / 2)).label,
      score: Math.round((nutritionHealthScore() + fitnessHealthScore()) / 2),
      sentence: `${Math.round(meals.protein)}g protein logged and ${percent(fitnessCompletion())} workout progress.`,
      action: "View health",
      tab: "food"
    },
    {
      name: "Education",
      status: state.educationCourses.length ? "Tracking" : "Not set",
      score: averageProgress(state.educationGoals),
      sentence: state.educationCourses.length ? `${state.educationCourses.length} course or learning path item${state.educationCourses.length === 1 ? "" : "s"} tracked.` : "Add a course, certification, or learning goal.",
      action: "View education",
      tab: "education"
    },
    {
      name: "Career",
      status: state.careerApplications.length ? "Tracking" : "Not set",
      score: averageProgress([...state.careerGoals, ...state.careerSkills]),
      sentence: `${state.careerApplications.length} applications and ${state.careerSkills.length} skills tracked privately.`,
      action: "View career",
      tab: "career"
    },
    {
      name: "Goals",
      status: scoreStatus(goalCompletion()).label,
      score: goalCompletion(),
      sentence: `${state.goals.length} goals and ${state.planActions.filter(action => !action.done).length} open weekly actions.`,
      action: "View goals",
      tab: "goals"
    },
    {
      name: "Connections",
      status: "Local preview",
      score: 0,
      sentence: "Private by default. Sharing tools are planned, not connected yet.",
      action: "Plan sharing",
      tab: "more"
    }
  ];
}

function homeUpcomingItems() {
  const payments = upcomingPayments(14).map(item => ({
    title: item.name,
    meta: item.daysUntil === 0 ? "Due today" : `Due in ${item.daysUntil} day${item.daysUntil === 1 ? "" : "s"}`
  }));
  const actions = state.planActions
    .filter(action => !action.done && daysUntil(action.deadline) !== null && daysUntil(action.deadline) >= 0)
    .sort((a, b) => daysUntil(a.deadline) - daysUntil(b.deadline))
    .map(action => ({ title: action.name, meta: `${action.area} action due ${action.deadline}` }));
  const goals = state.goals
    .filter(goal => goal.targetDate && daysUntil(goal.targetDate) !== null && daysUntil(goal.targetDate) >= 0)
    .sort((a, b) => daysUntil(a.targetDate) - daysUntil(b.targetDate))
    .map(goal => ({ title: goal.name, meta: `${goal.area} goal target ${goal.targetDate}` }));
  return [...payments, ...actions, ...goals].slice(0, 3);
}

function renderHomeV2() {
  const name = displayName() || "Dallas";
  const score = lifeScore();
  const status = scoreStatus(score);
  const scoreChange = scoreChangeFromHistory();
  const [weakArea, weakScore] = lowestScoreArea();
  const strongest = scoreBreakdown().reduce((top, item) => item[1] > top[1] ? item : top, scoreBreakdown()[0]);
  const greeting = document.getElementById("homeGreetingV2");
  if (greeting) greeting.textContent = `${timeGreeting()}, ${name}`;
  const dateFull = document.getElementById("homeDateFull");
  if (dateFull) dateFull.textContent = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  const subtext = document.getElementById("homeGreetingSubtext");
  if (subtext) subtext.textContent = "What matters today, how you are doing, and what to do next.";
  document.getElementById("homePriorityText").textContent = state.profile.priority || "Set one clear priority for today.";
  document.getElementById("homePriorityNotes").textContent = state.profile.notes || "Add supporting notes so the dashboard has better context.";
  document.getElementById("homeLifeScoreV2").textContent = score;
  document.getElementById("homeScoreStatusV2").textContent = status.label;
  document.getElementById("homeScoreStatusV2").className = status.className;
  const chartValues = scoreTrendValues(14);
  const chartStats = scoreTrendStats(chartValues);
  document.getElementById("homeScoreChange").textContent = chartValues.length > 1
    ? `${chartStats.change >= 0 ? "+" : ""}${Math.round(chartStats.change)} over recent snapshots`
    : scoreChange.text;
  renderScoreLineChart("homeScoreMarketChart", chartValues);
  const chartRange = document.getElementById("homeScoreChartRange");
  if (chartRange) chartRange.textContent = `${chartValues.length} point Life Score trend`;
  const chartHighLow = document.getElementById("homeScoreChartHighLow");
  if (chartHighLow) chartHighLow.textContent = `High ${Math.round(chartStats.high)} / Low ${Math.round(chartStats.low)}`;
  document.getElementById("homeScoreExplanation").textContent = `Strongest area: ${strongest[0]} at ${Math.round(strongest[1])}. Weakest area: ${weakArea} at ${Math.round(weakScore)}.`;
  renderTextRows("homeScoreAreas", [
    ["Strong area", `${strongest[0]} is currently strongest at ${Math.round(strongest[1])}.`],
    ["Weakest area", `${weakArea} needs the most attention right now.`]
  ]);
  renderTextRows("homeNextActionCard", [
    ["Recommendation", nextBestActionText()],
    ["Reason", `${weakArea} is the lowest category score at ${Math.round(weakScore)}.`],
    ["One clear action", bestActionText()]
  ]);
  document.getElementById("homeActionCategory").textContent = weakArea;
  renderHomeCategoryCards();
  const dashboardSettings = currentDashboardSettings();
  const missionSection = document.getElementById("homeMissionCardsV2")?.closest("article");
  if (missionSection) missionSection.hidden = dashboardSettings.showMissions === false;
  renderMissionCards("homeMissionCardsV2");
  const progress = missionProgress();
  document.getElementById("homeMissionPillV2").textContent = `${progress.complete}/${progress.total} complete`;
  renderTextRows("homeUpcomingList", homeUpcomingItems().map(item => [item.title, item.meta]));
  if (!homeUpcomingItems().length) {
    document.getElementById("homeUpcomingList").innerHTML = `<div class="empty">No important dated items are due soon.</div>`;
  }
  renderTextRows("homeRecentWin", [[recentWinText() ? "Recent win" : "Next win", recentWinText() || "Complete one mission or save today's snapshot to create a recent win."]]);
  window.LifeOpsModules?.timeline?.renderPreview?.();
  document.querySelectorAll("[data-quick-action]").forEach(button => {
    button.hidden = !currentDashboardSettings().quickActions.includes(button.dataset.quickAction);
  });
}

function renderHomeCategoryCards() {
  const grid = document.getElementById("homeCategoryCards");
  if (!grid) return;
  grid.innerHTML = "";
  const settings = currentDashboardSettings();
  const byName = Object.fromEntries(homeCategoryData().map(card => [card.name, card]));
  settings.categoryOrder
    .map(name => byName[name])
    .filter(card => card && settings.visibleCategoryCards.includes(card.name))
    .slice(0, 5)
    .forEach(card => {
    const article = document.createElement("article");
    article.className = "home-category-card";
    article.dataset.cardAccent = card.name.toLowerCase();
    article.innerHTML = `
      <div class="split"><h3></h3><span class="pill"></span></div>
      <strong></strong>
      <div class="progress"><div></div></div>
      <p></p>
      <button class="btn small" type="button"></button>`;
    article.querySelector("h3").textContent = card.name;
    article.querySelector(".pill").textContent = card.status;
    article.querySelector("strong").textContent = card.name === "Connections" ? "Plan" : Math.round(card.score);
    article.querySelector(".progress div").style.width = card.name === "Connections" ? "12%" : percent(card.score);
    article.querySelector("p").textContent = card.sentence;
    const button = article.querySelector("button");
    button.textContent = card.action;
    button.addEventListener("click", () => activateTab(card.tab));
    grid.appendChild(article);
  });
  if (!grid.children.length) {
    grid.innerHTML = `<div class="empty">Turn at least one dashboard category card back on in Modules.</div>`;
  }
}

function renderConnections() {
  const profiles = document.getElementById("connectionProfileList");
  if (!profiles) return;
  profiles.innerHTML = "";
  if (!state.connections.length) {
    profiles.innerHTML = `<div class="empty">Add a local connection profile to preview future sharing permissions.</div>`;
  } else {
    state.connections.forEach(connection => {
      const row = document.createElement("div");
      row.className = "item";
      row.innerHTML = `<div><div class="item-title"></div><div class="item-meta"></div></div><span class="pill"></span>`;
      row.querySelector(".item-title").textContent = connection.displayName;
      row.querySelector(".item-meta").textContent = `${connection.relationshipType} - ${connection.permissions.view} can view - Not synchronized`;
      row.querySelector(".pill").textContent = connection.status || "Prototype";
      profiles.appendChild(row);
    });
  }

  renderTextRows("connectionGroupList", state.connectionGroups.length
    ? state.connectionGroups.map(group => [group.name, `${group.description || "Local group preview."} Default: ${group.privacy}.`])
    : [["No groups yet", "Add a local group preview when you are ready."]]);
  renderTextRows("sharedListPreview", state.sharedLists.length
    ? state.sharedLists.map(list => [list.name, `${list.category} - ${list.items.length} item${list.items.length === 1 ? "" : "s"} - ${list.privacy}`])
    : [["No shared lists yet", "Shared lists are local prototypes only."]]);
  renderTextRows("sharedGoalPreview", state.sharedGoals.length
    ? state.sharedGoals.map(goal => [goal.name, `${goal.category} - ${percent(goal.progress)} complete - ${goal.privacy}`])
    : [["No shared goals yet", "Shared goals are local prototypes only."]]);
  renderTextRows("sharedChallengePreview", state.sharedChallenges.length
    ? state.sharedChallenges.map(challenge => [challenge.name, `${challenge.category} - ${challenge.target} - ${percent(challenge.progress)} complete`])
    : [["No challenges yet", "Challenges cannot involve wagers, punishment, or public financial details."]]);
  renderTextRows("sharedCalendarPreview", state.sharedPlans.length
    ? state.sharedPlans.map(plan => [plan.title, `${plan.date} - ${plan.category} - ${plan.privacy}. ${plan.note || "Local calendar preview only."}`])
    : [["No shared plans yet", "Calendar previews stay local until a real integration exists."]]);

  const permissionPreview = document.getElementById("connectionPermissionPreview");
  permissionPreview.innerHTML = "";
  ["View", "Edit", "Comment", "Hidden"].forEach(label => {
    const card = document.createElement("div");
    card.className = "permission-row";
    const firstConnection = state.connections[0];
    const value = firstConnection?.permissions?.[label.toLowerCase()] || (label === "Hidden" ? "Sensitive details" : "Only me");
    card.innerHTML = `<div class="item-title"></div><div class="item-meta"></div>`;
    card.querySelector(".item-title").textContent = label;
    card.querySelector(".item-meta").textContent = value;
    permissionPreview.appendChild(card);
  });
  renderTextRows("invitationPreviewList", [
    ["Future invite status", "Prototype only. No invitation has been delivered."],
    ["Default privacy", "Only me until the user explicitly chooses people or a group."],
    ["Hidden by default", "Sensitive money, medical, legal, tax, school, and relationship notes."]
  ]);
}

function integrationCatalog() {
  return [
    ["Calendar And Tasks", [
      ["google-calendar", "Google Calendar", "Requires OAuth"],
      ["apple-calendar", "Apple Calendar", "Planned"],
      ["microsoft-outlook", "Microsoft Outlook", "Requires OAuth"],
      ["google-tasks", "Google Tasks", "Requires OAuth"],
      ["apple-reminders", "Apple Reminders", "Planned"],
      ["todoist", "Todoist", "Research required"]
    ]],
    ["Health And Fitness", [
      ["apple-health", "Apple Health", "Requires platform permission"],
      ["health-connect", "Health Connect", "Requires platform permission"],
      ["fitbit", "Fitbit", "Requires OAuth"],
      ["garmin", "Garmin", "Research required"],
      ["strava", "Strava", "Requires OAuth"]
    ]],
    ["Productivity", [
      ["notion", "Notion", "Requires OAuth"],
      ["google-drive", "Google Drive", "Requires OAuth"],
      ["onedrive", "Microsoft OneDrive", "Requires OAuth"],
      ["github", "GitHub", "Requires OAuth"],
      ["slack", "Slack", "Requires OAuth"],
      ["discord", "Discord", "Research required"]
    ]],
    ["Money", [
      ["plaid", "Plaid compatible institutions", "Requires secure account system"],
      ["paypal", "PayPal", "Research required"],
      ["venmo", "Venmo", "Research required"],
      ["brokerage-import", "Brokerage import", "Research required"],
      ["csv-import", "CSV import", "Import supported"]
    ]]
  ];
}

function renderIntegrationsCenter() {
  const list = document.getElementById("integrationCatalogList");
  if (!list) return;
  list.innerHTML = "";
  integrationCatalog().forEach(([category, integrations]) => {
    const section = document.createElement("div");
    section.className = "integration-category";
    section.innerHTML = `<h4></h4><div class="prototype-grid"></div>`;
    section.querySelector("h4").textContent = category;
    const grid = section.querySelector(".prototype-grid");
    integrations.forEach(([id, name, status]) => {
      const card = document.createElement("article");
      card.className = "integration-card";
      card.innerHTML = `<div class="split"><strong></strong><span class="integration-status"></span></div><p class="about-lede"></p><button class="btn small" type="button">Details</button>`;
      card.querySelector("strong").textContent = name;
      card.querySelector(".integration-status").textContent = status;
      card.querySelector("p").textContent = status === "Import supported" ? "Local import planning only. No account connection required." : "Not connected. No credentials or tokens are stored.";
      card.querySelector("button").addEventListener("click", () => showIntegrationDetails({ id, name, status, category }));
      grid.appendChild(card);
    });
    list.appendChild(section);
  });
}

function moduleCatalog() {
  return [
    { id: "dashboard", name: "Dashboard", type: "Core", status: "Always on", description: "Daily summary, score, missions, and next best action." },
    { id: "finance", name: "Finance", type: "Core", status: "Always on", description: "Cash flow, bills, savings, emergency fund, debt, and goals." },
    { id: "health", name: "Health", type: "Core", status: "Always on", description: "Nutrition, fitness, water, sleep, and wellness check-ins." },
    { id: "goals", name: "Goals", type: "Core", status: "Always on", description: "Goals, weekly actions, roadmap, timeline, reviews, and rewards." },
    { id: "settings", name: "Settings", type: "Core", status: "Always on", description: "Profile, appearance, privacy, data, voice, accessibility, and tools." },
    { id: "education", name: "Education", type: "Optional", status: "Available", description: "Courses, assignments, exams, degree progress, costs, and learning goals." },
    { id: "career", name: "Career", type: "Optional", status: "Available", description: "Applications, interviews, resume work, networking, skills, and achievements." },
    { id: "calendar", name: "Calendar", type: "Optional", status: "Available", description: "Unified local agenda from LifeOps dates and future integrations." },
    { id: "documents", name: "Documents", type: "Optional", status: "Available", description: "Private local references and metadata for important documents." },
    { id: "connections", name: "Connections", type: "Optional", status: "Prototype", description: "Local preview for profiles, groups, shared goals, lists, and permissions." },
    { id: "integrations", name: "Integrations", type: "Optional", status: "Prototype", description: "Planned external connections with honest status labels." },
    { id: "privacy", name: "Privacy", type: "Optional", status: "Available", description: "Local storage, sharing defaults, and sensitive data controls." },
    { id: "reports", name: "Reports", type: "Optional", status: "Available", description: "Weekly, daily, and portfolio report exports." },
    { id: "history", name: "History", type: "Optional", status: "Available", description: "Daily snapshots and trend review." },
    { id: "coach", name: "Coach", type: "Optional", status: "Prototype", description: "Rule-based companion chat and coaching previews." },
    { id: "reflection", name: currentModulePreferences().reflectionName, type: "Optional", status: "Planned", description: "Private reflections, gratitude, intentions, reading plans, and values." },
    { id: "travel", name: "Travel", type: "Optional", status: "Planned", description: "Trip plans, checklists, budgets, documents, and shared preparation." },
    { id: "home", name: "Home", type: "Optional", status: "Planned", description: "Household tasks, maintenance, projects, and recurring routines." },
    { id: "pets", name: "Pets", type: "Optional", status: "Planned", description: "Pet care routines, appointments, costs, and reminders." },
    { id: "family", name: "Family", type: "Optional", status: "Planned", description: "Family plans, responsibilities, check-ins, and shared goals." },
    { id: "reading", name: "Reading", type: "Optional", status: "Planned", description: "Books, notes, reading goals, and learning progress." },
    { id: "projects", name: "Projects", type: "Optional", status: "Planned", description: "Personal project planning, milestones, tasks, and reviews." }
  ];
}

function currentModulePreferences() {
  return { ...defaultModulePreferences(), ...(state.modulePreferences || {}), enabled: { ...defaultModulePreferences().enabled, ...(state.modulePreferences?.enabled || {}) } };
}

function currentDashboardSettings() {
  const settings = { ...defaultDashboardSettings(), ...(state.dashboardSettings || {}) };
  const oldDefault = ["Finance", "Health", "Goals", "Connections"];
  if (Array.isArray(settings.visibleCategoryCards) && settings.visibleCategoryCards.join("|") === oldDefault.join("|")) {
    settings.visibleCategoryCards = defaultDashboardSettings().visibleCategoryCards;
  }
  return settings;
}

function renderModuleCatalog() {
  const list = document.getElementById("moduleCatalogList");
  if (!list) return;
  list.innerHTML = "";
  const prefs = currentModulePreferences();
  const coreIds = ["dashboard", "finance", "health", "goals", "settings"];
  const orderedIds = [...coreIds, ...prefs.order.filter(id => !coreIds.includes(id))];
  const catalog = Object.fromEntries(moduleCatalog().map(item => [item.id, item]));
  orderedIds.map(id => catalog[id]).filter(Boolean).forEach(module => {
    const isCore = module.type === "Core";
    const enabled = isCore || prefs.enabled[module.id] !== false;
    const row = document.createElement("div");
    row.className = "module-card";
    row.setAttribute("aria-disabled", String(!enabled));
    row.innerHTML = `
      <div>
        <div class="item-title"></div>
        <div class="item-meta"></div>
      </div>
      <div class="item-actions">
        <span class="pill"></span>
        <span class="pill"></span>
        <button class="btn small" type="button"></button>
        <button class="btn small" type="button">Up</button>
        <button class="btn small" type="button">Down</button>
      </div>`;
    row.querySelector(".item-title").textContent = module.name;
    row.querySelector(".item-meta").textContent = module.description;
    const pills = row.querySelectorAll(".pill");
    pills[0].textContent = module.type;
    pills[1].textContent = module.status;
    const buttons = row.querySelectorAll("button");
    buttons[0].textContent = isCore ? "Always on" : enabled ? "Disable" : "Enable";
    buttons[0].disabled = isCore;
    buttons[0].addEventListener("click", () => toggleModule(module.id));
    buttons[1].disabled = isCore;
    buttons[2].disabled = isCore;
    buttons[1].addEventListener("click", () => moveModule(module.id, -1));
    buttons[2].addEventListener("click", () => moveModule(module.id, 1));
    list.appendChild(row);
  });
  renderReflectionModule();
  renderDashboardCustomization();
  applyModuleVisibility();
}

function toggleModule(id) {
  const prefs = currentModulePreferences();
  prefs.enabled[id] = prefs.enabled[id] === false;
  state.modulePreferences = prefs;
  save();
}

function moveModule(id, direction) {
  const prefs = currentModulePreferences();
  const order = [...prefs.order];
  const index = order.indexOf(id);
  if (index < 0) return;
  const nextIndex = Math.max(0, Math.min(order.length - 1, index + direction));
  order.splice(index, 1);
  order.splice(nextIndex, 0, id);
  prefs.order = order;
  state.modulePreferences = prefs;
  save();
}

function applyModuleVisibility() {
  const prefs = currentModulePreferences();
  const map = {
    education: ["education"],
    career: ["career"],
    calendar: ["calendar"],
    documents: ["documents"],
    connections: ["connections"],
    integrations: ["integrations"],
    privacy: ["privacy"],
    reports: ["reports"],
    history: ["history"],
    coach: ["coach"]
  };
  Object.entries(map).forEach(([moduleId, primaryIds]) => {
    const visible = prefs.enabled[moduleId] !== false;
    primaryIds.forEach(primary => {
      document.querySelectorAll(`[data-primary="${primary}"]`).forEach(item => item.hidden = !visible);
    });
    document.querySelectorAll(`[data-open-tab="${moduleId}"]`).forEach(item => item.hidden = !visible);
  });
}

function renderReflectionModule() {
  renderTextRows("reflectionModuleList", [
    ["Module name", `${currentModulePreferences().reflectionName} can be renamed in a later detail view.`],
    ["Status", "Planned optional module. It is not a required primary tab."],
    ["Privacy", "Entries default to Private and avoid assumptions about religion or belief systems."]
  ]);
}

function renderDashboardCustomization() {
  const list = document.getElementById("dashboardCustomizationList");
  if (!list) return;
  const settings = currentDashboardSettings();
  const categoryChoices = ["Finance", "Health", "Education", "Career", "Goals", "Connections"];
  const quickChoices = [
    ["expense", "Add Expense"],
    ["meal", "Log Meal"],
    ["task", "Add Task"],
    ["workout", "Log Workout"],
    ["goal", "Add Goal"],
    ["invite", "Invite Person"]
  ];
  list.innerHTML = "";
  const addToggle = (title, text, checked, onChange) => {
    const row = document.createElement("label");
    row.className = "settings-switch";
    row.innerHTML = `<div><span></span><div class="item-meta"></div></div><input type="checkbox">`;
    row.querySelector("input").checked = checked;
    row.querySelector("span").textContent = title;
    row.querySelector(".item-meta").textContent = text;
    row.querySelector("input").addEventListener("change", event => onChange(event.target.checked));
    list.appendChild(row);
  };
  categoryChoices.forEach(category => addToggle(
    `Show ${category} card`,
    "Dashboard category overview",
    settings.visibleCategoryCards.includes(category),
    checked => {
      const next = new Set(currentDashboardSettings().visibleCategoryCards);
      checked ? next.add(category) : next.delete(category);
      state.dashboardSettings = { ...currentDashboardSettings(), visibleCategoryCards: [...next] };
      save();
    }
  ));
  quickChoices.forEach(([id, label]) => addToggle(
    label,
    "Quick action button",
    settings.quickActions.includes(id),
    checked => {
      const next = new Set(currentDashboardSettings().quickActions);
      checked ? next.add(id) : next.delete(id);
      state.dashboardSettings = { ...currentDashboardSettings(), quickActions: [...next] };
      save();
    }
  ));
  addToggle("Show missions", "Daily mission cards on Dashboard", settings.showMissions !== false, checked => {
    state.dashboardSettings = { ...currentDashboardSettings(), showMissions: checked };
    save();
  });
  addToggle("Show Life Score", "Display the score on Today and dashboard cards", settings.showLifeScore !== false, checked => {
    state.dashboardSettings = { ...currentDashboardSettings(), showLifeScore: checked };
    save();
  });
  addToggle("Show rewards", "XP and progress surfaces stay visible", settings.showRewards !== false, checked => {
    state.dashboardSettings = { ...currentDashboardSettings(), showRewards: checked };
    save();
  });
  const reset = document.createElement("button");
  reset.className = "btn";
  reset.type = "button";
  reset.textContent = "Reset Dashboard Layout";
  reset.addEventListener("click", () => {
    state.dashboardSettings = defaultDashboardSettings();
    save();
  });
  list.appendChild(reset);
}

function renderEducationCenter() {
  const completedCredits = state.educationCourses.reduce((sum, course) => sum + (course.status === "Complete" ? cleanNumber(course.credits) : 0), 0);
  const totalCredits = state.educationCourses.reduce((sum, course) => sum + cleanNumber(course.credits), 0);
  const progress = totalCredits ? (completedCredits / totalCredits) * 100 : averageProgress(state.educationGoals);
  const upcoming = [...state.educationAssignments.map(item => ({ ...item, kind: "Assignment", date: item.dueDate })), ...state.educationExams.map(item => ({ ...item, kind: "Exam" }))]
    .filter(item => item.date && daysUntil(item.date) !== null && daysUntil(item.date) >= 0)
    .sort((a, b) => daysUntil(a.date) - daysUntil(b.date));
  renderSummaryCards("educationSummaryCards", [
    { title: "Learning path", value: state.educationCourses[0]?.name || "Not set", meta: state.educationCourses[0]?.method || "Add your first course or learning goal" },
    { title: "Current courses", value: state.educationCourses.length, meta: `${completedCredits}/${totalCredits || 0} credits completed` },
    { title: "Upcoming work", value: upcoming[0]?.title || "None", meta: upcoming[0] ? `${upcoming[0].kind} due ${upcoming[0].date}` : "No dated assignments or exams" },
    { title: "Progress", value: percent(progress), meta: "Based on credits or learning goal progress" },
    { title: "Atlas Follow Up", value: "Optional", meta: "Add courses, credits, deadlines, and learning goals when ready." }
  ]);
  renderTextRows("educationUpcomingList", upcoming.length ? upcoming.slice(0, 6).map(item => [item.title, `${item.kind} for ${item.course || "learning path"} due ${item.date}. ${item.priority || "Medium"} priority.`]) : [["No upcoming work", "Add an assignment or exam to create your education agenda."]]);
  renderTextRows("educationCourseList", state.educationCourses.length ? state.educationCourses.map(course => [course.name, `${course.code || "No code"} - ${course.term || "No term"} - ${course.status} - ${course.privacy}`]) : [["No courses yet", "Add your first course, certification, training path, or independent study."]]);
  renderTextRows("educationGoalCostList", [
    ...(state.educationGoals.length ? state.educationGoals.map(goal => [goal.title, `${percent(goal.progress)} complete - target ${goal.targetDate || "not set"} - ${goal.privacy}`]) : [["No learning goals", "Add one learning goal to track progress."]]),
    ...(state.educationCosts.length ? state.educationCosts.map(cost => [cost.title, `${money(cost.amount)} - ${cost.category} - ${cost.privacy}`]) : [["No education costs", "Add tuition, books, exam fees, or training costs when useful."]])
  ]);
}

function averageProgress(items) {
  if (!items.length) return 0;
  return items.reduce((sum, item) => sum + cleanNumber(item.progress, 0, 100), 0) / items.length;
}

function renderCareerCenter() {
  const upcoming = [...state.careerInterviews.map(item => ({ title: `${item.company} interview`, date: item.date, meta: `${item.position || "Role"} - ${item.type}` })), ...state.careerApplications.filter(item => item.followUpDate).map(item => ({ title: `${item.company} follow-up`, date: item.followUpDate, meta: `${item.position} - ${item.nextStep || "Follow up"}` }))]
    .filter(item => item.date && daysUntil(item.date) !== null && daysUntil(item.date) >= 0)
    .sort((a, b) => daysUntil(a.date) - daysUntil(b.date));
  renderSummaryCards("careerSummaryCards", [
    { title: "Current role", value: state.careerApplications[0]?.status || "Not set", meta: "Career details stay private by default" },
    { title: "Target role", value: state.careerGoals[0]?.title || "Not set", meta: state.careerGoals[0] ? `${percent(state.careerGoals[0].progress)} complete` : "Add a career goal" },
    { title: "Applications", value: state.careerApplications.length, meta: `${state.careerApplications.filter(app => ["Applied", "Interviewing", "Offer"].includes(app.status)).length} active` },
    { title: "Development", value: state.careerSkills.length, meta: `${state.careerAchievements.length} achievements logged` },
    { title: "Atlas Follow Up", value: "Optional", meta: "Add role targets, applications, resume status, and salary goals later." }
  ]);
  renderTextRows("careerPipelineList", state.careerApplications.length ? state.careerApplications.map(app => [app.company, `${app.position} - ${app.status} - next: ${app.nextStep || "not set"} - ${app.privacy}`]) : [["No applications yet", "Add an application to start your career pipeline."]]);
  renderTextRows("careerUpcomingList", upcoming.length ? upcoming.slice(0, 6).map(item => [item.title, `${item.date} - ${item.meta}`]) : [["No interviews or follow-ups", "Add an interview or follow-up date to create a reminder."]]);
  renderTextRows("careerDevelopmentList", [
    ...(state.careerSkills.length ? state.careerSkills.map(skill => [skill.name || skill.title, `${skill.category} - ${percent(skill.progress)} complete - ${skill.privacy}`]) : [["No skills yet", "Add a skill you are building."]]),
    ...(state.careerAchievements.length ? state.careerAchievements.map(item => [item.title, `${item.date} - ${item.category} - ${item.privacy}`]) : [["No achievements yet", "Add achievements as portfolio evidence."]])
  ]);
}

function allCalendarItems() {
  const manual = state.calendarEvents.map(event => ({ title: event.title, date: event.date, category: event.category, source: event.source, privacy: event.privacy }));
  const bills = upcomingPayments(365).map(expense => ({ title: expense.name, date: expense.dueDate, category: "Finance", source: expense.type, privacy: "Private" }));
  const assignments = state.educationAssignments.map(item => ({ title: item.title, date: item.dueDate, category: "Education", source: "Assignment", privacy: item.privacy }));
  const exams = state.educationExams.map(item => ({ title: item.title, date: item.date, category: "Education", source: "Exam", privacy: item.privacy }));
  const interviews = state.careerInterviews.map(item => ({ title: `${item.company} interview`, date: item.date, category: "Career", source: item.type, privacy: item.privacy }));
  const goals = state.goals.map(goal => ({ title: goal.name, date: goal.targetDate, category: "Goals", source: "Goal", privacy: "Private" }));
  return [...manual, ...bills, ...assignments, ...exams, ...interviews, ...goals]
    .filter(item => item.date)
    .sort((a, b) => String(a.date).localeCompare(String(b.date)));
}

function renderCalendarCenter(view = "agenda") {
  const items = allCalendarItems();
  const today = todayKey();
  const weekItems = items.filter(item => daysUntil(item.date) !== null && daysUntil(item.date) >= 0 && daysUntil(item.date) <= 7);
  renderSummaryCards("calendarSummaryCards", [
    { title: "Today", value: items.filter(item => item.date === today).length, meta: "Local LifeOps events due today" },
    { title: "Next 7 days", value: weekItems.length, meta: "Bills, assignments, interviews, goals, and manual events" },
    { title: "Manual events", value: state.calendarEvents.length, meta: "Created inside LifeOps" },
    { title: "External calendars", value: "Disconnected", meta: "Google, Apple, and Outlook stay planned only" }
  ]);
  const title = document.getElementById("calendarViewTitle");
  if (title) title.textContent = view[0].toUpperCase() + view.slice(1);
  const filtered = view === "today" ? items.filter(item => item.date === today) : view === "week" ? weekItems : items;
  renderTextRows("calendarAgendaList", filtered.length ? filtered.slice(0, 12).map(item => [item.title, `${item.date} - ${item.category} - ${item.source} - ${item.privacy}`]) : [["No events in this view", "Add an event or dated item in another LifeOps section."]]);
}

function renderDocumentsCenter() {
  const sensitiveCount = state.documents.filter(doc => doc.sensitivity === "Sensitive").length;
  renderSummaryCards("documentSummaryCards", [
    { title: "References", value: state.documents.length, meta: "Metadata only. No files are uploaded." },
    { title: "Private", value: state.documents.filter(doc => doc.privacy === "Private").length, meta: "Default privacy classification" },
    { title: "Sensitive", value: sensitiveCount, meta: "Hidden from social, voice, and public exports by default" },
    { title: "Categories", value: new Set(state.documents.map(doc => doc.category)).size || 0, meta: "Finance, health, education, career, tax, and more" }
  ]);
  renderTextRows("documentReferenceList", state.documents.length ? state.documents.map(doc => [doc.title, `${doc.category} - ${doc.date || "No date"} - ${doc.privacy}/${doc.sensitivity}. ${doc.localNote || "Local metadata only."}`]) : [["No document references", "Add a local reference note without uploading sensitive files."]]);
}

function setSettingsPanel(panel = "profile") {
  const selected = panel || "profile";
  document.querySelectorAll("[data-settings-panel]").forEach(button => {
    const isActive = button.dataset.settingsPanel === selected;
    button.classList.toggle("active", isActive);
    if (isActive) button.setAttribute("aria-current", "page");
    else button.removeAttribute("aria-current");
  });
  document.querySelectorAll("[data-settings-panel-content]").forEach(card => {
    card.classList.toggle("active", card.dataset.settingsPanelContent === selected);
  });
}

function showIntegrationDetails(integration) {
  state.integrationPreferences.selectedIntegrationId = integration.id;
  const panel = document.getElementById("integrationDetailPanel");
  if (!panel) return;
  panel.innerHTML = `
    <div class="item-title"></div>
    <div class="item-meta"></div>
    <div class="list"></div>`;
  panel.querySelector(".item-title").textContent = integration.name;
  panel.querySelector(".item-meta").textContent = `${integration.category} - ${integration.status}`;
  const rows = [
    ["Data requested", "None in this version. Future versions must explain every field before connection."],
    ["Purpose", "Bring user-approved external signals into LifeOps summaries and planning."],
    ["Permissions", "Read-only by default unless a future feature clearly requires write access."],
    ["Privacy risk", "Requires security review, clear consent, and disconnect controls before release."],
    ["Storage", "No credentials, passwords, bank logins, health credentials, or access tokens in localStorage."]
  ];
  const details = panel.querySelector(".list");
  rows.forEach(([title, text]) => {
    const row = document.createElement("div");
    row.className = "item";
    row.innerHTML = `<div><div class="item-title"></div><div class="item-meta"></div></div>`;
    row.querySelector(".item-title").textContent = title;
    row.querySelector(".item-meta").textContent = text;
    details.appendChild(row);
  });
  persistState({ render: false });
}

function renderPrivacyCenter() {
  if (!document.getElementById("privacySummaryList")) return;
  renderTextRows("privacySummaryList", [
    ["Storage", "Browser localStorage key lifeops-dashboard-v1."],
    ["Sharing", "No real sharing or synchronization is active."],
    ["Integrations", "No external app is connected."],
    ["Sensitive data", "Do not store passwords, bank credentials, Social Security numbers, tax IDs, or health credentials."]
  ]);
  renderTextRows("privacyBackupStatus", [
    ["Backup status", "Export creates a JSON file on this device."],
    ["Restore behavior", "Restore validates list fields and asks before replacing local data."],
    ["Reset behavior", "Reset clears local browser data after confirmation."]
  ]);
  const matrix = document.getElementById("privacyClassificationMatrix");
  matrix.innerHTML = "";
  [
    ["Private", "Daily plans, local milestones, and personal notes.", "Shown only on this device."],
    ["Personal", "Profile, goals, wellness, meals, workouts, tasks.", "Exported only when the user downloads a backup."],
    ["Shared", "Future shared goals, lists, challenges, and plans.", "Prototype metadata only; default is Only me."],
    ["Sensitive", "Financial, medical, tax, legal, school, and relationship details.", "Hidden from social previews and voice by default."]
  ].forEach(([type, examples, defaultRule]) => {
    const row = document.createElement("div");
    row.className = "item";
    row.innerHTML = `<strong></strong><div class="item-meta"></div><span class="pill"></span>`;
    row.querySelector("strong").textContent = type;
    row.querySelector(".item-meta").textContent = examples;
    row.querySelector(".pill").textContent = defaultRule;
    matrix.appendChild(row);
  });
  renderTextRows("privacyPermissionList", state.connections.length
    ? state.connections.map(connection => [connection.displayName, `View: ${connection.permissions.view}. Edit: ${connection.permissions.edit}. Comment: ${connection.permissions.comment}. Hidden: ${connection.permissions.hidden}.`])
    : [["Default permission", "Only me. No shared data exists yet."]]);
}

function renderCompanionIdentity() {
  const companion = companionSettings();
  const initials = cleanInitials(companion.initials);
  const styleClass = ["sage", "sky", "gold", "slate"].includes(companion.avatarStyle) ? companion.avatarStyle : "sage";
  document.querySelectorAll(".companion-avatar:not(.atlas-brand-avatar)").forEach(avatar => {
    avatar.textContent = initials;
    avatar.classList.remove("sage", "sky", "gold", "slate");
    avatar.classList.add(styleClass);
  });
  document.querySelectorAll("[data-companion-name]").forEach(element => {
    element.textContent = companion.name;
  });
  const launcherLabel = document.getElementById("companionLauncherLabel");
  if (launcherLabel) launcherLabel.textContent = "Atlas Local";
  const previewName = document.getElementById("companionPreviewName");
  if (previewName) previewName.textContent = companion.name;
  const previewMeta = document.getElementById("companionPreviewMeta");
  if (previewMeta) previewMeta.textContent = `${companion.personality} ${companion.form.toLowerCase()} with ${companion.animationStyle.toLowerCase()}, focused on ${companion.focus.toLowerCase()}.`;
  const previewAvatar = document.getElementById("companionPreviewAvatar");
  if (previewAvatar) {
    previewAvatar.textContent = initials;
    previewAvatar.classList.remove("sage", "sky", "gold", "slate");
    previewAvatar.classList.add(styleClass);
  }
}

function renderCompanionChat() {
  ensureChatMessages();
  const companion = companionSettings();
  const initials = cleanInitials(companion.initials);
  const styleClass = ["sage", "sky", "gold", "slate"].includes(companion.avatarStyle) ? companion.avatarStyle : "sage";
  const chatWindows = [
    document.getElementById("companionChatWindow"),
    document.getElementById("globalCompanionChatWindow")
  ].filter(Boolean);
  if (!chatWindows.length) return;
  chatWindows.forEach(windowEl => {
  windowEl.innerHTML = "";
  chatMessages.forEach(message => {
    const row = document.createElement("div");
    row.className = `chat-message ${message.role === "user" ? "user" : ""}`;
    if (message.role === "typing") {
      row.innerHTML = `<div class="chat-avatar atlas-brand-avatar">${brandAssetMarkup("atlas", "AT", "Atlas companion")}</div><div class="chat-bubble"><span class="typing-dots"><span></span><span></span><span></span></span></div>`;
    } else if (message.role === "user") {
      row.innerHTML = `<div class="chat-bubble"></div>`;
      row.querySelector(".chat-bubble").textContent = message.text;
    } else {
      row.innerHTML = `<div class="chat-avatar atlas-brand-avatar">${brandAssetMarkup("atlas", "AT", "Atlas companion")}</div><div class="chat-bubble"></div>`;
      row.querySelector(".chat-bubble").textContent = message.text;
    }
    windowEl.appendChild(row);
  });
  windowEl.scrollTop = windowEl.scrollHeight;
  });
}

function render() {
  applyAppearanceSettings();
  document.getElementById("appVersionLabel").textContent = `Version ${appVersion}`;
  document.getElementById("todayDate").textContent = new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  document.getElementById("priorityInput").value = state.profile.priority || "";
  document.getElementById("notesInput").value = state.profile.notes || "";
  document.querySelectorAll("[data-check]").forEach(input => {
    input.checked = Boolean(state.checks[input.dataset.check]);
  });

  setNumberInput("incomeInput", state.profile.income);
  setNumberInput("savingsGoalInput", state.profile.savingsGoal);
  setNumberInput("currentSavingsInput", state.profile.currentSavings);
  setNumberInput("emergencyTargetInput", state.profile.emergencyTarget);
  setNumberInput("workoutGoalInput", state.profile.workoutGoal);
  setNumberInput("workoutsDoneInput", state.profile.workoutsDone);
  setNumberInput("stepGoalInput", state.profile.stepGoal);
  setNumberInput("stepsTodayInput", state.profile.stepsToday);
  setNumberInput("calorieGoalInput", state.profile.calorieGoal);
  setNumberInput("proteinGoalInput", state.profile.proteinGoal);
  setNumberInput("carbGoalInput", state.profile.carbGoal);
  setNumberInput("fatGoalInput", state.profile.fatGoal);
  setNumberInput("foodBudgetInput", state.profile.foodBudget);
  setNumberInput("waterGoalInput", state.profile.waterGoal);
  setNumberInput("sleepHoursInput", state.profile.sleepHours);
  setNumberInput("waterCupsInput", state.profile.waterCups);
  setNumberInput("setupFoodBudgetInput", state.profile.foodBudget);
  setNumberInput("setupCalorieGoalInput", state.profile.calorieGoal);
  setNumberInput("setupProteinGoalInput", state.profile.proteinGoal);
  setNumberInput("setupCarbGoalInput", state.profile.carbGoal);
  setNumberInput("setupFatGoalInput", state.profile.fatGoal);
  setNumberInput("setupSavingsGoalInput", state.profile.savingsGoal);
  setNumberInput("setupWorkoutGoalInput", state.profile.workoutGoal);
  setNumberInput("setupSleepGoalInput", state.profile.sleepGoal || 8);
  document.getElementById("moodInput").value = String(state.profile.mood || 3);
  document.getElementById("stressInput").value = String(state.profile.stress || 3);
  document.getElementById("energyInput").value = String(state.profile.energy || 3);
  document.getElementById("tomorrowFocusInput").value = state.profile.tomorrowFocus || "";
  const companion = companionSettings();
  document.getElementById("companionNameInput").value = companion.name;
  document.getElementById("companionInitialsInput").value = companion.initials;
  document.getElementById("companionFormInput").value = companion.form;
  document.getElementById("companionAvatarStyleInput").value = companion.avatarStyle;
  document.getElementById("companionColorInput").value = companion.color;
  document.getElementById("companionAccessoryInput").value = companion.accessory;
  document.getElementById("companionEnvironmentInput").value = companion.environment;
  document.getElementById("companionAnimationStyleInput").value = companion.animationStyle;
  document.getElementById("companionToneInput").value = companion.tone;
  document.getElementById("companionPersonalityInput").value = companion.personality;
  document.getElementById("companionStyleInput").value = companion.style;
  document.getElementById("companionFocusInput").value = companion.focus;

  const remainingCash = cashLeft();
  const score = lifeScore();
  document.getElementById("cashLeft").textContent = money(remainingCash);
  document.getElementById("dailyScore").textContent = percent(dailyCompletion());
  document.getElementById("fitnessScore").textContent = percent(fitnessCompletion());
  document.getElementById("foodBudgetScore").textContent = percent(foodBudgetCompletion());
  document.getElementById("lifeScore").textContent = score;
  const sidebarAtlasStatus = document.getElementById("sidebarAtlasStatus");
  if (sidebarAtlasStatus) sidebarAtlasStatus.textContent = score < 50 ? "Ready to help" : "Local intelligence";
  document.getElementById("moreVersionLabel").textContent = `Version ${appVersion}`;
  const settingsVersion = document.getElementById("settingsVersionLabel");
  if (settingsVersion) settingsVersion.textContent = `Version ${appVersion}`;
  document.getElementById("scoreRingValue").textContent = score;
  document.getElementById("scoreRing").style.setProperty("--score-deg", `${Math.max(0, Math.min(100, score)) * 3.6}deg`);
  document.getElementById("scoreProgress").style.width = percent(score);

  renderList("taskList", state.tasks, taskTemplate);
  renderList("expenseList", state.expenses, expenseTemplate);
  renderList("workoutList", state.workouts, workoutTemplate);
  renderList("mealList", state.meals, mealTemplate);
  renderList("goalList", state.goals, goalTemplate);
  renderList("planActionList", state.planActions, planActionTemplate);
  renderCharts();
  renderSectionSummaries();
  renderDailySummary();
  renderScoreCards();
  renderRewards();
  renderWeeklyReview();
  renderNextBestAction();
  renderSmartFoodLog();
  renderHistory();
  window.LifeOpsModules?.timeline?.render?.();
  renderConnections();
  renderPrivacyCenter();
  renderIntegrationsCenter();
  renderModuleCatalog();
  renderEducationCenter();
  renderCareerCenter();
  renderCalendarCenter();
  renderDocumentsCenter();
  window.LifeOpsModules?.memory?.render?.();
  window.LifeOpsModules?.graph?.render?.();
  renderSetupSummary();
  renderReportPreview();
  renderHomeScreen();
  renderCompanionChat();
  renderPersonalizationSettings();
  renderAppearanceSettings();
  renderVoiceSettings();
  const activeTab = document.querySelector(".tab.active")?.id || "dashboard";
  const activePrimary = sectionPrimary[activeTab] || "dashboard";
  document.body.dataset.activeTab = activeTab;
  const metricRow = document.querySelector(".metric-row");
  if (metricRow) metricRow.hidden = activeTab === "today" || !["dashboard", "today"].includes(activeTab);
  const pageHeader = document.getElementById("pageHeader");
  if (pageHeader) pageHeader.hidden = activeTab === "today";
  renderPageHeader(activePrimary, activeTab);
  renderSecondaryNav(activePrimary, activeTab);
}

function setNumberInput(id, value) {
  return window.LifeOpsUI.setNumberInput(id, value);
}

function emptyStateConfig(id) {
  return window.LifeOpsUI.emptyStateConfig(id);
}

function createEmptyState(id) {
  return window.LifeOpsUI.createEmptyState(id);
}

function renderList(id, items, template) {
  return window.LifeOpsUI.renderList(id, items, template);
}

function taskTemplate(task) {
  const row = itemShell(task.name, task.area);
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = task.done;
  checkbox.title = "Mark complete";
  checkbox.addEventListener("change", () => {
    task.done = checkbox.checked;
    save();
  });
  row.querySelector(".item-actions").prepend(checkbox);
  row.querySelector(".edit-btn").addEventListener("click", () => editTask(task));
  row.querySelector(".delete-btn").addEventListener("click", () => {
    state.tasks = state.tasks.filter(item => item.id !== task.id);
    save();
  });
  return row;
}

function expenseTemplate(expense) {
  const dueText = expense.dueDate ? ` - Due ${expense.dueDate}` : "";
  const row = itemShell(expense.name, `${expense.type} - ${money(cleanNumber(expense.amount))}${dueText}`);
  row.querySelector(".edit-btn").addEventListener("click", () => editExpense(expense));
  row.querySelector(".delete-btn").addEventListener("click", () => {
    state.expenses = state.expenses.filter(item => item.id !== expense.id);
    save();
  });
  return row;
}

function workoutTemplate(workout) {
  const row = itemShell(workout.name, `${workout.minutes || 0} min - ${workout.intensity}`);
  row.querySelector(".edit-btn").addEventListener("click", () => editWorkout(workout));
  row.querySelector(".delete-btn").addEventListener("click", () => {
    state.workouts = state.workouts.filter(item => item.id !== workout.id);
    save();
  });
  return row;
}

function mealTemplate(meal) {
  const meta = `${meal.source} - ${meal.calories || 0} cal - ${meal.protein || 0}g protein - ${money(Number(meal.cost || 0))}`;
  const row = itemShell(meal.name, meta);
  row.querySelector(".edit-btn").addEventListener("click", () => editMeal(meal));
  row.querySelector(".delete-btn").addEventListener("click", () => {
    state.meals = state.meals.filter(item => item.id !== meal.id);
    save();
  });
  return row;
}

function goalTemplate(goal) {
  const row = itemShell(goal.name, `${goal.area} - ${goal.progress || 0}% - Target ${goal.targetDate || "No date"}`);
  const progress = document.createElement("div");
  progress.className = "progress";
  progress.innerHTML = `<div style="width: ${percent(goal.progress)}"></div>`;
  row.querySelector(".item-meta").after(progress);
  row.querySelector(".edit-btn").addEventListener("click", () => editGoal(goal));
  row.querySelector(".delete-btn").addEventListener("click", () => {
    state.goals = state.goals.filter(item => item.id !== goal.id);
    save();
  });
  return row;
}

function planActionTemplate(action) {
  const row = itemShell(action.name, `${action.area} - ${action.impact} impact - Due ${action.deadline || "No date"} - ${action.goal || "No linked goal"}`);
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = action.done;
  checkbox.title = "Mark action complete";
  checkbox.addEventListener("change", () => {
    action.done = checkbox.checked;
    save();
  });
  row.querySelector(".item-actions").prepend(checkbox);
  row.querySelector(".edit-btn").addEventListener("click", () => editPlanAction(action));
  row.querySelector(".delete-btn").addEventListener("click", () => {
    state.planActions = state.planActions.filter(item => item.id !== action.id);
    save();
  });
  return row;
}

function itemShell(title, meta) {
  return window.LifeOpsUI.itemShell(title, meta);
}

function openEditModal(title, fields, onSave) {
  return window.LifeOpsUI.openEditModal(title, fields, onSave);
}

function closeEditModal() {
  return window.LifeOpsUI.closeEditModal();
}

function focusableElements(container) {
  return window.LifeOpsUI.focusableElements(container);
}

function trapModalFocus(event) {
  return window.LifeOpsUI.trapModalFocus(event);
}

function editTask(task) {
  openEditModal("Edit Task", [
    { name: "name", label: "Task", value: task.name, wide: true },
    { name: "area", label: "Area", type: "select", value: task.area, options: ["Money", "Fitness", "Career", "Home", "Wellness"] }
  ], values => {
    if (!values.name) return;
    task.name = values.name;
    task.area = values.area;
  });
}

function editExpense(expense) {
  openEditModal("Edit Bill Or Expense", [
    { name: "name", label: "Name", value: expense.name, wide: true },
    { name: "amount", label: "Amount", type: "number", value: expense.amount, min: 0, step: 5 },
    { name: "type", label: "Type", type: "select", value: expense.type, options: ["Bill", "Variable", "Debt Payment"] },
    { name: "dueDate", label: "Due date", type: "date", value: expense.dueDate || "" }
  ], values => {
    if (!values.name) return;
    expense.name = values.name;
    expense.amount = values.amount;
    expense.type = values.type;
    expense.dueDate = values.dueDate;
  });
}

function editWorkout(workout) {
  openEditModal("Edit Workout", [
    { name: "name", label: "Workout", value: workout.name, wide: true },
    { name: "minutes", label: "Minutes", type: "number", value: workout.minutes, min: 0, step: 5 },
    { name: "intensity", label: "Intensity", type: "select", value: workout.intensity, options: ["Easy", "Moderate", "Hard"] }
  ], values => {
    if (!values.name) return;
    workout.name = values.name;
    workout.minutes = values.minutes;
    workout.intensity = values.intensity;
  });
}

function editMeal(meal) {
  openEditModal("Edit Meal", [
    { name: "name", label: "Meal", value: meal.name, wide: true },
    { name: "source", label: "Source", type: "select", value: meal.source, options: ["Home", "Restaurant", "Snack"] },
    { name: "calories", label: "Calories", type: "number", value: meal.calories, min: 0, step: 25 },
    { name: "protein", label: "Protein", type: "number", value: meal.protein, min: 0, step: 1 },
    { name: "carbs", label: "Carbs", type: "number", value: meal.carbs, min: 0, step: 1 },
    { name: "fat", label: "Fat", type: "number", value: meal.fat, min: 0, step: 1 },
    { name: "cost", label: "Cost", type: "number", value: meal.cost, min: 0, step: 0.5 }
  ], values => {
    if (!values.name) return;
    Object.assign(meal, values);
  });
}

function editGoal(goal) {
  openEditModal("Edit Goal", [
    { name: "name", label: "Goal", value: goal.name, wide: true },
    { name: "area", label: "Area", type: "select", value: goal.area, options: ["Health", "Money", "Career", "Wellness", "Home"] },
    { name: "targetDate", label: "Target date", type: "date", value: goal.targetDate || "" },
    { name: "progress", label: "Progress %", type: "number", value: goal.progress, min: 0, max: 100, step: 5 }
  ], values => {
    if (!values.name) return;
    goal.name = values.name;
    goal.area = values.area;
    goal.targetDate = values.targetDate;
    goal.progress = values.progress;
  });
}

function editPlanAction(action) {
  openEditModal("Edit Weekly Action", [
    { name: "name", label: "Action", value: action.name, wide: true },
    { name: "area", label: "Area", type: "select", value: action.area, options: ["Money", "Nutrition", "Fitness", "Wellness", "Goals"] },
    { name: "deadline", label: "Deadline", type: "date", value: action.deadline || "" },
    { name: "goal", label: "Linked goal", value: action.goal || "" },
    { name: "impact", label: "Impact", type: "select", value: action.impact, options: ["High", "Medium", "Low"] }
  ], values => {
    if (!values.name) return;
    Object.assign(action, values);
  });
}

function barcodeDetectorSupported() {
  return "BarcodeDetector" in window && navigator.mediaDevices?.getUserMedia;
}

function saveBarcodeCapture(code, note = "", lookupStatus = "Scanned locally - no barcode database connected") {
  const cleanCode = String(code || "").trim().slice(0, 80);
  if (!cleanCode) return;
  state.barcodeCaptures.push({
    id: crypto.randomUUID(),
    code: cleanCode,
    note: String(note || "").trim().slice(0, 120),
    capturedAt: new Date().toISOString(),
    lookupStatus
  });
  save();
  addCompanionSystemMessage(`Barcode saved locally. Food lookup is unavailable until a secure nutrition database integration is added.\n\nCode: ${cleanCode}`);
}

function openManualBarcodeCapture(prefill = "") {
  openEditModal("Manual Barcode Capture", [
    { name: "code", label: "Barcode number", value: prefill, wide: true },
    { name: "note", label: "Food note", value: "", wide: true }
  ], values => {
    if (!values.code) return;
    saveBarcodeCapture(values.code, values.note, "Manual entry - no barcode database connected");
  });
}

async function scanBarcode() {
  if (!barcodeDetectorSupported()) {
    alert("Camera barcode scanning is not supported in this browser. You can still save the barcode manually.");
    openManualBarcodeCapture();
    return;
  }
  await openBarcodeScanner();
}

async function openBarcodeScanner() {
  const backdrop = document.getElementById("barcodeScannerBackdrop");
  const video = document.getElementById("barcodeScannerVideo");
  const status = document.getElementById("barcodeScannerStatus");
  if (!backdrop || !video || !status) {
    openManualBarcodeCapture();
    return;
  }
  try {
    stopBarcodeScanner();
    status.textContent = "Requesting camera permission...";
    backdrop.classList.add("active");
    backdrop.setAttribute("aria-hidden", "false");
    lastFocusedBeforeModal = document.activeElement;
    document.getElementById("closeBarcodeScannerBtn")?.focus();
    barcodeScannerStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: "environment" } },
      audio: false
    });
    video.srcObject = barcodeScannerStream;
    await video.play();
    const detector = new BarcodeDetector({
      formats: ["ean_13", "ean_8", "upc_a", "upc_e", "code_128", "code_39", "itf"]
    });
    status.textContent = "Point the camera at a barcode. The number will save locally when detected.";
    barcodeScannerTimer = window.setInterval(() => scanBarcodeFrame(detector, video), 350);
  } catch (error) {
    stopBarcodeScanner();
    const message = error?.name === "NotAllowedError"
      ? "Camera permission was not granted. Use manual entry instead."
      : "Camera scanner could not start in this browser. Use manual entry instead.";
    alert(message);
    openManualBarcodeCapture();
  }
}

async function scanBarcodeFrame(detector, video) {
  if (!video?.videoWidth || !detector) return;
  try {
    const codes = await detector.detect(video);
    const value = codes?.[0]?.rawValue;
    if (!value) return;
    saveBarcodeCapture(value, "Captured by camera", "Camera scan - no barcode database connected");
    stopBarcodeScanner("Barcode saved locally.");
  } catch (error) {
    const status = document.getElementById("barcodeScannerStatus");
    if (status) status.textContent = "Scanner paused. Try better light or use manual entry.";
  }
}

function stopBarcodeScanner(message = "") {
  if (barcodeScannerTimer) {
    window.clearInterval(barcodeScannerTimer);
    barcodeScannerTimer = null;
  }
  if (barcodeScannerStream) {
    barcodeScannerStream.getTracks().forEach(track => track.stop());
    barcodeScannerStream = null;
  }
  const video = document.getElementById("barcodeScannerVideo");
  if (video) {
    video.pause();
    video.srcObject = null;
  }
  const backdrop = document.getElementById("barcodeScannerBackdrop");
  if (backdrop) {
    backdrop.classList.remove("active");
    backdrop.setAttribute("aria-hidden", "true");
  }
  if (message) {
    const status = document.getElementById("barcodeScannerStatus");
    if (status) status.textContent = message;
  }
  if (lastFocusedBeforeModal && document.body.contains(lastFocusedBeforeModal)) {
    lastFocusedBeforeModal.focus();
  }
}

function lookupBarcode(code) {
  return { ok: false, code, status: "Not connected", message: "Barcode lookup requires a future nutrition database integration." };
}

function searchFoodDatabase(query) {
  return { ok: false, query, status: "Not connected", message: "Food search requires a future authenticated food database integration." };
}

function calculateRecipeNutrition(values) {
  const servings = Math.max(1, cleanNumber(values.servings, 1));
  return {
    servings,
    caloriesPerServing: Math.round(cleanNumber(values.calories) / servings),
    proteinPerServing: Math.round(cleanNumber(values.protein) / servings),
    carbsPerServing: Math.round(cleanNumber(values.carbs) / servings),
    fatPerServing: Math.round(cleanNumber(values.fat) / servings),
    costPerServing: Number((cleanNumber(values.cost) / servings).toFixed(2))
  };
}

function saveCustomFood(values) {
  const nutrition = calculateRecipeNutrition(values);
  const recipe = {
    id: crypto.randomUUID(),
    name: values.name.slice(0, 80),
    servings: nutrition.servings,
    calories: nutrition.caloriesPerServing,
    protein: nutrition.proteinPerServing,
    carbs: nutrition.carbsPerServing,
    fat: nutrition.fatPerServing,
    cost: nutrition.costPerServing,
    ingredients: values.ingredients.slice(0, 500),
    prepNotes: values.prepNotes.slice(0, 500),
    cookingTime: cleanNumber(values.cookingTime),
    tags: values.tags.slice(0, 120),
    mealPrep: values.mealPrep === "Yes",
    createdAt: todayKey()
  };
  state.recipes.push(recipe);
  state.savedMeals.push({
    id: crypto.randomUUID(),
    name: recipe.name,
    source: "Home",
    calories: recipe.calories,
    protein: recipe.protein,
    carbs: recipe.carbs,
    fat: recipe.fat,
    cost: recipe.cost
  });
  return recipe;
}

function openRecipeBuilder() {
  openEditModal("Recipe Builder", [
    { name: "name", label: "Recipe name", value: "", wide: true },
    { name: "ingredients", label: "Ingredients and amounts", value: "", wide: true },
    { name: "servings", label: "Serving count", type: "number", value: 1, min: 1, step: 1 },
    { name: "calories", label: "Total calories", type: "number", value: 0, min: 0, step: 25 },
    { name: "protein", label: "Total protein", type: "number", value: 0, min: 0, step: 1 },
    { name: "carbs", label: "Total carbs", type: "number", value: 0, min: 0, step: 1 },
    { name: "fat", label: "Total fat", type: "number", value: 0, min: 0, step: 1 },
    { name: "cost", label: "Total estimated cost", type: "number", value: 0, min: 0, step: .25 },
    { name: "cookingTime", label: "Cooking time minutes", type: "number", value: 0, min: 0, step: 5 },
    { name: "mealPrep", label: "Meal prep recipe", type: "select", value: "No", options: ["No", "Yes"] },
    { name: "tags", label: "Tags", value: "", wide: true },
    { name: "prepNotes", label: "Preparation notes", value: "", wide: true }
  ], values => {
    if (!values.name) return;
    const recipe = saveCustomFood(values);
    addCompanionSystemMessage(`Recipe saved locally and added to saved meals.\n\n${recipe.name}: ${recipe.protein}g protein, ${recipe.calories} calories, ${money(recipe.cost)} per serving.`);
  });
}

function openMealPrepView() {
  const recipes = state.recipes || [];
  setCompanionDrawer(true);
  addCompanionSystemMessage(recipes.length ? `Meal prep local summary\n\n${recipes.slice(-5).map(recipe => `${recipe.name}: ${recipe.servings} servings, ${recipe.protein}g protein, ${money(recipe.cost)} per serving`).join("\n")}` : "No recipes saved yet. Open Recipe Builder to create one from user-entered ingredients.");
}

function addWaterQuick() {
  state.profile.waterCups = cleanNumber(state.profile.waterCups) + 1;
  save();
}

function addSleepQuick() {
  openEditModal("Update Sleep", [
    { name: "sleepHours", label: "Sleep hours", type: "number", value: state.profile.sleepHours || 0, min: 0, max: 24, step: .25 }
  ], values => {
    state.profile.sleepHours = values.sleepHours;
  });
}

function openAddTaskModal() {
  openEditModal("Add Task", [
    { name: "name", label: "Task", value: "", wide: true },
    { name: "area", label: "Area", type: "select", value: "Money", options: ["Money", "Fitness", "Career", "Home", "Wellness"] }
  ], values => {
    if (!values.name) return;
    state.tasks.push({ id: crypto.randomUUID(), name: values.name, area: values.area, done: false });
  });
}

function openAddExpenseModal() {
  openEditModal("Add Bill Or Expense", [
    { name: "name", label: "Name", value: "", wide: true },
    { name: "amount", label: "Amount", type: "number", value: "", min: 0, step: 5 },
    { name: "type", label: "Type", type: "select", value: "Bill", options: ["Bill", "Variable", "Debt Payment"] },
    { name: "dueDate", label: "Due date", type: "date", value: "" }
  ], values => {
    if (!values.name || values.amount <= 0) return;
    state.expenses.push({ id: crypto.randomUUID(), name: values.name, amount: values.amount, type: values.type, dueDate: values.dueDate });
  });
}

function openAddWorkoutModal() {
  openEditModal("Add Workout", [
    { name: "name", label: "Workout", value: "", wide: true },
    { name: "minutes", label: "Minutes", type: "number", value: "", min: 0, step: 5 },
    { name: "intensity", label: "Intensity", type: "select", value: "Moderate", options: ["Easy", "Moderate", "Hard"] }
  ], values => {
    if (!values.name || values.minutes <= 0) return;
    state.workouts.push({ id: crypto.randomUUID(), name: values.name, minutes: values.minutes, intensity: values.intensity });
  });
}

function openAddMealModal() {
  openEditModal("Add Meal", [
    { name: "name", label: "Meal", value: "", wide: true },
    { name: "source", label: "Source", type: "select", value: "Home", options: ["Home", "Restaurant", "Snack"] },
    { name: "calories", label: "Calories", type: "number", value: "", min: 0, step: 25 },
    { name: "protein", label: "Protein", type: "number", value: "", min: 0, step: 1 },
    { name: "carbs", label: "Carbs", type: "number", value: "", min: 0, step: 1 },
    { name: "fat", label: "Fat", type: "number", value: "", min: 0, step: 1 },
    { name: "cost", label: "Cost", type: "number", value: "", min: 0, step: 0.5 }
  ], values => {
    if (!values.name || values.calories <= 0) return;
    state.meals.push({ id: crypto.randomUUID(), ...values });
  });
}

function openAddGoalModal() {
  openEditModal("Add Long-Term Goal", [
    { name: "name", label: "Goal", value: "", wide: true },
    { name: "area", label: "Area", type: "select", value: "Health", options: ["Health", "Money", "Career", "Wellness", "Home"] },
    { name: "targetDate", label: "Target date", type: "date", value: "" },
    { name: "progress", label: "Progress %", type: "number", value: 0, min: 0, max: 100, step: 5 }
  ], values => {
    if (!values.name) return;
    state.goals.push({ id: crypto.randomUUID(), name: values.name, area: values.area, targetDate: values.targetDate, progress: values.progress });
  });
}

function openAddPlanActionModal() {
  openEditModal("Add Weekly Action", [
    { name: "name", label: "Action", value: "", wide: true },
    { name: "area", label: "Area", type: "select", value: "Money", options: ["Money", "Nutrition", "Fitness", "Wellness", "Goals"] },
    { name: "deadline", label: "Deadline", type: "date", value: "" },
    { name: "goal", label: "Linked goal", value: "", wide: true },
    { name: "impact", label: "Expected impact", type: "select", value: "High", options: ["High", "Medium", "Low"] }
  ], values => {
    if (!values.name) return;
    state.planActions.push({ id: crypto.randomUUID(), name: values.name, area: values.area, deadline: values.deadline, goal: values.goal, impact: values.impact, done: false });
  });
}

function openMoneyTargetsModal() {
  openEditModal("Edit Money Targets", [
    { name: "income", label: "Monthly income", type: "number", value: state.profile.income, min: 0, step: 50 },
    { name: "savingsGoal", label: "Savings goal", type: "number", value: state.profile.savingsGoal, min: 0, step: 50 },
    { name: "currentSavings", label: "Current savings", type: "number", value: state.profile.currentSavings, min: 0, step: 50 },
    { name: "emergencyTarget", label: "Emergency fund target", type: "number", value: state.profile.emergencyTarget, min: 0, step: 50 }
  ], values => {
    Object.assign(state.profile, values);
  });
}

function openNutritionTargetsModal() {
  openEditModal("Edit Nutrition Targets", [
    { name: "calorieGoal", label: "Daily calories", type: "number", value: state.profile.calorieGoal, min: 0, step: 50 },
    { name: "proteinGoal", label: "Daily protein grams", type: "number", value: state.profile.proteinGoal, min: 0, step: 5 },
    { name: "carbGoal", label: "Daily carbs grams", type: "number", value: state.profile.carbGoal, min: 0, step: 5 },
    { name: "fatGoal", label: "Daily fat grams", type: "number", value: state.profile.fatGoal, min: 0, step: 5 },
    { name: "foodBudget", label: "Weekly food budget", type: "number", value: state.profile.foodBudget, min: 0, step: 5 },
    { name: "waterGoal", label: "Water goal cups", type: "number", value: state.profile.waterGoal, min: 0, step: 1 }
  ], values => {
    Object.assign(state.profile, values);
  });
}

function openAddEducationCourseModal() {
  openEditModal("Add Course Or Learning Path", [
    { name: "name", label: "Course or path name", value: "", wide: true },
    { name: "code", label: "Course code", value: "" },
    { name: "instructor", label: "Instructor or source", value: "" },
    { name: "credits", label: "Credit hours", type: "number", value: 0, min: 0, step: 1 },
    { name: "term", label: "Term", value: "" },
    { name: "startDate", label: "Start date", type: "date", value: "" },
    { name: "endDate", label: "End date", type: "date", value: "" },
    { name: "method", label: "Delivery method", type: "select", value: "Independent study", options: ["College", "Certification", "Trade school", "Professional training", "Independent study", "Language learning", "Other"] },
    { name: "status", label: "Status", type: "select", value: "In progress", options: ["Not started", "In progress", "Complete", "Paused"] },
    { name: "privacy", label: "Privacy", type: "select", value: "Private", options: ["Private", "Personal", "Shared", "Sensitive"] },
    { name: "notes", label: "Notes", value: "", wide: true }
  ], values => {
    if (!values.name) return;
    state.educationCourses.push({ id: crypto.randomUUID(), grade: "", ...values });
  });
}

function openAddEducationAssignmentModal(kind = "Assignment") {
  openEditModal(`Add ${kind}`, [
    { name: "title", label: `${kind} title`, value: "", wide: true },
    { name: "course", label: "Course or path", value: state.educationCourses[0]?.name || "" },
    { name: "date", label: kind === "Exam" ? "Exam date" : "Due date", type: "date", value: "" },
    { name: "priority", label: "Priority", type: "select", value: "Medium", options: ["Low", "Medium", "High"] },
    { name: "status", label: "Status", type: "select", value: "Not started", options: ["Not started", "In progress", "Complete", "Paused"] },
    { name: "privacy", label: "Privacy", type: "select", value: "Private", options: ["Private", "Personal", "Shared", "Sensitive"] },
    { name: "notes", label: "Notes", value: "", wide: true }
  ], values => {
    if (!values.title) return;
    const record = { id: crypto.randomUUID(), title: values.title, course: values.course, priority: values.priority, status: values.status, privacy: values.privacy, notes: values.notes };
    if (kind === "Exam") state.educationExams.push({ ...record, date: values.date });
    else state.educationAssignments.push({ ...record, dueDate: values.date });
  });
}

function openAddEducationGoalModal() {
  openEditModal("Add Learning Goal", [
    { name: "title", label: "Learning goal", value: "", wide: true },
    { name: "category", label: "Category", value: "Learning" },
    { name: "targetDate", label: "Target date", type: "date", value: "" },
    { name: "progress", label: "Progress %", type: "number", value: 0, min: 0, max: 100, step: 5 },
    { name: "privacy", label: "Privacy", type: "select", value: "Private", options: ["Private", "Personal", "Shared", "Sensitive"] },
    { name: "notes", label: "Notes", value: "", wide: true }
  ], values => {
    if (!values.title) return;
    state.educationGoals.push({ id: crypto.randomUUID(), ...values });
  });
}

function openAddEducationCostModal() {
  openEditModal("Add Education Cost", [
    { name: "title", label: "Cost name", value: "", wide: true },
    { name: "category", label: "Category", type: "select", value: "Tuition", options: ["Tuition", "Books", "Fees", "Exam", "Training", "Equipment", "Other"] },
    { name: "amount", label: "Amount", type: "number", value: 0, min: 0, step: 5 },
    { name: "date", label: "Date", type: "date", value: "" },
    { name: "privacy", label: "Privacy", type: "select", value: "Private", options: ["Private", "Personal", "Shared", "Sensitive"] },
    { name: "notes", label: "Notes", value: "", wide: true }
  ], values => {
    if (!values.title) return;
    state.educationCosts.push({ id: crypto.randomUUID(), ...values });
  });
}

function openAddCareerApplicationModal() {
  openEditModal("Add Application", [
    { name: "company", label: "Company", value: "", wide: true },
    { name: "position", label: "Position", value: "", wide: true },
    { name: "location", label: "Location", value: "" },
    { name: "salaryRange", label: "Salary range", value: "" },
    { name: "applicationDate", label: "Application date", type: "date", value: todayKey() },
    { name: "status", label: "Status", type: "select", value: "Saved", options: ["Saved", "Preparing", "Applied", "Interviewing", "Offer", "Rejected", "Paused"] },
    { name: "contact", label: "Contact", value: "" },
    { name: "nextStep", label: "Next step", value: "", wide: true },
    { name: "followUpDate", label: "Follow-up date", type: "date", value: "" },
    { name: "privacy", label: "Privacy", type: "select", value: "Private", options: ["Private", "Personal", "Shared", "Sensitive"] },
    { name: "notes", label: "Notes", value: "", wide: true }
  ], values => {
    if (!values.company || !values.position) return;
    state.careerApplications.push({ id: crypto.randomUUID(), ...values });
  });
}

function openAddCareerInterviewModal() {
  openEditModal("Add Interview", [
    { name: "company", label: "Company", value: "", wide: true },
    { name: "position", label: "Position", value: "" },
    { name: "date", label: "Interview date", type: "date", value: "" },
    { name: "type", label: "Type", type: "select", value: "Interview", options: ["Phone screen", "Interview", "Panel", "Final", "Offer discussion"] },
    { name: "status", label: "Status", type: "select", value: "Not started", options: ["Not started", "In progress", "Complete", "Paused"] },
    { name: "privacy", label: "Privacy", type: "select", value: "Private", options: ["Private", "Personal", "Shared", "Sensitive"] },
    { name: "notes", label: "Preparation notes", value: "", wide: true }
  ], values => {
    if (!values.company) return;
    state.careerInterviews.push({ id: crypto.randomUUID(), ...values });
  });
}

function openAddCareerContactModal() {
  openEditModal("Add Contact", [
    { name: "name", label: "Name", value: "", wide: true },
    { name: "organization", label: "Organization", value: "" },
    { name: "relationship", label: "Relationship", value: "" },
    { name: "followUpDate", label: "Follow-up date", type: "date", value: "" },
    { name: "privacy", label: "Privacy", type: "select", value: "Private", options: ["Private", "Personal", "Shared", "Sensitive"] },
    { name: "notes", label: "Notes", value: "", wide: true }
  ], values => {
    if (!values.name) return;
    state.careerContacts.push({ id: crypto.randomUUID(), ...values });
  });
}

function openAddCareerGoalModal() {
  openEditModal("Add Career Goal", [
    { name: "title", label: "Goal", value: "", wide: true },
    { name: "targetDate", label: "Target date", type: "date", value: "" },
    { name: "progress", label: "Progress %", type: "number", value: 0, min: 0, max: 100, step: 5 },
    { name: "privacy", label: "Privacy", type: "select", value: "Private", options: ["Private", "Personal", "Shared", "Sensitive"] },
    { name: "notes", label: "Notes", value: "", wide: true }
  ], values => {
    if (!values.title) return;
    state.careerGoals.push({ id: crypto.randomUUID(), category: "Career", ...values });
  });
}

function openAddCareerSkillModal() {
  openEditModal("Add Skill", [
    { name: "name", label: "Skill", value: "", wide: true },
    { name: "category", label: "Category", value: "Professional development" },
    { name: "progress", label: "Progress %", type: "number", value: 0, min: 0, max: 100, step: 5 },
    { name: "privacy", label: "Privacy", type: "select", value: "Private", options: ["Private", "Personal", "Shared", "Sensitive"] },
    { name: "notes", label: "Notes", value: "", wide: true }
  ], values => {
    if (!values.name) return;
    state.careerSkills.push({ id: crypto.randomUUID(), ...values });
  });
}

function openAddCareerAchievementModal() {
  openEditModal("Add Achievement", [
    { name: "title", label: "Achievement", value: "", wide: true },
    { name: "date", label: "Date", type: "date", value: todayKey() },
    { name: "category", label: "Category", value: "Career" },
    { name: "privacy", label: "Privacy", type: "select", value: "Private", options: ["Private", "Personal", "Shared", "Sensitive"] },
    { name: "notes", label: "Notes", value: "", wide: true }
  ], values => {
    if (!values.title) return;
    state.careerAchievements.push({ id: crypto.randomUUID(), ...values });
  });
}

function openAddCalendarEventModal() {
  openEditModal("Add Calendar Event", [
    { name: "title", label: "Event title", value: "", wide: true },
    { name: "date", label: "Date", type: "date", value: todayKey() },
    { name: "category", label: "Category", type: "select", value: "Personal", options: ["Finance", "Health", "Education", "Career", "Goals", "Connections", "Personal"] },
    { name: "source", label: "Source", value: "Manual" },
    { name: "privacy", label: "Privacy", type: "select", value: "Private", options: ["Private", "Personal", "Shared", "Sensitive"] },
    { name: "notes", label: "Notes", value: "", wide: true }
  ], values => {
    if (!values.title) return;
    state.calendarEvents.push({ id: crypto.randomUUID(), ...values });
  });
}

function openAddDocumentReferenceModal() {
  openEditModal("Add Document Reference", [
    { name: "title", label: "Document title", value: "", wide: true },
    { name: "category", label: "Category", type: "select", value: "Other", options: ["Finance", "Health", "Education", "Career", "Taxes", "Insurance", "Identity", "Legal", "Receipts", "Other"] },
    { name: "date", label: "Date", type: "date", value: todayKey() },
    { name: "description", label: "Description", value: "", wide: true },
    { name: "related", label: "Related goal or event", value: "" },
    { name: "privacy", label: "Privacy", type: "select", value: "Private", options: ["Private", "Personal", "Shared", "Sensitive"] },
    { name: "sensitivity", label: "Sensitivity", type: "select", value: "Personal", options: ["Private", "Personal", "Shared", "Sensitive"] },
    { name: "localNote", label: "Local reference note", value: "No file uploaded. Local metadata only.", wide: true }
  ], values => {
    if (!values.title) return;
    state.documents.push({ id: crypto.randomUUID(), ...values });
  });
}

function recommendedDailyFocus() {
  const remainingCash = cashLeft();
  const currentSavings = cleanNumber(state.profile.currentSavings);
  const emergencyTarget = cleanNumber(state.profile.emergencyTarget);
  if (remainingCash < 0) {
    return "Expenses and planned savings are above income. Review bills and variable spending before adding new commitments.";
  }
  const nextPayment = upcomingPayments(7)[0];
  if (nextPayment) {
    return `${nextPayment.name} is coming up. Keep enough cash available before optional spending.`;
  }
  if (emergencyTarget && currentSavings < emergencyTarget) {
    return "Protect cash and keep building the emergency fund before increasing optional spending.";
  }
  if (fitnessCompletion() < 100) {
    return "Complete a workout or active walk to keep the weekly fitness goal moving.";
  }
  if (state.tasks.some(task => !task.done)) {
    return "Finish one open task tied to today's priority.";
  }
  return "Maintain the routine and save today's snapshot so trends stay useful.";
}

function speechSupported() {
  return "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
}

function audioSupported() {
  return "AudioContext" in window || "webkitAudioContext" in window;
}

function voiceAllowsStartup() {
  return state.voice.mode === "startup" || state.voice.mode === "both";
}

function voiceAllowsBriefing() {
  return state.voice.mode === "briefing" || state.voice.mode === "both";
}

function startupSoundEnabled() {
  return state.voice.startupSound === true;
}

function startupAudioAllowed() {
  return state.voice.startupAudioUnlocked === true;
}

function displayName() {
  return String(state.voice.displayName || "").trim();
}

function timeGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function safeMoneyStatus() {
  if (cashLeft() < 0) return "Cash flow needs attention.";
  if (cleanNumber(state.profile.emergencyTarget) && cleanNumber(state.profile.currentSavings) < cleanNumber(state.profile.emergencyTarget)) {
    return "Your emergency fund is below target.";
  }
  return "Your money status is stable based on current entries.";
}

function recentWinText() {
  const completedAction = state.planActions.find(action => action.done);
  if (completedAction) return `Your recent win is completing ${completedAction.name}.`;
  const completedTask = state.tasks.find(task => task.done);
  if (completedTask) return `Your recent win is completing ${completedTask.name}.`;
  if (state.history.length) return "Your recent win is keeping LifeOps history updated.";
  return "";
}

function importantUpcomingCount() {
  return upcomingPayments(7).length + state.planActions.filter(action => !action.done && daysUntil(action.deadline) !== null && daysUntil(action.deadline) <= 7).length;
}

function bestActionText() {
  const nextAction = state.planActions.find(action => !action.done);
  return nextAction ? nextAction.name : recommendedDailyFocus();
}

function startupGreetingText() {
  const name = displayName();
  return `${name ? `Good ${timeGreeting().split(" ")[1]}, ${name}.` : `${timeGreeting()}.`} I am Atlas. Let's see what needs your attention.`;
}

function morningBriefingText() {
  const name = displayName();
  const upcoming = importantUpcomingCount();
  const workoutGoal = cleanNumber(state.profile.workoutGoal);
  const workoutsDone = cleanNumber(state.profile.workoutsDone);
  const lines = [
    `${timeGreeting()}${name ? `, ${name}` : ""}.`,
    `Today's focus is ${state.profile.priority || "choosing one clear priority"}.`,
    `Your next best action is ${bestActionText()}.`,
    `You have ${upcoming} important item${upcoming === 1 ? "" : "s"} coming up.`,
    workoutGoal ? `You have completed ${workoutsDone} of ${workoutGoal} workouts this week.` : "No weekly workout goal is set yet.",
    safeMoneyStatus()
  ];
  const win = recentWinText();
  if (win) lines.push(win);
  return lines.join("\n\n");
}

function selectedSpeechVoice() {
  if (!speechSupported()) return null;
  const saved = state.voice.voiceName;
  const maleHints = ["male", "george", "daniel", "ryan", "oliver", "arthur", "thomas", "james"];
  const isMaleNamed = voice => maleHints.some(hint => voice.name.toLowerCase().includes(hint));
  return availableVoices.find(voice => voice.name === saved) ||
    availableVoices.find(voice => /^en-GB/i.test(voice.lang || "") && isMaleNamed(voice)) ||
    availableVoices.find(voice => /british|united kingdom|uk english/i.test(voice.name)) ||
    availableVoices.find(voice => /^en-GB/i.test(voice.lang || "")) ||
    availableVoices.find(voice => /^en/i.test(voice.lang || "") && isMaleNamed(voice)) ||
    availableVoices.find(voice => /^en/i.test(voice.lang || "")) ||
    availableVoices[0] ||
    null;
}

function setVoiceStatus(message) {
  const targets = ["homeVoiceStatus", "voiceLiveStatus"];
  targets.forEach(id => {
    const element = document.getElementById(id);
    if (element) element.textContent = message;
  });
  const settingsText = document.getElementById("settingsBriefingText");
  if (settingsText && !settingsText.dataset.locked) settingsText.textContent = message;
}

function updateStartVoiceExperienceButton() {
  const button = document.getElementById("startVoiceExperienceBtn");
  if (!button) return;
  const wantsStartupAudio = startupSoundEnabled() || voiceAllowsStartup();
  button.hidden = !wantsStartupAudio || startupAudioAllowed();
}

function ensureAudioContext() {
  if (!audioSupported()) return null;
  if (!audioContext) {
    const AudioCtor = window.AudioContext || window.webkitAudioContext;
    audioContext = new AudioCtor();
  }
  return audioContext;
}

async function resumeAudioContext(context) {
  if (!context || context.state !== "suspended") return context?.state || "unavailable";
  try {
    await Promise.race([
      context.resume(),
      new Promise(resolve => window.setTimeout(resolve, 260))
    ]);
  } catch {
    return context.state;
  }
  return context.state;
}

async function unlockAudioSystems() {
  let unlocked = false;
  try {
    const context = ensureAudioContext();
    if (context && context.state === "suspended") await resumeAudioContext(context);
    unlocked = Boolean(context && context.state === "running");
  } catch {
    unlocked = false;
  }
  if (speechSupported()) {
    try {
      window.speechSynthesis.cancel();
      unlocked = true;
    } catch {
      unlocked = unlocked || false;
    }
  }
  if (unlocked) {
    state.voice.startupAudioUnlocked = true;
    save();
    setVoiceStatus("Voice experience is ready. Some browsers may still require interaction after refresh.");
    if (startupSoundEnabled()) {
      window.setTimeout(() => playStartupTone({ preview: true }), 80);
    }
  } else {
    setVoiceStatus("This browser blocked startup audio. Use the play buttons when needed.");
  }
  updateStartVoiceExperienceButton();
  return unlocked;
}

function stopStartupTone() {
  activeStartupOscillators.forEach(node => {
    try { node.stop(); } catch {}
  });
  activeStartupOscillators = [];
}

function stopVoice(message = "Voice stopped.") {
  stopStartupTone();
  if (speechSupported()) window.speechSynthesis.cancel();
  setVoiceStatus(message);
}

async function playStartupTone(options = {}) {
  if (!options.preview && !startupSoundEnabled()) return false;
  if (!audioSupported()) {
    setVoiceStatus("Startup sound is not supported in this browser.");
    return false;
  }
  stopVoice("Preparing startup sound.");
  try {
    const context = ensureAudioContext();
    if (!context) return false;
    if (context.state === "suspended") await resumeAudioContext(context);
    if (context.state !== "running") {
      if (!options.preview) {
        state.voice.startupAudioUnlocked = false;
        save();
        setVoiceStatus("Tap Start Voice Experience once so your browser can allow the LifeOps Pulse on startup.");
        updateStartVoiceExperienceButton();
      }
      return false;
    }
    if (!options.preview && !startupAudioAllowed()) {
      state.voice.startupAudioUnlocked = true;
      save();
    }
    const now = context.currentTime;
    const volume = cleanNumber(state.voice.startupVolume ?? 0.35, 0, 0.7);
    const master = context.createGain();
    const filter = context.createBiquadFilter();
    const delay = context.createDelay(0.35);
    const echoGain = context.createGain();
    master.gain.setValueAtTime(0.0001, now);
    master.gain.exponentialRampToValueAtTime(Math.max(0.0001, volume * 0.18), now + 0.08);
    master.gain.exponentialRampToValueAtTime(0.0001, now + 0.92);
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(2400, now);
    filter.frequency.linearRampToValueAtTime(3600, now + 0.46);
    filter.Q.setValueAtTime(0.35, now);
    delay.delayTime.setValueAtTime(0.13, now);
    echoGain.gain.setValueAtTime(volume * 0.04, now);
    master.connect(filter);
    filter.connect(context.destination);
    filter.connect(delay);
    delay.connect(echoGain);
    echoGain.connect(context.destination);

    [
      { frequency: 246.94, start: 0.03, duration: 0.54, gain: 0.78, type: "sine" },
      { frequency: 369.99, start: 0.03, duration: 0.46, gain: 0.18, type: "sine" },
      { frequency: 493.88, start: 0.28, duration: 0.48, gain: 0.54, type: "sine" },
      { frequency: 739.99, start: 0.28, duration: 0.36, gain: 0.14, type: "triangle" },
      { frequency: 987.77, start: 0.34, duration: 0.22, gain: 0.045, type: "sine" }
    ].forEach(note => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = note.type;
      oscillator.frequency.setValueAtTime(note.frequency, now + note.start);
      gain.gain.setValueAtTime(0.0001, now + note.start);
      gain.gain.exponentialRampToValueAtTime(note.gain, now + note.start + 0.07);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + note.start + note.duration);
      oscillator.connect(gain);
      gain.connect(master);
      oscillator.start(now + note.start);
      oscillator.stop(now + note.start + note.duration + 0.04);
      activeStartupOscillators.push(oscillator);
    });
    window.setTimeout(() => {
      activeStartupOscillators = [];
      setVoiceStatus("LifeOps Pulse ready.");
    }, 950);
    return true;
  } catch {
    if (!options.preview) {
      state.voice.startupAudioUnlocked = false;
      save();
      setVoiceStatus("Tap Start Voice Experience once so your browser can allow the LifeOps Pulse on startup.");
      updateStartVoiceExperienceButton();
    }
    return false;
  }
}

function speakText(text, options = {}) {
  const visibleText = options.visibleTargetId ? document.getElementById(options.visibleTargetId) : null;
  if (visibleText) visibleText.textContent = text;
  if (!speechSupported()) {
    if (!options.silentFailure) setVoiceStatus("Voice playback is not supported in this browser.");
    return;
  }
  if (state.voice.mode === "off" && !options.allowWhenOff) {
    if (!options.silentFailure) setVoiceStatus("Voice guidance is off.");
    return;
  }
  window.speechSynthesis.cancel();
  try {
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = selectedSpeechVoice();
    if (voice) utterance.voice = voice;
    utterance.rate = cleanNumber(state.voice.rate, 0.8, 1.2);
    utterance.onstart = () => setVoiceStatus("Voice playing.");
    utterance.onpause = () => setVoiceStatus("Voice paused.");
    utterance.onresume = () => setVoiceStatus("Voice resumed.");
    utterance.onend = () => setVoiceStatus("Voice ready.");
    utterance.onerror = () => {
      if (options.startupAttempt) updateStartVoiceExperienceButton();
      if (!options.silentFailure) setVoiceStatus("Voice stopped or unavailable. Browser default voice will be used next time.");
    };
    window.speechSynthesis.speak(utterance);
  } catch {
    if (options.startupAttempt) updateStartVoiceExperienceButton();
    if (!options.silentFailure) setVoiceStatus("Voice could not start in this browser.");
  }
}

function playMorningBriefing() {
  const text = morningBriefingText();
  document.getElementById("morningBriefingText").textContent = text;
  document.getElementById("settingsBriefingText").textContent = text;
  if (!voiceAllowsBriefing()) {
    setVoiceStatus(state.voice.mode === "off" ? "Voice guidance is off." : "Morning briefing voice is not enabled.");
    return;
  }
  speakText(text, { visibleTargetId: "morningBriefingText" });
}

function previewVoice() {
  speakText("Hello. LifeOps voice guidance is ready.", { allowWhenOff: true, visibleTargetId: "settingsBriefingText" });
}

async function previewStartupSound() {
  await unlockAudioSystems();
  await playStartupTone({ preview: true });
}

async function previewStartupExperience() {
  await unlockAudioSystems();
  const played = await playStartupTone({ preview: true });
  window.setTimeout(() => {
    speakText("Welcome back. LifeOps is ready.", { allowWhenOff: true, visibleTargetId: "settingsBriefingText" });
  }, played ? 920 : 80);
}

function pauseVoice() {
  if (speechSupported() && window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
    window.speechSynthesis.pause();
    setVoiceStatus("Voice paused.");
  }
}

function resumeVoice() {
  if (speechSupported() && window.speechSynthesis.paused) {
    window.speechSynthesis.resume();
    setVoiceStatus("Voice resumed.");
  }
}

function loadBrowserVoices() {
  if (!speechSupported()) {
    availableVoices = [];
    renderVoiceSettings();
    return;
  }
  availableVoices = window.speechSynthesis.getVoices() || [];
  renderVoiceSettings();
}

function renderVoiceSettings() {
  const supported = speechSupported();
  const unsupported = document.getElementById("voiceUnsupportedMessage");
  const fields = document.getElementById("voiceSettingsFields");
  const voiceSelect = document.getElementById("voiceSelectInput");
  const controlButtons = document.getElementById("voiceControlButtons");
  const controls = ["playMorningBriefingBtn", "previewVoiceBtn", "previewStartupSoundBtn", "previewStartupExperienceBtn", "pauseVoiceBtn", "resumeVoiceBtn", "stopVoiceBtn"];
  if (unsupported) unsupported.hidden = supported;
  if (fields) fields.hidden = !supported;
  if (controlButtons) controlButtons.hidden = !supported;
  controls.forEach(id => {
    const button = document.getElementById(id);
    if (button) {
      button.disabled = !supported;
      if (id === "playMorningBriefingBtn") button.hidden = !supported;
    }
  });
  document.getElementById("displayNameInput").value = state.voice.displayName || "";
  document.getElementById("startupAnimationInput").checked = state.voice.startupAnimation !== false;
  document.getElementById("startupSoundInput").checked = state.voice.startupSound === true;
  document.getElementById("voiceModeInput").value = state.voice.mode;
  document.getElementById("voiceRateInput").value = state.voice.rate;
  document.getElementById("voiceRateLabel").textContent = `${Number(state.voice.rate).toFixed(2)}x`;
  document.getElementById("startupVolumeInput").value = state.voice.startupVolume ?? 0.35;
  document.getElementById("startupVolumeLabel").textContent = `${Math.round(cleanNumber(state.voice.startupVolume ?? 0.35, 0, 0.7) * 100)}%`;
  if (voiceSelect) {
    const current = voiceSelect.value;
    voiceSelect.innerHTML = "";
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Browser default voice";
    voiceSelect.appendChild(defaultOption);
    availableVoices.forEach(voice => {
      const option = document.createElement("option");
      option.value = voice.name;
      option.textContent = `${voice.name}${voice.lang ? ` (${voice.lang})` : ""}`;
      voiceSelect.appendChild(option);
    });
    voiceSelect.value = state.voice.voiceName && availableVoices.some(voice => voice.name === state.voice.voiceName) ? state.voice.voiceName : current && availableVoices.some(voice => voice.name === current) ? current : "";
  }
  setVoiceStatus(supported ? voiceModeLabel() : "Voice playback is not supported in this browser.");
  updateStartVoiceExperienceButton();
}

function voiceModeLabel() {
  const labels = {
    off: "Voice guidance is off.",
    startup: "Startup greeting is enabled.",
    briefing: "Morning briefing is available on request.",
    both: "Startup greeting and morning briefing are enabled."
  };
  return labels[state.voice.mode] || labels.off;
}

function saveVoiceSettings() {
  state.voice.displayName = document.getElementById("displayNameInput").value.trim().slice(0, 32);
  state.voice.startupAnimation = document.getElementById("startupAnimationInput").checked;
  state.voice.startupSound = document.getElementById("startupSoundInput").checked;
  state.voice.mode = document.getElementById("voiceModeInput").value;
  state.voice.voiceModeUserSet = true;
  state.voice.voiceName = document.getElementById("voiceSelectInput").value;
  state.voice.rate = cleanNumber(document.getElementById("voiceRateInput").value, 0.8, 1.2);
  state.voice.startupVolume = cleanNumber(document.getElementById("startupVolumeInput").value, 0, 0.7);
  save();
}

function resetVoiceSettings() {
  stopVoice("Voice settings reset.");
  state.voice = defaultVoiceSettings();
  save();
}

function renderStartupSteps(completed = 0) {
  const list = document.getElementById("startupSteps");
  if (!list) return;
  list.innerHTML = "";
  startupSteps.forEach((step, index) => {
    const row = document.createElement("div");
    row.className = `startup-step ${index < completed ? "complete" : ""}`.trim();
    row.innerHTML = `<span class="check">Ã¢Å“â€œ</span><span></span>`;
    row.querySelector("span:last-child").textContent = step;
    list.appendChild(row);
  });
  const live = document.getElementById("startupLiveStatus");
  if (live) live.textContent = completed ? startupSteps[Math.min(completed - 1, startupSteps.length - 1)] : "Starting LifeOps.";
}

async function finishStartup() {
  if (startupHasFinished) return;
  startupHasFinished = true;
  const overlay = document.getElementById("startupOverlay");
  if (overlay) {
    overlay.classList.add("hidden");
    overlay.setAttribute("aria-hidden", "true");
  }
  playDashboardEntrance();
  if (startupSoundEnabled()) {
    await playStartupTone();
  }
  if (voiceAllowsStartup()) {
    window.setTimeout(() => {
      if (!startupAudioAllowed()) updateStartVoiceExperienceButton();
      speakText(startupGreetingText(), { startupAttempt: true, silentFailure: true });
    }, startupSoundEnabled() ? 720 : 120);
  }
  updateStartVoiceExperienceButton();
  window.setTimeout(() => openAtlasOnboarding(false), 260);
}

function runStartupSequence() {
  renderStartupSteps(0);
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (state.voice.startupAnimation === false) {
    renderStartupSteps(startupSteps.length);
    finishStartup();
    return;
  }
  const duration = reducedMotion ? 180 : 1450;
  startupSteps.forEach((_, index) => {
    window.setTimeout(() => renderStartupSteps(index + 1), reducedMotion ? 20 : Math.round((duration / startupSteps.length) * (index + 1)));
  });
  window.setTimeout(finishStartup, reducedMotion ? 240 : 1780);
}

function playDashboardEntrance() {
  if (entranceHasPlayed) return;
  entranceHasPlayed = true;
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.body.classList.add("startup-enter");
    window.setTimeout(() => document.body.classList.remove("startup-enter"), 900);
    animateHomeNumbers();
  }
}

function animateHomeNumbers() {
  ["homeLifeScore", "scoreRingValue", "lifeScore"].forEach(id => {
    const element = document.getElementById(id);
    if (!element) return;
    const target = Number(element.textContent);
    if (!Number.isFinite(target)) return;
    const start = performance.now();
    const duration = 520;
    const step = now => {
      const progress = Math.min(1, (now - start) / duration);
      element.textContent = Math.round(target * progress);
      if (progress < 1) requestAnimationFrame(step);
      else element.textContent = String(target);
    };
    requestAnimationFrame(step);
  });
}

function renderDailySummary() {
  const billTotal = state.expenses.filter(expense => expense.type === "Bill").reduce((sum, expense) => sum + cleanNumber(expense.amount), 0);
  const debtTotal = state.expenses.filter(expense => expense.type === "Debt Payment").reduce((sum, expense) => sum + cleanNumber(expense.amount), 0);
  const completedTasks = state.tasks.filter(task => task.done).length;
  const completedHabits = Object.values(state.checks).filter(Boolean).length;
  document.getElementById("dailyGreeting").textContent = "Good morning, Dallas.";
  renderSummaryCards("dashboardSummaryList", [
    { title: "Current Priority", value: state.profile.priority || "Set one priority", meta: "Main focus for today", className: "priority" },
    { title: "Emergency Fund", value: percent(savingsCompletion()), meta: `${money(cleanNumber(state.profile.currentSavings))} of ${money(cleanNumber(state.profile.emergencyTarget))}` },
    { title: "Savings Goal", value: money(cleanNumber(state.profile.savingsGoal)), meta: "Planned this month" },
    { title: "Income", value: money(cleanNumber(state.profile.income)), meta: "Monthly income" },
    { title: "Expenses", value: money(totalExpenses()), meta: `${money(billTotal)} bills - ${money(debtTotal)} debt` },
    { title: "Upcoming Payment", value: upcomingPayments(7)[0]?.name || "None soon", meta: upcomingPaymentText(), className: upcomingPayments(7)[0] ? "warning" : "" },
    { title: "Cash Flow", value: money(cashLeft()), meta: "Estimated remaining after savings" },
    { title: "Tasks", value: `${completedTasks}/${state.tasks.length}`, meta: "Completed today" },
    { title: "Habits", value: `${completedHabits}/${Object.keys(state.checks).length}`, meta: "Daily checks complete" },
    { title: "Workout Goal", value: percent(fitnessCompletion()), meta: `${state.profile.workoutsDone || 0} of ${state.profile.workoutGoal || 0} workouts` },
    { title: "Steps", value: cleanNumber(state.profile.stepsToday).toLocaleString(), meta: `${cleanNumber(state.profile.stepGoal).toLocaleString()} step goal` },
    { title: "Today XP", value: todayRewardPoints(), meta: nextRewardUnlock() },
    { title: "LifeOps Level", value: `Level ${rewardLevelInfo().level}`, meta: `${rewardLevelInfo().remaining} XP to next level` },
    { title: "Recommended Focus", value: "Next move", meta: recommendedDailyFocus(), className: "focus" }
  ]);
}

function renderCharts() {
  const expenseTotal = totalExpenses();
  const income = Number(state.profile.income || 0);
  const cashLeft = income - expenseTotal - Number(state.profile.savingsGoal || 0);
  const meals = mealTotals();
  const moneyRows = [
    ["Expenses", income ? (expenseTotal / income) * 100 : 0, money(expenseTotal)],
    ["Savings", income ? (Number(state.profile.savingsGoal || 0) / income) * 100 : 0, money(Number(state.profile.savingsGoal || 0))],
    ["Cash left", income ? (Math.max(0, cashLeft) / income) * 100 : 0, money(cashLeft)],
    ["Emergency fund", savingsCompletion(), percent(savingsCompletion())]
  ];
  const workoutMinutes = state.workouts.reduce((sum, workout) => sum + Number(workout.minutes || 0), 0);
  const fitnessRows = [
    ["Workouts", fitnessCompletion(), percent(fitnessCompletion())],
    ["Steps", stepsCompletion(), percent(stepsCompletion())],
    ["Workout min", Math.min(100, (workoutMinutes / 150) * 100), `${workoutMinutes}/150`]
  ];
  const foodRows = [
    ["Calories", macroCompletion(meals.calories, Number(state.profile.calorieGoal || 0)), `${meals.calories}/${state.profile.calorieGoal}`],
    ["Protein", macroCompletion(meals.protein, Number(state.profile.proteinGoal || 0)), `${meals.protein}g/${state.profile.proteinGoal}g`],
    ["Food cost", Number(state.profile.foodBudget || 0) ? (meals.cost / Number(state.profile.foodBudget || 0)) * 100 : 0, money(meals.cost)]
  ];
  const goalRows = [
    ["Goal average", goalCompletion(), percent(goalCompletion())],
    ["Health goals", areaGoalCompletion("Health"), percent(areaGoalCompletion("Health"))],
    ["Money goals", areaGoalCompletion("Money"), percent(areaGoalCompletion("Money"))]
  ];
  const wellnessRows = [
    ["Sleep", macroCompletion(cleanNumber(state.profile.sleepHours), cleanNumber(state.profile.sleepGoal, 1)), `${state.profile.sleepHours}/${state.profile.sleepGoal || 8}h`],
    ["Water", macroCompletion(Number(state.profile.waterCups || 0), Number(state.profile.waterGoal || 0)), `${state.profile.waterCups}/${state.profile.waterGoal}`],
    ["Stress", ((6 - Number(state.profile.stress || 0)) / 5) * 100, `${state.profile.stress}/5`],
    ["Energy", (Number(state.profile.energy || 0) / 5) * 100, `${state.profile.energy}/5`]
  ];
  renderBars("moneyChart", moneyRows);
  renderBars("fitnessChart", fitnessRows);
  renderBars("foodChart", foodRows);
  renderBars("wellnessChart", wellnessRows);
  renderBars("dashboardWellnessChart", wellnessRows);
  renderBars("goalChart", goalRows);
  renderInsights(cashLeft, meals);
}

function renderSmartFoodLog() {
  const select = document.getElementById("savedMealSelect");
  const selected = select.value;
  select.innerHTML = "";
  state.savedMeals.forEach(meal => {
    const option = document.createElement("option");
    option.value = meal.id;
    option.textContent = `${meal.name} (${meal.protein}g protein, ${money(meal.cost)})`;
    select.appendChild(option);
  });
  if (selected && state.savedMeals.some(meal => meal.id === selected)) select.value = selected;

  const remaining = remainingNutrition();
  renderTextRows("macroRemainingList", [
    ["Calories left", `${Math.max(0, Math.round(remaining.calories))} remaining`],
    ["Protein left", `${Math.max(0, Math.round(remaining.protein))}g remaining`],
    ["Food budget left", money(Math.max(0, remaining.foodBudget))]
  ]);

  const meals = mealTotals();
  renderBars("foodCostCompareChart", [
    ["Home", Number(state.profile.foodBudget || 0) ? (meals.homeCost / Number(state.profile.foodBudget || 0)) * 100 : 0, money(meals.homeCost)],
    ["Restaurant", Number(state.profile.foodBudget || 0) ? (meals.restaurantCost / Number(state.profile.foodBudget || 0)) * 100 : 0, money(meals.restaurantCost)],
    ["Budget used", Number(state.profile.foodBudget || 0) ? (meals.cost / Number(state.profile.foodBudget || 0)) * 100 : 0, percent(Number(state.profile.foodBudget || 0) ? (meals.cost / Number(state.profile.foodBudget || 0)) * 100 : 0)]
  ]);

  renderTextRows("mealSuggestionList", mealSuggestions());
}

function mealSuggestions() {
  const remaining = remainingNutrition();
  const meals = mealTotals();
  const budget = Number(state.profile.foodBudget || 0);
  const restaurantShare = meals.cost ? (meals.restaurantCost / meals.cost) * 100 : 0;
  const suggestions = [];
  if (remaining.protein > 25) {
    suggestions.push(["Protein gap", `You need about ${Math.round(remaining.protein)}g protein left. Try a saved high-protein home meal before adding restaurant cost.`]);
  }
  if (budget && meals.cost > budget * .75) {
    suggestions.push(["Budget watch", `Food spending has used ${percent((meals.cost / budget) * 100)} of the weekly budget.`]);
  }
  if (restaurantShare >= 35) {
    suggestions.push(["Restaurant pressure", `Restaurant meals are ${percent(restaurantShare)} of food cost. One home meal could improve both nutrition and money scores.`]);
  }
  if (remaining.calories < 0) {
    suggestions.push(["Calories over target", `Calories are ${Math.abs(Math.round(remaining.calories))} over target. Keep the next meal lighter and protein-focused.`]);
  }
  if (!suggestions.length) {
    suggestions.push(["On track", "Macros and food spending are balanced so far. Keep using saved meals to make logging faster."]);
  }
  return suggestions.slice(0, 4);
}

function renderScoreCards() {
  const categories = [
    ["Money Health", moneyHealthScore(), "Cash flow, savings, emergency fund"],
    ["Nutrition Health", nutritionHealthScore(), "Macros, protein, food budget"],
    ["Fitness Health", fitnessHealthScore(), "Workouts, steps, active minutes"],
    ["Wellness Health", wellnessHealthScore(), "Sleep, mood, stress, energy, water"],
    ["Goal Progress", goalCompletion(), "Long-term roadmap completion"],
    ["Overall LifeOps", lifeScore(), "Blended life operating score"]
  ];
  const grid = document.getElementById("scoreCategoryGrid");
  grid.innerHTML = "";
  categories.forEach(([name, score, caption]) => {
    const status = scoreStatus(score);
    const card = document.createElement("article");
    card.className = "metric score-card";
    card.innerHTML = `
      <div class="label"></div>
      <strong></strong>
      <span></span>
      <div class="${status.className}"></div>
      <div class="progress"><div></div></div>`;
    card.querySelector(".label").textContent = name;
    card.querySelector("strong").textContent = Math.round(score);
    card.querySelector("span").textContent = caption;
    card.querySelector(".status").textContent = `${status.arrow} ${status.label}`;
    card.querySelector(".progress div").style.width = percent(score);
    grid.appendChild(card);
  });
}

function renderRewards() {
  if (currentAppearance().gamificationEnabled === false) {
    document.getElementById("rewardLevel").textContent = "Off";
    document.getElementById("rewardLevelCaption").textContent = "Rewards are disabled in Settings.";
    document.getElementById("rewardLevelProgress").style.width = "0%";
    document.getElementById("rewardTodayXp").textContent = "0";
    document.getElementById("rewardTodayCaption").textContent = "Turn rewards back on to show XP.";
    document.getElementById("rewardStreak").textContent = "Off";
    document.getElementById("rewardStreakCaption").textContent = "Streak display is paused.";
    renderTextRows("rewardBreakdownList", [["Rewards disabled", "XP, levels, and achievements are optional and can be turned back on in Settings."]]);
    document.getElementById("rewardBadgeGrid").innerHTML = `<div class="empty">Achievements are hidden while rewards are disabled.</div>`;
    renderTextRows("rewardNextUnlockList", [["Optional system", "LifeOps does not punish missed days and does not use random rewards, paid XP, or loot boxes."]]);
    return;
  }
  const level = rewardLevelInfo();
  const streak = savedDayStreak();
  document.getElementById("rewardLevel").textContent = `Level ${level.level}`;
  document.getElementById("rewardLevelCaption").textContent = `${level.total} total XP. ${level.remaining} XP to Level ${level.level + 1}.`;
  document.getElementById("rewardLevelProgress").style.width = percent(level.progress);
  document.getElementById("rewardTodayXp").textContent = todayRewardPoints();
  document.getElementById("rewardTodayCaption").textContent = todayRewardPoints() ? "Earned from today's logged activity." : "Complete one action to start earning XP.";
  document.getElementById("rewardStreak").textContent = `${streak} day${streak === 1 ? "" : "s"}`;
  document.getElementById("rewardStreakCaption").textContent = streak ? "Saved days with steady LifeOps progress." : "Save snapshots to build a streak.";

  renderTextRows("rewardBreakdownList", rewardBreakdown().map(item => [
    item.title,
    `${item.done ? "+" : ""}${item.points} XP - ${item.meta}`
  ]));

  const badgeGrid = document.getElementById("rewardBadgeGrid");
  badgeGrid.innerHTML = "";
  rewardBadges().forEach(badge => {
    const card = document.createElement("article");
    card.className = `badge-card ${badge.unlocked ? "" : "locked"}`.trim();
    card.innerHTML = `
      <div class="pill"></div>
      <strong></strong>
      <span></span>`;
    card.querySelector(".pill").textContent = badge.unlocked ? "Unlocked" : "Locked";
    card.querySelector("strong").textContent = badge.title;
    card.querySelector("span").textContent = badge.meta;
    badgeGrid.appendChild(card);
  });

  renderTextRows("rewardNextUnlockList", [
    ["Next unlock", nextRewardUnlock()],
    ["Reward rule", "XP is based on logged habits, meals, workouts, tasks, savings progress, and weekly actions."]
  ]);
}

function weeklyReviewRows() {
  const meals = mealTotals();
  const variableExpenses = state.expenses.filter(expense => expense.type === "Variable");
  const biggestVariable = variableExpenses.reduce((top, expense) => Number(expense.amount || 0) > Number(top.amount || 0) ? expense : top, { name: "No variable expenses logged", amount: 0 });
  const scores = [
    ["Money", moneyHealthScore()],
    ["Nutrition", nutritionHealthScore()],
    ["Fitness", fitnessHealthScore()],
    ["Wellness", wellnessHealthScore()],
    ["Goals", goalCompletion()]
  ];
  const best = scores.reduce((top, item) => item[1] > top[1] ? item : top, scores[0]);
  const weakest = scores.reduce((low, item) => item[1] < low[1] ? item : low, scores[0]);
  return [
    ["Biggest win", `${best[0]} is the strongest area at ${Math.round(best[1])}.`],
    ["Biggest money leak", `${biggestVariable.name}: ${money(Number(biggestVariable.amount || 0))}. Food logged separately: ${money(meals.cost)}.`],
    ["Best health habit", fitnessCompletion() >= nutritionHealthScore() ? "Workout consistency is carrying health progress." : "Nutrition logging is creating useful visibility."],
    ["Weakest area", `${weakest[0]} needs the most attention at ${Math.round(weakest[1])}.`],
    ["Next week's focus", state.profile.tomorrowFocus || "Pick one money action and one health action to repeat all week."]
  ];
}

function dailyReviewRows() {
  const snapshot = currentSnapshot();
  const context = getAtlasContext();
  const top = evaluateAtlasPriorities(context)[0];
  const completedTasks = state.tasks.filter(task => task.done);
  const missedTasks = state.tasks.filter(task => !task.done);
  const meals = mealTotals();
  return [
    ["Completed priorities", completedTasks.length ? `${completedTasks.length} task${completedTasks.length === 1 ? "" : "s"} completed.` : "No completed tasks logged yet today."],
    ["Open priorities", missedTasks.length ? missedTasks.slice(0, 3).map(task => task.name).join("; ") : "No open tasks left."],
    ["Meals", `${state.meals.length} meal${state.meals.length === 1 ? "" : "s"} logged, ${Math.round(meals.protein)}g protein, ${money(meals.cost)} food cost.`],
    ["Workout", state.workouts.length ? `${state.workouts.length} workout record${state.workouts.length === 1 ? "" : "s"} logged.` : "No workout logged yet."],
    ["Spending", `${money(totalExpenses())} monthly expenses tracked. Cash flow estimate: ${money(cashLeft())}.`],
    ["Life Score change", scoreDeltaFromHistory().label],
    ["Recent win", recentWinText()],
    ["Tomorrow preview", state.profile.tomorrowFocus || top?.action || "Set one realistic next action before tomorrow."]
  ];
}

function monthlyReviewRows() {
  const history = recentHistory(30);
  const scoreAverage = Math.round(average(history.map(item => item.lifeScore)));
  const scoreTrend = trendDirection(history);
  const totalFood = history.reduce((sum, item) => sum + cleanNumber(item.foodCost), 0);
  const workoutsCompleted = state.workouts.length;
  const assignmentsDone = state.educationAssignments.filter(item => item.status === "Complete").length;
  const applicationsSubmitted = state.careerApplications.filter(item => item.status && item.status !== "Preparing").length;
  const advancedGoals = state.goals.filter(goal => cleanNumber(goal.progress) > 0).length;
  const milestones = (window.LifeOpsTimelineEngine?.allEvents(state) || state.timeline || [])
    .filter(item => !item.hidden && String(item.date || "").slice(0, 7) === todayKey().slice(0, 7));
  return [
    ["Major milestones", milestones.length ? `${milestones.length} milestone/event item${milestones.length === 1 ? "" : "s"} this month.` : "No milestones saved for this month yet."],
    ["Score trend", history.length ? `${scoreTrend}; average ${scoreAverage} across ${history.length} saved day${history.length === 1 ? "" : "s"}.` : "Save daily snapshots to build a monthly trend."],
    ["Money", `Estimated monthly cash flow is ${money(cashLeft())}. Emergency fund is ${percent(savingsCompletion())} funded.`],
    ["Food spending trend", history.length ? `${money(totalFood)} logged across saved snapshots.` : `${money(mealTotals().cost)} logged today.`],
    ["Workouts completed", `${workoutsCompleted} workout record${workoutsCompleted === 1 ? "" : "s"} in the current local log.`],
    ["Nutrition consistency", `${state.meals.length} meal${state.meals.length === 1 ? "" : "s"} logged. ${state.savedMeals.length} saved meal${state.savedMeals.length === 1 ? "" : "s"} available.`],
    ["Education", `${assignmentsDone} assignment${assignmentsDone === 1 ? "" : "s"} marked complete. ${state.educationAssignments.length} assignment${state.educationAssignments.length === 1 ? "" : "s"} tracked.`],
    ["Career", `${applicationsSubmitted} application item${applicationsSubmitted === 1 ? "" : "s"} beyond preparing. ${state.careerApplications.length} application${state.careerApplications.length === 1 ? "" : "s"} tracked.`],
    ["Goals advanced", `${advancedGoals} goal${advancedGoals === 1 ? "" : "s"} have visible progress.`]
  ];
}

function lifeReplayCards() {
  const history = recentHistory(30);
  const context = getAtlasContext();
  const monthly = monthlyReviewRows();
  return [
    ["Month title", new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })],
    ["Life Score trend", history.length ? `${trendDirection(history)} with ${history.length} saved snapshot${history.length === 1 ? "" : "s"}.` : "No saved snapshots yet."],
    ["Top achievement", recentWinText()],
    ["Money progress", `Emergency fund ${percent(savingsCompletion())}; cash flow ${money(cashLeft())}.`],
    ["Health progress", `Nutrition ${context.lifeScore.categoryScores.Nutrition || 0}, fitness ${context.lifeScore.categoryScores.Fitness || 0}, wellness ${context.lifeScore.categoryScores.Wellness || 0}.`],
    ["Education progress", monthly.find(row => row[0] === "Education")?.[1] || "No education records yet."],
    ["Career progress", monthly.find(row => row[0] === "Career")?.[1] || "No career records yet."],
    ["Goal progress", `${percent(goalCompletion())} average goal progress.`],
    ["Most consistent habit", missionProgress().complete ? `${missionProgress().complete}/${missionProgress().total} missions complete today.` : "Save snapshots and complete missions to find consistency."],
    ["Atlas closing message", evaluateAtlasPriorities(context)[0]?.action || "Add more LifeOps data so Atlas can close the replay with a grounded recommendation."]
  ];
}

function renderLifeReplayPreview() {
  const cards = lifeReplayCards();
  lifeReplayIndex = Math.max(0, Math.min(cards.length - 1, lifeReplayIndex));
  const current = cards[lifeReplayIndex];
  const stage = document.getElementById("lifeReplayStage");
  if (stage) {
    stage.innerHTML = `
      <div class="life-replay-card">
        <div class="life-replay-kicker"></div>
        <div class="life-replay-title"></div>
        <div class="life-replay-copy"></div>
      </div>`;
    stage.querySelector(".life-replay-kicker").textContent = `Card ${lifeReplayIndex + 1} of ${cards.length}`;
    stage.querySelector(".life-replay-title").textContent = current[0];
    stage.querySelector(".life-replay-copy").textContent = current[1];
  }
  const progress = document.getElementById("lifeReplayProgress");
  if (progress) progress.style.width = percent(((lifeReplayIndex + 1) / cards.length) * 100);
  renderTextRows("lifeReplayList", [
    [`Card ${lifeReplayIndex + 1} of ${cards.length}: ${current[0]}`, current[1]],
    ["Status", "Animated in-app story preview only. Video export is not implemented yet."],
    ["Privacy", "Sensitive values stay local and private by default."]
  ]);
}

function startLifeReplay() {
  pauseLifeReplay();
  const cards = lifeReplayCards();
  if (!cards.length) return;
  lifeReplayTimer = window.setInterval(() => {
    lifeReplayIndex = lifeReplayIndex >= cards.length - 1 ? 0 : lifeReplayIndex + 1;
    renderLifeReplayPreview();
  }, 2600);
}

function pauseLifeReplay() {
  if (lifeReplayTimer) {
    window.clearInterval(lifeReplayTimer);
    lifeReplayTimer = null;
  }
}

function renderSetupSummary() {
  renderTextRows("setupSummaryList", [
    ["Food budget", `${money(Number(state.profile.foodBudget || 0))} per week for logged meals.`],
    ["Macro targets", `${state.profile.calorieGoal || 0} calories, ${state.profile.proteinGoal || 0}g protein, ${state.profile.carbGoal || 0}g carbs, ${state.profile.fatGoal || 0}g fat.`],
    ["Savings goal", `${money(Number(state.profile.savingsGoal || 0))} planned monthly savings.`],
    ["Fitness goal", `${state.profile.workoutGoal || 0} workouts per week.`],
    ["Sleep goal", `${state.profile.sleepGoal || 8} hours per night.`]
  ]);
}

function renderWeeklyReview() {
  const reviewRows = weeklyReviewRows();
  renderTextRows("dailyReviewList", dailyReviewRows());
  renderTextRows("weeklyReviewList", reviewRows);
  renderTextRows("monthlyReviewList", monthlyReviewRows());
  renderLifeReplayPreview();
  renderTextRows("aiPreviewList", coachPreviewRows());
}

function coachPreviewRows() {
  const [weakArea, weakScore] = lowestScoreArea();
  const meals = mealTotals();
  const remaining = remainingNutrition();
  const budget = Number(state.profile.foodBudget || 0);
  const restaurantShare = meals.cost ? (meals.restaurantCost / meals.cost) * 100 : 0;
  const openActions = state.planActions.filter(action => !action.done);
  const nextAction = openActions.find(action => action.area === weakArea) || openActions.find(action => action.impact === "High") || openActions[0];
  const rows = [
    ["Coach readout", `${weakArea} is the lowest score at ${Math.round(weakScore)}. Focus there before adding more tracking.`],
    ["Next move", nextAction ? `${nextAction.name} (${nextAction.impact} impact).` : recommendedFallbackAction(weakArea)]
  ];

  if (remaining.protein > 0) {
    rows.push(["Nutrition cue", `You need about ${Math.round(remaining.protein)}g protein left today. A saved home meal can close the gap without overspending.`]);
  }
  if (budget && meals.cost > budget * .7) {
    rows.push(["Money cue", `Food spending has used ${percent((meals.cost / budget) * 100)} of the weekly food budget.`]);
  }
  if (restaurantShare >= 35) {
    rows.push(["Pattern", `Restaurant meals are ${percent(restaurantShare)} of food cost, so this habit affects both money and nutrition.`]);
  }
  if (Number(state.profile.sleepHours || 0) < 7) {
    rows.push(["Wellness cue", "Sleep is below 7 hours. Protecting sleep may improve energy, workouts, and food choices tomorrow."]);
  }
  rows.push(["Action plan", "Pick one money action, one health action, and one wellness action for the week. Keep it realistic enough to finish."]);
  return rows.slice(0, 6);
}

function scoreBreakdown() {
  return [
    ["Money", moneyHealthScore()],
    ["Nutrition", nutritionHealthScore()],
    ["Fitness", fitnessHealthScore()],
    ["Wellness", wellnessHealthScore()],
    ["Goals", goalCompletion()]
  ];
}

function todayKey() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function sortedHistory() {
  return [...state.history].sort((a, b) => a.date.localeCompare(b.date));
}

function recentHistory(days = 7) {
  return sortedHistory().slice(-days);
}

function trendHistoryForRange() {
  const input = document.getElementById("trendRangeInput");
  const range = input?.value || "7";
  const history = sortedHistory();
  const withCurrent = history.some(item => item.date === todayKey()) ? history : [...history, currentSnapshot()];
  if (range === "all") return withCurrent;
  return withCurrent.slice(-Number(range || 7));
}

function completedActionsCount() {
  return state.planActions.filter(action => action.done).length;
}

function currentSnapshot() {
  const meals = mealTotals();
  return {
    date: todayKey(),
    lifeScore: lifeScore(),
    money: moneyHealthScore(),
    nutrition: nutritionHealthScore(),
    fitness: fitnessHealthScore(),
    wellness: wellnessHealthScore(),
    goals: Math.round(goalCompletion()),
    calories: Math.round(meals.calories),
    protein: Math.round(meals.protein),
    foodCost: Number(meals.cost.toFixed(2)),
    sleep: Number(state.profile.sleepHours || 0),
    water: Number(state.profile.waterCups || 0),
    completedActions: completedActionsCount()
  };
}

function saveTodaySnapshot() {
  const snapshot = currentSnapshot();
  const withoutToday = state.history.filter(item => item.date !== snapshot.date);
  state.history = [...withoutToday, snapshot].sort((a, b) => a.date.localeCompare(b.date));
  save();
}

function average(values) {
  return values.length ? values.reduce((sum, value) => sum + Number(value || 0), 0) / values.length : 0;
}

function trendDirection(history) {
  if (history.length < 2) return "Not enough history";
  const firstHalf = history.slice(0, Math.ceil(history.length / 2));
  const secondHalf = history.slice(Math.floor(history.length / 2));
  const change = average(secondHalf.map(item => item.lifeScore)) - average(firstHalf.map(item => item.lifeScore));
  if (change >= 3) return "Improving";
  if (change <= -3) return "Slipping";
  return "Flat";
}

function renderHistory() {
  const history = recentHistory(7);
  const current = currentSnapshot();
  const best = history.reduce((top, item) => item.lifeScore > top.lifeScore ? item : top, history[0] || current);
  const weakest = history.reduce((low, item) => item.lifeScore < low.lifeScore ? item : low, history[0] || current);
  const averageScore = Math.round(average(history.map(item => item.lifeScore)));
  const direction = trendDirection(history);

  renderTextRows("historySummaryList", [
    ["Today snapshot", `${current.date}: LifeOps ${current.lifeScore}, ${current.calories} calories, ${current.protein}g protein, ${money(current.foodCost)} food cost.`],
    ["7-day average", history.length ? `${averageScore} across ${history.length} saved days.` : "No saved days yet."],
    ["Best day", best ? `${best.date}: ${best.lifeScore}` : "No history yet."],
    ["Weakest day", weakest ? `${weakest.date}: ${weakest.lifeScore}` : "No history yet."]
  ]);

  renderBars("historyTrendChart", history.map(item => [
    item.date.slice(5),
    item.lifeScore,
    String(item.lifeScore)
  ]));

  const latest = history[history.length - 1];
  const previous = history[history.length - 2];
  const delta = latest && previous ? latest.lifeScore - previous.lifeScore : 0;
  renderTextRows("historyDirectionList", [
    ["Direction", direction],
    ["Latest change", latest && previous ? `${delta >= 0 ? "+" : ""}${delta} from previous saved day.` : "Save at least two days to compare."],
    ["AI unlock", "History lets the coach explain what changed this week and what habits are moving the score."]
  ]);

  const list = document.getElementById("historyList");
  list.innerHTML = "";
  [...history].reverse().forEach(item => {
    const row = document.createElement("div");
    row.className = "item";
    row.innerHTML = `<div><div class="item-title"></div><div class="item-meta"></div></div>`;
    row.querySelector(".item-title").textContent = item.date;
    row.querySelector(".item-meta").textContent = `LifeOps ${item.lifeScore} - Food ${money(item.foodCost)} - Protein ${item.protein}g - Sleep ${item.sleep}h - Actions ${item.completedActions}`;
    list.appendChild(row);
  });
  if (!history.length) {
    const empty = document.createElement("div");
    empty.className = "empty";
    empty.textContent = "Save today's snapshot.";
    list.appendChild(empty);
  }
  renderTrendSystem();
}

function formatMetric(value, type = "number") {
  if (type === "money") return money(value);
  if (type === "percent") return percent(value);
  if (type === "hours") return `${Number(value || 0).toFixed(1)}h`;
  if (type === "grams") return `${Math.round(value || 0)}g`;
  return String(Math.round(value || 0));
}

function metricAverage(history, key) {
  return Math.round(average(history.map(item => Number(item[key] || 0))));
}

function renderColumnTrend(id, history, key, maxValue = 100) {
  const chart = document.getElementById(id);
  if (!chart) return;
  chart.innerHTML = "";
  if (!history.length) {
    chart.innerHTML = `<div class="empty">Save daily snapshots to build this chart.</div>`;
    return;
  }
  const values = history.map(item => Number(item[key] || 0));
  const scale = Math.max(maxValue, ...values, 1);
  history.forEach(item => {
    const value = Number(item[key] || 0);
    const column = document.createElement("div");
    column.className = "trend-column";
    column.innerHTML = `<div class="trend-column-bar" title=""></div><span class="trend-column-label"></span>`;
    column.querySelector(".trend-column-bar").style.height = percent((value / scale) * 100);
    column.querySelector(".trend-column-bar").title = `${item.date}: ${value}`;
    column.querySelector(".trend-column-label").textContent = item.date.slice(5);
    chart.appendChild(column);
  });
}

function renderTrendSystem() {
  const history = trendHistoryForRange();
  const latest = history[history.length - 1] || currentSnapshot();
  const previous = history[history.length - 2];
  renderColumnTrend("trendScoreChart", history, "lifeScore", 100);
  renderBars("trendNutritionChart", [
    ["Calories", latest.calories, `${Math.round(latest.calories || 0)}`],
    ["Protein", latest.protein, `${Math.round(latest.protein || 0)}g`],
    ["Nutrition", latest.nutrition, percent(latest.nutrition || 0)]
  ]);
  renderBars("trendMoneyChart", [
    ["Money score", latest.money, percent(latest.money || 0)],
    ["Food cost", state.profile.foodBudget ? (Number(latest.foodCost || 0) / Number(state.profile.foodBudget || 1)) * 100 : 0, money(latest.foodCost || 0)],
    ["Goals", latest.goals, percent(latest.goals || 0)]
  ]);
  renderBars("trendActivityChart", [
    ["Fitness", latest.fitness, percent(latest.fitness || 0)],
    ["Wellness", latest.wellness, percent(latest.wellness || 0)],
    ["Sleep", (Number(latest.sleep || 0) / Number(state.profile.sleepGoal || 8)) * 100, formatMetric(latest.sleep, "hours")],
    ["Water", (Number(latest.water || 0) / 8) * 100, `${Math.round(latest.water || 0)} cups`],
    ["Actions", Math.min(100, Number(latest.completedActions || 0) * 20), String(latest.completedActions || 0)]
  ]);
  const change = previous ? latest.lifeScore - previous.lifeScore : 0;
  renderTextRows("trendCompletenessList", [
    ["Current range", `${history.length} day${history.length === 1 ? "" : "s"} shown. Current snapshot is included for today if not saved yet.`],
    ["Life Score movement", previous ? `${change >= 0 ? "+" : ""}${change} from the previous point.` : "Save another day to compare movement."],
    ["Averages", `Score ${metricAverage(history, "lifeScore")}; protein ${formatMetric(metricAverage(history, "protein"), "grams")}; sleep ${formatMetric(average(history.map(item => item.sleep)), "hours")}.`]
  ]);
}

function lowestScoreArea() {
  return scoreBreakdown().reduce((low, item) => item[1] < low[1] ? item : low, scoreBreakdown()[0]);
}

function recommendedFallbackAction(area) {
  const actions = {
    Money: "Review variable expenses and move one small amount toward savings or debt.",
    Nutrition: "Plan one high-protein low-cost meal before the next restaurant purchase.",
    Fitness: "Schedule a 30 minute walk or workout before the day gets crowded.",
    Wellness: "Protect sleep tonight and log water, mood, stress, and energy tomorrow.",
    Goals: "Pick one long-term goal and define a 20 minute next step."
  };
  return actions[area] || "Choose one practical action that improves the weakest score area.";
}

function renderNextBestAction() {
  const [area, score] = lowestScoreArea();
  const openActions = state.planActions.filter(action => !action.done);
  const matching = openActions.find(action => action.area === area) || openActions.find(action => action.impact === "High") || openActions[0];
  const rows = matching ? [
    ["Weakest area", `${area} is currently lowest at ${Math.round(score)}.`],
    ["Recommended action", matching.name],
    ["Why it matters", `${matching.impact} impact for ${matching.area}${matching.goal ? `, linked to ${matching.goal}` : ""}.`],
    ["Deadline", matching.deadline || "No deadline set"]
  ] : [
    ["Weakest area", `${area} is currently lowest at ${Math.round(score)}.`],
    ["Recommended action", recommendedFallbackAction(area)],
    ["Why it matters", "Add this to the Plan tab so it can be tracked and reviewed."],
    ["Deadline", "Set one for this week"]
  ];
  renderTextRows("nextActionList", rows);
}

function nextBestActionText() {
  const [area, score] = lowestScoreArea();
  const openActions = state.planActions.filter(action => !action.done);
  const matching = openActions.find(action => action.area === area) || openActions.find(action => action.impact === "High") || openActions[0];
  if (matching) {
    return `${matching.name} (${matching.impact} impact for ${matching.area}; weakest area is ${area} at ${Math.round(score)}).`;
  }
  return `${recommendedFallbackAction(area)} Weakest area is ${area} at ${Math.round(score)}.`;
}

function atlasTimingText(days) {
  if (days === 0) return "due today";
  if (days === 1) return "due tomorrow";
  return `due in ${days} days`;
}

function atlasPrioritySignals() {
  const signals = [];
  const [weakArea, weakScore] = lowestScoreArea();
  const meals = mealTotals();
  const remaining = remainingNutrition();
  const cash = cashLeft();
  const addSignal = signal => signals.push({
    severity: 3,
    category: "Goals",
    tab: "goals",
    estimate: "10-20 minutes",
    impacts: ["Life Score", "Goal Progress"],
    ...signal
  });

  if (cash < 0) {
    addSignal({
      severity: 10,
      title: "Cash flow needs attention",
      meta: "Monthly expenses and planned savings are above income.",
      category: "Finance",
      tab: "money",
      action: "Review expenses before adding new spending.",
      reason: "Finance is a high leverage area because negative cash flow can pressure savings, bills, and debt payoff.",
      estimate: "10 minutes",
      impacts: ["Finance", "Cash Flow", "Bills"]
    });
  }

  const payment = upcomingPayments(7)[0];
  if (payment) {
    addSignal({
      severity: payment.daysUntil <= 1 ? 9 : 7,
      title: `${payment.name} is ${atlasTimingText(payment.daysUntil)}`,
      meta: "Upcoming bill or debt payment from your local expense list.",
      category: "Finance",
      tab: "money",
      action: "Confirm the payment plan and protect cash.",
      reason: "Upcoming obligations should be visible before spending, saving, or goal decisions.",
      estimate: "5 minutes",
      impacts: ["Finance", "Upcoming", "Cash Flow"]
    });
  }

  if (cleanNumber(state.profile.currentSavings) < cleanNumber(state.profile.emergencyTarget)) {
    addSignal({
      severity: 6,
      title: "Emergency fund is below target",
      meta: `${percent(savingsCompletion())} of target saved.`,
      category: "Finance",
      tab: "money",
      action: "Choose one small cash protection move this week.",
      reason: "Emergency savings supports stability across money, planning, and stress.",
      estimate: "10 minutes",
      impacts: ["Finance", "Wellness", "Goal Progress"]
    });
  }

  if (cleanNumber(state.profile.proteinGoal) && remaining.protein > 0) {
    addSignal({
      severity: remaining.protein > 40 ? 7 : 5,
      title: "Protein target still has room",
      meta: `${Math.max(0, Math.round(remaining.protein))}g protein left today.`,
      category: "Nutrition",
      tab: "food",
      action: "Log or plan one high-protein meal that fits the food budget.",
      reason: "Nutrition is connected to fitness progress and food cost visibility.",
      estimate: "5-15 minutes",
      impacts: ["Nutrition", "Fitness", "Food Budget"]
    });
  }

  if (cleanNumber(state.profile.foodBudget) && remaining.foodBudget < 0) {
    addSignal({
      severity: 8,
      title: "Food budget is over plan",
      meta: "Logged food cost is above the weekly target.",
      category: "Nutrition",
      tab: "food",
      action: "Compare restaurant cost against home meal options.",
      reason: "Food choices can affect both budget health and macro progress.",
      estimate: "10 minutes",
      impacts: ["Nutrition", "Finance", "Planning"]
    });
  }

  if (fitnessCompletion() < 100) {
    addSignal({
      severity: state.workouts.length ? 4 : 6,
      title: "Workout goal is not complete yet",
      meta: `${state.profile.workoutsDone || 0} of ${state.profile.workoutGoal || 0} workouts logged.`,
      category: "Fitness",
      tab: "fitness",
      action: "Schedule or log one practical workout.",
      reason: "Workout consistency improves the health side of the Life Score.",
      estimate: "20-30 minutes",
      impacts: ["Fitness", "Wellness", "Life Score"]
    });
  }

  if (cleanNumber(state.profile.sleepGoal) && cleanNumber(state.profile.sleepHours) < cleanNumber(state.profile.sleepGoal)) {
    addSignal({
      severity: 5,
      title: "Sleep is below target",
      meta: `${cleanNumber(state.profile.sleepHours)}h logged against a ${cleanNumber(state.profile.sleepGoal)}h goal.`,
      category: "Wellness",
      tab: "wellness",
      action: "Protect tonight's sleep window and log energy tomorrow.",
      reason: "Sleep can influence stress, energy, workouts, and daily follow-through.",
      estimate: "5 minutes",
      impacts: ["Wellness", "Fitness", "Focus"]
    });
  }

  const openAction = state.planActions
    .filter(action => !action.done)
    .sort((a, b) => (a.impact === "High" ? -1 : 0) - (b.impact === "High" ? -1 : 0))[0];
  if (openAction) {
    addSignal({
      severity: openAction.impact === "High" ? 7 : 4,
      title: openAction.name,
      meta: `${openAction.impact || "Normal"} impact weekly action${openAction.deadline ? `, due ${openAction.deadline}` : ""}.`,
      category: openAction.area || "Goals",
      tab: "goals",
      action: "Open Goals and complete the next action step.",
      reason: "Open weekly actions turn long-term goals into trackable progress.",
      estimate: "15-25 minutes",
      impacts: [openAction.area || "Goals", "Goal Progress", "Weekly Review"]
    });
  }

  const educationItem = [...state.educationAssignments.map(item => ({ title: item.title, date: item.dueDate, kind: "assignment" })), ...state.educationExams.map(item => ({ title: item.title, date: item.date, kind: "exam" }))]
    .filter(item => daysUntil(item.date) !== null && daysUntil(item.date) >= 0 && daysUntil(item.date) <= 7)
    .sort((a, b) => daysUntil(a.date) - daysUntil(b.date))[0];
  if (educationItem) {
    addSignal({
      severity: daysUntil(educationItem.date) <= 1 ? 8 : 6,
      title: `${educationItem.title} is ${atlasTimingText(daysUntil(educationItem.date))}`,
      meta: `Education ${educationItem.kind} from your local tracker.`,
      category: "Education",
      tab: "education",
      action: "Open Education and prepare the next deliverable.",
      reason: "Education deadlines are time-sensitive and should shape today's focus.",
      estimate: "20 minutes",
      impacts: ["Education", "Calendar", "Goals"]
    });
  }

  const careerItem = [...state.careerInterviews.map(item => ({ title: `${item.company} interview`, date: item.date, kind: "interview" })), ...state.careerApplications.filter(item => item.followUpDate).map(item => ({ title: `${item.company} follow-up`, date: item.followUpDate, kind: "follow-up" }))]
    .filter(item => daysUntil(item.date) !== null && daysUntil(item.date) >= 0 && daysUntil(item.date) <= 7)
    .sort((a, b) => daysUntil(a.date) - daysUntil(b.date))[0];
  if (careerItem) {
    addSignal({
      severity: daysUntil(careerItem.date) <= 1 ? 8 : 6,
      title: `${careerItem.title} is ${atlasTimingText(daysUntil(careerItem.date))}`,
      meta: `Career ${careerItem.kind} from your local tracker.`,
      category: "Career",
      tab: "career",
      action: "Open Career and prepare the next follow-up.",
      reason: "Career dates are high leverage because preparation compounds before the event.",
      estimate: "15-30 minutes",
      impacts: ["Career", "Calendar", "Growth"]
    });
  }

  const calendarItem = state.calendarEvents
    .filter(item => daysUntil(item.date) !== null && daysUntil(item.date) >= 0 && daysUntil(item.date) <= 3)
    .sort((a, b) => daysUntil(a.date) - daysUntil(b.date))[0];
  if (calendarItem) {
    addSignal({
      severity: daysUntil(calendarItem.date) <= 1 ? 6 : 4,
      title: `${calendarItem.title} is ${atlasTimingText(daysUntil(calendarItem.date))}`,
      meta: "Manual LifeOps calendar event.",
      category: "Calendar",
      tab: "calendar",
      action: "Open Calendar and confirm what needs preparation.",
      reason: "Near-term calendar items should shape today's plan.",
      estimate: "5 minutes",
      impacts: ["Calendar", "Planning", "Focus"]
    });
  }

  addSignal({
    severity: Math.round((100 - weakScore) / 15),
    title: `${weakArea} is the lowest score area`,
    meta: `${weakArea} is currently ${Math.round(weakScore)} out of 100.`,
    category: weakArea,
    tab: weakArea === "Money" ? "money" : weakArea === "Nutrition" ? "food" : weakArea === "Fitness" ? "fitness" : weakArea === "Wellness" ? "wellness" : "goals",
    action: recommendedFallbackAction(weakArea),
    reason: "Atlas prioritizes the lowest score area when no urgent deadline is stronger.",
    estimate: "10-20 minutes",
    impacts: [weakArea, "Life Score", "Daily Focus"]
  });

  if (state.documents.some(doc => doc.sensitivity === "Sensitive" && doc.privacy !== "Private")) {
    addSignal({
      severity: 8,
      title: "Sensitive document privacy needs review",
      meta: "One or more document references are marked sensitive but not private.",
      category: "Documents",
      tab: "documents",
      action: "Open Documents and review privacy labels.",
      reason: "Sensitive information should stay hidden from social, voice, and public export surfaces by default.",
      estimate: "5 minutes",
      impacts: ["Privacy", "Documents", "Trust"]
    });
  }

  return signals.sort((a, b) => b.severity - a.severity).slice(0, 8);
}

function atlasRecommendation() {
  const context = getAtlasContext();
  const decision = currentAtlasDecision(context);
  if (decision?.topAction) {
    const top = decision.topAction;
    return {
      score: lifeScore(),
      status: scoreStatus(lifeScore()),
      scoreChange: scoreChangeFromHistory(),
      weakArea: context.lifeScore.weakestArea,
      weakScore: context.lifeScore.weakestScore,
      priorities: [top, ...(decision.alternatives || [])].slice(0, 3).map(item => ({
        title: item.title,
        meta: `${Math.round(item.atlasScore || 0)} decision score`,
        category: item.category,
        tab: item.navigationTarget,
        action: item.title,
        reason: item.description,
        estimate: `${item.estimatedMinutes} minutes`,
        impacts: [item.category, item.expectedOutcome].filter(Boolean)
      })),
      action: top.title,
      category: top.category,
      tab: top.navigationTarget || "dashboard",
      estimate: `${top.estimatedMinutes} minutes`,
      impacts: [top.category, top.expectedOutcome].filter(Boolean),
      reason: decision.explanation?.whyNow || top.description,
      title: top.title
    };
  }
  const signals = atlasPrioritySignals();
  const primary = signals[0];
  const score = lifeScore();
  const status = scoreStatus(score);
  const scoreChange = scoreChangeFromHistory();
  const [weakArea, weakScore] = lowestScoreArea();
  return {
    score,
    status,
    scoreChange,
    weakArea,
    weakScore,
    priorities: signals.slice(0, 3),
    action: primary?.action || nextBestActionText(),
    category: primary?.category || weakArea,
    tab: primary?.tab || "dashboard",
    estimate: primary?.estimate || "10-20 minutes",
    impacts: primary?.impacts || [weakArea, "Life Score", "Daily Focus"],
    reason: primary?.reason || `${weakArea} is the lowest score area at ${Math.round(weakScore)}.`,
    title: primary?.title || "Choose one practical action for today."
  };
}

function renderAtlasDashboard() {
  const atlas = atlasRecommendation();
  const setText = (id, text) => {
    const element = document.getElementById(id);
    if (element) element.textContent = text;
  };
  setText("atlasRecommendedAction", atlas.action);
  setText("atlasEstimatedTime", atlas.estimate);
  setText("atlasReason", atlas.reason);
  setText("atlasLifeScoreDelta", `${atlas.score}/100 - ${atlas.scoreChange.text}`);
  setText("atlasWeakSignal", `${atlas.weakArea} ${Math.round(atlas.weakScore)}`);
  const status = document.getElementById("atlasStatusPill");
  if (status) {
    status.textContent = `${atlas.category} focus`;
    status.className = atlas.status.className;
  }
  const impactList = document.getElementById("atlasImpactList");
  if (impactList) {
    impactList.innerHTML = "";
    atlas.impacts.slice(0, 4).forEach(impact => {
      const pill = document.createElement("span");
      pill.className = "pill";
      pill.textContent = impact;
      impactList.appendChild(pill);
    });
  }
  const list = document.getElementById("atlasPriorityList");
  if (list) {
    list.innerHTML = "";
    atlas.priorities.forEach((item, index) => {
      const row = document.createElement("div");
      row.className = "atlas-priority-item";
      const rank = document.createElement("div");
      rank.className = "atlas-priority-rank";
      rank.textContent = index + 1;
      const content = document.createElement("div");
      const title = document.createElement("strong");
      title.textContent = item.title;
      const meta = document.createElement("span");
      meta.textContent = `${item.category} - ${item.meta}`;
      content.append(title, meta);
      row.append(rank, content);
      list.appendChild(row);
    });
  }
  const startButton = document.getElementById("atlasStartTaskBtn");
  if (startButton) startButton.dataset.openAtlasTab = atlas.tab;
}

function atlasPageInsight(primary, tab) {
  const atlas = atlasRecommendation();
  const insights = {
    dashboard: `Highest leverage now: ${atlas.action} Reason: ${atlas.reason}`,
    money: cashLeft() < 0 ? "Finance needs attention: expenses and planned savings are above income. Review bills, debt payments, and variable spending first." : `Finance is stable enough to review goals. Emergency fund progress is ${percent(savingsCompletion())}.`,
    health: `Health signal: ${Math.round(mealTotals().protein)}g protein logged, ${percent(fitnessCompletion())} workout progress, and ${cleanNumber(state.profile.sleepHours)}h sleep logged.`,
    education: state.educationAssignments.length ? "Education is tracking real deadlines. Check the soonest assignment or exam before adding new learning goals." : "Education is ready for a first course, certification, assignment, or learning goal.",
    career: state.careerApplications.length ? "Career is tracking applications and follow-ups. Prepare the next dated interview or follow-up first." : "Career is ready for a first application, skill target, or portfolio milestone.",
    goals: `Growth focus: ${state.planActions.filter(action => !action.done).length} weekly actions are still open. Complete the highest impact action first.`,
    calendar: homeUpcomingItems().length ? "Calendar is showing near-term items from bills, goals, and LifeOps events. Use it to choose today's focus." : "Calendar has no urgent local items. Add dated goals, bills, or plans to improve planning.",
    documents: "Documents stay local in this version. Review privacy and sensitivity labels before using reports or sharing previews.",
    settings: "Settings control personalization, appearance, voice, startup, data, and privacy without changing your saved LifeOps data.",
    modules: "Modules can be hidden from navigation without deleting saved data. Keep Version 1 focused on the areas you actually use.",
    more: "More contains utilities, reports, privacy, integrations, and prototypes. Planned integrations are clearly marked until real authentication exists."
  };
  return insights[primary] || insights[tab] || insights.dashboard;
}

function weeklyReviewReportText() {
  const scores = scoreBreakdown();
  const strongest = scores.reduce((top, item) => item[1] > top[1] ? item : top, scores[0]);
  const weakest = scores.reduce((low, item) => item[1] < low[1] ? item : low, scores[0]);
  const meals = mealTotals();
  const remaining = remainingNutrition();
  const budget = Number(state.profile.foodBudget || 0);
  const foodBudgetStatus = budget
    ? `${money(Math.max(0, remaining.foodBudget))} left of ${money(budget)} weekly budget; ${money(meals.cost)} logged.`
    : `${money(meals.cost)} logged; no weekly food budget set.`;
  const proteinStatus = `${Math.round(meals.protein)}g logged of ${state.profile.proteinGoal || 0}g target; ${Math.max(0, Math.round(remaining.protein))}g left.`;
  const lines = [
    "LifeOps Weekly Review",
    `Generated: ${new Date().toLocaleString()}`,
    "",
    `LifeOps score: ${lifeScore()}/100`,
    `Strongest area: ${strongest[0]} (${Math.round(strongest[1])})`,
    `Weakest area: ${weakest[0]} (${Math.round(weakest[1])})`,
    `Food budget status: ${foodBudgetStatus}`,
    `Protein status: ${proteinStatus}`,
    `Next best action: ${nextBestActionText()}`,
    "",
    "Weekly Review"
  ];
  weeklyReviewRows().forEach(([title, text]) => lines.push(`- ${title}: ${text}`));
  lines.push("", "AI Coach Preview");
  coachPreviewRows().forEach(([title, text]) => lines.push(`- ${title}: ${text}`));
  return lines.join("\n");
}

function dailySnapshotReportText() {
  const snapshot = currentSnapshot();
  return [
    "LifeOps Daily Snapshot",
    `Generated: ${new Date().toLocaleString()}`,
    "",
    `Date: ${snapshot.date}`,
    `LifeOps score: ${snapshot.lifeScore}/100`,
    `Money Health: ${snapshot.money}`,
    `Nutrition Health: ${snapshot.nutrition}`,
    `Fitness Health: ${snapshot.fitness}`,
    `Wellness Health: ${snapshot.wellness}`,
    `Goal Progress: ${snapshot.goals}`,
    "",
    `Calories: ${snapshot.calories}`,
    `Protein: ${snapshot.protein}g`,
    `Food cost: ${money(snapshot.foodCost)}`,
    `Sleep: ${snapshot.sleep} hours`,
    `Water: ${snapshot.water} cups`,
    `Completed actions: ${snapshot.completedActions}`,
    "",
    `Next best action: ${nextBestActionText()}`
  ].join("\n");
}

function portfolioSummaryReportText() {
  return [
    "LifeOps Portfolio Summary",
    `Generated: ${new Date().toLocaleString()}`,
    "",
    "Problem",
    "People make food, money, fitness, and wellness decisions in separate tools, so tradeoffs are easy to miss.",
    "",
    "Solution",
    "LifeOps combines daily targets, category health scores, history, reports, and coach-style actions in one dashboard.",
    "",
    "Features",
    "- Onboarding profile setup",
    "- Money, food, fitness, wellness, goals, and action tracking",
    "- LifeOps score and category health cards",
    "- Daily history and weekly review",
    "- Report exports and rule-based AI coach preview",
    "",
    "Skills demonstrated",
    "Dashboard UX, KPI design, state management, local storage, report generation, product positioning, and practical business analysis.",
    "",
    "Future roadmap",
    "Real AI coaching, richer trend analysis, account integrations, meal database improvements, and polished PDF exports."
  ].join("\n");
}

function reportTextByType(type) {
  if (type === "daily") return dailySnapshotReportText();
  if (type === "portfolio") return portfolioSummaryReportText();
  return weeklyReviewReportText();
}

function reportFilename(type) {
  const date = new Date().toISOString().slice(0, 10);
  if (type === "daily") return `lifeops-daily-snapshot-${date}.txt`;
  if (type === "portfolio") return `lifeops-portfolio-summary-${date}.txt`;
  return `lifeops-weekly-review-${date}.txt`;
}

function renderReportPreview() {
  const select = document.getElementById("reportTypeInput");
  if (!select) return;
  const type = select.value;
  document.getElementById("reportPreview").textContent = reportTextByType(type);
  renderTextRows("reportSummaryList", [
    ["Weekly Review", "Best for a weekly check-in or accountability summary."],
    ["Daily Snapshot", "Best for saving one day of score, macro, cost, sleep, and action data."],
    ["Portfolio Summary", "Best for explaining this project in an interview or portfolio walkthrough."]
  ]);
}

function coachRowsForQuestion(question) {
  return atlasLocalRowsForQuestion(question, getAtlasContext());
}

function renderCoachAnswer() {
  const input = document.getElementById("coachQuestionInput");
  if (!input) return;
  sendCompanionMessage(input.value || "What should I focus on this week?");
  input.value = "";
}

function downloadText(filename, text) {
  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function validateBackupData(data) {
  return window.LifeOpsStorage.validateImportData(data, { defaultState, mergeState, sanitizeState });
}

function sanitizeState(nextState) {
  nextState.schemaVersion = window.LifeOpsStorage?.CURRENT_SCHEMA_VERSION || 1;
  const numericProfileKeys = [
    "income", "savingsGoal", "currentSavings", "emergencyTarget", "workoutGoal", "workoutsDone",
    "stepGoal", "stepsToday", "calorieGoal", "proteinGoal", "carbGoal", "fatGoal", "foodBudget",
    "waterGoal", "sleepGoal", "sleepHours", "waterCups", "mood", "stress", "energy"
  ];
  numericProfileKeys.forEach(key => {
    nextState.profile[key] = cleanNumber(nextState.profile[key]);
  });
  nextState.goals.forEach(goal => {
    goal.progress = cleanNumber(goal.progress, 0, 100);
  });
  nextState.expenses.forEach(expense => {
    expense.amount = cleanNumber(expense.amount);
    expense.dueDate = expense.dueDate || "";
  });
  if (window.LifeOpsTimelineNormalization) {
    nextState.timeline = window.LifeOpsTimelineNormalization.normalizeEvents(nextState.timeline || []);
    nextState.timelineProposals = window.LifeOpsTimelineNormalization
      .normalizeEvents(nextState.timelineProposals || [])
      .filter(item => ["proposed", "rejected", "confirmed"].includes(item.status))
      .slice(-75);
  } else {
    nextState.timeline.forEach(item => {
      item.id = item.id || crypto.randomUUID();
      item.title = String(item.title || "Untitled milestone").trim().slice(0, 80) || "Untitled milestone";
      item.date = String(item.date || todayKey()).slice(0, 10);
      item.category = ["Money", "Health", "Career", "Education", "Goals", "Relationships", "Personal"].includes(item.category) ? item.category : "Personal";
      item.note = String(item.note || "").trim().slice(0, 240);
      item.relatedGoal = String(item.relatedGoal || "").trim().slice(0, 80);
      item.privacy = ["Private", "Shared with selected people", "Shared with a group"].includes(item.privacy) ? item.privacy : "Private";
    });
    nextState.timelineProposals = Array.isArray(nextState.timelineProposals) ? nextState.timelineProposals : [];
  }
  const sharingChoices = ["Only me", "Selected people", "Group", "Everyone in household"];
  const relationshipTypes = ["Family", "Partner", "Friend", "Accountability partner", "Coach", "Other"];
  nextState.connections.forEach(connection => {
    connection.connectionId = connection.connectionId || connection.id || crypto.randomUUID();
    connection.displayName = String(connection.displayName || "Local connection").trim().slice(0, 60) || "Local connection";
    connection.relationshipType = relationshipTypes.includes(connection.relationshipType) ? connection.relationshipType : "Other";
    connection.groupIds = Array.isArray(connection.groupIds) ? connection.groupIds : [];
    connection.sharedGoalIds = Array.isArray(connection.sharedGoalIds) ? connection.sharedGoalIds : [];
    connection.sharedListIds = Array.isArray(connection.sharedListIds) ? connection.sharedListIds : [];
    connection.sharedChallengeIds = Array.isArray(connection.sharedChallengeIds) ? connection.sharedChallengeIds : [];
    connection.status = String(connection.status || "Prototype").trim().slice(0, 32) || "Prototype";
    connection.createdAt = String(connection.createdAt || todayKey()).slice(0, 10);
    connection.lastSyncedAt = "";
    const permissions = connection.permissions || {};
    connection.permissions = {
      view: sharingChoices.includes(permissions.view) ? permissions.view : "Only me",
      edit: sharingChoices.includes(permissions.edit) ? permissions.edit : "Only me",
      comment: sharingChoices.includes(permissions.comment) ? permissions.comment : "Only me",
      hidden: String(permissions.hidden || "Sensitive details").trim().slice(0, 140) || "Sensitive details"
    };
  });
  nextState.connectionGroups.forEach(group => {
    group.id = group.id || crypto.randomUUID();
    group.name = String(group.name || "Local group").trim().slice(0, 60) || "Local group";
    group.description = String(group.description || "").trim().slice(0, 160);
    group.memberIds = Array.isArray(group.memberIds) ? group.memberIds : [];
    group.privacy = sharingChoices.includes(group.privacy) ? group.privacy : "Only me";
  });
  nextState.sharedLists.forEach(list => {
    list.id = list.id || crypto.randomUUID();
    list.name = String(list.name || "Shared list").trim().slice(0, 60) || "Shared list";
    list.category = String(list.category || "Household").trim().slice(0, 40) || "Household";
    list.items = Array.isArray(list.items) ? list.items.map(item => String(item).trim().slice(0, 60)).filter(Boolean).slice(0, 8) : [];
    list.privacy = sharingChoices.includes(list.privacy) ? list.privacy : "Only me";
    list.connectionIds = Array.isArray(list.connectionIds) ? list.connectionIds : [];
    list.groupIds = Array.isArray(list.groupIds) ? list.groupIds : [];
  });
  nextState.sharedGoals.forEach(goal => {
    goal.id = goal.id || crypto.randomUUID();
    goal.name = String(goal.name || "Shared goal").trim().slice(0, 60) || "Shared goal";
    goal.category = String(goal.category || "Goals").trim().slice(0, 40) || "Goals";
    goal.progress = cleanNumber(goal.progress, 0, 100);
    goal.privacy = sharingChoices.includes(goal.privacy) ? goal.privacy : "Only me";
    goal.connectionIds = Array.isArray(goal.connectionIds) ? goal.connectionIds : [];
    goal.groupIds = Array.isArray(goal.groupIds) ? goal.groupIds : [];
  });
  nextState.sharedChallenges.forEach(challenge => {
    challenge.id = challenge.id || crypto.randomUUID();
    challenge.name = String(challenge.name || "Shared challenge").trim().slice(0, 60) || "Shared challenge";
    challenge.category = String(challenge.category || "Wellness").trim().slice(0, 40) || "Wellness";
    challenge.target = String(challenge.target || "Complete the challenge").trim().slice(0, 100);
    challenge.progress = cleanNumber(challenge.progress, 0, 100);
    challenge.privacy = sharingChoices.includes(challenge.privacy) ? challenge.privacy : "Only me";
    challenge.connectionIds = Array.isArray(challenge.connectionIds) ? challenge.connectionIds : [];
    challenge.groupIds = Array.isArray(challenge.groupIds) ? challenge.groupIds : [];
  });
  nextState.sharedPlans.forEach(plan => {
    plan.id = plan.id || crypto.randomUUID();
    plan.title = String(plan.title || "Shared plan").trim().slice(0, 60) || "Shared plan";
    plan.date = String(plan.date || todayKey()).slice(0, 10);
    plan.category = String(plan.category || "Personal").trim().slice(0, 40) || "Personal";
    plan.privacy = sharingChoices.includes(plan.privacy) ? plan.privacy : "Only me";
    plan.note = String(plan.note || "").trim().slice(0, 160);
  });
  const privacyClasses = ["Private", "Personal", "Shared", "Sensitive"];
  const educationStatuses = ["Not started", "In progress", "Complete", "Paused"];
  nextState.educationCourses.forEach(course => {
    course.id = course.id || crypto.randomUUID();
    course.name = String(course.name || "Course").trim().slice(0, 80) || "Course";
    course.code = String(course.code || "").trim().slice(0, 24);
    course.instructor = String(course.instructor || "").trim().slice(0, 60);
    course.credits = cleanNumber(course.credits, 0, 24);
    course.term = String(course.term || "").trim().slice(0, 40);
    course.startDate = String(course.startDate || "").slice(0, 10);
    course.endDate = String(course.endDate || "").slice(0, 10);
    course.method = String(course.method || "Independent study").trim().slice(0, 40);
    course.grade = String(course.grade || "").trim().slice(0, 12);
    course.status = educationStatuses.includes(course.status) ? course.status : "In progress";
    course.privacy = privacyClasses.includes(course.privacy) ? course.privacy : "Private";
    course.notes = String(course.notes || "").trim().slice(0, 180);
  });
  nextState.educationAssignments.forEach(item => {
    item.id = item.id || crypto.randomUUID();
    item.title = String(item.title || "Assignment").trim().slice(0, 80) || "Assignment";
    item.course = String(item.course || "").trim().slice(0, 80);
    item.dueDate = String(item.dueDate || "").slice(0, 10);
    item.priority = ["Low", "Medium", "High"].includes(item.priority) ? item.priority : "Medium";
    item.status = educationStatuses.includes(item.status) ? item.status : "Not started";
    item.privacy = privacyClasses.includes(item.privacy) ? item.privacy : "Private";
    item.notes = String(item.notes || "").trim().slice(0, 180);
  });
  nextState.educationExams.forEach(item => {
    item.id = item.id || crypto.randomUUID();
    item.title = String(item.title || "Exam").trim().slice(0, 80) || "Exam";
    item.course = String(item.course || "").trim().slice(0, 80);
    item.date = String(item.date || "").slice(0, 10);
    item.priority = ["Low", "Medium", "High"].includes(item.priority) ? item.priority : "Medium";
    item.status = educationStatuses.includes(item.status) ? item.status : "Not started";
    item.privacy = privacyClasses.includes(item.privacy) ? item.privacy : "Private";
    item.notes = String(item.notes || "").trim().slice(0, 180);
  });
  nextState.educationGoals.forEach(goal => {
    goal.id = goal.id || crypto.randomUUID();
    goal.title = String(goal.title || "Learning goal").trim().slice(0, 80) || "Learning goal";
    goal.category = String(goal.category || "Learning").trim().slice(0, 40);
    goal.targetDate = String(goal.targetDate || "").slice(0, 10);
    goal.progress = cleanNumber(goal.progress, 0, 100);
    goal.privacy = privacyClasses.includes(goal.privacy) ? goal.privacy : "Private";
    goal.notes = String(goal.notes || "").trim().slice(0, 180);
  });
  nextState.educationCosts.forEach(cost => {
    cost.id = cost.id || crypto.randomUUID();
    cost.title = String(cost.title || "Education cost").trim().slice(0, 80) || "Education cost";
    cost.category = String(cost.category || "Tuition").trim().slice(0, 40);
    cost.amount = cleanNumber(cost.amount);
    cost.date = String(cost.date || "").slice(0, 10);
    cost.privacy = privacyClasses.includes(cost.privacy) ? cost.privacy : "Private";
    cost.notes = String(cost.notes || "").trim().slice(0, 180);
  });
  const appStatuses = ["Saved", "Applied", "Interviewing", "Offer", "Rejected", "Paused", "Preparing"];
  nextState.careerApplications.forEach(app => {
    app.id = app.id || crypto.randomUUID();
    app.company = String(app.company || "Company").trim().slice(0, 80) || "Company";
    app.position = String(app.position || "Position").trim().slice(0, 80) || "Position";
    app.location = String(app.location || "").trim().slice(0, 60);
    app.salaryRange = String(app.salaryRange || "").trim().slice(0, 40);
    app.applicationDate = String(app.applicationDate || "").slice(0, 10);
    app.status = appStatuses.includes(app.status) ? app.status : "Saved";
    app.contact = String(app.contact || "").trim().slice(0, 80);
    app.nextStep = String(app.nextStep || "").trim().slice(0, 100);
    app.followUpDate = String(app.followUpDate || "").slice(0, 10);
    app.privacy = privacyClasses.includes(app.privacy) ? app.privacy : "Private";
    app.notes = String(app.notes || "").trim().slice(0, 180);
  });
  nextState.careerInterviews.forEach(item => {
    item.id = item.id || crypto.randomUUID();
    item.company = String(item.company || "Company").trim().slice(0, 80) || "Company";
    item.position = String(item.position || "").trim().slice(0, 80);
    item.date = String(item.date || "").slice(0, 10);
    item.type = String(item.type || "Interview").trim().slice(0, 40);
    item.status = educationStatuses.includes(item.status) ? item.status : "Not started";
    item.privacy = privacyClasses.includes(item.privacy) ? item.privacy : "Private";
    item.notes = String(item.notes || "").trim().slice(0, 180);
  });
  nextState.careerContacts.forEach(contact => {
    contact.id = contact.id || crypto.randomUUID();
    contact.name = String(contact.name || "Contact").trim().slice(0, 80) || "Contact";
    contact.organization = String(contact.organization || "").trim().slice(0, 80);
    contact.relationship = String(contact.relationship || "").trim().slice(0, 60);
    contact.followUpDate = String(contact.followUpDate || "").slice(0, 10);
    contact.privacy = privacyClasses.includes(contact.privacy) ? contact.privacy : "Private";
    contact.notes = String(contact.notes || "").trim().slice(0, 180);
  });
  [...nextState.careerGoals, ...nextState.careerSkills].forEach(item => {
    item.id = item.id || crypto.randomUUID();
    item.title = String(item.title || item.name || "Career item").trim().slice(0, 80) || "Career item";
    item.name = String(item.name || item.title).trim().slice(0, 80);
    item.category = String(item.category || "Career").trim().slice(0, 40);
    item.targetDate = String(item.targetDate || "").slice(0, 10);
    item.progress = cleanNumber(item.progress, 0, 100);
    item.privacy = privacyClasses.includes(item.privacy) ? item.privacy : "Private";
    item.notes = String(item.notes || "").trim().slice(0, 180);
  });
  nextState.careerAchievements.forEach(item => {
    item.id = item.id || crypto.randomUUID();
    item.title = String(item.title || "Achievement").trim().slice(0, 80) || "Achievement";
    item.date = String(item.date || todayKey()).slice(0, 10);
    item.category = String(item.category || "Career").trim().slice(0, 40);
    item.privacy = privacyClasses.includes(item.privacy) ? item.privacy : "Private";
    item.notes = String(item.notes || "").trim().slice(0, 180);
  });
  nextState.calendarEvents.forEach(event => {
    event.id = event.id || crypto.randomUUID();
    event.title = String(event.title || "Event").trim().slice(0, 80) || "Event";
    event.date = String(event.date || todayKey()).slice(0, 10);
    event.category = String(event.category || "Personal").trim().slice(0, 40);
    event.source = String(event.source || "Manual").trim().slice(0, 40);
    event.privacy = privacyClasses.includes(event.privacy) ? event.privacy : "Private";
    event.notes = String(event.notes || "").trim().slice(0, 180);
  });
  nextState.documents.forEach(doc => {
    doc.id = doc.id || crypto.randomUUID();
    doc.title = String(doc.title || "Document reference").trim().slice(0, 80) || "Document reference";
    doc.category = String(doc.category || "Other").trim().slice(0, 40);
    doc.date = String(doc.date || "").slice(0, 10);
    doc.description = String(doc.description || "").trim().slice(0, 180);
    doc.related = String(doc.related || "").trim().slice(0, 80);
    doc.privacy = privacyClasses.includes(doc.privacy) ? doc.privacy : "Private";
    doc.sensitivity = privacyClasses.includes(doc.sensitivity) ? doc.sensitivity : "Personal";
    doc.localNote = String(doc.localNote || "").trim().slice(0, 180);
  });
  nextState.atlasHistory = Array.isArray(nextState.atlasHistory)
    ? nextState.atlasHistory.slice(-75).map(entry => ({
      id: String(entry.id || crypto.randomUUID()).slice(0, 80),
      createdAt: String(entry.createdAt || new Date().toISOString()).slice(0, 40),
      type: String(entry.type || "decision-action").slice(0, 40),
      candidateId: String(entry.candidateId || "").slice(0, 140),
      candidateTitle: String(entry.candidateTitle || "").slice(0, 90),
      category: String(entry.category || "").slice(0, 40),
      action: String(entry.action || "").slice(0, 40),
      decisionScore: cleanNumber(entry.decisionScore, 0, 100),
      sourceModule: String(entry.sourceModule || "").slice(0, 40),
      note: String(entry.note || "").slice(0, 160)
    }))
    : [];
  nextState.atlasMemory = window.LifeOpsMemoryNormalization
    ? window.LifeOpsMemoryNormalization.normalizeMemories(nextState.atlasMemory || []).slice(-250)
    : Array.isArray(nextState.atlasMemory) ? nextState.atlasMemory.slice(-250) : [];
  if (window.LifeOpsGraphNormalization) {
    nextState.graphNodes = window.LifeOpsGraphNormalization.normalizeNodes(nextState.graphNodes || []).slice(-300);
    const sourceNodes = window.LifeOpsGraphNodes?.sourceNodes
      ? window.LifeOpsGraphNodes.sourceNodes(nextState)
      : nextState.graphNodes;
    nextState.graphEdges = window.LifeOpsGraphNormalization.normalizeEdges(nextState.graphEdges || [], [...sourceNodes, ...nextState.graphNodes]).slice(-600);
  } else {
    nextState.graphNodes = Array.isArray(nextState.graphNodes) ? nextState.graphNodes.slice(-300) : [];
    nextState.graphEdges = Array.isArray(nextState.graphEdges) ? nextState.graphEdges.slice(-600) : [];
  }
  nextState.atlasCandidateState = nextState.atlasCandidateState && typeof nextState.atlasCandidateState === "object" && !Array.isArray(nextState.atlasCandidateState)
    ? Object.fromEntries(Object.entries(nextState.atlasCandidateState).slice(-75).map(([id, value]) => {
      const preference = value && typeof value === "object" && !Array.isArray(value) ? value : {};
      return [String(id).slice(0, 140), {
        completed: preference.completed === true,
        dismissed: preference.dismissed === true,
        snoozedUntil: String(preference.snoozedUntil || "").slice(0, 10),
        updatedAt: String(preference.updatedAt || "").slice(0, 40)
      }];
    }))
    : {};
  nextState.commandCenter = window.LifeOpsCommandTypes?.normalizeCommandCenter
    ? window.LifeOpsCommandTypes.normalizeCommandCenter(nextState.commandCenter || {})
    : (nextState.commandCenter && typeof nextState.commandCenter === "object" && !Array.isArray(nextState.commandCenter) ? nextState.commandCenter : {});
  nextState.commandHistory = window.LifeOpsCommandTypes?.normalizeHistory
    ? window.LifeOpsCommandTypes.normalizeHistory(nextState.commandHistory || [])
    : Array.isArray(nextState.commandHistory) ? nextState.commandHistory.slice(-150) : [];
  nextState.workouts.forEach(workout => {
    workout.minutes = cleanNumber(workout.minutes);
  });
  [...nextState.meals, ...nextState.savedMeals].forEach(meal => {
    ["calories", "protein", "carbs", "fat", "cost"].forEach(key => {
      meal[key] = cleanNumber(meal[key]);
    });
  });
  const companionDefaults = defaultCompanionSettings();
  const allowedAvatarStyles = ["sage", "sky", "gold", "slate"];
  const allowedForms = ["Core companion", "Orbit guide", "Seed guardian", "Light avatar", "Minimal assistant"];
  const allowedColors = ["Gold", "Obsidian", "Champagne", "Graphite"];
  const allowedAccessories = ["Guidance ring", "Compass mark", "Soft halo", "None"];
  const allowedEnvironments = ["Quiet command room", "Focus desk", "Night mode space", "Morning planning room"];
  const allowedAnimationStyles = ["Calm pulse", "Slow orbit", "Minimal motion", "Reduced motion"];
  const allowedTones = ["Balanced", "Direct", "Encouraging", "Analytical"];
  const allowedPersonalities = ["Steady", "Curious", "Calm", "Strategic", "Supportive"];
  const allowedStyles = ["Daily Coach", "Accountability Partner", "Wellness Guide", "Money Coach"];
  const allowedFocus = ["Next best action", "Money stability", "Nutrition and fitness", "Wellness and energy", "Goals and career"];
  nextState.companion = {
    ...companionDefaults,
    ...(nextState.companion || {}),
    name: String(nextState.companion?.name || companionDefaults.name).trim().slice(0, 24) || companionDefaults.name,
    initials: cleanInitials(nextState.companion?.initials, companionDefaults.initials),
    form: allowedForms.includes(nextState.companion?.form) ? nextState.companion.form : companionDefaults.form,
    avatarStyle: allowedAvatarStyles.includes(nextState.companion?.avatarStyle) ? nextState.companion.avatarStyle : companionDefaults.avatarStyle,
    color: allowedColors.includes(nextState.companion?.color) ? nextState.companion.color : companionDefaults.color,
    accessory: allowedAccessories.includes(nextState.companion?.accessory) ? nextState.companion.accessory : companionDefaults.accessory,
    environment: allowedEnvironments.includes(nextState.companion?.environment) ? nextState.companion.environment : companionDefaults.environment,
    animationStyle: allowedAnimationStyles.includes(nextState.companion?.animationStyle) ? nextState.companion.animationStyle : companionDefaults.animationStyle,
    tone: allowedTones.includes(nextState.companion?.tone) ? nextState.companion.tone : companionDefaults.tone,
    personality: allowedPersonalities.includes(nextState.companion?.personality) ? nextState.companion.personality : companionDefaults.personality,
    style: allowedStyles.includes(nextState.companion?.style) ? nextState.companion.style : companionDefaults.style,
    focus: allowedFocus.includes(nextState.companion?.focus) ? nextState.companion.focus : companionDefaults.focus
  };
  const voiceDefaults = defaultVoiceSettings();
  const allowedVoiceModes = ["off", "startup", "briefing", "both"];
  const modeWasUserSet = nextState.voice?.voiceModeUserSet === true;
  const importedMode = allowedVoiceModes.includes(nextState.voice?.mode) ? nextState.voice.mode : voiceDefaults.mode;
  nextState.voice = {
    ...voiceDefaults,
    ...(nextState.voice || {}),
    displayName: String(nextState.voice?.displayName || "").trim().slice(0, 32),
    startupAnimation: nextState.voice?.startupAnimation !== false,
    startupSound: nextState.voice?.startupSound === true,
    startupAudioUnlocked: nextState.voice?.startupAudioUnlocked === true,
    startupVolume: cleanNumber(nextState.voice?.startupVolume ?? voiceDefaults.startupVolume, 0, 0.7),
    mode: modeWasUserSet ? importedMode : voiceDefaults.mode,
    voiceModeUserSet: modeWasUserSet,
    voiceName: String(nextState.voice?.voiceName || "").trim().slice(0, 120),
    rate: cleanNumber(nextState.voice?.rate ?? voiceDefaults.rate, 0.8, 1.2)
  };
  const appearanceDefaults = defaultAppearanceSettings();
  const allowedModes = ["dark"];
  const allowedDensity = ["comfortable", "compact"];
  nextState.appearance = {
    ...appearanceDefaults,
    ...(nextState.appearance || {}),
    theme: normalizeTheme(nextState.appearance?.theme),
    mode: "dark",
    density: allowedDensity.includes(nextState.appearance?.density) ? nextState.appearance.density : appearanceDefaults.density,
    reducedEffects: nextState.appearance?.reducedEffects === true,
    gamificationEnabled: nextState.appearance?.gamificationEnabled !== false,
    sidebarCollapsed: nextState.appearance?.sidebarCollapsed === true
  };
  const personalizationDefaults = defaultPersonalizationSettings();
  const allowedAvatarColors = ["sage", "sky", "gold", "slate"];
  const allowedAvatarIcons = ["spark", "compass", "leaf", "bolt", "target"];
  nextState.personalization = {
    ...personalizationDefaults,
    ...(nextState.personalization || {}),
    displayName: String(nextState.personalization?.displayName || "").trim().slice(0, 32),
    initials: cleanInitials(nextState.personalization?.initials, personalizationDefaults.initials),
    pronouns: String(nextState.personalization?.pronouns || "").trim().slice(0, 32),
    avatarColor: allowedAvatarColors.includes(nextState.personalization?.avatarColor) ? nextState.personalization.avatarColor : personalizationDefaults.avatarColor,
    avatarIcon: allowedAvatarIcons.includes(nextState.personalization?.avatarIcon) ? nextState.personalization.avatarIcon : personalizationDefaults.avatarIcon,
    personalTitle: String(nextState.personalization?.personalTitle || personalizationDefaults.personalTitle).trim().slice(0, 48) || personalizationDefaults.personalTitle,
    currentFocus: String(nextState.personalization?.currentFocus || personalizationDefaults.currentFocus).trim().slice(0, 96) || personalizationDefaults.currentFocus
  };
  const privacyDefaults = defaultPrivacySettings();
  nextState.privacySettings = {
    ...privacyDefaults,
    ...(nextState.privacySettings || {}),
    defaultSharing: sharingChoices.includes(nextState.privacySettings?.defaultSharing) ? nextState.privacySettings.defaultSharing : privacyDefaults.defaultSharing,
    voiceSensitiveData: nextState.privacySettings?.voiceSensitiveData === true,
    socialSensitiveData: nextState.privacySettings?.socialSensitiveData === true,
    exportWarningAcknowledged: nextState.privacySettings?.exportWarningAcknowledged === true
  };
  const integrationDefaults = defaultIntegrationPreferences();
  nextState.integrationPreferences = {
    ...integrationDefaults,
    ...(nextState.integrationPreferences || {}),
    selectedIntegrationId: String(nextState.integrationPreferences?.selectedIntegrationId || "").trim().slice(0, 80),
    csvImportReady: nextState.integrationPreferences?.csvImportReady !== false,
    oauthEnabled: false,
    secureAccountSystem: false
  };
  const moduleDefaults = defaultModulePreferences();
  const moduleIds = Object.keys(moduleDefaults.enabled);
  const savedEnabled = nextState.modulePreferences?.enabled || {};
  nextState.modulePreferences = {
    ...moduleDefaults,
    ...(nextState.modulePreferences || {}),
    order: Array.isArray(nextState.modulePreferences?.order)
      ? [...new Set(nextState.modulePreferences.order.filter(id => moduleIds.includes(id))), ...moduleDefaults.order.filter(id => !nextState.modulePreferences.order.includes(id))]
      : moduleDefaults.order,
    enabled: Object.fromEntries(moduleIds.map(id => [id, savedEnabled[id] === undefined ? moduleDefaults.enabled[id] : savedEnabled[id] === true])),
    reflectionName: String(nextState.modulePreferences?.reflectionName || moduleDefaults.reflectionName).trim().slice(0, 40) || moduleDefaults.reflectionName
  };
  const dashboardDefaults = defaultDashboardSettings();
  const categoryChoices = ["Finance", "Health", "Education", "Career", "Goals", "Connections"];
  const quickActionChoices = ["expense", "meal", "task", "workout", "goal", "invite"];
  const savedDashboard = nextState.dashboardSettings || {};
  nextState.dashboardSettings = {
    ...dashboardDefaults,
    ...savedDashboard,
    categoryOrder: Array.isArray(savedDashboard.categoryOrder)
      ? [...new Set(savedDashboard.categoryOrder.filter(item => categoryChoices.includes(item))), ...categoryChoices.filter(item => !savedDashboard.categoryOrder.includes(item))]
      : dashboardDefaults.categoryOrder,
    visibleCategoryCards: Array.isArray(savedDashboard.visibleCategoryCards)
      ? savedDashboard.visibleCategoryCards.filter(item => categoryChoices.includes(item)).slice(0, 6)
      : dashboardDefaults.visibleCategoryCards,
    quickActions: Array.isArray(savedDashboard.quickActions)
      ? savedDashboard.quickActions.filter(item => quickActionChoices.includes(item)).slice(0, 6)
      : dashboardDefaults.quickActions,
    showMissions: savedDashboard.showMissions !== false,
    showRewards: savedDashboard.showRewards !== false,
    showStreaks: savedDashboard.showStreaks !== false,
    layoutDensity: savedDashboard.layoutDensity === "compact" ? "compact" : "comfortable"
  };
  const onboardingDefaults = defaultOnboardingSettings();
  const savedOnboarding = nextState.onboarding || {};
  nextState.onboarding = {
    ...onboardingDefaults,
    ...savedOnboarding,
    completed: savedOnboarding.completed === true,
    skipped: savedOnboarding.skipped === true,
    mode: ["voice", "text", "forms"].includes(savedOnboarding.mode) ? savedOnboarding.mode : onboardingDefaults.mode,
    path: ["essential", "deep"].includes(savedOnboarding.path) ? savedOnboarding.path : onboardingDefaults.path,
    currentStep: cleanNumber(savedOnboarding.currentStep, 0, 100),
    muted: savedOnboarding.muted === true,
    transcript: String(savedOnboarding.transcript || "").slice(0, 1200),
    answers: savedOnboarding.answers && typeof savedOnboarding.answers === "object" && !Array.isArray(savedOnboarding.answers) ? savedOnboarding.answers : {},
    recommendedModules: Array.isArray(savedOnboarding.recommendedModules) ? savedOnboarding.recommendedModules.slice(0, 12) : [],
    deepCompleted: savedOnboarding.deepCompleted === true,
    completedAt: String(savedOnboarding.completedAt || "").slice(0, 40)
  };
  return nextState;
}

function restoreState(nextState) {
  window.LifeOpsStorage.createRollbackBackup(state, "pre-replace-state");
  Object.keys(state).forEach(key => delete state[key]);
  Object.assign(state, nextState);
  window.LifeOpsState.replaceState(state, { notify: false });
  save();
}

function renderTextRows(id, rows) {
  return window.LifeOpsUI.renderTextRows(id, rows);
}

function renderSummaryCards(id, cards) {
  return window.LifeOpsUI.renderSummaryCards(id, cards);
}

function renderSectionSummaries() {
  const meals = mealTotals();
  const workoutMinutes = state.workouts.reduce((sum, workout) => sum + cleanNumber(workout.minutes), 0);
  const completedActions = state.planActions.filter(action => action.done).length;
  const recentMilestone = [...state.timeline].sort((a, b) => String(b.date).localeCompare(String(a.date)))[0];
  renderSummaryCards("moneySectionSummary", [
    { title: "Monthly income", value: money(cleanNumber(state.profile.income)), meta: "Current profile target" },
    { title: "Monthly expenses", value: money(totalExpenses()), meta: "Bills, variable costs, and debt payments" },
    { title: "Cash remaining", value: money(cashLeft()), meta: "After planned savings" },
    { title: "Emergency fund", value: percent(savingsCompletion()), meta: `${money(cleanNumber(state.profile.currentSavings))} saved` },
    { title: "Atlas Follow Up", value: "Optional", meta: "Add income, expenses, savings, emergency target, debt, and budget style later." }
  ]);
  renderSummaryCards("healthSectionSummary", [
    { title: "Workout progress", value: percent(fitnessCompletion()), meta: `${state.profile.workoutsDone || 0} of ${state.profile.workoutGoal || 0} workouts` },
    { title: "Steps", value: cleanNumber(state.profile.stepsToday).toLocaleString(), meta: `${percent(stepsCompletion())} of daily goal` },
    { title: "Sleep", value: `${cleanNumber(state.profile.sleepHours)}h`, meta: `${cleanNumber(state.profile.sleepGoal || 8)}h goal` },
    { title: "Nutrition status", value: percent(macroCompletion(meals.protein, cleanNumber(state.profile.proteinGoal))), meta: `${meals.protein}g protein logged` },
    { title: "Atlas Follow Up", value: "Optional", meta: "Add nutrition, sleep, workout frequency, height, and weight later." }
  ]);
  renderSummaryCards("nutritionSectionSummary", [
    { title: "Calories", value: `${meals.calories}`, meta: `${state.profile.calorieGoal || 0} calorie target` },
    { title: "Protein", value: `${meals.protein}g`, meta: `${state.profile.proteinGoal || 0}g target` },
    { title: "Food cost", value: money(meals.cost), meta: `${money(cleanNumber(state.profile.foodBudget))} weekly budget` },
    { title: "Home meals", value: state.meals.filter(meal => meal.source === "Home").length, meta: "Logged from home" }
  ]);
  renderSummaryCards("growthSectionSummary", [
    { title: "Goals progress", value: percent(goalCompletion()), meta: `${state.goals.length} goal${state.goals.length === 1 ? "" : "s"} tracked` },
    { title: "Weekly actions", value: `${completedActions}/${state.planActions.length}`, meta: "Completed this week" },
    { title: "XP", value: todayRewardPoints(), meta: `Level ${rewardLevelInfo().level}` },
    { title: "Recent milestone", value: recentMilestone?.category || "None yet", meta: recentMilestone?.title || "Add a timeline milestone" }
  ]);
  renderSummaryCards("moreSectionSummary", [
    { title: "Data and Backup", value: "Local", meta: "Export, restore, empty test, and reset tools" },
    { title: "Settings", value: "Appearance", meta: "Themes, density, voice, startup, and profile" },
    { title: "Trust", value: "Privacy", meta: "Local storage, sharing preview, and integrations status" },
    { title: "Tools", value: "Reports", meta: "History, reports, coach, and about pages" }
  ]);
  renderTextRows("moneyTargetSummary", [
    ["Income", money(cleanNumber(state.profile.income))],
    ["Savings goal", money(cleanNumber(state.profile.savingsGoal))],
    ["Current savings", money(cleanNumber(state.profile.currentSavings))],
    ["Emergency target", money(cleanNumber(state.profile.emergencyTarget))]
  ]);
}

function areaGoalCompletion(area) {
  const goals = state.goals.filter(goal => goal.area === area);
  if (!goals.length) return 0;
  return goals.reduce((sum, goal) => sum + Number(goal.progress || 0), 0) / goals.length;
}

function renderInsights(cashLeft, meals) {
  const insights = [];
  const budget = Number(state.profile.foodBudget || 0);
  const restaurantShare = meals.cost ? (meals.restaurantCost / meals.cost) * 100 : 0;
  if (budget && meals.cost > budget) {
    insights.push(`Food spending is ${money(meals.cost - budget)} over the weekly budget. That can pressure savings or debt payoff if it becomes a pattern.`);
  } else if (budget) {
    insights.push(`Food spending is ${money(Math.max(0, budget - meals.cost))} under the weekly budget so far.`);
  }
  if (restaurantShare >= 35) {
    insights.push(`Restaurant meals are ${percent(restaurantShare)} of logged food cost. This is the clearest place to connect better macros with lower spending.`);
  }
  if (meals.protein >= Number(state.profile.proteinGoal || 0)) {
    insights.push("Protein target is on track today, which supports the fitness score.");
  }
  if (cashLeft < 0) {
    insights.push("Monthly cash left is negative after planned savings. Lower variable expenses or adjust the savings target before adding new spending.");
  }
  if (!insights.length) {
    insights.push("The dashboard has enough balance to keep building. Log more meals and goals to make the connections sharper.");
  }

  const list = document.getElementById("insightList");
  list.innerHTML = "";
  insights.slice(0, 4).forEach(text => {
    const item = document.createElement("div");
    item.className = "insight";
    item.textContent = text;
    list.appendChild(item);
  });
}

function renderBars(id, rows) {
  return window.LifeOpsUI.renderBars(id, rows);
}

function addItem(collection, item) {
  collection.push({ id: crypto.randomUUID(), ...item });
  save();
}

function renderSecondaryNav(primary, activeTab) {
  return window.LifeOpsNavigation.renderSecondaryNav(primary, activeTab);
}

function renderPageHeader(primary, tab) {
  return window.LifeOpsNavigation.renderPageHeader(primary, tab);
}

function activateTab(tab, forcedPrimary = null) {
  return window.LifeOpsNavigation.navigateTo(tab, { primary: forcedPrimary || sectionPrimary[tab] || "dashboard" });
}

function setCompanionDrawer(open) {
  document.getElementById("companionDrawer").classList.toggle("active", open);
  document.getElementById("companionDrawerBackdrop").classList.toggle("active", open);
  if (open) {
    renderCompanionChat();
    const input = document.getElementById("globalCoachQuestionInput");
    if (input) input.focus();
  }
}

function sendGlobalCompanionMessage() {
  const input = document.getElementById("globalCoachQuestionInput");
  if (!input) return;
  sendCompanionMessage(input.value || "What should I focus on right now?");
  input.value = "";
}

function saveCompanionSettings() {
  state.companion = {
    name: document.getElementById("companionNameInput").value.trim().slice(0, 24) || "LifeOps",
    initials: cleanInitials(document.getElementById("companionInitialsInput").value, "LO"),
    form: document.getElementById("companionFormInput").value,
    avatarStyle: document.getElementById("companionAvatarStyleInput").value,
    color: document.getElementById("companionColorInput").value,
    accessory: document.getElementById("companionAccessoryInput").value,
    environment: document.getElementById("companionEnvironmentInput").value,
    animationStyle: document.getElementById("companionAnimationStyleInput").value,
    tone: document.getElementById("companionToneInput").value,
    personality: document.getElementById("companionPersonalityInput").value,
    style: document.getElementById("companionStyleInput").value,
    focus: document.getElementById("companionFocusInput").value
  };
  chatMessages.length = 0;
  addCompanionSystemMessage(`${state.companion.name} is updated. I will use a ${state.companion.tone.toLowerCase()} tone as your ${state.companion.personality.toLowerCase()} ${state.companion.form.toLowerCase()}, focused on ${state.companion.focus.toLowerCase()}.`);
  save();
}

let infrastructureInitialized = false;
let eventListenersInitialized = false;

function initializeLifeOpsInfrastructure() {
  if (infrastructureInitialized) return;
  infrastructureInitialized = true;
  window.LifeOpsUI.initialize({
    onModalSave: save,
    actions: {
      openAddTaskModal,
      openAddExpenseModal,
      openAddWorkoutModal,
      openAddMealModal,
      openAddGoalModal,
      openAddPlanActionModal
    }
  });
  window.LifeOpsNavigation.initialize({
    brandAssetMarkup,
    atlasPageInsight,
    actionHandlers: {
      addCalendarEvent: openAddCalendarEventModal,
      addExpense: openAddExpenseModal,
      addMeal: openAddMealModal,
      addEducationAssignment: () => openAddEducationAssignmentModal("Assignment"),
      addCareerApplication: openAddCareerApplicationModal,
      addGoal: openAddGoalModal,
      addDocumentReference: openAddDocumentReferenceModal,
      editProfile: () => activateTab("setup", "settings"),
      customizeHome: () => activateTab("modules", "modules"),
      exportBackup: () => document.getElementById("exportBtn")?.click()
    }
  });
  initializeLifeOpsModuleControllers();
}

function initializeLifeOpsModuleControllers() {
  const sharedContext = {
    state,
    getState: () => state,
    save,
    renderTextRows,
    currentAppearance,
    setSettingsPanel,
    getAtlasContext,
    evaluateAtlasPriorities,
    setAtlasCenterPanel,
    saveCompanionSettings,
    saveAppearanceSettings,
    savePersonalizationSettings,
    playMorningBriefing,
    unlockAudioSystems,
    previewVoice,
    previewStartupSound,
    previewStartupExperience,
    pauseVoice,
    resumeVoice,
    stopVoice,
    resetVoiceSettings,
    saveVoiceSettings,
    openAddEducationCourseModal,
    openAddEducationAssignmentModal,
    openAddEducationGoalModal,
    openAddEducationCostModal,
    openAddCareerApplicationModal,
    openAddCareerInterviewModal,
    openAddCareerContactModal,
    openAddCareerGoalModal,
    openAddCareerSkillModal,
    openAddCareerAchievementModal,
    openAddCalendarEventModal,
    renderCalendarCenter,
    openAddDocumentReferenceModal,
    setTreeDetailPanel,
    activateTab,
    sectionPrimary,
    openAddExpenseModal,
    openAddMealModal,
    openAddTaskModal,
    openAddWorkoutModal,
    openAddGoalModal
  };
  [
    window.LifeOpsSettingsModule,
    window.LifeOpsEducationModule,
    window.LifeOpsCareerModule,
    window.LifeOpsCalendarModule,
    window.LifeOpsDocumentsModule,
    window.LifeOpsLifeTreeModule,
    window.LifeOpsModules?.timeline,
    window.LifeOpsModules?.memory,
    window.LifeOpsModules?.graph,
    window.LifeOpsModules?.commandCenter
  ].forEach(module => {
    try {
      module?.initialize?.(sharedContext);
    } catch (error) {
      console.error("LifeOps module controller failed to initialize.", error);
      window.LifeOpsUI?.showStatus?.("One LifeOps panel opened with limited controls. Other sections are still available.", "warning");
    }
  });
}

function registerLifeOpsEventListeners() {
  if (eventListenersInitialized) return;
  eventListenersInitialized = true;
document.querySelectorAll("[data-open-tab]").forEach(button => {
  button.addEventListener("click", () => {
    setAtlasCenterPanel(false);
    setTreeDetailPanel(false);
    activateTab(button.dataset.openTab);
  });
});
document.getElementById("openAtlasOrbBtn")?.addEventListener("click", () => setAtlasCenterPanel(true));
document.getElementById("closeAtlasCenterBtn")?.addEventListener("click", () => setAtlasCenterPanel(false));
document.getElementById("atlasCenterPanel")?.addEventListener("click", event => {
  if (event.target?.id === "atlasCenterPanel") setAtlasCenterPanel(false);
});
document.getElementById("atlasCenterAskBtn")?.addEventListener("click", askAtlasCenterPanel);
document.getElementById("atlasCenterInput")?.addEventListener("keydown", event => {
  if (event.key === "Enter") askAtlasCenterPanel();
});
document.getElementById("atlasCenterVoiceBtn")?.addEventListener("click", playMorningBriefing);
document.getElementById("atlasCenterBriefingBtn")?.addEventListener("click", playMorningBriefing);
document.getElementById("atlasCommandAskBtn")?.addEventListener("click", () => setAtlasCenterPanel(true));
document.getElementById("atlasCommandStartBtn")?.addEventListener("click", event => {
  const priority = evaluateAtlasPriorities(getAtlasContext())[0];
  if (!applyConfirmedAtlasAction(priority)) {
    const tab = event.currentTarget.dataset.openAtlasTab || "dashboard";
    activateTab(tab, sectionPrimary[tab] || null);
  }
});
document.getElementById("atlasCommandCompleteBtn")?.addEventListener("click", () => updateCurrentAtlasAction("complete"));
document.getElementById("atlasCommandSnoozeBtn")?.addEventListener("click", () => updateCurrentAtlasAction("snooze", { days: 1 }));
document.getElementById("atlasCommandDismissBtn")?.addEventListener("click", () => updateCurrentAtlasAction("dismiss"));
document.getElementById("atlasCommandAlternativesBtn")?.addEventListener("click", showAtlasAlternatives);
document.getElementById("atlasCommandCorrectBtn")?.addEventListener("click", openAtlasCorrectionModal);
document.getElementById("atlasCommandRecalculateBtn")?.addEventListener("click", recalculateAtlasDecision);
document.getElementById("openGlobalCompanionBtn").addEventListener("click", () => setCompanionDrawer(true));
document.getElementById("openGlobalCompanionSidebarBtn")?.addEventListener("click", () => setCompanionDrawer(true));
document.getElementById("closeGlobalCompanionBtn").addEventListener("click", () => setCompanionDrawer(false));
document.getElementById("companionDrawerBackdrop").addEventListener("click", () => setCompanionDrawer(false));
document.getElementById("atlasStartTaskBtn").addEventListener("click", event => {
  const priority = evaluateAtlasPriorities(getAtlasContext())[0];
  if (!applyConfirmedAtlasAction(priority)) {
    const tab = event.currentTarget.dataset.openAtlasTab || "dashboard";
    activateTab(tab, sectionPrimary[tab] || null);
  }
});
document.getElementById("atlasExplainMoreBtn").addEventListener("click", () => {
  const context = getAtlasContext();
  const priority = evaluateAtlasPriorities(context)[0];
  setCompanionDrawer(true);
  addCompanionSystemMessage(`Atlas Local explanation\n\n${formatAtlasRows(atlasRowsFromAction(priority, context))}`);
});
document.getElementById("atlasCorrectBtn")?.addEventListener("click", openAtlasCorrectionModal);
document.getElementById("globalAskCoachBtn").addEventListener("click", sendGlobalCompanionMessage);
document.getElementById("globalCoachQuestionInput").addEventListener("keydown", event => {
  if (event.key === "Enter") sendGlobalCompanionMessage();
});
[
  ["openTaskModalBtn", openAddTaskModal],
  ["openExpenseModalBtn", openAddExpenseModal],
  ["openWorkoutModalBtn", openAddWorkoutModal],
  ["openMealModalBtn", openAddMealModal],
  ["openGoalModalBtn", openAddGoalModal],
  ["openPlanActionModalBtn", openAddPlanActionModal],
  ["openMoneyTargetsModalBtn", openMoneyTargetsModal],
  ["openNutritionTargetsModalBtn", openNutritionTargetsModal]
].forEach(([id, handler]) => {
  const button = document.getElementById(id);
  if (button) button.addEventListener("click", handler);
});
document.querySelectorAll("[data-quick-action]").forEach(button => {
  button.addEventListener("click", () => {
    const action = button.dataset.quickAction;
    if (action === "expense") openAddExpenseModal();
    if (action === "meal") openAddMealModal();
    if (action === "task") openAddTaskModal();
    if (action === "workout") openAddWorkoutModal();
    if (action === "goal") openAddGoalModal();
    if (action === "invite") activateTab("connections", "more");
  });
});
document.getElementById("todayOpenAtlasBtn")?.addEventListener("click", () => setCompanionDrawer(true));
document.getElementById("todayAskAtlasBtn")?.addEventListener("click", () => setAtlasCenterPanel(true));
document.getElementById("todayStartActionBtn")?.addEventListener("click", () => {
  const priority = evaluateAtlasPriorities(getAtlasContext())[0];
  applyConfirmedAtlasAction(priority);
});
document.getElementById("scanBarcodeBtn")?.addEventListener("click", scanBarcode);
document.getElementById("nutritionBarcodeBtn")?.addEventListener("click", scanBarcode);
document.getElementById("recipeBuilderBtn")?.addEventListener("click", openRecipeBuilder);
document.getElementById("mealPrepBtn")?.addEventListener("click", openMealPrepView);
document.getElementById("addWaterQuickBtn")?.addEventListener("click", addWaterQuick);
document.getElementById("addSleepQuickBtn")?.addEventListener("click", addSleepQuick);
document.getElementById("saveSnapshotQuickBtn")?.addEventListener("click", saveTodaySnapshot);
document.getElementById("startDailyReviewQuickBtn")?.addEventListener("click", () => activateTab("review", "goals"));
document.getElementById("replayBackBtn")?.addEventListener("click", () => {
  pauseLifeReplay();
  lifeReplayIndex = Math.max(0, lifeReplayIndex - 1);
  renderLifeReplayPreview();
});
document.getElementById("replayPlayBtn")?.addEventListener("click", startLifeReplay);
document.getElementById("replayPauseBtn")?.addEventListener("click", pauseLifeReplay);
document.getElementById("replayNextBtn")?.addEventListener("click", () => {
  pauseLifeReplay();
  lifeReplayIndex = Math.min(lifeReplayCards().length - 1, lifeReplayIndex + 1);
  renderLifeReplayPreview();
});
document.getElementById("replayRestartBtn")?.addEventListener("click", () => {
  pauseLifeReplay();
  lifeReplayIndex = 0;
  renderLifeReplayPreview();
});
document.getElementById("trendRangeInput")?.addEventListener("change", renderTrendSystem);
document.getElementById("closeBarcodeScannerBtn")?.addEventListener("click", () => stopBarcodeScanner());
document.getElementById("stopBarcodeScannerBtn")?.addEventListener("click", () => stopBarcodeScanner());
document.getElementById("manualBarcodeBtn")?.addEventListener("click", () => {
  stopBarcodeScanner();
  openManualBarcodeCapture();
});
document.getElementById("completePriorityBtn").addEventListener("click", () => {
  const priority = String(state.profile.priority || "").trim();
  if (!priority) {
    alert("Set a current priority before marking it complete.");
    return;
  }
  const matchingTask = state.tasks.find(task => task.name.toLowerCase() === priority.toLowerCase());
  if (matchingTask) {
    matchingTask.done = true;
  } else {
    state.tasks.push({ id: crypto.randomUUID(), name: priority, area: "Goals", done: true });
  }
  save();
});
document.getElementById("invitePersonPreviewBtn").addEventListener("click", () => {
  activateTab("connections", "more");
});
document.getElementById("addConnectionBtn").addEventListener("click", () => {
  openEditModal("Add Local Connection", [
    { name: "displayName", label: "Display name", value: "", wide: true },
    { name: "relationshipType", label: "Relationship", type: "select", value: "Friend", options: ["Family", "Partner", "Friend", "Accountability partner", "Coach", "Other"] },
    { name: "view", label: "Who can view", type: "select", value: "Only me", options: ["Only me", "Selected people", "Group", "Everyone in household"] }
  ], values => {
    if (!values.displayName) return;
    state.connections.push({
      connectionId: crypto.randomUUID(),
      displayName: values.displayName,
      relationshipType: values.relationshipType,
      groupIds: [],
      permissions: { view: values.view, edit: "Only me", comment: "Only me", hidden: "Sensitive details" },
      sharedGoalIds: [],
      sharedListIds: [],
      sharedChallengeIds: [],
      status: "Prototype",
      createdAt: todayKey(),
      lastSyncedAt: ""
    });
  });
});
document.getElementById("addConnectionGroupBtn").addEventListener("click", () => {
  openEditModal("Add Local Group", [
    { name: "name", label: "Group name", value: "", wide: true },
    { name: "description", label: "Description", value: "", wide: true },
    { name: "privacy", label: "Privacy", type: "select", value: "Only me", options: ["Only me", "Selected people", "Group", "Everyone in household"] }
  ], values => {
    if (!values.name) return;
    state.connectionGroups.push({ id: crypto.randomUUID(), name: values.name, description: values.description, memberIds: [], privacy: values.privacy });
  });
});
document.getElementById("addSharedListBtn").addEventListener("click", () => {
  openEditModal("Add Shared List Preview", [
    { name: "name", label: "List name", value: "", wide: true },
    { name: "category", label: "Category", value: "Household" },
    { name: "items", label: "Items, comma separated", value: "", wide: true },
    { name: "privacy", label: "Privacy", type: "select", value: "Only me", options: ["Only me", "Selected people", "Group", "Everyone in household"] }
  ], values => {
    if (!values.name) return;
    state.sharedLists.push({ id: crypto.randomUUID(), name: values.name, category: values.category, items: values.items.split(",").map(item => item.trim()).filter(Boolean), privacy: values.privacy, connectionIds: [], groupIds: [] });
  });
});
document.getElementById("addSharedGoalBtn").addEventListener("click", () => {
  openEditModal("Add Shared Goal Preview", [
    { name: "name", label: "Goal name", value: "", wide: true },
    { name: "category", label: "Category", value: "Goals" },
    { name: "progress", label: "Progress", type: "number", value: 0, min: 0, max: 100, step: 5 },
    { name: "privacy", label: "Privacy", type: "select", value: "Only me", options: ["Only me", "Selected people", "Group", "Everyone in household"] }
  ], values => {
    if (!values.name) return;
    state.sharedGoals.push({ id: crypto.randomUUID(), name: values.name, category: values.category, progress: values.progress, privacy: values.privacy, connectionIds: [], groupIds: [] });
  });
});
document.getElementById("addSharedChallengeBtn").addEventListener("click", () => {
  openEditModal("Add Challenge Preview", [
    { name: "name", label: "Challenge name", value: "", wide: true },
    { name: "category", label: "Category", value: "Wellness" },
    { name: "target", label: "Target", value: "Complete the challenge", wide: true },
    { name: "privacy", label: "Privacy", type: "select", value: "Only me", options: ["Only me", "Selected people", "Group", "Everyone in household"] }
  ], values => {
    if (!values.name) return;
    state.sharedChallenges.push({ id: crypto.randomUUID(), name: values.name, category: values.category, target: values.target, progress: 0, privacy: values.privacy, connectionIds: [], groupIds: [] });
  });
});
document.getElementById("privacyExportBtn").addEventListener("click", () => {
  document.getElementById("exportBtn").click();
});
document.getElementById("skipStartupBtn").addEventListener("click", finishStartup);
document.getElementById("startupOverlay")?.addEventListener("click", event => {
  if (event.target?.id === "skipStartupBtn") return;
  finishStartup();
});
document.getElementById("beginAtlasOnboardingBtn").addEventListener("click", beginAtlasInterview);
document.getElementById("learnMoreAtlasOnboardingBtn").addEventListener("click", () => {
  document.getElementById("atlasOnboardingDescription").textContent = "Atlas asks one question at a time, stores answers locally, recommends modules, and prepares the dashboard without sending information anywhere.";
});
document.getElementById("skipAtlasOnboardingBtn").addEventListener("click", () => completeAtlasOnboarding(true));
document.getElementById("atlasNextBtn").addEventListener("click", () => {
  const question = currentAtlasQuestion();
  if (question?.key === "mode" && atlasOnboarding().answers.mode === "Traditional Forms") {
    atlasOnboarding().mode = "forms";
    atlasOnboarding().skipped = true;
    persistState({ render: false });
    closeAtlasOnboarding();
    activateTab("setup", "settings");
    return;
  }
  atlasOnboardingNext(false);
});
document.getElementById("atlasSkipQuestionBtn").addEventListener("click", () => atlasOnboardingNext(true));
document.getElementById("atlasAskLaterBtn").addEventListener("click", atlasOnboardingAskLater);
document.getElementById("atlasFinishSetupBtn").addEventListener("click", () => completeAtlasOnboarding(false));
document.getElementById("atlasUseKnownBtn").addEventListener("click", () => completeAtlasOnboarding(false));
document.getElementById("atlasBackBtn").addEventListener("click", atlasOnboardingBack);
document.getElementById("atlasVoiceToggleBtn").addEventListener("click", () => {
  if (atlasOnboarding().mode === "voice") {
    atlasOnboarding().mode = "text";
    stopAtlasRecognition();
    renderAtlasOnboardingQuestion();
  } else {
    startAtlasRecognition();
  }
});
document.getElementById("atlasReplayQuestionBtn").addEventListener("click", () => speakAtlasQuestion(currentAtlasQuestion()?.question || "Atlas onboarding is ready."));
document.getElementById("atlasMuteBtn").addEventListener("click", () => {
  atlasOnboarding().muted = !atlasOnboarding().muted;
  if (atlasOnboarding().muted) window.speechSynthesis?.cancel?.();
  renderAtlasOnboardingQuestion();
});
document.getElementById("atlasTraditionalFormsBtn").addEventListener("click", () => {
  atlasOnboarding().mode = "forms";
  atlasOnboarding().skipped = true;
  persistState({ render: false });
  closeAtlasOnboarding();
  activateTab("setup", "settings");
});
document.getElementById("launchLifeOpsBtn").addEventListener("click", closeAtlasOnboarding);
document.getElementById("completeAtlasBlueprintBtn").addEventListener("click", () => {
  const onboarding = atlasOnboarding();
  onboarding.path = "deep";
  onboarding.currentStep = 0;
  onboarding.skipped = false;
  persistState({ render: false });
  showAtlasOnboardingScreen("atlasOnboardingInterview");
  renderAtlasOnboardingQuestion();
});
document.getElementById("reviewAtlasProfileBtn").addEventListener("click", () => {
  closeAtlasOnboarding();
  activateTab("setup", "settings");
});
if (speechSupported()) {
  window.speechSynthesis.onvoiceschanged = loadBrowserVoices;
  loadBrowserVoices();
}
window.addEventListener("beforeunload", () => {
  pauseLifeReplay();
  stopBarcodeScanner();
  stopStartupTone();
  if (speechSupported()) window.speechSynthesis.cancel();
});

document.getElementById("priorityInput").addEventListener("input", event => {
  state.profile.priority = event.target.value;
  save();
});

document.getElementById("notesInput").addEventListener("input", event => {
  state.profile.notes = event.target.value;
  save();
});

document.querySelectorAll("[data-check]").forEach(input => {
  input.addEventListener("change", () => {
    state.checks[input.dataset.check] = input.checked;
    save();
  });
});

[
  ["incomeInput", "income"],
  ["savingsGoalInput", "savingsGoal"],
  ["currentSavingsInput", "currentSavings"],
  ["emergencyTargetInput", "emergencyTarget"],
  ["workoutGoalInput", "workoutGoal"],
  ["workoutsDoneInput", "workoutsDone"],
  ["stepGoalInput", "stepGoal"],
  ["stepsTodayInput", "stepsToday"],
  ["calorieGoalInput", "calorieGoal"],
  ["proteinGoalInput", "proteinGoal"],
  ["carbGoalInput", "carbGoal"],
  ["fatGoalInput", "fatGoal"],
  ["foodBudgetInput", "foodBudget"],
  ["waterGoalInput", "waterGoal"],
  ["sleepHoursInput", "sleepHours"],
  ["waterCupsInput", "waterCups"],
  ["setupFoodBudgetInput", "foodBudget"],
  ["setupCalorieGoalInput", "calorieGoal"],
  ["setupProteinGoalInput", "proteinGoal"],
  ["setupCarbGoalInput", "carbGoal"],
  ["setupFatGoalInput", "fatGoal"],
  ["setupSavingsGoalInput", "savingsGoal"],
  ["setupWorkoutGoalInput", "workoutGoal"],
  ["setupSleepGoalInput", "sleepGoal"]
].forEach(([inputId, key]) => {
  document.getElementById(inputId).addEventListener("input", event => {
    state.profile[key] = cleanNumber(event.target.value);
    save();
  });
});

[
  ["moodInput", "mood"],
  ["stressInput", "stress"],
  ["energyInput", "energy"]
].forEach(([inputId, key]) => {
  document.getElementById(inputId).addEventListener("change", event => {
    state.profile[key] = cleanNumber(event.target.value, 0, 5);
    save();
  });
});

document.getElementById("tomorrowFocusInput").addEventListener("input", event => {
  state.profile.tomorrowFocus = event.target.value;
  save();
});

document.getElementById("addTaskBtn").addEventListener("click", () => {
  const name = document.getElementById("taskName").value.trim();
  if (!name) return;
  addItem(state.tasks, { name, area: document.getElementById("taskArea").value, done: false });
  document.getElementById("taskName").value = "";
});

document.getElementById("addExpenseBtn").addEventListener("click", () => {
  const name = document.getElementById("expenseName").value.trim();
  const amount = cleanNumber(document.getElementById("expenseAmount").value);
  if (!name || amount <= 0) return;
  addItem(state.expenses, { name, amount, type: document.getElementById("expenseType").value, dueDate: document.getElementById("expenseDueDate").value });
  document.getElementById("expenseName").value = "";
  document.getElementById("expenseAmount").value = "";
  document.getElementById("expenseDueDate").value = "";
});

document.getElementById("addWorkoutBtn").addEventListener("click", () => {
  const name = document.getElementById("workoutName").value.trim();
  const minutes = cleanNumber(document.getElementById("workoutMinutes").value);
  if (!name || minutes <= 0) return;
  addItem(state.workouts, { name, minutes, intensity: document.getElementById("workoutIntensity").value });
  document.getElementById("workoutName").value = "";
  document.getElementById("workoutMinutes").value = "";
});

document.getElementById("addMealBtn").addEventListener("click", () => {
  const name = document.getElementById("mealName").value.trim();
  const calories = cleanNumber(document.getElementById("mealCalories").value);
  if (!name || calories <= 0) return;
  addItem(state.meals, {
    name,
    source: document.getElementById("mealSource").value,
    calories,
    protein: cleanNumber(document.getElementById("mealProtein").value),
    carbs: cleanNumber(document.getElementById("mealCarbs").value),
    fat: cleanNumber(document.getElementById("mealFat").value),
    cost: cleanNumber(document.getElementById("mealCost").value)
  });
  ["mealName", "mealCalories", "mealProtein", "mealCarbs", "mealFat", "mealCost"].forEach(id => {
    document.getElementById(id).value = "";
  });
});

document.getElementById("quickAddSavedMealBtn").addEventListener("click", () => {
  const selectedId = document.getElementById("savedMealSelect").value;
  const meal = state.savedMeals.find(item => item.id === selectedId);
  if (!meal) return;
  addItem(state.meals, {
    name: meal.name,
    source: meal.source,
    calories: cleanNumber(meal.calories),
    protein: cleanNumber(meal.protein),
    carbs: cleanNumber(meal.carbs),
    fat: cleanNumber(meal.fat),
    cost: cleanNumber(meal.cost)
  });
});

document.getElementById("copyLastMealBtn").addEventListener("click", () => {
  const lastMeal = state.meals[state.meals.length - 1];
  if (!lastMeal) return;
  addItem(state.meals, {
    name: lastMeal.name,
    source: lastMeal.source,
    calories: cleanNumber(lastMeal.calories),
    protein: cleanNumber(lastMeal.protein),
    carbs: cleanNumber(lastMeal.carbs),
    fat: cleanNumber(lastMeal.fat),
    cost: cleanNumber(lastMeal.cost)
  });
});

document.getElementById("addGoalBtn").addEventListener("click", () => {
  const name = document.getElementById("goalName").value.trim();
  if (!name) return;
  addItem(state.goals, {
    name,
    area: document.getElementById("goalArea").value,
    targetDate: document.getElementById("goalDate").value,
    progress: cleanNumber(document.getElementById("goalProgress").value, 0, 100)
  });
  ["goalName", "goalDate", "goalProgress"].forEach(id => {
    document.getElementById(id).value = "";
  });
});

document.getElementById("addPlanActionBtn").addEventListener("click", () => {
  const name = document.getElementById("planActionName").value.trim();
  if (!name) return;
  addItem(state.planActions, {
    name,
    area: document.getElementById("planActionArea").value,
    deadline: document.getElementById("planActionDeadline").value,
    goal: document.getElementById("planActionGoal").value.trim(),
    impact: document.getElementById("planActionImpact").value,
    done: false
  });
  ["planActionName", "planActionDeadline", "planActionGoal"].forEach(id => {
    document.getElementById(id).value = "";
  });
});

document.getElementById("saveSnapshotBtn").addEventListener("click", () => {
  saveTodaySnapshot();
});

document.getElementById("reportTypeInput").addEventListener("change", renderReportPreview);
document.getElementById("refreshReportBtn").addEventListener("click", renderReportPreview);
document.getElementById("downloadReportBtn").addEventListener("click", () => {
  const type = document.getElementById("reportTypeInput").value;
  downloadText(reportFilename(type), reportTextByType(type));
});

document.querySelectorAll("[data-coach-prompt]").forEach(button => {
  button.addEventListener("click", () => {
    sendCompanionMessage(button.dataset.coachPrompt);
    document.getElementById("coachQuestionInput").value = "";
  });
});

document.getElementById("askCoachBtn").addEventListener("click", renderCoachAnswer);
document.getElementById("coachQuestionInput").addEventListener("keydown", event => {
  if (event.key === "Enter") renderCoachAnswer();
});

document.querySelectorAll("[data-companion-action]").forEach(button => {
  button.addEventListener("click", () => {
    const action = button.dataset.companionAction;
    if (action === "meal") {
      activateTab("food");
      addCompanionSystemMessage("Food log opened. Add one realistic meal first. The coach will use calories, protein, and cost.");
    } else if (action === "workout") {
      activateTab("fitness");
      addCompanionSystemMessage("Workout tracker opened. A simple walk or short workout can move the fitness score today.");
    } else if (action === "snapshot") {
      saveTodaySnapshot();
      addCompanionSystemMessage("Today's snapshot is saved. History gives the coach better trend context.");
    } else {
      sendCompanionMessage("Show my weakest area");
    }
  });
});

document.getElementById("exportBtn").addEventListener("click", () => {
  const blob = new Blob([window.LifeOpsStorage.exportState(state)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `lifeops-backup-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
});

document.getElementById("importBtn").addEventListener("click", () => {
  document.getElementById("importFileInput").click();
});

document.getElementById("importFileInput").addEventListener("change", event => {
  const file = event.target.files[0];
  event.target.value = "";
  if (!file) return;
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    const parsed = window.LifeOpsStorage.parseImportText(reader.result);
    if (!parsed.ok) {
      alert(parsed.message);
      return;
    }
    const validation = validateBackupData(parsed.data);
    if (!validation.ok) {
      alert(validation.message);
      return;
    }
    if (!confirm("Restore this LifeOps backup? This will replace the current local dashboard data.")) return;
    restoreState(validation.data);
  });
  reader.readAsText(file);
});

document.getElementById("emptyTestBtn").addEventListener("click", () => {
  if (!confirm("Load empty LifeOps test data? Export a backup first if you want to keep the current local data.")) return;
  restoreState(emptyState());
});

document.getElementById("cancelEditModalBtn").addEventListener("click", closeEditModal);
document.getElementById("closeEditModalBtn").addEventListener("click", closeEditModal);
document.getElementById("editModalBackdrop").addEventListener("click", event => {
  if (event.target.id === "editModalBackdrop") closeEditModal();
});
document.getElementById("barcodeScannerBackdrop")?.addEventListener("click", event => {
  if (event.target.id === "barcodeScannerBackdrop") stopBarcodeScanner();
});
document.addEventListener("keydown", event => {
  trapModalFocus(event);
  if (event.key === "Escape") {
    closeEditModal();
    stopBarcodeScanner();
    setCompanionDrawer(false);
    setAtlasCenterPanel(false);
    setTreeDetailPanel(false);
  }
});

document.getElementById("exportReviewBtn").addEventListener("click", () => {
  downloadText(`lifeops-weekly-review-${new Date().toISOString().slice(0, 10)}.txt`, weeklyReviewReportText());
});

document.getElementById("resetBtn").addEventListener("click", () => {
  if (!confirm("Clear the current LifeOps data and reload the starter sample?")) return;
  window.LifeOpsStorage.resetState(state);
  location.reload();
});

}

function bootstrapLifeOps() {
  try {
    initializeLifeOpsInfrastructure();
    registerLifeOpsEventListeners();
    render();
    runStartupSequence();
  } catch (error) {
    console.error("LifeOps could not complete startup.", error);
    try { finishStartup(); } catch (startupError) { console.error("LifeOps startup fallback failed.", startupError); }
    window.LifeOpsUI?.showStatus?.("LifeOps opened with limited startup effects. Your local data was not changed.", "warning");
  }
}

bootstrapLifeOps();



