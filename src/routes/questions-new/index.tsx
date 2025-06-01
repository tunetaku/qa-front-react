import React, { useEffect, useState } from 'react';
import { useUser } from '../../contexts/UserContext';
import { addQuestion, fetchCategories, fetchTags, NewQuestion } from './api';
import { Category, Tag } from '../../types';
import {
  Button,
  Input,
  Textarea,
  Dropdown,
  Option,
  Label,
  Spinner,
  Field,
  TagPicker,
  makeStyles,
  shorthands,
  tokens,
  useToastController,
  ToastTitle,
} from '@fluentui/react-components';
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles({
  container: {
    maxWidth: '520px',
    margin: '2rem auto',
    padding: '32px',
    background: tokens.colorNeutralBackground1,
    borderRadius: tokens.borderRadiusLarge,
    boxShadow: tokens.shadow16,
  },
  field: { marginBottom: '20px' },
  error: { color: tokens.colorPaletteRedForeground1, marginBottom: '12px' },
  success: { color: tokens.colorPaletteGreenForeground1, marginBottom: '12px' },
});

export default function Page() {
  const { dispatchToast } = useToastController();
  const navigate = useNavigate();
  const { user } = useUser();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [categoryId, setCategoryId] = useState<number | undefined>();
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const styles = useStyles();

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => setError('カテゴリ取得失敗'));
    fetchTags().then(setTags).catch(() => setError('タグ取得失敗'));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    if (!title || !body || !categoryId) {
      setError('タイトル・本文・カテゴリは必須です');
      dispatchToast(
        <>
          <ToastTitle>必須項目が未入力です</ToastTitle>
          タイトル・本文・カテゴリは必須です
        </>,
        { intent: 'error' }
      );
      return;
    }
    setLoading(true);
    try {
      const input: NewQuestion = {
        Title: title,
        Body: body,
        CategoryId: Number(categoryId),
        Tags: selectedTags.length > 0 ? selectedTags.map(t => t.Id) : undefined,
        AuthorLdapId: user?.LdapId,
      };
      await addQuestion(input);
      setSuccess(true);
      setTitle('');
      setBody('');
      setCategoryId(undefined);
      setSelectedTags([]);
      dispatchToast(
        <>
          <ToastTitle>質問を投稿しました</ToastTitle>
          質問が正常に登録されました
        </>,
        { intent: 'success' }
      );
      navigate('/'); // 必要に応じて遷移先を調整
    } catch (e: any) {
      setError(e.message || '登録失敗');
      dispatchToast(
        <>
          <ToastTitle>投稿に失敗しました</ToastTitle>
          {e.message || '登録失敗'}
        </>,
        { intent: 'error' }
      );
    } finally {
      setLoading(false);
    }
  };


  // Fluent UI TagPicker風のタグ選択
  const tagPickerItems = tags.map(tag => ({
    key: tag.Id.toString(),
    text: tag.Name || '',
    tag,
  }));

  return (
    <div className={styles.container}>
      <h2>新規質問登録</h2>
      {error && <div className={styles.error}>{error}</div>}
      {success && <div className={styles.success}>登録が完了しました！</div>}
      <form onSubmit={handleSubmit}>
        <Field label={<Label required>タイトル</Label>} className={styles.field}>
          <Input value={title} onChange={(_, d) => setTitle(d.value)} required />
        </Field>
        <Field label={<Label required>本文</Label>} className={styles.field}>
          <Textarea value={body} onChange={(_, d) => setBody(d.value)} required resize='vertical' />
        </Field>
        <Field label={<Label required>カテゴリ</Label>} className={styles.field}>
          <Dropdown
            placeholder="選択してください"
            onOptionSelect={(_, data) => {
              if (!data.optionValue) return;
              const cat = (categories ?? []).find(c => c.Id?.toString?.() === data.optionValue);
              if (!cat) return;
              setCategoryId(cat.Id);
            }}
          >
            {categories.map(cat => (
                <Option key={cat.Id} value={String(cat.Id)}>{cat.Name}</Option>
              ))}
          </Dropdown>
        </Field>
        <Field label={<Label>タグ（複数選択可）</Label>} className={styles.field}>
          <Dropdown
            multiselect
            selectedOptions={(selectedTags ?? []).filter(Boolean).map(t => t.Id?.toString?.() ?? '')}
            onOptionSelect={(_, data) => {
              if (!data.optionValue) return;
              const tag = (tags ?? []).find(t => t.Id?.toString?.() === data.optionValue);
              if (!tag) return;
              // 選択状態はdata.selectedOptionsに含まれているかで判定
              const isSelected = data.selectedOptions.includes(data.optionValue as string);
              if (isSelected) {
                setSelectedTags(prev => {
                  if (prev.find(t => t.Id === tag.Id)) return prev;
                  return [...prev, tag];
                });
              } else {
                setSelectedTags(prev => prev.filter(t => t.Id !== tag.Id));
              }
            }}
            placeholder="タグを選択"
          >
            {(tags ?? [])
              .filter(tag => tag && tag.Id != null)
              .map(tag => (
                <Option key={tag.Id} value={String(tag.Id)}>{tag.Name}</Option>
              ))}
          </Dropdown>
        </Field>
        <Button appearance="primary" type="submit" disabled={loading}>
          {loading ? <Spinner size="tiny" /> : '登録'}
        </Button>
      </form>
    </div>
  );
}
