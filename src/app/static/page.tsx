import { getSortedPostsData } from "@/lib/posts";
import Head from "next/head";
import Layout, { siteTitle } from "@/components/Layout";
import utilStyles from "@/app/utils.module.css";

export async function getPost() {
  const allPostsData = getSortedPostsData();
  return allPostsData;
}

export default async function Home() {
  const allPostsData = await getPost();
  return (
    <Layout home>
      {/* Keep the existing code here */}

      {/* Add this <section> tag below the existing <section> tag */}
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Blog</h2>
        <ul className={utilStyles.list}>
          {allPostsData.map(({ id, date, title }) => (
            <li className={utilStyles.listItem} key={id}>
              {title}
              <br />
              {id}
              <br />
              {date}
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  );
}
