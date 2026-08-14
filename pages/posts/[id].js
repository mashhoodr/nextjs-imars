import Layout from '../../components/layout'
import Seo, { breadcrumb, PERSON_ID } from '../../components/seo'
import { absoluteUrl } from '../../lib/site'
import { getAllPostIds, getPostData } from '../../lib/posts'
import Date from '../../components/date'
import utilStyles from '../../styles/utils.module.css'

export default function Post({ postData }) {
  const path = `/posts/${postData.id}`

  return (
    <Layout>
      <Seo
        title={postData.title}
        description={postData.excerpt || undefined}
        path={path}
        type="article"
        jsonLd={[
          {
            '@type': 'BlogPosting',
            '@id': `${absoluteUrl(path)}#post`,
            headline: postData.title,
            url: absoluteUrl(path),
            datePublished: postData.date,
            dateModified: postData.date,
            author: { '@id': PERSON_ID },
            publisher: { '@id': PERSON_ID },
            mainEntityOfPage: absoluteUrl(path),
            ...(postData.excerpt ? { description: postData.excerpt } : {}),
          },
          breadcrumb([
            { name: 'Blog archive', path: '/blog' },
            { name: postData.title, path },
          ]),
        ]}
      />
      <article>
        <h1 className={utilStyles.headingXl}>{postData.title}</h1>
        <div className={utilStyles.lightText}>
          <Date dateString={postData.date} />
        </div>
        <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
      </article>
    </Layout>
  )
}

export async function getStaticPaths() {
  const paths = getAllPostIds()
  return {
    paths,
    fallback: false
  }
}

export async function getStaticProps({ params }) {
  const postData = await getPostData(params.id)
  return {
    props: {
      postData
    }
  }
}
