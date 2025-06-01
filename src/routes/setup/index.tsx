import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Field, Input, Button, RadioGroup, Radio } from '@fluentui/react-components';
import { useUser } from '../../contexts/UserContext';
import type { User } from '../../types';
import { fetchAllHandleNames } from './api';
import { animalEmojiMap } from '../../config';
import { UserHandle } from '../../components/UserHandle';

export default function Page() {
  const { user, saveUser } = useUser();
  const navigate = useNavigate();
  const [ldapId, setLdapId] = useState('');
  const [handleName, setHandleName] = useState('');
  const [allHandleNames, setAllHandleNames] = useState<string[]>([]);
  const [handleNameCandidates, setHandleNameCandidates] = useState<string[]>([]);
  const [suggesting, setSuggesting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 既にユーザー情報があれば自動遷移
  React.useEffect(() => {
    if (user) {
      navigate('/home', { replace: true });
    }
  }, [user, navigate]);

  // --- ハンドルネーム生成ロジック ---
  // 動物名＋絵文字
  const handleNameWords = Object.keys(animalEmojiMap);

  function generateHandleNameCandidate(existing: string[]): string {
    let tries = 0;
    let candidate = '';
    do {
      const name = handleNameWords[Math.floor(Math.random() * handleNameWords.length)];
      const num = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      candidate = `${name}_${num}`;
      tries++;
    } while ((existing.includes(candidate) || candidate === '') && tries < 10);
    return candidate;
  }
  function generateHandleNameCandidates(existing: string[], count = 10): string[] {
    const candidates: string[] = [];
    let tries = 0;
    while (candidates.length < count && tries < count * 5) {
      const c = generateHandleNameCandidate([...existing, ...candidates]);
      if (!candidates.includes(c)) candidates.push(c);
      tries++;
    }
    return candidates;
  }

  // 初回レンダリング時に全ハンドルネーム取得＆候補生成
  React.useEffect(() => {
    setSuggesting(true);
    fetchAllHandleNames()
      .then(list => {
        setAllHandleNames(list);
        const candidates = generateHandleNameCandidates(list, 10);
        setHandleNameCandidates(candidates);
        setHandleName(candidates[0] || '');
      })
      .finally(() => setSuggesting(false));
  }, []);

  // 「候補を再生成」ボタン
  const handleSuggest = () => {
    const candidates = generateHandleNameCandidates(allHandleNames, 10);
    setHandleNameCandidates(candidates);
    setHandleName(candidates[0] || '');
  };

  const validate = () => {
    if (!ldapId.trim()) return 'LDAP IDは必須です';
    if (!handleName.trim()) return 'ハンドルネームは必須です';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    setLoading(true);
    try {
      const user: User = { LdapId: ldapId.trim(), HandleName: handleName.trim() };
      await saveUser(user);
      navigate('/home');
    } catch (e: any) {
      setError(e?.message || '登録に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '40px auto' }}>
      <h2>初回セットアップ</h2>
      <Field label="LDAP ID" required validationState={error && !ldapId ? 'error' : undefined} validationMessage={!ldapId ? error : undefined}>
        <Input value={ldapId} onChange={(_, d) => setLdapId(d.value)} disabled={loading} />
      </Field>
      <Field label="ハンドルネーム" required validationState={error && !handleName ? 'error' : undefined} validationMessage={!handleName ? error : undefined}>
        <RadioGroup value={handleName} onChange={(_, data) => setHandleName(data.value as string)}>
          {handleNameCandidates.map(c => {
            return (
              <Radio key={c} value={c} label={<UserHandle handleName={c} />} />
            );
          })}
        </RadioGroup>
        <Button type="button" onClick={handleSuggest} disabled={loading || suggesting} style={{ marginTop: 8 }}>
          候補を再生成
        </Button>
      </Field>
      {error && ldapId && handleName && (
        <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>
      )}
      <Button type="submit" appearance="primary" disabled={loading} style={{ marginTop: 16, width: '100%' }}>
        {loading ? '登録中...' : '登録'}
      </Button>
    </form>
  );
}
