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
  // LEVEL 1 — EASY (Multiple Choice)
  {
    id: 1,
    level: 1,
    text: "What animal spoke to Balaam?",
    options: ["Snake", "Donkey", "Lion", "Horse"],
    answer: "Donkey",
  },
  {
    id: 2,
    level: 1,
    text: "What was the name of Abraham’s wife?",
    options: ["Rebekah", "Rachel", "Sarah", "Leah"],
    answer: "Sarah",
  },
  {
    id: 3,
    level: 1,
    text: "Where did Jesus grow up?",
    options: ["Bethlehem", "Jerusalem", "Nazareth", "Capernaum"],
    answer: "Nazareth",
  },
  {
    id: 4,
    level: 1,
    text: "What did God create on the first day?",
    options: ["Sun and moon", "Light", "Animals", "Plants"],
    answer: "Light",
  },
  {
    id: 5,
    level: 1,
    text: "How many days did God take to create the world?",
    options: ["5", "6", "7", "8"],
    answer: "6",
  },
  {
    id: 6,
    level: 1,
    text: "What did manna represent for the Israelites?",
    options: ["Meat", "Bread from heaven", "Water", "Fruit"],
    answer: "Bread from heaven",
  },
  {
    id: 7,
    level: 1,
    text: "Who was thrown into the lions’ den?",
    options: ["Elijah", "Elisha", "Daniel", "Isaiah"],
    answer: "Daniel",
  },
  {
    id: 8,
    level: 1,
    text: "How many books are in the New Testament?",
    options: ["25", "27", "29", "31"],
    answer: "27",
  },
  {
    id: 9,
    level: 1,
    text: "Who was Isaac’s wife?",
    options: ["Rachel", "Leah", "Rebekah", "Miriam"],
    answer: "Rebekah",
  },
  {
    id: 10,
    level: 1,
    text: "What did Jesus turn water into?",
    options: ["Oil", "Juice", "Wine", "Honey"],
    answer: "Wine",
  },

  // LEVEL 2 — MEDIUM (No Multiple Choice)
  {
    id: 11,
    level: 2,
    text: "What is the name of the place where Jesus was crucified?",
    options: [],
    answer: "Calvary / Golgotha",
  },
  {
    id: 12,
    level: 2,
    text: "What is the shortest verse in the Bible?",
    options: [],
    answer: "John 11:35 “Jesus wept”.",
  },
  {
    id: 13,
    level: 2,
    text: "Where did Moses receive the 10 Commandments?",
    options: [],
    answer: "Mount Sinai",
  },
  {
    id: 14,
    level: 2,
    text: "Who was the Man who walked with God and was taken to heaven without dying?",
    options: [],
    answer: "Enoch",
  },
  {
    id: 15,
    level: 2,
    text: "What is the name of the king who wrote many of the Psalms?",
    options: [],
    answer: "David",
  },
  {
    id: 16,
    level: 2,
    text: "Who is the tax collector who climbed a tree to see Jesus?",
    options: [],
    answer: "Zacchaeus",
  },
  {
    id: 17,
    level: 2,
    text: "Who is the disciple who betrayed Jesus?",
    options: [],
    answer: "Judas Iscariot",
  },
  {
    id: 18,
    level: 2,
    text: "What is the name of the king who asked God for wisdom instead of riches?",
    options: [],
    answer: "Solomon",
  },
  {
    id: 19,
    level: 2,
    text: "Who was thrown into the fiery furnace but survived?",
    options: [],
    answer: "Shadrach, Meshach and Abednego",
  },
  {
    id: 20,
    level: 2,
    text: "Which book in the Bible contains the Ten Commandments?",
    options: [],
    answer: "Exodus",
  },

  // LEVEL 3 — HARD (No Multiple Choice)
  {
    id: 21,
    level: 3,
    text: "Who is the woman who became queen and saved her people?",
    options: [],
    answer: "Esther",
  },
  {
    id: 22,
    level: 3,
    text: "Where was Jesus baptized?",
    options: [],
    answer: "Jordan River",
  },
  {
    id: 23,
    level: 3,
    text: "What is the name of the man who wrestled with God?",
    options: [],
    answer: "Jacob",
  },
  {
    id: 24,
    level: 3,
    text: "Who is the first Christian martyr?",
    options: [],
    answer: "Stephen",
  },
  {
    id: 25,
    level: 3,
    text: "Who is the prophet who anointed both Saul and David as kings?",
    options: [],
    answer: "Samuel",
  },
  {
    id: 26,
    level: 3,
    text: "What is the name of the woman who hid the Israelite spies in Jericho?",
    options: [],
    answer: "Rahab",
  },
  {
    id: 27,
    level: 3,
    text: "Who is the Judge of Israel who defeated the Midianites with only 300 men?",
    options: [],
    answer: "Gideon",
  },
  {
    id: 28,
    level: 3,
    text: "What kind of wood was used by Noah to make the Ark?",
    options: [],
    answer: "Gopher Wood",
  },
  {
    id: 29,
    level: 3,
    text: "How many of Jacob’s children were named in the Bible?",
    options: [],
    answer: "13",
  },
  {
    id: 30,
    level: 3,
    text: "Which trees are in the middle of the Garden of Eden?",
    options: [],
    answer: "Tree of the Knowledge of Good and Evil and Tree of Life",
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
