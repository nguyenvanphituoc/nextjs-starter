import Head from "next/head";
import Image from "next/image";
import Form from "./shared/form";

export default async function Page() {
  return (
    /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
    <>
      <Head>
        <title>First Post</title>
      </Head>
      <div className="flex-1 items-center justify-end w-full">
        <Image
          src="/FYC-Logo.jpg"
          alt="FYC Logo"
          className="dark:invert m-auto h-auto"
          width={100}
          height={50}
          priority
        />
        <p className="text-center font-semibold">Graphic Asset Search</p>

        <Form />
        {/* <Result /> */}
      </div>
    </>
  );
}
