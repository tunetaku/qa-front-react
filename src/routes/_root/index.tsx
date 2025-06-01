import * as React from 'react';
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useUser } from '../../contexts/UserContext';
import { Button } from '@fluentui/react-components';
import { ArrowLeft24Regular } from '@fluentui/react-icons';
import { UserHandle } from '../../components/UserHandle';
function UserInfo() {
  const { user } = useUser();
  if (!user) return null;
  return (
    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', fontSize: '1rem', color: '#444' }}>
      <UserHandle handleName={user.HandleName} fontSize="1.15em" />
    </div>
  );
}

export default function Page() {
  const { user } = useUser();
  const location = useLocation();
  const navigate = useNavigate();

  // 認証ガード: userがなければ/setupへリダイレクト（ただし/setup自身は除外）
  React.useEffect(() => {
    if (!user && location.pathname !== '/setup') {
      navigate('/setup', { replace: true });
    }
  }, [user, location, navigate]);

  return (
    <div style={{ position: 'relative' }}>
      {/* 戻るボタン：/home, / 以外で表示 */}
      {location.pathname !== '/home' && location.pathname !== '/' && (
        <Button
          appearance="subtle"
          icon={<ArrowLeft24Regular />}
          onClick={() => navigate(-1)}
          style={{ position: 'absolute', left: 24, top: 64, zIndex: 200 }}
          aria-label="前のページに戻る"
        >
          戻る
        </Button>
      )}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: 'linear-gradient(90deg, #f5f6fa 0%, #e9ecef 100%)',
          color: '#222',
          padding: '1.2rem 2rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
          borderBottom: '1px solid #e0e0e0',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          minHeight: '24px',
          position: 'relative',
        }}
      >

        <Link
          to="/"
          style={{
            color: '#333',
            textDecoration: 'none',
            fontWeight: 700,
            fontSize: '1.5rem',
            letterSpacing: '0.04em',
            fontFamily: 'Segoe UI, Arial, sans-serif',
            transition: 'color 0.2s',
          }}
        >
          知恵袋アプリ
        </Link>
        <UserInfo />
      </header>
      <main style={{ padding: '2rem' }}>
        <Outlet />
      </main>
    </div>
  );
}
