import React from 'react';
import { Button } from '../common/Button';
import { Icon } from '../common/Icon';

interface LandingPageProps {
  onLoginClick: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick }) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-neutral-100 bg-white/80 backdrop-blur-md fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="bg-primary-600 text-white p-1.5 rounded-lg">
                <Icon name="cube" className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold text-neutral-900 tracking-tight">HR Core</span>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={onLoginClick}
                className="text-sm font-medium text-neutral-600 hover:text-primary-600 transition-colors hidden sm:block"
              >
                Log Masuk
              </button>
              <Button onClick={onLoginClick} size="sm">
                Mula Percuma
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-primary-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-xs font-semibold mb-6 animate-fade-in-up">
            <span className="flex h-2 w-2 rounded-full bg-primary-600 mr-2"></span>
            Sistem HR Pilihan No.1 SME Malaysia
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-neutral-900 tracking-tight mb-6 leading-tight">
            Urus Gaji & HR Tanpa <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-blue-600">Sakit Kepala.</span>
          </h1>
          <p className="text-lg sm:text-xl text-neutral-600 max-w-2xl mx-auto mb-10">
            Lupakan Excel yang serabut. Automasi payroll, KWSP, cuti, dan kehadiran dalam satu sistem. Jimat 20 jam sebulan atau kami pulangkan masa anda.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" onClick={onLoginClick} className="shadow-lg shadow-primary-500/30 transform hover:-translate-y-1 transition-all">
              Cuba Demo Percuma Sekarang
            </Button>
            <button onClick={onLoginClick} className="px-6 py-3 rounded-md font-semibold text-neutral-700 bg-white border border-neutral-200 hover:bg-neutral-50 transition-colors">
              Lihat Ciri-ciri
            </button>
          </div>
          <p className="mt-4 text-sm text-neutral-500">
            Tiada kad kredit diperlukan • 14 hari percubaan percuma
          </p>
          
          {/* Dashboard Preview */}
          <div className="mt-16 relative mx-auto max-w-5xl rounded-xl bg-neutral-900/5 p-2 ring-1 ring-inset ring-neutral-900/10 lg:rounded-2xl lg:p-4">
             <div className="rounded-md bg-white shadow-2xl overflow-hidden ring-1 ring-neutral-900/10">
                <img src="https://placehold.co/1200x800/f3f4f6/0ea5e9?text=Dashboard+Preview+HR+Core" alt="HR Core Dashboard" className="w-full h-auto" />
             </div>
          </div>
        </div>
      </section>

      {/* Features Grid - The Value Stack */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">Kenapa 500+ Syarikat Pilih Kami?</h2>
            <p className="text-neutral-500">Kami bukan sekadar software, kami 'rakan kongsi' compliance anda.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon="banknotes" 
              title="Payroll Automatik" 
              desc="Kira gaji, EPF, SOCSO, EIS & PCB dengan tepat. Klik sekali, siap semua fail bank." 
            />
            <FeatureCard 
              icon="calendar" 
              title="Cuti & Kehadiran" 
              desc="Staf mohon cuti guna phone. Bos luluskan dalam 3 saat. Rekod kehadiran via QR Code." 
            />
            <FeatureCard 
              icon="chart-bar" 
              title="Analitik Bisnes" 
              desc="Tahu kos sebenar tenaga kerja anda. Data visual untuk keputusan pantas." 
            />
             <FeatureCard 
              icon="paperclip" 
              title="Klaim Digital" 
              desc="Tangkap gambar resit, upload, dan selesai. Tiada lagi kertas hilang." 
            />
             <FeatureCard 
              icon="users" 
              title="Direktori Pekerja" 
              desc="Semua data staf dalam satu database selamat. Akses di mana-mana sahaja." 
            />
             <FeatureCard 
              icon="check" 
              title="Patuh Undang-undang" 
              desc="Sentiasa dikemaskini dengan akta buruh Malaysia terkini. Elak denda LHDN." 
            />
          </div>
        </div>
      </section>

      {/* Social Proof / Stats */}
      <section className="py-20 bg-neutral-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div>
                    <p className="text-4xl font-bold text-primary-400 mb-2">500+</p>
                    <p className="text-neutral-400">Syarikat Aktif</p>
                </div>
                <div>
                    <p className="text-4xl font-bold text-primary-400 mb-2">RM 50J+</p>
                    <p className="text-neutral-400">Gaji Diproses</p>
                </div>
                <div>
                    <p className="text-4xl font-bold text-primary-400 mb-2">99.9%</p>
                    <p className="text-neutral-400">Uptime Sistem</p>
                </div>
                <div>
                    <p className="text-4xl font-bold text-primary-400 mb-2">24/7</p>
                    <p className="text-neutral-400">Sokongan Tempatan</p>
                </div>
            </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">Bersedia Untuk Transformasi HR Anda?</h2>
          <p className="text-lg text-primary-100 mb-10">
            Jangan biarkan admin manual melambatkan bisnes anda. Sertai revolusi HR digital hari ini.
          </p>
          <button 
            onClick={onLoginClick}
            className="bg-white text-primary-600 font-bold text-lg px-8 py-4 rounded-lg shadow-xl hover:bg-neutral-50 transform hover:-translate-y-1 transition-all"
          >
            Mula Guna HR Core Sekarang &rarr;
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12 border-t border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 text-center text-neutral-500 text-sm">
          <p>&copy; {new Date().getFullYear()} HR Core System. Hak Cipta Terpelihara.</p>
          <div className="mt-4 space-x-4">
            <a href="#" className="hover:text-primary-600">Privasi</a>
            <a href="#" className="hover:text-primary-600">Terma</a>
            <a href="#" className="hover:text-primary-600">Bantuan</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: any, title: string, desc: string }> = ({ icon, title, desc }) => (
  <div className="p-6 rounded-2xl bg-neutral-50 hover:bg-white border border-neutral-100 hover:border-primary-200 hover:shadow-xl transition-all duration-300 group">
    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary-600 mb-4 group-hover:scale-110 transition-transform">
      <Icon name={icon} className="w-6 h-6" />
    </div>
    <h3 className="text-xl font-bold text-neutral-900 mb-2">{title}</h3>
    <p className="text-neutral-600 leading-relaxed">{desc}</p>
  </div>
);
