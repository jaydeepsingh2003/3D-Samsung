import Navbar from '../components/Navbar';
import ScrollSequence from '../components/ScrollSequence';

export default function Home() {
  return (
    <main className="min-h-screen bg-samsung-black text-white selection:bg-samsung-cyan selection:text-black">
      <Navbar />
      <ScrollSequence />
      <footer className="py-20 text-center text-white/20 text-sm">
        <p>&copy; 2025 Samsung Electronics Co., Ltd.</p>

      </footer>
    </main>
  );
}
