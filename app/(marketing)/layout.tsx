import { Footer } from './_components/footer';
import { Navbar } from './_components/navbar';
import React from 'react';

const MarketingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full bg-zinc-600">
      <Navbar />
      <main className="pt-40 pb-20 bg-zinc-600">{children}</main>
      <Footer />
    </div>
  );
};

export default MarketingLayout;
