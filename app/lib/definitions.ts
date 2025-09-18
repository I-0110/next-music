// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.
export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  image_url: string;
};

// export type Customer = {
//   id: string;
//   name: string;
//   email: string;
//   image_url: string;
// };

export type Post = {
  id: string;
  user_id: string;
  date: string;
  // In TypeScript, this is called a string union type.
  // It means that the "status" property can only be one of the two strings: 'pending' or 'paid'.
  status: 'pending' | 'posted';
};

export type LatestPost = {
  id: string;
  name: string;
  image_url: string;
  email: string;
};

export type PostsTable = {
  id: string;
  user_id: string;
  name: string;
  email: string;
  image_url: string;
  date: string;
  status: 'pending' | 'posted';
};

export type UsersTableType = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_posts: number;
  total_pending: number;
  total_posted: number;
};

export type FormattedUsersTable = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_posts: number;
  total_pending: string;
  total_posted: string;
};

export type UserField = {
  id: string;
  name: string;
};

export type PostForm = {
  id: string;
  user_id: string;
  status: 'pending' | 'posted';
};
