import React from 'react';
import { animalEmojiMap } from '../config';

/**
 * ユーザーのハンドルネームを絵文字付きで表示する共通コンポーネント
 * @param handleName 例: Cat_123
 */
export const UserHandle: React.FC<{ handleName?: string | null; fontSize?: string }>
  = ({ handleName, fontSize = '1em' }) => {
  if (!handleName) return null;
  const animal = handleName.split('_')[0];
  const emoji = animalEmojiMap[animal] || '';
  return (
    <span style={{ fontSize, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      <span>{emoji}</span>
      <span>{handleName}</span>
    </span>
  );
};
