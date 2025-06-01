import { Question, Answer, Category } from "../../types";
import { BaseURL } from "../../config";

export interface ExpandedQuestion extends Question {
  Answers?: Answer[];
  Category?: Category;
}

/**
 * 質問詳細＋回答リストを取得するAPIラッパー
 * @param id 質問ID
 * @returns ExpandedQuestion（Answers含む）
 * @throws エラー時は例外
 */
export async function fetchQuestionWithAnswers(id: string | number): Promise<ExpandedQuestion> {
  const expand = "$expand=AuthorLdap($select=HandleName),Answers($select=Id,Body,Created,IsBest;$expand=AuthorLdap($select=HandleName)),Category($select=Name)";
  const select="$select=Id,Title,Body,Created,Closed,Tags";
  const res = await fetch(`${BaseURL}/odata/Questions(${id})?${expand}&${select}`);
  const contentType = res.headers.get('content-type');
  if (!res.ok) throw new Error("質問データの取得に失敗しました");
  if (!contentType || !contentType.includes('application/json')) {
    throw new Error('APIレスポンスが不正です。APIサーバーやURLをご確認ください');
  }
  return await res.json();
}
