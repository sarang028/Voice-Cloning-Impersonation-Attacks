# VoxShield AI - Real-Time AI Voice Cloning Impersonation Prevention Platform

VoxShield AI is an enterprise cybersecurity platform designed to detect and prevent AI-powered synthetic voice cloning and audio impersonation attacks in real-time. Built with a Light Enterprise UI, real-time Web Audio API signal processing engine, and a Supabase PostgreSQL backend.

---

## ✨ Features

- **Real-Time Acoustic Signal Engine**: Extracts pitch variance, spectral roll-off, harmonic-to-noise ratio (HNR), and frame boundary jitter using Web Audio API FFT analysis.
- **Dynamic Classification**: Categorizes audio into `VERIFIED AUTHENTIC VOICE`, `HIGH PROBABILITY DEEPFAKE`, or `SUSPICIOUS`.
- **Forensic Diagnostic Spectrogram**: HTML5 Canvas 2D frequency heatmap rendering pitch tracking curves (F0) and highlighted anomaly timestamp bands.
- **Out-of-Band Identity Verification**: Multi-factor verification protocols (`Independent Callback`, `Trusted Contact`, `Security Question`, `Secret Passphrase`, `Push Token`) to halt fraudulent wire transfers and unauthorized access.
- **Supabase PostgreSQL & Storage**: Logs audit history, RLS security policies, developer API key management, and audio sample storage.
- **Security Center & Analytics**: Enterprise security posture score, policy recommendations, and vocoder model signature breakdowns (ElevenLabs, Tortoise-TTS, OpenAI Voice Engine, Tacotron2).

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Lucide Icons, Canvas Confetti.
- **Design System**: Light Enterprise UI with signature VoxShield Brand Gradient (`Green #22C55E -> Orange #F97316 -> Sky Blue #38BDF8 -> White #FFFFFF`).
- **Backend / Database**: Supabase (PostgreSQL Database, Storage, Row-Level Security, Auth).
- **Processing Engine**: Web Audio API AudioContext + FFT AnalyserNode + Spectral Heuristic Classifier.

---

## 🚀 Getting Started

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/sarang028/Voice-Cloning-Impersonation-Attacks.git
cd Voice-Cloning-Impersonation-Attacks
npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
```

### 3. Run Development Server

```bash
npm run dev
```

### 4. Build for Production

```bash
npm run build
```

---

## 📜 Database Schema Setup

Execute `supabase/schema.sql` on your Supabase project to generate the required database tables (`profiles`, `voice_scans`, `scan_anomalies`, `api_keys`) and storage bucket (`audio_samples`).
