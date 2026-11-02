'use server'

import { revalidatePath } from 'next/cache'
import { addCreatedPost } from './posts/post-store'

export async function createPost(formData: FormData): Promise<string> {
  const title = String(formData.get('title') ?? '').trim()
  const body = String(formData.get('body') ?? '').trim()

  if (!title || !body) {
    return 'Enter both a title and post content.'
  }

  addCreatedPost(title, body)
  revalidatePath('/posts')

  return 'Post added successfully.'
}
