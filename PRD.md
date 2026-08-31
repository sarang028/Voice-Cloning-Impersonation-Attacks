# Product Requirement Document (PRD) - VoiceGuard AI
## AI Fake Voice & Voice Cloning Detection Platform

### 1. Product Overview
VoiceGuard AI is a full-stack, enterprise-grade AI voice deepfake detection platform designed to detect synthetic voice cloning, neural vocoder artifacts, and manipulated audio clips in real-time. Using advanced spectral signal processing, pitch variance analysis, harmonic distortion measurement, and deep learning acoustic heuristics, VoiceGuard AI provides immediate authenticity verification with detailed diagnostic metrics.

---

### 2. Core Features & Functional Requirements

#### 2.1 Audio Ingestion & Live Capture
- **File Upload**: Supports drag-and-drop audio uploading (MP3, WAV, M4A, OGG, FLAC, WebM) up to 50MB.
- **Live Microphone Recording**: High-fidelity in-browser microphone capture with real-time waveform visualization and instant analysis.
- **Audio Playback**: Custom waveform audio player with play/pause, scrub bar, and time indicator.

#### 2.2 Acoustic Feature Extraction & Detection Engine
- **Pitch Variance & Stability Analysis**: Measures pitch contours to identify unnatural monotone/robotic synthetic pitch tracks typical of neural TTS (Text-to-Speech) engines.
- **Spectral Centroid & High-Frequency Truncation**: Evaluates high-frequency roll-off and truncation artifacts common in AI cloning algorithms (e.g., ElevenLabs, Tortoise, Tacotron).
- **Harmonic-to-Noise Ratio (HNR)**: Detects phase discontinuity, vocoder metallic ringing, and sub-harmonic distortion.
- **Temporal Jitter & Phase Coherence**: Identifies micro-splicing, boundary jitter, and unnatural silence padding.
- **Dynamic Classification**: Categorizes audio into `REAL HUMAN VOICE` (85%-100%), `SUSPICIOUS / HIGH ARTIFACTS` (50%-84%), or `AI CLONED FAKE` (0%-49%).

#### 2.3 Visual Diagnostic Spectrogram & Heatmap
- **Interactive Canvas Spectrogram**: Renders real-time frequency distribution across time.
- **Anomaly Highlight Markers**: Visual flags pin-pointing exact timestamp ranges where synthetic artifacts or phase discontinuities occur.

#### 2.4 Supabase Full-Stack Integration
- **Authentication**: Email/Password Sign Up and Sign In powered by Supabase Auth with persistent session state.
- **Database Storage**:
  - `profiles`: User account details, subscription tier, and scan quotas.
  - `voice_scans`: Scan history logs, acoustic metric scores, confidence scores, and audio file metadata.
  - `scan_anomalies`: Anomaly segment markers with timestamps, severity levels, and descriptions.
  - `api_keys`: Generated API keys for enterprise developer integration.
- **Cloud Storage**: Audio sample files stored in Supabase Storage (`audio_samples` bucket) with Row Level Security (RLS).

#### 2.5 Developer Portal & Analytics
- **API Key Management**: Create, copy, and revoke API access keys for programmatic backend verification.
- **Scan History & Export**: Filterable scan logs with one-click report generation and downloadable analysis summary.

---

### 3. User Interface & Aesthetic Design
- **Theme**: Dark Mode Cyber-Security / AI Intelligence aesthetic.
- **Color Palette**: Neon Cyan (`#00f2fe`), Deep Sapphire (`#0f172a`), Vibrant Emerald (`#10b981`), High-Risk Crimson (`#ef4444`), Glassmorphism surface overlays.
- **Typography**: Inter / Outfit modern sans-serif fonts.
- **Animations**: Micro-interactions, pulsing audio rings, glowing status badges, and smooth tab transitions.

---

### 4. Technical Architecture
- **Frontend Framework**: React 18 + Vite + TypeScript.
- **Icons**: Lucide React icons.
- **Backend / Database**: Supabase (PostgreSQL, Storage, Auth, Edge SQL).
- **Processing Engine**: Web Audio API AudioContext + FFT AnalyserNode + Spectral Heuristic Classifier.