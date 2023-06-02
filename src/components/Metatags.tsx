import Head from "next/head";

type MetatagsProps = {
  title?: string;
  description?: string;
  image?: string;
};

const Metatags = ({ title, description, image }: MetatagsProps) => {
  const baseTitle = "Cervixes - Cervical Cancer Diagnosis Expert System";
  const baseDescription =
    "Cervixes is a cervical cancer diagnosis expert system using Dempster-Shafer methodology";
  return (
    <Head>
      <title>{title || baseTitle}</title>

      <meta name="title" content={title || baseTitle} />
      <meta name="description" content={description || baseDescription} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title || baseTitle} />
      <meta
        name="twitter:description"
        content={description || baseDescription}
      />
      <meta name="twitter:image" content={image} />

      <meta property="og:title" content={title || baseTitle} />
      <meta
        property="og:description"
        content={description || baseDescription}
      />
      <meta property="og:image" content={image} />

      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
};

export default Metatags;
