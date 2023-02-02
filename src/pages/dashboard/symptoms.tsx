import type { GetServerSideProps } from "next";
import { getServerAuthSession } from "../../server/auth";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerAuthSession(context);

  if (!session || session.user.role === "USER") {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

const Symptoms = () => {
  return <div>symptoms</div>;
};

export default Symptoms;
