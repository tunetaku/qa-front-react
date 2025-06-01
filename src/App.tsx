import { Routes, Route, Navigate } from 'react-router-dom';
import RootLayout from './routes/_root';
import Home from './routes/home';
import Me from './routes/me';
import Question from './routes/question';
import QuestionAnswersNew from './routes/question/answers-new';
import QuestionEdit from './routes/question/edit';
import Questions from './routes/questions';
import QuestionsNew from './routes/questions-new';
import Search from './routes/search';
import Setup from './routes/setup';
import Tag from './routes/tag';
import Tags from './routes/tags';
import Users from './routes/users';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path="me" element={<Me />} />
        <Route path="question" element={<Question />} />
        <Route path="question/:id" element={<Question />} />
        <Route path="question/:id/answers-new" element={<QuestionAnswersNew />} />
        <Route path="question/:id/edit" element={<QuestionEdit />} />
        <Route path="questions" element={<Questions />} />
        <Route path="questions-new" element={<QuestionsNew />} />
        <Route path="search" element={<Search />} />
        <Route path="setup" element={<Setup />} />
        <Route path="tag" element={<Tag />} />
        <Route path="tags" element={<Tags />} />
        <Route path="users" element={<Users />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
