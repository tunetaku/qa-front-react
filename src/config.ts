// src/config.ts

export const BaseURL = 'http://localhost:5001';

// 動物名→絵文字マッピング（共通化用）
export const animalEmojiMap: Record<string, string> = {
  Cat: '🐱', Dog: '🐶', Lion: '🦁', Tiger: '🐯', Bear: '🐻', Wolf: '🐺',
  Eagle: '🦅', Falcon: '🦅', Rabbit: '🐰', Fox: '🦊', Dolphin: '🐬',
  Shark: '🦈', Whale: '🐋', Horse: '🐴', Sheep: '🐑', Koala: '🐨',
  Panda: '🐼', Turtle: '🐢', Star: '⭐', Cloud: '☁️', River: '🏞️',
  Forest: '🌳', Mountain: '⛰️', Sun: '🌞', Moon: '🌙'
};

