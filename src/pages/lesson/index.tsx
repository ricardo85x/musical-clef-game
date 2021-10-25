export const getServerSideProps = async ({ res }) => {
    res.setHeader("location", "/lesson/1");
    res.statusCode = 302;
    res.end();
    return { props: {} };
};

const Index = () => <>Redirect to Lesson 1</>;
export default Index;