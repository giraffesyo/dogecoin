export async function getStaticProps() {
  return {
    redirect: {
      permanent: true,
      destination: 'https://giraffesyo.io',
    },
  }
}

const IndexPage = () => <p>This isn't a real app.</p>

export default IndexPage
