export default function PrivatePageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <header>Header</header>
      <main className="bg-red-400 max-w-screen-xl mx-auto px-10">
        {children}
      </main>
    </>
  );
}
