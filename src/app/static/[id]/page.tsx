import Head from "next/head";
import Layout from "@/components/Layout";
import Date from "@/components/Date";
import { getAllPostIds, getPostData } from "@/lib/posts";
import utilStyles from "@/app/utils.module.css";

type Params = {
  id: string;
};

type Props = {
  params: Params;
};

export async function generateStaticParams(): Promise<Params[]> {
  const paths = getAllPostIds();
  return paths;
}

export default async function PostDetail(props: Props) {
  const { params } = props;
  const postData = await getPostData(params.id);
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
