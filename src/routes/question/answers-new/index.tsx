import * as React from 'react';
import { useEffect, useState } from 'react';
import { Accordion, AccordionItem, AccordionHeader, AccordionPanel, Field, Textarea, Button, Spinner } from '@fluentui/react-components';
import { fetchQuestionWithAnswers, addAnswer, NewAnswer } from './api';
import { useUser } from '../../../contexts/UserContext';
import { useParams, useNavigate } from 'react-router-dom';
import { QuestionWithAnswers, Answer } from '../../../types';
import { UserHandle } from '../../../components/UserHandle';

export default function Page() {
  const { user } = useUser();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState<QuestionWithAnswers | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [answerBody, setAnswerBody] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const q = await fetchQuestionWithAnswers(Number(id));
        setQuestion(q);
        setFetchError(null);
      } catch (e: any) {
        setFetchError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleSubmit = async () => {
    setSubmitError(null);
    setSubmitting(true);
    try {
      if (!id) throw new Error('質問IDが不正です');
      if (!answerBody.trim()) throw new Error('回答内容は必須です');
      if (!user?.LdapId) throw new Error('ユーザー情報が取得できません');
      const input: NewAnswer = {
        QuestionId: Number(id),
        Body: answerBody.trim(),
        AuthorLdapId: user.LdapId,
      };
      await addAnswer(input);
      setSuccess(true);
      setTimeout(() => navigate(`/question/${id}`), 1200);
    } catch (e: any) {
      setSubmitError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Spinner label="読み込み中..." />;
  if (fetchError) return <Field validationState="error" validationMessage={fetchError}><div>データ取得エラー</div></Field>;
  if (!question) return <div>質問データがありません。</div>;

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 24 }}>
      <Accordion multiple collapsible defaultOpenItems={['question']}>
        <AccordionItem value="question">
          <AccordionHeader>質問: {question.Title}<UserHandle handleName={question.Author?.HandleName} /></AccordionHeader>
          <AccordionPanel>
            <div style={{ whiteSpace: 'pre-wrap' }}>{question.Body}</div>
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem value="answers">
          <AccordionHeader>他の回答（{(question.Answers?.length ?? 0)}件）</AccordionHeader>
          <AccordionPanel>
            {(question.Answers ?? []).filter(a => a && a.Id != null).length === 0 && <div>まだ回答はありません。</div>}
            {(question.Answers ?? []).filter(a => a && a.Id != null).map((a: Answer) => (
              <Field key={a.Id} label={a.AuthorLdap?.HandleName || '匿名'}>
                <div style={{ whiteSpace: 'pre-wrap', background: '#f6f6fa', borderRadius: 4, padding: 8 }}>{a.Body}</div>
              </Field>
            ))}
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
      <form
        onSubmit={e => {
          e.preventDefault();
          if (!submitting) handleSubmit();
        }}
        style={{ marginTop: 32 }}
      >
        <Field
          label="あなたの回答"
          required
          validationState={submitError ? 'error' : undefined}
          validationMessage={submitError || undefined}
        >
          <Textarea
            value={answerBody}
            onChange={(_, d) => setAnswerBody(d.value)}
            placeholder="ここに回答を入力してください"
            resize="vertical"
            style={{ minHeight: 100 }}
          />
        </Field>
        <Button
          appearance="primary"
          type="submit"
          disabled={submitting || !answerBody.trim()}
          style={{ marginTop: 16 }}
        >
          {submitting ? <Spinner size="tiny" label="送信中..." /> : '送信'}
        </Button>
        {success && <div style={{ color: '#248f24', marginTop: 12 }}>回答を投稿しました。リダイレクトします...</div>}
      </form>
    </div>
  );
}

