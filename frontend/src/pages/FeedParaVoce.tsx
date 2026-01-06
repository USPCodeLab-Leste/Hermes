import { useFeed } from '../hooks/useFeed'

export default function FeedParaVoce() {
  const { data, isLoading } = useFeed('for-you')

  if (isLoading) {
    return <p>Carregando...</p>
  }

  return (
    <>
      <h1>Feed Seguindo</h1>

      <section>
        {data?.map(product => (
          <div key={product.id}>
            <h2>{product.description}</h2>
          </div>
        ))}
      </section>
    </>
  )
}