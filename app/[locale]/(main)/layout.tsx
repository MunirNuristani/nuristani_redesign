import Header from "@/app/components/navigation/Header";
import Footer from "@/app/components/navigation/Footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="min-h-[calc(100dvh-180px)]">{children}</main>
      <Footer />
    </>
  );
}
