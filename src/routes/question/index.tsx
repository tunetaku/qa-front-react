import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { QuestionStatus } from "../../types";
import { Badge, Button, Card, Field, Text, Title3 } from "@fluentui/react-components";
import { fetchQuestionWithAnswers, ExpandedQuestion } from "./api";
import { UserHandle } from "../../components/UserHandle";

// ステータスごとのBadge色マッピング
const statusBadgeAppearance: Record<QuestionStatus, { appearance: "filled" | "outline" | "tint", color: "brand" | "success" | "danger" | "warning" | "neutral" }> = {
  [QuestionStatus.Open]: { appearance: "filled", color: "brand" },
  [QuestionStatus.Resolved]: { appearance: "filled", color: "success" },
  [QuestionStatus.Closed]: { appearance: "outline", color: "neutral" },
};


export default function Page() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [question, setQuestion] = useState<ExpandedQuestion | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    fetchQuestionWithAnswers(id)
      .then(setQuestion)
      .catch((e: any) => setError(e.message ?? "不明なエラーが発生しました"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Text>読み込み中...</Text>;
  if (error) return <Text appearance="danger">{error}</Text>;
  if (!question) return <Text>質問が見つかりません</Text>;

  // ステータスBadge
  const status = question.Status ?? QuestionStatus.Open;
  const badgeProps = statusBadgeAppearance[status];

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 24 }}>
      <Title3>{question.Title}</Title3>
      <UserHandle handleName={question.AuthorLdap?.HandleName} />
      <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "12px 0" }}>
        <Badge appearance={badgeProps.appearance} color={badgeProps.color}>
          {status === QuestionStatus.Open && "受付中"}
          {status === QuestionStatus.Resolved && "解決済み"}
          {status === QuestionStatus.Closed && "クローズ"}
        </Badge>
        <Text size={300} as="span" style={{ color: "#888" }}>
          {question.Created?.slice(0, 10)}
        </Text>
      </div>
      <Field label="カテゴリ">
        <Text>{question.Category?.Name || "-"}</Text>
      </Field>
      <Field label="タグ">
        <Text>{question.Tags?.filter(x => x && x.Name).map(x => x.Name).join(", ") || "-"}</Text>
      </Field>
      <Field label="本文">
        <Text>{question.Body}</Text>
      </Field>
      <div style={{ margin: "32px 0 16px 0" }}>
        <Title3>回答</Title3>
      </div>
      {question.Answers && question.Answers.length > 0 ? (
        question.Answers.filter(x => x && x.Id != null).map((answer) => (
          <Card key={answer.Id} style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {answer.IsBest && (
                <Badge appearance="filled" color="success">ベスト</Badge>
              )}
              <UserHandle handleName={answer.AuthorLdap?.HandleName} />
              <Text size={200} as="span" style={{ color: "#888", marginLeft: 8 }}>
                {answer.Created?.slice(0, 10)}
              </Text>
            </div>
            <Text>{answer.Body}</Text>
          </Card>
        ))
      ) : (
        <Text>まだ回答がありません</Text>
      )}
      <div style={{ textAlign: "right", marginTop: 24 }}>
        <Button appearance="primary" onClick={() => navigate(`/question/${id}/answers-new`)}>
          新規回答を投稿
        </Button>
      </div>
    </div>
  );
}
