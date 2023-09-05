import Head from "next/head";
import { readModels, readVisualStyles } from "@/lib/visual-style";
import Form from "./shared/form";
import Loading from "./shared/loading";

export default function Page() {
  const models: any = readModels();
  const visualStyles: any = readVisualStyles();

  return (
    /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
    <>
      <Head>
        <title>First Post</title>
      </Head>
      <Loading visualStyles={visualStyles} />
      <Form models={models} />
    </>
  );
}
