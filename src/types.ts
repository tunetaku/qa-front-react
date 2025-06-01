// types.ts

export interface QuestionWithAnswers extends Question {
  Answers?: Answer[];
  AuthorLdap?: {
    HandleName: string;
  };
}

export interface Answer {
    Id: number;
    Body?: string;
    Created?: string; // ISO8601日付文字列
    IsBest?: boolean;
    AuthorLdapId?: string;
    QuestionId?: number;
    Attachments?: Attachment[];
    Comments?: Comment[];
    Question?: Question;
    ReferenceLinks?: ReferenceLink[];
    Votes?: Vote[];
    AuthorLdap?: {
      HandleName: string;
    };
  }
  
  export interface Attachment {
    Id: number;
    FilePath?: string;
    FileName?: string;
    Size?: number;
    QuestionId?: number;
    AnswerId?: number;
    UploadedByLdapId?: string;
    UploadedAt?: string; // ISO8601日付文字列
  }
  
  export interface Category {
    Id: number;
    Name?: string;
  }
  
  export interface Comment {
    Id: number;
    Body?: string;
    Created?: string;
    AuthorLdapId?: string;
    QuestionId?: number;
    AnswerId?: number;
  }
  
  export enum QuestionStatus {
  Open = 'Open',
  Resolved = 'Resolved',
  Closed = 'Closed',
}

export interface Question {
    Id: number;
    Title?: string;
    Body?: string;
    Created?: string;
    Closed?: string;
    AuthorLdapId?: string;
    CategoryId?: number;
    Tags?: Tag[];
    Status?: QuestionStatus;
    AuthorLdap?: {
      HandleName: string;
    };
}

// 質問リストのページング取得用型
export interface PaginatedQuestions {
    data: Question[];
    total: number;
}

  
  export interface ReferenceLink {
    Id: number;
    Url?: string;
    Title?: string;
    QuestionId?: number;
    AnswerId?: number;
  }
  
  export interface Tag {
    Id: number;
    Name?: string;
  }
  
  export interface User {
    LdapId: string;
    HandleName?: string;
  }
  
  export interface Vote {
    Id: number;
    UserLdapId?: string;
    QuestionId?: number;
    AnswerId?: number;
  }