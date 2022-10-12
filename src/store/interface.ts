export type Role = "root" | "admin" | "user" | "visitor";

/**
 * 前后端字段关系映射
 */
export interface Schema {
  name: string;
  label: string;
  type: string;
  hideInTable?: boolean;
  externalSchema?: string;
  searchable?: boolean;
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
  required?: boolean;
  disabled?: boolean;
  showInSearch?: boolean;
}

export interface LearningArticle {
  id: string;
  categoryId: string;
  title: string;
  content: string;
  createTime: number;
  updateTime: number;
}

export interface LearningCategory {
  id: string;
  name: string;
  createTime: number;
  updateTime: number;
}

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
  createTime: number;
  updateTime: number;
}

export interface User {
  id: string;
  username: string;
  password: string;
  email: string;
  profile?: string;
  slug?: string;
  messageCount: number;
  credit: number;
  role: Role;
  nickname?: string;
  createTime: number;
  updateTime: number;
}

export interface UserInfo {
  favoriteCount: number;
  followCount: number;
  followingCount: number;
  subscribeCount: number;
  followed: boolean;

  postCount: number;
  draftCount: number;
  commentCount: number;
  viewCount: number;
}

export interface UserModel {
  user: User;
  postModelPage: Page<BBSPostModel>;
  subscribeModelPage: Page<UserSubscribeModel>;
  followModelPage: Page<UserFollowModel>;
  followingModelPage: Page<UserFollowModel>;
  favoriteModelPage: Page<UserFavoriteModel>;
}

export interface BBSCategory {
  id: string;
  image: File;
  boardId: string;
  name: string;
  description: string;
  createTime: number;
  updateTime: number;
}

export interface BBSPost {
  id: string;
  userId: string;
  username: string;
  nickname: string;
  borderId: string;
  categoryId: string;
  title: string;
  content: string;
  viewCount: number;
  commentCount: number;
  published: boolean;
  pinned: boolean;
  banned: boolean;
  globalPinned: boolean;
  recommend: boolean;
  removed: boolean;
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
  level: number;
  userNickName: string;
  createTime: number;
  updateTime: number;
}

export interface BBSCommentModel {
  post: BBSPost;
  parent: BBSCommentModel;
  comment: BBSComment;
  user: User;
}

export interface BBSPostModel {
  board: BBSBoard;
  category: BBSCategory;
  user: User;
  post: BBSPost;
  tags: BBSTag[];
  commentPage: Page<BBSCommentModel>;
}

export interface BBSCategoryModel {
  board: BBSBoard;
  category: BBSCategory;
  admins: User[];
  postPage: Page<BBSPostModel>;
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

export interface UserSubscribeModel {
  user: User;
  categoryModel: BBSCategoryModel;
}

export interface UserFollowModel {
  user: User;
  userInfo: UserInfo;
  following: User;
  followingInfo: UserInfo;
}
export interface UserFavoriteModel {
  user: User;
  postModel: BBSPostModel;
}

export interface UserNotify {
  userId: string;
  postId: string;
  title: string;
  content: string;
}

export interface StatisticSystem {
  registerCount: number;
  loginCount: number;
  articleViewCount: number;
  postViewCount: number;
  newPostCount: number;
  newCommentCount: number;
  compileCount: number;
  recordDate: number;
}

export interface StatisticCategory {
  categoryId: number;
  categoryName: string;
  viewCount: number;
  postViewCount: number;
  newPostCount: number;
  newCommentCount: number;
  subscribeCount: number;
  recordDate: number;
}

export interface Statistic {
  totalUserCount: number;
  totalArticleCount: number;
  totalPostCount: number;
  totalCommentCount: number;
  statisticCategories: StatisticCategory[];
  statisticSystems: StatisticSystem[];
}

export interface SystemResource {
  id: string;
  resource: File;
  absolutePath: string;
  type: string;
  size: number;
  originalName: string;
  folder: "avatar" | "image" | "video" | "other";
  invalid: boolean;
  filename: string;
}

export interface SliceResource {
  chunkNumber: number;
  currentChunkSize: number;
  totalChunks: number;
}
