import Head from "next/head";
import { readModels } from "@/lib/visual-style";
import Form from "./shared/form";

export default function Page() {
  const models: any = readModels();

  return (
    /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
    <>
      <Head>
        <title>First Post</title>
      </Head>
      <Form models={models} />
    </>
  );
}
