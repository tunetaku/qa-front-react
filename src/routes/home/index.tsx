import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Title2, Card, TabList, Tab, Spinner, Field } from '@fluentui/react-components';
import { QuestionsList } from './QuestionsList';
import { fetchAllUsersLdapHandle, buildHandleNameMap, HandleNameMap } from '../../contexts/userApi';
import { Pagination } from './Pagination';

export default function Page() {
  // ページ固有スタイルをJSX内で定義
  const homeCardStyle = `
    .home-card {
      width: 100%;
      margin: 0 auto;
      padding: 1.2rem;
      border: none;
      box-shadow: none;
      max-width: 100%;
    }
    @media (min-width: 600px) {
      .home-card {
        max-width: 600px;
      }
    }
  `;
  const navigate = useNavigate();
  // タブ状態: 'open' = 回答受付中, 'closed' = 解決済み, 'all' = すべて
  type TabKey = 'open' | 'closed' | 'all';
  const [tab, setTab] = useState<TabKey>('open');
  // タブごとにページ番号を独立管理
  const [pageOpen, setPageOpen] = useState(1);
  const [pageClosed, setPageClosed] = useState(1);
  const [pageAll, setPageAll] = useState(1);



  // ページ番号取得・セット関数
  const getCurrentPage = () => {
    if (tab === 'open') return pageOpen;
    if (tab === 'closed') return pageClosed;
    return pageAll;
  };
  const setCurrentPage = (page: number) => {
    if (tab === 'open') setPageOpen(page);
    else if (tab === 'closed') setPageClosed(page);
    else setPageAll(page);
  };

  // データ・ローディング・エラー状態
  const [questions, setQuestions] = useState<{ [key in TabKey]: any[] }>({ open: [], closed: [], all: [] });
  const [total, setTotal] = useState<{ [key in TabKey]: number }>({ open: 0, closed: 0, all: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // タブ・ページ変更時にAPI取得
  useEffect(() => {
    setLoading(true);
    setError(null);
    import('./api').then(({ fetchQuestions }) => {
      fetchQuestions({ status: tab as any, page: getCurrentPage(), pageSize: 10 })
        .then(result => {
          setQuestions(prev => ({ ...prev, [tab]: result.data }));
          setTotal(prev => ({ ...prev, [tab]: result.total }));
        })
        .catch(e => {
          setError(e.message || '取得失敗');
        })
        .finally(() => setLoading(false));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, pageOpen, pageClosed, pageAll]);

  return (
    <>
      <style>{homeCardStyle}</style>
      <Card className="home-card">
      <Title2 style={{ marginBottom: 16 }}>ホーム</Title2>
      <div>
      <Button appearance="primary" style={{ marginBottom: '2rem' }} onClick={() => navigate('/questions-new')}>
        新規質問を投稿する
      </Button>
      </div>
      <TabList selectedValue={tab} onTabSelect={(_, d) => setTab(d.value as TabKey)} style={{ marginBottom: 24 }}>
        <Tab value="open">回答受付中</Tab>
        <Tab value="closed">解決済み</Tab>
        <Tab value="all">すべて</Tab>
      </TabList>
      {loading ? (
        <Spinner size="medium" />
      ) : error ? (
        <Field validationState="error">{error}</Field>
      ) : (
        <>
          <QuestionsList questions={questions[tab]} />
          <Pagination
            currentPage={getCurrentPage()}
            totalItems={total[tab]}
            pageSize={10}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </Card>
    </>
  );
}

