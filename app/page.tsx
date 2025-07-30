import PageHeading from "@/components/PageHeading";
import MyGraph2 from "@/components/MyGraph2";

export default function Home() {


    return (
    <div>
      <PageHeading title="Welcome" description="This is the Melvi-tron." />
      <p className="px-8 xl:px-64">I built this web application using React and Next.js to demonstrate various concepts of machine learning and artificial intelligence. Click around, have fun, and learn something.</p>
      <div className="sm:w-1/5 w-1/3 mx-auto my-4">
        <MyGraph2 xMin={-50} xMax={50} yMin={-50} yMax={50} graphDataSets={[]} uid='1' />
      </div>
    </div>
  );
}
