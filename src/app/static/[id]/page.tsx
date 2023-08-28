import Head from "next/head";
import Layout from "@/components/Layout";
import Date from "@/components/Date";
import { getAllPostIds, getPostData } from "@/lib/posts";
import utilStyles from "@/app/utils.module.css";

export async function generateStaticParams() {
  const paths = getAllPostIds();
  return paths;
}

export async function getPostStaticProps(params) {
  const postData = await getPostData(params.id);
  return postData;
}

export default async function PostDetail({ params }) {
  const postData = await getPostStaticProps(params);
  return (
    <Layout>
      {/* Add this <Head> tag */}
      <Head>
        <title>{postData.title}</title>
      </Head>
      <article>
        <h1 className={utilStyles.headingXl}>{postData.title}</h1>
        <div className={utilStyles.lightText}>
          <Date dateString={postData.date} />
        </div>
        <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
      </article>
    </Layout>
  );
}
