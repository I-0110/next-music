import postgres from 'postgres';
import {
  UserField,
  UsersTableType,
  PostForm,
  PostsTable,
  LatestPost,
} from './definitions';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function fetchLatestPosts() {
  try {
    const data = await sql<LatestPost[]>`
      SELECT users.name, users.image_url, users.email, posts.id
      FROM posts
      JOIN users ON posts.user_id = users.id
      ORDER BY posts.date DESC
      LIMIT 5`;

    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest posts.');
  }
}

export async function fetchCardData() {
  try {
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    const postCountPromise = sql`SELECT COUNT(*) FROM posts`;
    const userCountPromise = sql`SELECT COUNT(*) FROM users`;

    const data = await Promise.all([
      postCountPromise,
      userCountPromise,
    ]);

    const numberOfPosts = Number(data[0][0].count ?? '0');
    const numberOfUsers = Number(data[1][0].count ?? '0');

    return {
      numberOfUsers,
      numberOfPosts,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredPosts(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const posts = await sql<PostsTable[]>`
      SELECT
        posts.id,
        posts.date,
        posts.status,
        users.name,
        users.email,
        users.image_url
      FROM posts
      JOIN users ON posts.user_id = users.id
      WHERE
        users.name ILIKE ${`%${query}%`} OR
        users.email ILIKE ${`%${query}%`} OR
        posts.amount::text ILIKE ${`%${query}%`} OR
        posts.date::text ILIKE ${`%${query}%`} OR
        posts.status ILIKE ${`%${query}%`}
      ORDER BY posts.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return posts;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch posts.');
  }
}

export async function fetchPostsPages(query: string) {
  try {
    const data = await sql`SELECT COUNT(*)
    FROM posts
    JOIN users ON posts.customer_id = users.id
    WHERE
      users.name ILIKE ${`%${query}%`} OR
      users.email ILIKE ${`%${query}%`} OR
      posts.date::text ILIKE ${`%${query}%`} OR
      posts.status ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of posts.');
  }
}

export async function fetchPostById(id: string) {
  try {
    const data = await sql<PostForm[]>`
      SELECT
        posts.id,
        posts.user_id,
        posts.status
      FROM posts
      WHERE posts.id = ${id};
    `;

    return data[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch post.');
  }
}

export async function fetchUsers() {
  try {
    const users = await sql<UserField[]>`
      SELECT
        id,
        name
      FROM users
      ORDER BY name ASC
    `;

    return users;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all users.');
  }
}

export async function fetchFilteredUsers(query: string) {
  try {
    const data = await sql<UsersTableType[]>`
		SELECT
		  users.id,
		  users.name,
		  users.email,
		  users.image_url,
		  COUNT(posts.id) AS total_posts,
		  SUM(CASE WHEN invoices.status = 'pending' THEN posts.amount ELSE 0 END) AS total_pending,
		  SUM(CASE WHEN posts.status = 'paid' THEN posts.amount ELSE 0 END) AS total_paid
		FROM users
		LEFT JOIN posts ON users.id = posts.user_id
		WHERE
		  users.name ILIKE ${`%${query}%`} OR
        users.email ILIKE ${`%${query}%`}
		GROUP BY users.id, users.name, users.email, users.image_url
		ORDER BY users.name ASC
	  `;

    return data;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch user table.');
  }
}
