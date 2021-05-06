export type Placeholder = {
  content: string
  example?: string
};

export type Placeholders = {
  [key: string]: Placeholder
};

export type Message = {
  message: string,
  description: string,
  placeholders?: Placeholders
};

export type Messages = {
  [key: string]: Message
};
