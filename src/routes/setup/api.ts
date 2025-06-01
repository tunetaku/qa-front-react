import { BaseURL } from '../../config';

// 全ユーザーのHandleNameリスト取得
export async function fetchAllHandleNames(): Promise<string[]> {
  const res = await fetch(`${BaseURL}/odata/Users?$select=HandleName`);
  if (!res.ok) throw new Error('API error');
  const data = await res.json();
  // null/空文字を除外
  return Array.isArray(data.value)
    ? data.value.map((u: { HandleName?: string }) => u.HandleName).filter((n: string | undefined): n is string => !!n)
    : [];
}
