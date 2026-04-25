/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Question {
  id: number;
  text: string;
  options: string[];
  answer: string; // The text of the correct option
  level: 1 | 2 | 3;
}

export interface Team {
  id: string;
  name: string;
  color: string;
  score: number;
}

export const QUESTIONS: Question[] = [
  // LEVEL 1 — EASY
  {
    id: 1,
    level: 1,
    text: "Who built the ark to survive the flood?",
    options: ["Abraham", "Moses", "Noah", "David"],
    answer: "Noah",
  },
  {
    id: 2,
    level: 1,
    text: "Who was swallowed by a great fish?",
    options: ["Jonah", "Peter", "Samuel", "Elijah"],
    answer: "Jonah",
  },
  {
    id: 3,
    level: 1,
    text: "Who killed Goliath?",
    options: ["Saul", "David", "Joshua", "Samson"],
    answer: "David",
  },
  {
    id: 4,
    level: 1,
    text: "Who led the Israelites out of Egypt?",
    options: ["Moses", "Joseph", "Aaron", "Joshua"],
    answer: "Moses",
  },
  {
    id: 5,
    level: 1,
    text: "What is the first book of the Bible?",
    options: ["Exodus", "Genesis", "Matthew", "Psalms"],
    answer: "Genesis",
  },
  {
    id: 6,
    level: 1,
    text: "Who was thrown into the lions’ den?",
    options: ["Daniel", "Joseph", "Peter", "Paul"],
    answer: "Daniel",
  },
  {
    id: 7,
    level: 1,
    text: "How many days did God take to create the world?",
    options: ["5", "6", "7", "10"],
    answer: "6",
  },
  {
    id: 8,
    level: 1,
    text: "Who was the mother of Jesus?",
    options: ["Martha", "Elizabeth", "Mary", "Anna"],
    answer: "Mary",
  },

  // LEVEL 2 — HARD
  {
    id: 9,
    level: 2,
    text: "What was the name of Abraham’s wife?",
    options: ["Rebekah", "Sarah", "Leah", "Rachel"],
    answer: "Sarah",
  },
  {
    id: 10,
    level: 2,
    text: "Who interpreted Pharaoh’s dreams in Egypt?",
    options: ["Moses", "Joseph", "Daniel", "Aaron"],
    answer: "Joseph",
  },
  {
    id: 11,
    level: 2,
    text: "What river was Jesus baptized in?",
    options: ["Nile", "Jordan", "Euphrates", "Tigris"],
    answer: "Jordan",
  },
  {
    id: 12,
    level: 2,
    text: "Who replaced Judas Iscariot as an apostle?",
    options: ["Barnabas", "Matthias", "Silas", "Timothy"],
    answer: "Matthias",
  },
  {
    id: 13,
    level: 2,
    text: "What is the shortest verse in the Bible?",
    options: ["Pray without ceasing", "Jesus wept", "God is love", "Fear not"],
    answer: "Jesus wept",
  },
  {
    id: 14,
    level: 2,
    text: "Who was the strongest man in the Bible?",
    options: ["Samson", "Saul", "Gideon", "Joshua"],
    answer: "Samson",
  },
  {
    id: 15,
    level: 2,
    text: "How many books are in the New Testament?",
    options: ["27", "39", "24", "30"],
    answer: "27",
  },
  {
    id: 16,
    level: 2,
    text: "What was Paul’s name before he became a Christian?",
    options: ["Simon", "Saul", "Silas", "Seth"],
    answer: "Saul",
  },

  // LEVEL 3 — VERY HARD
  {
    id: 17,
    level: 3,
    text: "What was the name of the high priest who judged Jesus?",
    options: ["Annas", "Caiaphas", "Gamaliel", "Eli"],
    answer: "Caiaphas",
  },
  {
    id: 18,
    level: 3,
    text: "Who was the father of John the Baptist?",
    options: ["Joseph", "Zechariah", "Eli", "Nicodemus"],
    answer: "Zechariah",
  },
  {
    id: 19,
    level: 3,
    text: "Which prophet married a prostitute as a sign to Israel?",
    options: ["Hosea", "Isaiah", "Jeremiah", "Amos"],
    answer: "Hosea",
  },
  {
    id: 20,
    level: 3,
    text: "How many stones did David take when he fought Goliath?",
    options: ["3", "4", "5", "7"],
    answer: "5",
  },
  {
    id: 21,
    level: 3,
    text: "Who fell asleep and fell out of a window while Paul was preaching?",
    options: ["Eutychus", "Tychicus", "Epaphras", "Onesimus"],
    answer: "Eutychus",
  },
  {
    id: 22,
    level: 3,
    text: "What island was Paul shipwrecked on?",
    options: ["Crete", "Malta", "Cyprus", "Patmos"],
    answer: "Malta",
  },
  {
    id: 23,
    level: 3,
    text: "Who was the first Christian martyr?",
    options: ["Peter", "Stephen", "James", "Andrew"],
    answer: "Stephen",
  },
  {
    id: 24,
    level: 3,
    text: "Which king saw the “writing on the wall”?",
    options: ["Nebuchadnezzar", "Belshazzar", "Darius", "Cyrus"],
    answer: "Belshazzar",
  },
];

export const INITIAL_TEAMS: Team[] = [
  { id: "blue", name: "Blue Team", color: "#3B82F6", score: 0 },
  { id: "red", name: "Red Team", color: "#EF4444", score: 0 },
  { id: "yellow", name: "Yellow Team", color: "#FFD700", score: 0 },
  { id: "green", name: "Green Team", color: "#10B981", score: 0 },
  { id: "orange", name: "Orange Team", color: "#F97316", score: 0 },
  { id: "violet", name: "Violet Team", color: "#8B5CF6", score: 0 },
];

export const TIMER_DURATION = 30; // seconds per question
