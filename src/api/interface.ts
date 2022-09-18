export interface ApiResponse<Data = any> {
  status: number;
  success: boolean;
  msg: string;
  data: Data;
}
