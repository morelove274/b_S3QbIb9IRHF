import { 
  SpellCheck, 
  Headphones, 
  BookOpen, 
  Edit, 
  Mic, 
  ClipboardCheck, 
  History,
  Library,
  Bot
} from 'lucide-react';

export const VOCAB_DATA = [
  { word: "Analyze", pos: "v.", def: "To examine in detail to discover meaning.", zh: "分析", ex: "We need to analyze the data before making a decision.", syn: ["Examine", "Inspect"], audio: "https://dict.youdao.com/dictvoice?audio=Analyze&type=2" },
  { word: "Approach", pos: "n./v.", def: "A way of dealing with something.", zh: "方法/接近", ex: "A new approach to learning can improve results.", syn: ["Method", "Strategy"], audio: "https://dict.youdao.com/dictvoice?audio=Approach&type=2" },
  { word: "Benefit", pos: "n./v.", def: "An advantage or profit gained.", zh: "利益/受益", ex: "The benefits of exercise are well-documented.", syn: ["Advantage", "Gain"], audio: "https://dict.youdao.com/dictvoice?audio=Benefit&type=2" },
  { word: "Concept", pos: "n.", def: "An abstract idea or general notion.", zh: "概念", ex: "It is a difficult concept to grasp at first.", syn: ["Idea", "Notion"], audio: "https://dict.youdao.com/dictvoice?audio=Concept&type=2" },
  { word: "Data", pos: "n.", def: "Facts and statistics collected for analysis.", zh: "数据", ex: "The data suggests a significant trend.", syn: ["Information", "Facts"], audio: "https://dict.youdao.com/dictvoice?audio=Data&type=2" },
  { word: "Evidence", pos: "n.", def: "Facts indicating whether a belief is true.", zh: "证据", ex: "There is no evidence to support that claim.", syn: ["Proof", "Grounds"], audio: "https://dict.youdao.com/dictvoice?audio=Evidence&type=2" },
  { word: "Factor", pos: "n.", def: "A circumstance that contributes to a result.", zh: "因素", ex: "Cost is a major factor in the decision.", syn: ["Element", "Component"], audio: "https://dict.youdao.com/dictvoice?audio=Factor&type=2" },
  { word: "Identify", pos: "v.", def: "Establish or indicate who or what something is.", zh: "识别", ex: "Can you identify the main problem here?", syn: ["Recognize", "Distinguish"], audio: "https://dict.youdao.com/dictvoice?audio=Identify&type=2" },
  { word: "Interpret", pos: "v.", def: "Explain the meaning of information or actions.", zh: "解释/口译", ex: "How do you interpret these findings?", syn: ["Explain", "Clarify"], audio: "https://dict.youdao.com/dictvoice?audio=Interpret&type=2" },
  { word: "Issue", pos: "n.", def: "An important topic or problem for debate.", zh: "问题/议题", ex: "Climate change is a global issue.", syn: ["Problem", "Matter"], audio: "https://dict.youdao.com/dictvoice?audio=Issue&type=2" },
  { word: "Method", pos: "n.", def: "A particular form of procedure for doing something.", zh: "方法", ex: "They used a new method for the experiment.", syn: ["Procedure", "Technique"], audio: "https://dict.youdao.com/dictvoice?audio=Method&type=2" },
  { word: "Period", pos: "n.", def: "A length or portion of time.", zh: "时期", ex: "The company had a period of rapid growth.", syn: ["Time", "Era"], audio: "https://dict.youdao.com/dictvoice?audio=Period&type=2" },
  { word: "Policy", pos: "n.", def: "A course or principle of action adopted.", zh: "政策", ex: "The school has a strict attendance policy.", syn: ["Rule", "Strategy"], audio: "https://dict.youdao.com/dictvoice?audio=Policy&type=2" },
  { word: "Process", pos: "n.", def: "A series of actions or steps taken to achieve an end.", zh: "过程", ex: "Learning a language is a long process.", syn: ["Procedure", "Operation"], audio: "https://dict.youdao.com/dictvoice?audio=Process&type=2" },
  { word: "Role", pos: "n.", def: "The function assumed or part played by someone.", zh: "角色", ex: "Technology plays a key role in modern life.", syn: ["Part", "Function"], audio: "https://dict.youdao.com/dictvoice?audio=Role&type=2" },
  { word: "Section", pos: "n.", def: "A distinct part or portion of something.", zh: "部分", ex: "This section of the report is very detailed.", syn: ["Part", "Segment"], audio: "https://dict.youdao.com/dictvoice?audio=Section&type=2" },
  { word: "Significant", pos: "adj.", def: "Sufficiently great or important to be worthy of attention.", zh: "显著的/重要的", ex: "There was a significant increase in sales.", syn: ["Important", "Notable"], audio: "https://dict.youdao.com/dictvoice?audio=Significant&type=2" },
  { word: "Source", pos: "n.", def: "A place, person, or thing from which something comes.", zh: "来源", ex: "What is the source of this information?", syn: ["Origin", "Root"], audio: "https://dict.youdao.com/dictvoice?audio=Source&type=2" },
  { word: "Structure", pos: "n.", def: "The arrangement of and relations between parts.", zh: "结构", ex: "The structure of the essay must be clear.", syn: ["Framework", "Organization"], audio: "https://dict.youdao.com/dictvoice?audio=Structure&type=2" },
  { word: "Theory", pos: "n.", def: "A system of ideas intended to explain something.", zh: "理论", ex: "He developed a new theory of evolution.", syn: ["Hypothesis", "Principle"], audio: "https://dict.youdao.com/dictvoice?audio=Theory&type=2" },
  { word: "Variable", pos: "n.", def: "An element, feature, or factor that is liable to vary or change.", zh: "变量", ex: "There are too many variables in the experiment.", syn: ["Factor", "Element"], audio: "https://dict.youdao.com/dictvoice?audio=Variable&type=2" },
  { word: "Acquire", pos: "v.", def: "Buy or obtain (an asset or object) for oneself.", zh: "获得", ex: "I managed to acquire all the necessary documents.", syn: ["Obtain", "Get"], audio: "https://dict.youdao.com/dictvoice?audio=Acquire&type=2" },
  { word: "Complex", pos: "adj.", def: "Consisting of many different and connected parts.", zh: "复杂的", ex: "The situation is more complex than it seems.", syn: ["Complicated", "Intricate"], audio: "https://dict.youdao.com/dictvoice?audio=Complex&type=2" },
  { word: "Design", pos: "n./v.", def: "A plan or drawing produced to show the look and function.", zh: "设计", ex: "The design of the building is very modern.", syn: ["Plan", "Blueprint"], audio: "https://dict.youdao.com/dictvoice?audio=Design&type=2" },
];

export const CAMBRIDGE_LIBRARY = Array.from({ length: 18 }, (_, i) => ({
  id: `c${18 - i}`,
  title: `Cambridge IELTS ${18 - i}`,
  tests: [
    { 
      id: `c${18 - i}-t1`, 
      title: "Test 1",
      listening: {
        audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        script: "Welcome to the IELTS Listening test. You will hear a number of different recordings...",
        questions: [
          { q: "1. What is the name of the speaker?", a: "John Smith", explanation: "The speaker introduces himself at the beginning of Section 1." }
        ]
      },
      reading: {
        passages: [
          { 
            title: "The History of Glass", 
            content: "Glass has been used for centuries... It was first discovered in Mesopotamia...",
            questions: [
              { q: "1. Glass was first discovered in Egypt.", a: "False", explanation: "The text states it was first discovered in Mesopotamia." }
            ]
          }
        ]
      },
      writing: {
        task1: { prompt: "The chart shows the percentage of people who...", sample: "The provided line graph illustrates...", comments: "Excellent use of comparative language." },
        task2: { prompt: "Some people believe that technology has...", sample: "In the contemporary era, technology...", comments: "Strong thesis statement and logical flow." }
      },
      speaking: {
        part1: { topic: "Work or Study", questions: ["Do you work or are you a student?"], sample: "I am currently a final year university student..." },
        part2: { topic: "Describe a park you like", cue: ["Where it is", "How often you go"], sample: "I'd like to talk about Central Park..." }
      }
    },
    { id: `c${18 - i}-t2`, title: "Test 2" },
    { id: `c${18 - i}-t3`, title: "Test 3" },
    { id: `c${18 - i}-t4`, title: "Test 4" },
  ]
}));

export const LISTENING_RESOURCES = [
  { title: "BBC 6 Minute English", level: "Intermediate", desc: "Weekly podcast on everyday topics with key vocabulary.", link: "https://www.bbc.co.uk/learningenglish/english/features/6-minute-english" },
  { title: "TED Talks - Education", level: "Advanced", desc: "Inspiring talks from experts on the future of learning.", link: "https://www.ted.com/talks?topics%5B%5D=education" },
  { title: "Cambridge IELTS 18 Listening", level: "Exam Level", desc: "Official practice tests to simulate real exam conditions.", link: "#" },
  { title: "IELTS Podcast", level: "All Levels", desc: "Expert advice and sample answers for listening and speaking.", link: "https://www.ieltspodcast.com/" },
];

export const READING_TECHNIQUES = [
  { 
    title: "Skimming", 
    method: "Read the title, headings, and the first sentence of each paragraph.", 
    example: "Quickly reading a news article to get the 'gist' before diving into details.",
    exercise: "Try to summarize a 500-word article in 30 seconds."
  },
  { 
    title: "Scanning", 
    method: "Move your eyes quickly across the text looking for specific keywords or numbers.", 
    example: "Looking for a specific date or a person's name in a historical text.",
    exercise: "Find 5 specific dates in a provided text within 15 seconds."
  },
  { 
    title: "Paraphrasing", 
    method: "Identify synonyms and restructured sentences that carry the same meaning.", 
    example: "'The city is crowded' -> 'The urban area has a high population density.'",
    exercise: "Rewrite 3 complex sentences using your own words without changing the meaning."
  },
  { 
    title: "Inference", 
    method: "Use clues in the text to understand information that is not explicitly stated.", 
    example: "If a character is 'shivering', you can infer it is cold or they are scared.",
    exercise: "Read a short story and explain the character's mood based on their actions."
  },
];

export const WRITING_SAMPLES = [
  {
    title: "Job Security vs. Job Hopping",
    topic: "Some people think that it is best to work for the same organization for one's whole life. Others think that it is better to change jobs frequently. Discuss both views and give your opinion.",
    band: "9.0",
    highlights: ["Stability", "Career progression", "Versatility", "Economic fluctuations"],
    content: "In the modern labor market, the debate between lifelong employment at a single firm and frequent job changes remains highly relevant. While some prioritize the security of a long-term role, others argue that mobility is key to professional growth. This essay will discuss both perspectives and argue that a balanced approach, favoring strategic changes, is often most beneficial.\n\nOn one hand, staying with one organization offers undeniable stability. Employees who remain loyal often benefit from deep institutional knowledge and a clear sense of belonging. Furthermore, long-term tenure can lead to seniority and reliable pension schemes, which are crucial for financial planning. For instance, in many traditional industries, loyalty is rewarded with steady promotions and job security that protects against market volatility.\n\nOn the other hand, changing jobs frequently allows individuals to acquire a diverse set of skills. By working in different environments, professionals can adapt to various corporate cultures and management styles. This versatility makes them more resilient in a rapidly changing economy. Moreover, 'job hopping' is often the fastest way to secure a significant salary increase, as external hires are frequently offered more competitive packages than internal candidates.\n\nIn my opinion, while the security of a single employer is comforting, the benefits of changing jobs—especially in the early stages of a career—outweigh the drawbacks. It fosters a growth mindset and prevents professional stagnation. However, these changes should be purposeful rather than impulsive.\n\nIn conclusion, both paths have their merits. Lifelong loyalty provides peace of mind, but frequent, strategic transitions offer the breadth of experience necessary for success in the 21st century.",
    comments: "This response demonstrates a sophisticated command of language. The introduction clearly outlines the discussion, and the body paragraphs are logically structured with clear topic sentences. The vocabulary is precise (e.g., 'institutional knowledge', 'market volatility', 'professional stagnation') and the grammar is flawless."
  }
];

export const SPEAKING_TOPICS = [
  {
    part: "Part 1",
    title: "Hometown & Accommodation",
    questions: [
      "Where is your hometown?",
      "What do you like most about your hometown?",
      "Do you live in a house or an apartment?"
    ],
    sampleAnswer: "My hometown is a vibrant coastal city in the south. What I love most is the blend of modern architecture and traditional markets. Currently, I live in a cozy apartment near the city center, which is very convenient for commuting."
  },
  {
    part: "Part 2",
    title: "Describe a book you enjoyed reading",
    cueCard: [
      "What the book was",
      "When you read it",
      "What it was about",
      "And explain why you enjoyed it"
    ],
    sampleAnswer: "I'd like to talk about 'The Great Gatsby' by F. Scott Fitzgerald. I read it during my university years. It's set in the 1920s and explores themes of wealth, love, and the American Dream. I enjoyed it because of its lyrical prose and the tragic depth of the characters."
  }
];

export const MOCK_EXAMS = [
  {
    id: "ielts-mock-01",
    title: "IELTS Academic Full Test 01",
    duration: "2h 45m",
    sections: ["Listening", "Reading", "Writing", "Speaking"],
    difficulty: "Medium",
    status: "Available"
  },
  {
    id: "ielts-mock-02",
    title: "IELTS Academic Full Test 02",
    duration: "2h 45m",
    sections: ["Listening", "Reading", "Writing", "Speaking"],
    difficulty: "Hard",
    status: "Locked"
  }
];

export const REVIEW_DATA = {
  wrongQuestions: [
    { type: "Listening", question: "Section 1 - Spelling of 'Sakurajima'", correct: "Sakurajima", user: "Sakurajema", date: "2026-04-14" },
    { type: "Reading", question: "T/F/NG - Paragraph 3 Inference", correct: "False", user: "Not Given", date: "2026-04-15" }
  ],
  weakPoints: [
    { area: "Writing Task 1", description: "Describing trends in line graphs.", improvement: "Practice using varied verbs like 'fluctuate', 'plateau', and 'plummet'." },
    { area: "Speaking Part 3", description: "Extending answers on abstract topics.", improvement: "Use the P.R.E.P (Point, Reason, Example, Point) method." }
  ]
};

export const AI_SPEAKING_TOPICS = [
  {
    id: "p1-hobbies",
    part: "Part 1",
    title: "Hobbies & Interests",
    questions: [
      "What do you like to do in your free time?",
      "Did you have any different hobbies when you were a child?",
      "Is it important to have a hobby?"
    ]
  },
  {
    id: "p2-travel",
    part: "Part 2",
    title: "Describe a memorable journey",
    cueCard: [
      "Where you went",
      "Who you went with",
      "What you did there",
      "And explain why it was memorable"
    ]
  },
  {
    id: "p3-tourism",
    part: "Part 3",
    title: "Tourism & Culture",
    questions: [
      "How has tourism changed in your country in recent years?",
      "What are the benefits of international travel?",
      "Do you think people should respect local customs when they travel?"
    ]
  }
];

// 分级单词库
export const DICTATION_WORDS = {
  easy: [
    { id: 'd1', zh: "苹果", en: "apple", words: ["apple"] },
    { id: 'd2', zh: "书本", en: "book", words: ["book"] },
    { id: 'd3', zh: "猫", en: "cat", words: ["cat"] },
    { id: 'd4', zh: "狗", en: "dog", words: ["dog"] },
    { id: 'd5', zh: "鸡蛋", en: "egg", words: ["egg"] },
    { id: 'd6', zh: "鱼", en: "fish", words: ["fish"] },
    { id: 'd7', zh: "女孩", en: "girl", words: ["girl"] },
    { id: 'd8', zh: "家", en: "home", words: ["home"] },
    { id: 'd9', zh: "冰", en: "ice", words: ["ice"] },
    { id: 'd10', zh: "果汁", en: "juice", words: ["juice"] },
    { id: 'd11', zh: "国王", en: "king", words: ["king"] },
    { id: 'd12', zh: "台灯", en: "lamp", words: ["lamp"] },
    { id: 'd13', zh: "月亮", en: "moon", words: ["moon"] },
    { id: 'd14', zh: "鼻子", en: "nose", words: ["nose"] },
    { id: 'd15', zh: "橙子", en: "orange", words: ["orange"] },
    { id: 'd16', zh: "钢笔", en: "pen", words: ["pen"] },
    { id: 'd17', zh: "女王", en: "queen", words: ["queen"] },
    { id: 'd18', zh: "下雨", en: "rain", words: ["rain"] },
    { id: 'd19', zh: "太阳", en: "sun", words: ["sun"] },
    { id: 'd20', zh: "树木", en: "tree", words: ["tree"] },
    { id: 'd21', zh: "上面", en: "up", words: ["up"] },
    { id: 'd22', zh: "货车", en: "van", words: ["van"] },
    { id: 'd23', zh: "水", en: "water", words: ["water"] },
    { id: 'd24', zh: "黄色", en: "yellow", words: ["yellow"] },
    { id: 'd25', zh: "动物园", en: "zoo", words: ["zoo"] }
  ],
  medium: [
    { id: 'd26', zh: "机会", en: "opportunity", words: ["opportunity"] },
    { id: 'd27', zh: "推荐", en: "recommend", words: ["recommend"] },
    { id: 'd28', zh: "重要的", en: "important", words: ["important"] },
    { id: 'd29', zh: "困难的", en: "difficult", words: ["difficult"] },
    { id: 'd30', zh: "成功", en: "success", words: ["success"] },
    { id: 'd31', zh: "失败", en: "failure", words: ["failure"] },
    { id: 'd32', zh: "经验", en: "experience", words: ["experience"] },
    { id: 'd33', zh: "知识", en: "knowledge", words: ["knowledge"] },
    { id: 'd34', zh: "技能", en: "skill", words: ["skill"] },
    { id: 'd35', zh: "挑战", en: "challenge", words: ["challenge"] },
    { id: 'd36', zh: "目标", en: "goal", words: ["goal"] },
    { id: 'd37', zh: "计划", en: "plan", words: ["plan"] },
    { id: 'd38', zh: "执行", en: "execute", words: ["execute"] },
    { id: 'd39', zh: "分析", en: "analyze", words: ["analyze"] },
    { id: 'd40', zh: "解决", en: "solve", words: ["solve"] },
    { id: 'd41', zh: "创新", en: "innovate", words: ["innovate"] },
    { id: 'd42', zh: "合作", en: "cooperate", words: ["cooperate"] },
    { id: 'd43', zh: "沟通", en: "communicate", words: ["communicate"] },
    { id: 'd44', zh: "领导", en: "lead", words: ["lead"] },
    { id: 'd45', zh: "管理", en: "manage", words: ["manage"] },
    { id: 'd46', zh: "组织", en: "organize", words: ["organize"] },
    { id: 'd47', zh: "协调", en: "coordinate", words: ["coordinate"] },
    { id: 'd48', zh: "监督", en: "supervise", words: ["supervise"] },
    { id: 'd49', zh: "评估", en: "evaluate", words: ["evaluate"] },
    { id: 'd50', zh: "改进", en: "improve", words: ["improve"] }
  ],
  hard: [
    { id: 'd51', zh: "住宿", en: "accommodation", words: ["accommodation"] },
    { id: 'd52', zh: "情况", en: "circumstance", words: ["circumstance"] },
    { id: 'd53', zh: "环境", en: "environment", words: ["environment"] },
    { id: 'd54', zh: "基础设施", en: "infrastructure", words: ["infrastructure"] },
    { id: 'd55', zh: "可持续性", en: "sustainability", words: ["sustainability"] },
    { id: 'd56', zh: "全球化", en: "globalization", words: ["globalization"] },
    { id: 'd57', zh: "技术", en: "technology", words: ["technology"] },
    { id: 'd58', zh: "创新", en: "innovation", words: ["innovation"] },
    { id: 'd59', zh: "发展", en: "development", words: ["development"] },
    { id: 'd60', zh: "经济", en: "economy", words: ["economy"] },
    { id: 'd61', zh: "政策", en: "policy", words: ["policy"] },
    { id: 'd62', zh: "法规", en: "regulation", words: ["regulation"] },
    { id: 'd63', zh: "标准", en: "standard", words: ["standard"] },
    { id: 'd64', zh: "质量", en: "quality", words: ["quality"] },
    { id: 'd65', zh: "效率", en: "efficiency", words: ["efficiency"] },
    { id: 'd66', zh: "效益", en: "effectiveness", words: ["effectiveness"] },
    { id: 'd67', zh: "竞争力", en: "competitiveness", words: ["competitiveness"] },
    { id: 'd68', zh: "市场", en: "market", words: ["market"] },
    { id: 'd69', zh: "消费者", en: "consumer", words: ["consumer"] },
    { id: 'd70', zh: "生产者", en: "producer", words: ["producer"] },
    { id: 'd71', zh: "供应商", en: "supplier", words: ["supplier"] },
    { id: 'd72', zh: "分销商", en: "distributor", words: ["distributor"] },
    { id: 'd73', zh: "零售商", en: "retailer", words: ["retailer"] },
    { id: 'd74', zh: "顾客", en: "customer", words: ["customer"] },
    { id: 'd75', zh: "客户", en: "client", words: ["client"] }
  ]
};

// 分级句子库
export const DICTATION_SENTENCES = {
  easy: [
    { id: 's1', zh: "我每天早上吃一个苹果。", en: "I eat an apple every morning.", words: ["I", "eat", "an", "apple", "every", "morning"] },
    { id: 's2', zh: "她正在读一本新书。", en: "She is reading a new book.", words: ["She", "is", "reading", "a", "new", "book"] },
    { id: 's3', zh: "我的猫睡在沙发上。", en: "My cat sleeps on the sofa.", words: ["My", "cat", "sleeps", "on", "the", "sofa"] },
    { id: 's4', zh: "这只狗非常友好。", en: "The dog is very friendly.", words: ["The", "dog", "is", "very", "friendly"] },
    { id: 's5', zh: "我早餐吃了两个鸡蛋。", en: "I had two eggs for breakfast.", words: ["I", "had", "two", "eggs", "for", "breakfast"] },
    { id: 's6', zh: "这家餐厅的鱼很新鲜。", en: "The fish at this restaurant is fresh.", words: ["The", "fish", "at", "this", "restaurant", "is", "fresh"] },
    { id: 's7', zh: "那个小女孩正在笑。", en: "The little girl is smiling.", words: ["The", "little", "girl", "is", "smiling"] },
    { id: 's8', zh: "我放学后就直接回家。", en: "I go home right after school.", words: ["I", "go", "home", "right", "after", "school"] },
    { id: 's9', zh: "夏天我喜欢喝冰水。", en: "I like ice water in summer.", words: ["I", "like", "ice", "water", "in", "summer"] },
    { id: 's10', zh: "他每天早上喝橙汁。", en: "He drinks orange juice every morning.", words: ["He", "drinks", "orange", "juice", "every", "morning"] }
  ],
  medium: [
    { id: 's11', zh: "她向我推荐了一家好餐厅。", en: "She recommended a good restaurant to me.", words: ["She", "recommended", "a", "good", "restaurant", "to", "me"] },
    { id: 's12', zh: "我有机会去国外学习。", en: "I have an opportunity to study abroad.", words: ["I", "have", "an", "opportunity", "to", "study", "abroad"] },
    { id: 's13', zh: "重要的是保持健康的生活方式。", en: "It is important to maintain a healthy lifestyle.", words: ["It", "is", "important", "to", "maintain", "a", "healthy", "lifestyle"] },
    { id: 's14', zh: "我发现学习英语很困难。", en: "I find it difficult to learn English.", words: ["I", "find", "it", "difficult", "to", "learn", "English"] },
    { id: 's15', zh: "成功需要努力工作和坚持。", en: "Success requires hard work and persistence.", words: ["Success", "requires", "hard", "work", "and", "persistence"] },
    { id: 's16', zh: "失败是成功之母。", en: "Failure is the mother of success.", words: ["Failure", "is", "the", "mother", "of", "success"] },
    { id: 's17', zh: "我有很多工作经验。", en: "I have a lot of work experience.", words: ["I", "have", "a", "lot", "of", "work", "experience"] },
    { id: 's18', zh: "知识就是力量。", en: "Knowledge is power.", words: ["Knowledge", "is", "power"] },
    { id: 's19', zh: "我需要提高我的沟通技能。", en: "I need to improve my communication skills.", words: ["I", "need", "to", "improve", "my", "communication", "skills"] },
    { id: 's20', zh: "面对挑战，我们应该保持积极。", en: "We should stay positive in the face of challenges.", words: ["We", "should", "stay", "positive", "in", "the", "face", "of", "challenges"] }
  ],
  hard: [
    { id: 's21', zh: "大学提供的住宿非常方便。", en: "The accommodation provided by the university is very convenient.", words: ["The", "accommodation", "provided", "by", "the", "university", "is", "very", "convenient"] },
    { id: 's22', zh: "在这种情况下，我们需要采取行动。", en: "Under these circumstances, we need to take action.", words: ["Under", "these", "circumstances", "we", "need", "to", "take", "action"] },
    { id: 's23', zh: "保护环境是我们的责任。", en: "Protecting the environment is our responsibility.", words: ["Protecting", "the", "environment", "is", "our", "responsibility"] },
    { id: 's24', zh: "城市的基础设施需要改善。", en: "The city's infrastructure needs to be improved.", words: ["The", "city's", "infrastructure", "needs", "to", "be", "improved"] },
    { id: 's25', zh: "可持续发展是我们的目标。", en: "Sustainable development is our goal.", words: ["Sustainable", "development", "is", "our", "goal"] },
    { id: 's26', zh: "全球化带来了很多机会。", en: "Globalization has brought many opportunities.", words: ["Globalization", "has", "brought", "many", "opportunities"] },
    { id: 's27', zh: "技术创新改变了我们的生活。", en: "Technological innovation has changed our lives.", words: ["Technological", "innovation", "has", "changed", "our", "lives"] },
    { id: 's28', zh: "经济发展需要稳定的政策。", en: "Economic development requires stable policies.", words: ["Economic", "development", "requires", "stable", "policies"] },
    { id: 's29', zh: "政府应该制定合理的法规。", en: "The government should formulate reasonable regulations.", words: ["The", "government", "should", "formulate", "reasonable", "regulations"] },
    { id: 's30', zh: "提高产品质量是企业的核心竞争力。", en: "Improving product quality is the core competitiveness of enterprises.", words: ["Improving", "product", "quality", "is", "the", "core", "competitiveness", "of", "enterprises"] }
  ]
};

// 兼容旧代码的导出
export const DICTATION_DATA = [
  ...DICTATION_WORDS.easy,
  ...DICTATION_WORDS.medium,
  ...DICTATION_WORDS.hard
];

// 兼容旧代码的句子数据
export const DICTATION_SENTENCES_OLD = [
  { id: 's53', zh: "这块蛋糕非常甜。", en: "This cake tastes very sweet.", words: ["This", "cake", "tastes", "very", "sweet"], level: "Daily" },
  { id: 's54', zh: "这杯柠檬汁很酸。", en: "This lemon juice is very sour.", words: ["This", "lemon", "juice", "is", "very", "sour"], level: "Daily" },
  { id: 's55', zh: "这杯咖啡有点苦。", en: "The coffee is a bit bitter.", words: ["The", "coffee", "is", "a", "bit", "bitter"], level: "Daily" },
  { id: 's56', zh: "这碗汤太咸了。", en: "This soup is too salty.", words: ["This", "soup", "is", "too", "salty"], level: "Daily" },
  { id: 's57', zh: "这只猫最近变胖了。", en: "This cat has become fat recently.", words: ["This", "cat", "has", "become", "fat", "recently"], level: "Daily" },
  { id: 's58', zh: "她看起来比以前瘦了。", en: "She looks thinner than before.", words: ["She", "looks", "thinner", "than", "before"], level: "Daily" },
  { id: 's59', zh: "这个湖非常深。", en: "This lake is very deep.", words: ["This", "lake", "is", "very", "deep"], level: "Daily" },
  { id: 's60', zh: "游泳池这边比较浅。", en: "This side of the pool is shallow.", words: ["This", "side", "of", "the", "pool", "is", "shallow"], level: "Daily" },
  { id: 's61', zh: "这个箱子很重。", en: "This box is very heavy.", words: ["This", "box", "is", "very", "heavy"], level: "Daily" },
  { id: 's62', zh: "这个包裹很轻。", en: "This package is very light.", words: ["This", "package", "is", "very", "light"], level: "Daily" },
  { id: 's63', zh: "这件外套很贵。", en: "This coat is very expensive.", words: ["This", "coat", "is", "very", "expensive"], level: "Daily" },
  { id: 's64', zh: "这家店的水果很便宜。", en: "Fruits at this shop are cheap.", words: ["Fruits", "at", "this", "shop", "are", "cheap"], level: "Daily" },
  { id: 's65', zh: "这片海滩非常美丽。", en: "This beach is very beautiful.", words: ["This", "beach", "is", "very", "beautiful"], level: "Daily" },
  { id: 's66', zh: "他觉得那幅画很丑。", en: "He thinks that painting is ugly.", words: ["He", "thinks", "that", "painting", "is", "ugly"], level: "Daily" },
  { id: 's67', zh: "请保持房间干净。", en: "Please keep the room clean.", words: ["Please", "keep", "the", "room", "clean"], level: "Daily" },
  { id: 's68', zh: "下雨后地面很脏。", en: "The ground is dirty after rain.", words: ["The", "ground", "is", "dirty", "after", "rain"], level: "Daily" },
  { id: 's69', zh: "他的肚子已经饱了。", en: "His stomach is already full.", words: ["His", "stomach", "is", "already", "full"], level: "Daily" },
  { id: 's70', zh: "这个瓶子是空的。", en: "This bottle is empty.", words: ["This", "bottle", "is", "empty"], level: "Daily" },
  { id: 's71', zh: "他的身体很强壮。", en: "His body is very strong.", words: ["His", "body", "is", "very", "strong"], level: "Daily" },
  { id: 's72', zh: "感冒让我感觉很虚弱。", en: "The cold makes me feel weak.", words: ["The", "cold", "makes", "me", "feel", "weak"], level: "Daily" },
  { id: 's73', zh: "她是个聪明的学生。", en: "She is a smart student.", words: ["She", "is", "a", "smart", "student"], level: "Daily" },
  { id: 's74', zh: "不要做愚蠢的事情。", en: "Do not do stupid things.", words: ["Do", "not", "do", "stupid", "things"], level: "Daily" },
  { id: 's75', zh: "他来自一个富裕的家庭。", en: "He comes from a rich family.", words: ["He", "comes", "from", "a", "rich", "family"], level: "Daily" },
  { id: 's76', zh: "他小时候家里很穷。", en: "His family was poor in childhood.", words: ["His", "family", "was", "poor", "in", "childhood"], level: "Daily" },
  { id: 's77', zh: "那个年轻人很有礼貌。", en: "That young man is very polite.", words: ["That", "young", "man", "is", "very", "polite"], level: "Daily" },
  { id: 's78', zh: "她工作日总是很忙。", en: "She is always busy on weekdays.", words: ["She", "is", "always", "busy", "on", "weekdays"], level: "Daily" },
  { id: 's79', zh: "不要做一个懒惰的人。", en: "Do not be a lazy person.", words: ["Do", "not", "be", "a", "lazy", "person"], level: "Daily" },
  { id: 's80', zh: "他是一个勇敢的消防员。", en: "He is a brave firefighter.", words: ["He", "is", "a", "brave", "firefighter"], level: "Daily" },
  ...Array.from({ length: 420 }, (_, i) => {
    const n = 81 + i;
    return {
      id: `s${n}`,
      zh: `日常生活例句 ${n}`,
      en: `This is a common daily sentence number ${n}`,
      words: ["This", "is", "a", "common", "daily", "sentence", "number", `${n}`],
      level: "Daily",
    };
  }),
];

export const STUDY_MODULES = [
  { id: 'ai-speaking', title: 'AI 口语教练', desc: 'AI 实时对练 · 深度估分', icon: Bot, progress: 0, total: '专业对练' },
  { id: 'library', title: '剑桥真题库', desc: 'Cambridge IELTS 1-18 全集', icon: Library, progress: 10, total: '2/72 套' },
  { id: 'vocab', title: '雅思单词', desc: '1500+ 核心词库 · 包含发音', icon: SpellCheck, progress: 32, total: '256/1500 词' },
  { id: 'dictation', title: '听写打字', desc: '雅思核心句库 · 逐词特训', icon: ClipboardCheck, progress: 0, total: '0/50 关' },
  { id: 'listening', title: '听力材料', desc: '精听训练模式 · 官方资源', icon: Headphones, progress: 45, total: '14/30 单元' },
  { id: 'reading', title: '阅读技巧', desc: '长难句破解 · 技巧专项', icon: BookOpen, progress: 20, total: '11/55 章' },
  { id: 'writing', title: '写作范文', desc: 'Band 7-9 范文 · 深度点评', icon: Edit, progress: 15, total: '3/20 篇' },
  { id: 'speaking', title: '口语练习', desc: '真题话题 · 录音跟读', icon: Mic, progress: 10, total: '5/50 话题' },
  { id: 'mock', title: '模拟考试', desc: '全真模拟 · 自动评分', icon: ClipboardCheck, progress: 0, total: '0/10 套' },
  { id: 'review', title: '复习中心', desc: '错题收集 · 弱项强化', icon: History, progress: 60, total: '12 处弱项' },
];
