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
