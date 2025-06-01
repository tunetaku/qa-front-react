import React from 'react';
import { Question } from '../../types';
import { Card, CardHeader, CardFooter, Text, Tag as FluentTag, Badge } from '@fluentui/react-components';
import { Link } from 'react-router-dom';
import { UserHandle } from '../../components/UserHandle';



interface QuestionsListProps {
  questions: Question[];
}

export const QuestionsList: React.FC<QuestionsListProps> = ({ questions }) => {
  if (!questions || questions.length === 0) return <Text>質問がありません。</Text>;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {questions.filter(q => q && q.Id != null).map(q => (
        <Card key={q.Id}>
          <CardHeader
            header={<Link to={`/question/${q.Id}`}>{q.Title || '(タイトルなし)'}</Link>}
            description={<Text>{q.Created ? new Date(q.Created).toLocaleString() : ''}</Text>}
          />
          <CardFooter>
            <UserHandle handleName={q.AuthorLdap?.HandleName} />
            {q.Tags?.filter(tag => tag && tag.Id != null).map(tag => (
              <FluentTag key={tag.Id}>{tag.Name}</FluentTag>
            ))}
            {/* 状態表示をBadgeで */}
            <Badge
              style={{ marginLeft: 12 }}
              appearance={q.Closed ? 'outline' : 'filled'}
              color={q.Closed ? 'informative' : 'important'}
            >
              {q.Closed ? '解決済み' : '受付中'}
            </Badge>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
