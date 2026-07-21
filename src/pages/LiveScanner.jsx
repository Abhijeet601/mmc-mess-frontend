import { useCallback, useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import {
  AlertTriangle,
  Camera,
  CheckCircle2,
  Clock,
  RefreshCw,
  ScanBarcode,
  ShieldAlert,
  ShieldCheck,
  University,
  Wifi,
  WifiOff,
  XCircle,
} from "lucide-react";
import { apiRequest } from "../lib/api";

const SCANNER_ID = "mess-live-qr-reader";

/* ------------------------------------------------------------------ */
/* Sound                                                               */
/* ------------------------------------------------------------------ */
function playSuccessSound() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const context = new AudioContext();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.frequency.setValueAtTime(660, context.currentTime);
    oscillator.frequency.setValueAtTime(880, context.currentTime + 0.08);
    gain.gain.setValueAtTime(0.12, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.22);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.22);
    oscillator.onended = () => context.close();
  } catch (error) {
    console.warn("[MessScanner] success audio unavailable", error);
  }
}

/* ------------------------------------------------------------------ */
/* Error classification                                                */
/* Backend is expected to return either error.code or a message that   */
/* matches one of these patterns. This keeps the four required states  */
/* visually and textually distinct instead of one generic red banner.  */
/* ------------------------------------------------------------------ */
const ERROR_STATES = {
  QR_EXPIRED: {
    title: "QR Expired",
    detail: "Ask student to show the latest live QR",
    icon: Clock,
    tone: "amber",
  },
  QR_USED: {
    title: "QR Already Used",
    detail: "This code cannot be accepted again",
    icon: ShieldAlert,
    tone: "red",
  },
  QR_INVALID: {
    title: "Invalid Mess QR",
    detail: "This code could not be verified",
    icon: XCircle,
    tone: "red",
  },
  MEAL_ALREADY_MARKED: {
    title: "Meal Attendance Already Marked",
    detail: "This student's attendance for the current meal is already recorded",
    icon: AlertTriangle,
    tone: "orange",
  },
  ADMIN_SESSION_REQUIRED: {
    title: "Admin Session Required",
    detail: "Log out and sign in through the Admin or Super Admin portal",
    icon: ShieldAlert,
    tone: "red",
  },
};

function classifyError(error) {
  const code = error?.code || error?.data?.code;
  if (code && ERROR_STATES[code]) return ERROR_STATES[code];

  const msg = (error?.message || "").toLowerCase();
  if (msg.includes("expired")) return ERROR_STATES.QR_EXPIRED;
  if (msg.includes("already used") || msg.includes("reused") || msg.includes("used already")) return ERROR_STATES.QR_USED;
  if (msg.includes("already marked") || msg.includes("already recorded")) return ERROR_STATES.MEAL_ALREADY_MARKED;
  if (msg.includes("permission") || msg.includes("unauthorized") || msg.includes("token expired")) return ERROR_STATES.ADMIN_SESSION_REQUIRED;
  return { ...ERROR_STATES.QR_INVALID, detail: error?.message || ERROR_STATES.QR_INVALID.detail };
}

const TONE_CLASSES = {
  amber: "border-amber-200 bg-amber-50 text-amber-700",
  red: "border-red-200 bg-red-50 text-red-700",
  orange: "border-orange-200 bg-orange-50 text-orange-700",
  blue: "border-blue-100 bg-blue-50 text-blue-700",
};

/* ------------------------------------------------------------------ */
/* Success ID card                                                     */
/* ------------------------------------------------------------------ */
function StudentSuccessCard({ result }) {
  const s = result.student;
  const details = [
    ["Registration No.", s.registration_number],
    ["Admission No.", s.admission_number],
    ["Course", s.course],
    ["Department", s.department],
    ["Year / Semester", [s.academic_year, s.semester].filter(Boolean).join(" / ")],
    ["Hostel", s.hostel],
    ["Room", s.room_number],
    ["Current Meal", result.meal],
    ["Scan Date", result.scan_date],
    ["Exact Scan Time", result.scan_time],
  ];

  return (
    <div className="animate-pill-pop overflow-hidden rounded-xl3 border border-emerald-200 bg-white p-4 shadow-[0_20px_55px_rgba(16,185,129,.16)] sm:p-5">
      <div className="flex flex-col items-center justify-center gap-2 text-center text-green-700 sm:flex-row sm:gap-3">
        <CheckCircle2 size={30} className="shrink-0 sm:size-[34px]" />
        <h2 className="font-display text-xl font-semibold sm:text-2xl">Attendance Marked Successfully</h2>
      </div>

      <div className="relative mt-4 overflow-hidden rounded-xl3 border border-emerald-100 bg-white shadow-soft sm:mt-5">
        <div className="pointer-events-none absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-emerald-50/70 to-transparent" />
        <div className="relative flex items-center justify-between gap-2 bg-gradient-to-r from-blue-700 to-cyan-600 px-4 py-3 text-white sm:px-5">
          <div className="flex min-w-0 items-center gap-2">
            <University size={22} className="shrink-0 sm:size-[24px]" />
            <div className="min-w-0">
              <p className="truncate font-display text-sm font-semibold sm:text-base">Magadh Mahila College</p>
              <p className="text-[10px] text-white/75">Digital Mess Attendance ID</p>
            </div>
          </div>
          <ShieldCheck size={26} className="shrink-0 sm:size-[28px]" />
        </div>

        <div className="relative grid grid-cols-1 gap-5 p-4 sm:p-5 sm:grid-cols-[130px_1fr] md:grid-cols-[160px_1fr]">
          <div className="mx-auto text-center sm:mx-0">
            <img
              src={s.photo_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(s.name)}`}
              alt={s.name}
              className="mx-auto h-32 w-32 rounded-xl2 border-4 border-white object-cover shadow-[0_0_0_3px_rgba(52,211,153,.22),0_12px_28px_rgba(15,23,42,.14)] sm:h-40 sm:w-36"
            />
            <div className="mt-3 rounded-full bg-green-100 px-3 py-1 text-sm font-bold text-green-700">MARKED</div>
          </div>

          <div>
            <h3 className="font-display text-xl font-semibold text-dark sm:text-2xl">{s.name}</h3>
            <p className="text-sm text-slate-500">Student ID: {s.registration_number}</p>
            <div className="mt-4 grid grid-cols-1 gap-x-5 gap-y-3 xs:grid-cols-2 sm:grid-cols-2">
              {details.map(([label, value]) => (
                <div key={label}>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{label}</p>
                  <p className="break-words text-sm font-semibold text-slate-700">{value || "—"}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main scanner                                                        */
/* ------------------------------------------------------------------ */
export default function LiveScanner() {
  const scannerRef = useRef(null);
  const mountedRef = useRef(false);
  const processingRef = useRef(false);
  const recentRef = useRef(new Map());
  const resumeTimerRef = useRef(null);
  const mealRef = useRef(null);
  const startingRef = useRef(false);
  const hardwareInputRef = useRef(null);
  const deviceModeRef = useRef("hardware");

  const [cameras, setCameras] = useState([]);
  const [cameraId, setCameraId] = useState("");
  const [deviceMode, setDeviceMode] = useState("hardware");
  const [hardwareValue, setHardwareValue] = useState("");
  const [meal, setMeal] = useState(null);
  const [status, setStatus] = useState("starting"); // starting | ready | validating | success | rejected | error
  const [message, setMessage] = useState("Checking camera and meal window…");
  const [errorState, setErrorState] = useState(null); // classified error for rejected state
  const [result, setResult] = useState(null);

  const resumeScanner = useCallback(() => {
    setResult(null);
    setErrorState(null);
    processingRef.current = false;
    try {
      scannerRef.current?.resume();
      setStatus("ready");
      setMessage("Ready to scan next student");
      if (deviceModeRef.current === "hardware") {
        setTimeout(() => hardwareInputRef.current?.focus(), 0);
      }
    } catch (error) {
      console.warn("[MessScanner] resume failed", error);
      setStatus("error");
      setMessage("Scanner could not resume. Restart the camera.");
    }
  }, []);

  const handleDecoded = useCallback(
    async (decodedText) => {
      const token = decodedText.trim();
      const now = Date.now();
      for (const [key, time] of recentRef.current) if (now - time > 30000) recentRef.current.delete(key);
      if (!token || processingRef.current || recentRef.current.has(token)) return;

      processingRef.current = true;
      recentRef.current.set(token, now);
      try {
        scannerRef.current?.pause(true);
      } catch (error) {
        console.warn("[MessScanner] pause failed", error);
      }

      setStatus("validating");
      setErrorState(null);
      setMessage("Validating live QR and marking attendance…");
      console.info("[MessScanner] QR decoded; validating with backend");

      try {
        const data = await apiRequest("/scanner/consume", {
          method: "POST",
          body: JSON.stringify({ token, meal: mealRef.current }),
        });
        setResult(data);
        setStatus("success");
        setMessage("Attendance marked");
        playSuccessSound();
        resumeTimerRef.current = setTimeout(resumeScanner, 4000);
      } catch (error) {
        console.error("[MessScanner] validation rejected", error);
        const classified = classifyError(error);
        setErrorState(classified);
        setStatus("rejected");
        setMessage(classified.title);
        resumeTimerRef.current = setTimeout(resumeScanner, 2800);
      }
    },
    [resumeScanner]
  );

  const startCamera = useCallback(
    async (preferredId) => {
      if (!mountedRef.current || startingRef.current || scannerRef.current?.isScanning) return;
      if (!window.isSecureContext && location.hostname !== "localhost" && location.hostname !== "127.0.0.1") {
        setStatus("error");
        setMessage("Camera access requires HTTPS or localhost.");
        return;
      }
      if (!navigator.mediaDevices?.getUserMedia) {
        setStatus("error");
        setMessage("This browser does not support camera access.");
        return;
      }
      try {
        startingRef.current = true;
        setStatus("starting");
        setMessage("Requesting camera permission…");
        const found = await Html5Qrcode.getCameras();
        if (!found.length) throw new Error("No camera was detected");
        if (!mountedRef.current) return;

        setCameras(found);
        const rear = found.find((c) => /back|rear|environment/i.test(c.label));
        const selected = preferredId || rear?.id || found[0].id;
        setCameraId(selected);

        const scanner = new Html5Qrcode(SCANNER_ID, false);
        scannerRef.current = scanner;
        await scanner.start(
          selected,
          {
            fps: 10,
            qrbox: (w, h) => {
              const size = Math.floor(Math.min(w, h) * 0.72);
              return { width: size, height: size };
            },
            aspectRatio: window.innerWidth < 640 ? 1 : 1.333,
          },
          handleDecoded,
          () => {}
        );
        if (!mountedRef.current) {
          await scanner.stop();
          await scanner.clear();
          if (scannerRef.current === scanner) scannerRef.current = null;
          return;
        } else {
          setStatus("ready");
          setMessage("Ready to scan live Mess QR");
          console.info("[MessScanner] camera started", { camera: selected, meal: mealRef.current });
        }
      } catch (error) {
        console.error("[MessScanner] camera start failed", error);
        if (mountedRef.current) {
          setStatus("error");
          setMessage(
            error?.name === "NotAllowedError"
              ? "Camera permission denied. Allow camera access and try again."
              : error.message || "Unable to start camera"
          );
        }
      } finally {
        startingRef.current = false;
      }
    },
    [handleDecoded]
  );

  const restartCamera = useCallback(
    async (id = cameraId) => {
      if (startingRef.current) return;
      clearTimeout(resumeTimerRef.current);
      processingRef.current = false;
      const old = scannerRef.current;
      scannerRef.current = null;
      if (old) {
        try {
          if (old.isScanning) await old.stop();
          await old.clear();
        } catch (error) {
          console.warn("[MessScanner] cleanup before restart failed", error);
        }
      }
      await startCamera(id);
    },
    [cameraId, startCamera]
  );

  const activateHardwareScanner = useCallback(async () => {
    clearTimeout(resumeTimerRef.current);
    processingRef.current = false;
    const old = scannerRef.current;
    scannerRef.current = null;
    if (old) {
      try {
        if (old.isScanning) await old.stop();
        await old.clear();
      } catch (error) {
        console.warn("[MessScanner] camera cleanup for hardware scanner failed", error);
      }
    }
    deviceModeRef.current = "hardware";
    setDeviceMode("hardware");
    setHardwareValue("");
    setStatus("ready");
    setMessage("USB/Bluetooth scanner ready");
    setTimeout(() => hardwareInputRef.current?.focus(), 0);
  }, []);

  const selectCamera = useCallback(
    async (id) => {
      deviceModeRef.current = "camera";
      setDeviceMode("camera");
      setCameraId(id);
      await restartCamera(id);
    },
    [restartCamera]
  );

  const submitHardwareScan = useCallback(
    (event) => {
      event.preventDefault();
      const value = hardwareValue.trim();
      if (!value) return;
      setHardwareValue("");
      handleDecoded(value);
    },
    [handleDecoded, hardwareValue]
  );

  useEffect(() => {
    mountedRef.current = true;
    apiRequest("/scanner/status")
      .then((data) => {
        if (!mountedRef.current) return;
        mealRef.current = data.meal;
        setMeal(data.meal);
        if (!data.meal) {
          setStatus("error");
          setMessage("No meal scanning window is currently active");
          return;
        }
        activateHardwareScanner();
      })
      .catch((error) => {
        console.error("[MessScanner] status request failed", error);
        setStatus("error");
        setMessage(error.message);
      });

    return () => {
      mountedRef.current = false;
      clearTimeout(resumeTimerRef.current);
      const scanner = scannerRef.current;
      scannerRef.current = null;
      if (scanner) {
        const cleanup = scanner.isScanning ? scanner.stop().then(() => scanner.clear()) : scanner.clear();
        cleanup.catch((error) => console.warn("[MessScanner] camera cleanup failed", error));
      }
    };
  }, [activateHardwareScanner]);

  const bannerTone = errorState ? TONE_CLASSES[errorState.tone] : status === "validating" ? TONE_CLASSES.blue : "border-blue-100 bg-blue-50 text-blue-700";
  const BannerIcon = errorState?.icon;

  return (
    <div className="relative mx-auto w-full max-w-6xl space-y-4 overflow-hidden rounded-xl3 border border-sky-100 bg-[linear-gradient(rgba(14,165,233,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,.035)_1px,transparent_1px)] bg-[size:28px_28px] p-3 pb-[max(12px,env(safe-area-inset-bottom))] shadow-soft sm:space-y-5 sm:p-5 lg:p-6">
      {/* Header */}
      <div className="flex flex-col gap-3 rounded-xl3 border border-white bg-white/90 p-4 shadow-soft backdrop-blur-sm sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-sky-100 bg-sky-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-sky-700"><ShieldCheck size={12} /> Secure attendance terminal</div>
          <h1 className="font-display text-xl font-semibold text-dark sm:text-2xl">Live Mess QR Scanner</h1>
          <p className="text-sm text-slate-500">Camera and hardware validation with real-time attendance</p>
        </div>
        <div
          className={`inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
            status === "ready" ? "border border-emerald-200 bg-emerald-50 text-emerald-700 shadow-[0_0_0_4px_rgba(16,185,129,.06)]" : "border border-slate-200 bg-slate-50 text-slate-600"
          }`}
        >
          {status === "ready" ? <Wifi size={15} /> : <WifiOff size={15} />} {meal || "Meal closed"}
        </div>
      </div>

      {/* Success ID card replaces the scanner view */}
      {result && <StudentSuccessCard result={result} />}

      {/* Scanner + side panel — stacks on mobile/tablet, side-by-side on desktop */}
      <div className={`${result ? "hidden" : "grid"} grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-[minmax(0,1fr)_320px]`}>
        {/* Camera */}
        <div className={`relative overflow-hidden rounded-xl3 border bg-white p-2 shadow-[0_18px_50px_rgba(14,116,144,.12)] sm:p-3 ${deviceMode === "hardware" ? "border-sky-100" : "animate-frame-pulse border-cyan-200"}`}>
          <div
            id={SCANNER_ID}
            className={`${deviceMode === "hardware" ? "hidden" : "block"} mx-auto aspect-square w-full max-h-[70vh] overflow-hidden rounded-xl2 border border-sky-100 bg-sky-50 sm:aspect-[4/3] lg:aspect-square`}
          />
          {deviceMode === "camera" && status === "ready" && <div className="pointer-events-none absolute inset-x-8 top-4 h-0.5 animate-laser bg-gradient-to-r from-transparent via-cyan-300 to-transparent shadow-[0_0_14px_3px_rgba(34,211,238,.75)]" />}
          {deviceMode === "camera" && ["left-5 top-5 border-l-4 border-t-4", "right-5 top-5 border-r-4 border-t-4", "bottom-5 left-5 border-b-4 border-l-4", "bottom-5 right-5 border-b-4 border-r-4"].map((position) => <span key={position} className={`pointer-events-none absolute h-9 w-9 animate-corner-glow border-cyan-300 ${position}`} />)}
          {deviceMode === "hardware" && (
            <form onSubmit={submitHardwareScan} className="relative flex min-h-[360px] flex-col items-center justify-center overflow-hidden rounded-xl2 border border-sky-100 bg-gradient-to-b from-sky-50/80 to-white px-4 text-center">
              <span className="absolute h-40 w-40 animate-ripple rounded-full border border-sky-200" />
              <span className="relative grid h-20 w-20 place-items-center rounded-xl3 border border-sky-200 bg-white text-primary shadow-[0_14px_35px_rgba(37,99,235,.14)]"><ScanBarcode size={42} className="animate-float-icon" /></span>
              <h2 className="mt-4 font-display text-xl font-semibold text-dark">USB/Bluetooth Scanner</h2>
              <p className="mt-1 text-xs text-slate-500">Scanner input is active and ready</p>
              <input
                ref={hardwareInputRef}
                value={hardwareValue}
                onChange={(event) => setHardwareValue(event.target.value)}
                onBlur={() => setTimeout(() => hardwareInputRef.current?.focus(), 0)}
                autoFocus
                autoComplete="off"
                aria-label="Hardware scanner input"
                className="relative mt-5 w-full max-w-md rounded-xl2 border border-sky-200 bg-white px-4 py-3 text-center text-sm shadow-inner outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                placeholder="Scan student QR"
              />
              <button type="submit" className="relative mt-3 rounded-xl2 bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(37,99,235,.22)] transition hover:bg-primary-600 active:scale-[0.98]">
                Submit scan
              </button>
            </form>
          )}
        </div>

        {/* Side panel */}
        <aside className="rounded-xl3 border border-sky-100 bg-white/95 p-4 shadow-[0_18px_50px_rgba(15,23,42,.08)] backdrop-blur-sm sm:p-5">
          <div className="flex items-center gap-2">
            {deviceMode === "hardware" ? <ScanBarcode className="text-primary" size={20} /> : <Camera className="text-primary" size={20} />}
            <h2 className="font-semibold text-dark">{deviceMode === "hardware" ? "Hardware Scanner" : "Camera Scanner"}</h2>
          </div>

          <div
            role="status"
            aria-live="polite"
            className={`mt-4 flex items-start gap-2 rounded-xl2 border p-3 text-sm shadow-sm ${bannerTone}`}
          >
            {BannerIcon && <BannerIcon size={16} className="mt-0.5 shrink-0" />}
            <div>
              <p className="font-semibold">{errorState ? errorState.title : message}</p>
              {errorState && <p className="mt-0.5 text-xs opacity-80">{errorState.detail}</p>}
            </div>
          </div>

          <div className="mt-5">
            <p className="text-xs font-semibold text-slate-500">Scanner device</p>
            <div className="mt-1.5 grid grid-cols-2 gap-2 rounded-xl2 bg-slate-50 p-1" role="group" aria-label="Scanner device">
              <button
                type="button"
                onClick={() => selectCamera(cameraId)}
                className={`flex min-h-11 items-center justify-center gap-2 rounded-xl2 border px-2 py-2 text-xs font-semibold transition ${
                  deviceMode === "camera"
                    ? "border-primary bg-primary text-white shadow-md"
                    : "border-transparent bg-white text-slate-600 hover:border-primary/30"
                }`}
              >
                <Camera size={16} /> Camera
              </button>
              <button
                type="button"
                onClick={activateHardwareScanner}
                className={`flex min-h-11 items-center justify-center gap-2 rounded-xl2 border px-2 py-2 text-xs font-semibold transition ${
                  deviceMode === "hardware"
                    ? "border-primary bg-primary text-white shadow-md"
                    : "border-transparent bg-white text-slate-600 hover:border-primary/30"
                }`}
              >
                <ScanBarcode size={16} /> USB Scanner
              </button>
            </div>
          </div>

          {deviceMode === "camera" && (
            <label className="mt-4 block text-xs font-semibold text-slate-500">
              Camera source
              <select
                value={cameraId}
                onChange={(event) => selectCamera(event.target.value)}
                className="mt-1.5 w-full rounded-xl2 border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                {!cameras.length && <option value="">Detecting cameras...</option>}
                {cameras.map((camera, index) => (
                  <option key={camera.id} value={camera.id}>
                    {camera.label || `Camera ${index + 1}`}
                  </option>
                ))}
              </select>
            </label>
          )}

          <button
            onClick={() => deviceMode === "hardware" ? hardwareInputRef.current?.focus() : restartCamera()}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl2 bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(37,99,235,.2)] transition hover:bg-primary-600 active:scale-[0.98]"
          >
            <RefreshCw size={15} />
            {deviceMode === "hardware" ? "Focus scanner input" : "Restart camera"}
          </button>

          <p className="mt-4 text-xs leading-relaxed text-slate-400">
            {deviceMode === "hardware"
              ? "Connect the scanner in keyboard mode. Its scan is submitted automatically when the device sends Enter."
              : "Camera access works on HTTPS or localhost. The scanner pauses during validation and resumes automatically after each result."}
          </p>
        </aside>
      </div>
    </div>
  );
}
