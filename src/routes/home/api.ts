import { BaseURL } from '../../config';
import { Question, PaginatedQuestions } from '../../types';

// status: 'open' | 'closed' | 'all', page: 1始まり, pageSize: 件数
export async function fetchQuestions(params: { status: 'open' | 'closed' | 'all', page: number, pageSize: number }): Promise<PaginatedQuestions> {
    const { status, page, pageSize } = params;
    let filter = '';
    if (status === 'open') filter = "$filter=Closed eq null";
    else if (status === 'closed') filter = "$filter=Closed ne null";
    // 'all'はフィルタなし
    const skip = (page - 1) * pageSize;
    const query = [
        filter,
        `$orderby=Created desc`,
        `$top=${pageSize}`,
        `$skip=${skip}`,
        `$count=true`
    ].filter(Boolean).join('&');
    const expand = "$expand=AuthorLdap($select=HandleName),Category($select=Name)";
    const select="$select=Id,Title,Body,Created,Closed,Tags";
    try {
        const res = await fetch(`${BaseURL}/odata/questions?${expand}&${select}&${query}`);
        if (!res.ok) throw new Error('質問取得に失敗しました');
        const data = await res.json();
        return {
            data: (data.value as Question[]).filter(q => q && q.Id != null),
            total: typeof data['@odata.count'] === 'number' ? data['@odata.count'] : 0
        };
    } catch (e: any) {
        throw new Error(e?.message || '質問取得に失敗しました');
    }
}
