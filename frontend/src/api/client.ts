export async function fakeRequest<T>(data: T, delay = 200): Promise<T> {
  await new Promise(resolve => setTimeout(resolve, delay))
  
  return data
}