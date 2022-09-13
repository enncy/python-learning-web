export interface Compile {
  id: string;
  codeId: string;
  errorMessage: string;
  codeContent: string;
  output: string;
  input: string;
  timeConsuming: number;
}

export interface Code {
  id: string;
  filename: string;
  content: string;
}

export interface User {
  id: string;
  username: string;
  password: string;
  email: string;
  profile?: string;
  slug?: string;
  role: "visitor" | "user" | "admin";
  nickname?: string;
  createTime: number;
  updateTime: number;
}

export interface BBSCategory {
  id: string;
  boardId: string;
  name: string;
  description: string;
  createTime: number;
  updateTime: number;
}

export interface BBSPost {
  id: string;
  borderId: string;
  categoryId: string;
  title: string;
  content: string;
  viewCount: number;
  commentCount: number;
  published: boolean;
  pinned: boolean;
  banned: boolean;
  createTime: number;
  updateTime: number;
}

export interface BBSBoard {
  id: string;
  name: string;
  description: string;
  createTime: number;
  updateTime: number;
}

export interface BBSTag {
  id: string;
  postId: string;
  categoryId: string;
  name: string;
  createTime: number;
  updateTime: number;
}
export interface BBSComment {
  id: string;
  postId: string;
  parentId: string;
  userId: string;
  content: string;
  likeNum: number;
  userNickName: string;
  createTime: number;
  updateTime: number;
}

export interface BBSPostModel {
  board: BBSBoard;
  category: BBSCategory;
  post: BBSPost;
  tags: BBSTag[];
}

export interface BBSCategoryModel {
  board: BBSBoard;
  category: BBSCategory;
  admins: User[];
  posts: Page<BBSPost>;
}

export interface BBSBoardModel {
  board: BBSBoard;
  categories: BBSCategoryModel[];
}

export interface Page<T> {
  records: T[];
  total: number;
  size: number;
  current: number;
  orders: T[];
  optimizeCountSql: boolean;
  searchCount: boolean;
  optimizeJoinOfCountSql: boolean;
  countId: string;
  maxLimit: number;
}
