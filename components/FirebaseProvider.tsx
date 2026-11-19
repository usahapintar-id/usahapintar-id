"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import {
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
  type Timestamp,
} from "firebase/firestore";
import {
  auth,
  db,
  googleProvider,
  handleFirestoreError,
  OperationType,
  testConnection,
} from "@/lib/firebase";
import { kunciBulanSekarang, type PaketTier } from "@/lib/paket";

export interface UserProfileData {
  uid: string;
  displayName: string;
  email: string;
  businessName: string;
  businessPhone: string;
  businessAddress: string;
  businessLogoData: string;
  plan: PaketTier;
  invoiceMonthKey: string;
  invoiceCountThisMonth: number;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface ProfilTokoInput {
  displayName?: string;
  businessName: string;
  businessPhone: string;
  businessAddress: string;
  businessLogoData: string;
}

interface FirebaseContextValue {
  user: User | null;
  profile: UserProfileData | null;
  authReady: boolean;
  profileLoading: boolean;
  authBusy: boolean;
  authError: string | null;
  clearAuthError: () => void;
  loginDenganGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  simpanProfilToko: (input: ProfilTokoInput) => Promise<void>;
}

const FirebaseContext = createContext<FirebaseContextValue | undefined>(
  undefined
);

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [authBusy, setAuthBusy] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    void testConnection();
    const unsub = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setAuthReady(true);
      if (!nextUser) {
        setProfile(null);
        setProfileLoading(false);
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!authReady || !user) return;
    if (!user.emailVerified) {
      setAuthError(
        "Email akun Google Anda belum terverifikasi. Gunakan akun Google terverifikasi untuk sinkronisasi data."
      );
      setProfileLoading(false);
      return;
    }

    const userPath = `users/${user.uid}`;
    const userRef = doc(db, "users", user.uid);
    let cancelled = false;
    let unsubProfile: (() => void) | undefined;

    async function initAndSubscribe() {
      if (!user) return;
      setProfileLoading(true);
      try {
        const snap = await getDoc(userRef);
        if (!snap.exists() && !cancelled) {
          const fallbackName = (
            user.displayName ||
            user.email?.split("@")[0] ||
            "Pemilik Usaha"
          )
            .trim()
            .slice(0, 100);
          const safeEmail = (user.email || "pengguna@cuankit.id")
            .trim()
            .slice(0, 160);
          await setDoc(userRef, {
            uid: user.uid,
            displayName: fallbackName || "Pemilik Usaha",
            email: safeEmail,
            businessName: "",
            businessPhone: "",
            businessAddress: "",
            businessLogoData: "",
            plan: "gratis",
            invoiceMonthKey: kunciBulanSekarang(),
            invoiceCountThisMonth: 0,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, userPath);
      }

      if (cancelled) return;

      unsubProfile = onSnapshot(
        userRef,
        (docSnap) => {
          if (docSnap.exists()) {
            setProfile(docSnap.data() as UserProfileData);
          }
          setProfileLoading(false);
        },
        (err) => {
          setProfileLoading(false);
          handleFirestoreError(err, OperationType.GET, userPath);
        }
      );
    }

    void initAndSubscribe();

    return () => {
      cancelled = true;
      if (unsubProfile) unsubProfile();
    };
  }, [authReady, user]);

  const clearAuthError = useCallback(() => setAuthError(null), []);

  const loginDenganGoogle = useCallback(async () => {
    setAuthError(null);
    setAuthBusy(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      const code =
        typeof err === "object" && err !== null && "code" in err
          ? String((err as { code: unknown }).code)
          : "";
      if (code === "auth/popup-closed-by-user") {
        setAuthError("Jendela masuk Google ditutup sebelum selesai.");
      } else if (code === "auth/popup-blocked") {
        setAuthError(
          "Popup login diblokir browser. Izinkan popup untuk situs ini lalu coba lagi."
        );
      } else {
        setAuthError("Gagal masuk dengan Google. Silakan coba lagi.");
      }
    } finally {
      setAuthBusy(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setAuthError(null);
    setAuthBusy(true);
    try {
      await signOut(auth);
      setProfile(null);
    } catch {
      setAuthError("Gagal keluar dari akun. Coba muat ulang halaman.");
    } finally {
      setAuthBusy(false);
    }
  }, []);

  const simpanProfilToko = useCallback(
    async (input: ProfilTokoInput) => {
      if (!user) throw new Error("Silakan masuk akun terlebih dahulu.");
      const userPath = `users/${user.uid}`;
      const userRef = doc(db, "users", user.uid);
      const nextDisplayName = (
        input.displayName ??
        profile?.displayName ??
        user.displayName ??
        "Pemilik Usaha"
      )
        .trim()
        .slice(0, 100);

      try {
        await updateDoc(userRef, {
          displayName: nextDisplayName || "Pemilik Usaha",
          businessName: input.businessName.trim().slice(0, 120),
          businessPhone: input.businessPhone.trim().slice(0, 32),
          businessAddress: input.businessAddress.trim().slice(0, 240),
          businessLogoData: input.businessLogoData.slice(0, 120000),
          updatedAt: serverTimestamp(),
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, userPath);
      }
    },
    [user, profile?.displayName]
  );

  return (
    <FirebaseContext.Provider
      value={{
        user,
        profile,
        authReady,
        profileLoading,
        authBusy,
        authError,
        clearAuthError,
        loginDenganGoogle,
        logout,
        simpanProfilToko,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
}

export function useFirebaseAuth() {
  const ctx = useContext(FirebaseContext);
  if (!ctx) {
    throw new Error("useFirebaseAuth harus dipakai di dalam FirebaseProvider");
  }
  return ctx;
}
