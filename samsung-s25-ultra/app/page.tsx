import Navbar from '../components/Navbar';
import ScrollSequence from '../components/ScrollSequence';
import AmbientBackground from '../components/AmbientBackground';
import AiHud from '../components/AiHud';

export default function Home() {
  return (
    <main className="min-h-screen bg-samsung-black text-white selection:bg-samsung-cyan selection:text-black">
      <AmbientBackground />
      <Navbar />
      <AiHud />
      <ScrollSequence />
      <footer className="py-20 text-center text-white/20 text-sm relative z-10">
        <p>&copy; 2025 Samsung Electronics Co., Ltd.</p>
      </footer>
    </main>
  );
}
