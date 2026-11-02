export interface CreatedPost {
  id: number
  title: string
  body: string
}

const createdPosts: CreatedPost[] = []

export function addCreatedPost(title: string, body: string): CreatedPost {
  const post = {
    id: Date.now(),
    title,
    body,
  }

  createdPosts.unshift(post)
  return post
}

export function getCreatedPosts(): CreatedPost[] {
  return [...createdPosts]
}
