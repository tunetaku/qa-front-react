import { User } from '../types';

// ODataエンドポイント例
import { BaseURL } from '../config';

// LdapId→HandleName変換用型
export type HandleNameMap = Record<string, string | undefined>;

/**
 * 全ユーザーのLdapId, HandleNameを取得
 */
export async function fetchAllUsersLdapHandle(): Promise<User[]> {
  const res = await fetch(`${BaseURL}/odata/Users?$select=LdapId,HandleName`);
  if (!res.ok) throw new Error('ユーザー一覧取得に失敗しました');
  const data = await res.json();
  return Array.isArray(data.value) ? data.value.filter((u: User) => !!u.LdapId) : [];
}

/**
 * LdapId→HandleNameのマッピングを作成
 */
export function buildHandleNameMap(users: User[]): HandleNameMap {
  const map: HandleNameMap = {};
  users.forEach(u => {
    if (u.LdapId && u.HandleName) map[u.LdapId] = u.HandleName;
  });
  return map;
}

/**
 * LdapId→HandleName変換（なければ空文字）
 */
export function findHandleNameByLdapId(map: HandleNameMap, ldapId?: string | null): string {
  if (!ldapId) return '';
  return map[ldapId] || '';
}

/**
 * DBへユーザー情報を保存（新規登録）
 * @param user User型
 */
export async function saveUserToDb(user: User): Promise<void> {
  try {
    const res = await fetch(`${BaseURL}/odata/Users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error?.message || 'ユーザー登録に失敗しました');
    }
    // 単一データ取得時はres.json()でOK
    // 複数データ取得時はres.json().value
  } catch (e) {
    throw e;
  }
}

/**
 * LdapIdでユーザー情報取得（必要に応じて）
 */
export async function getUserByLdapId(ldapId: string): Promise<User | null> {
  try {
    const res = await fetch(`${BaseURL}/odata/Users?$filter=LdapId eq '${ldapId}'`);
    if (!res.ok) throw new Error('ユーザー取得に失敗しました');
    const data = await res.json();
    // 複数データ取得はvalue配列
    return (Array.isArray(data.value) && data.value.length > 0) ? data.value[0] : null;
  } catch (e) {
    throw e;
  }
}
