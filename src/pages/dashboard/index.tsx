import type { GetServerSideProps } from "next";
import { getServerAuthSession } from "../../server/auth";
import { api } from "../../utils/api";

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

const Dashboard = () => {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });

  return (
    <div>
      <p className="text-2xl text-black">
        {hello.data ? hello.data.greeting : "Loading tRPC query..."}
      </p>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos
        laudantium facere maxime consequuntur est voluptatem qui unde, rerum
        temporibus laboriosam accusantium voluptates, cumque eos assumenda hic
        at esse officiis veritatis?
      </p>
    </div>
  );
};

export default Dashboard;
