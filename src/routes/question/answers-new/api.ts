import { QuestionWithAnswers, Answer } from '../../../types';
import { BaseURL } from '../../../config';

export type NewAnswer = {
  QuestionId: number;
  Body: string;
  AuthorLdapId: string;
  // 添付ファイルや他項目が必要なら追加
};

// 質問＋他の回答一覧一括取得API
export async function fetchQuestionWithAnswers(questionId: number): Promise<QuestionWithAnswers> {
  try {
    const res = await fetch(`${BaseURL}/odata/Questions(${questionId})?$expand=Answers($select=Id,Body,Created,IsBest;$expand=AuthorLdap($select=HandleName))`);
    if (!res.ok) throw new Error('質問・回答取得に失敗しました');
    const data = await res.json();
    return data as QuestionWithAnswers;
  } catch (e: any) {
    throw new Error(e?.message || '質問・回答取得時にエラーが発生しました');
  }
}

// 新規回答投稿API
export async function addAnswer(input: NewAnswer): Promise<Answer> {
  try {
    const res = await fetch(`${BaseURL}/odata/Answers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    if (!res.ok) throw new Error('回答投稿に失敗しました');
    const data = await res.json();
    return data.value as Answer;
  } catch (e: any) {
    throw new Error(e?.message || '回答投稿時にエラーが発生しました');
  }
}
