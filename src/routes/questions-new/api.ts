import { BaseURL } from '../../config';
import { Category, Tag, Question } from '../../types';

// 質問登録用型（id, created, closed, votes等は除外）
export type NewQuestion = {
  Title: string;
  Body: string;
  CategoryId: number;
  Tags?: number[]; // タグID配列
  AuthorLdapId?: string; // ログインユーザーから取得する場合は不要
};

// 質問登録API
export async function addQuestion(input: NewQuestion): Promise<Question> {
  const res = await fetch(`${BaseURL}/odata/questions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error('質問登録に失敗しました');
  return await res.json();
}

// カテゴリ一覧取得API
export async function fetchCategories(): Promise<Category[]> {
  const res = await fetch(`${BaseURL}/odata/categories?$orderby=Name`);
  if (!res.ok) throw new Error('カテゴリ取得失敗');
  const data = await res.json();
  return data.value as Category[];
}

// タグ一覧取得API
export async function fetchTags(): Promise<Tag[]> {
  const res = await fetch(`${BaseURL}/odata/tags?$orderby=Name`);
  if (!res.ok) throw new Error('タグ取得失敗');
  const data = await res.json();
  return data.value as Tag[];
}
