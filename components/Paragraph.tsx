export default function Paragraph( { children }: { children: React.ReactNode } ) {

  return (
  <>
    <p className="px-8 py-2 xl:px-24">{children}</p>
  </>
  );
}