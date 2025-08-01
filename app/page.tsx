import PageHeading from "@/components/PageHeading";
import MyGraph2 from "@/components/MyGraph2";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";


export default function Home() {

    return (
    <div>
      <PageHeading title="Welcome" description="This is the Melvi-tron." />
      <p className="px-8 xl:px-64">I built this web application using React and Next.js to demonstrate various concepts of machine learning and artificial intelligence. Click around, have fun, and learn something.</p>
      <div className="sm:w-1/5 w-1/3 mx-auto my-4">
        <Dialog>
          <DialogTrigger asChild>
            <MyGraph2 xMin={-50} xMax={50} yMin={-50} yMax={50} graphDataSets={[]} uid='1' />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Don&apos;t Do That</DialogTitle>
              <DialogDescription>
                Tapping this or clicking on it doesn&apos;t do anything. Please navigate the site using the menus like a normal person.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>-Mike</DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
