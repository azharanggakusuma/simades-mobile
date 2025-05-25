import { useState, useCallback } from 'react';

/**
 * Custom hook untuk mengelola logika pull-to-refresh.
 * @param refreshDataFunction Fungsi yang akan dipanggil untuk memuat ulang data. Sebaiknya mengembalikan Promise.
 * @returns Object berisi `isRefreshing` (boolean) dan `onRefresh` (fungsi callback).
 */
const useRefresh = (refreshDataFunction: () => Promise<void> | void) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await refreshDataFunction(); // Panggil fungsi refresh data spesifik dari layar
    } catch (error) {
      console.error("Proses refresh gagal:", error);
      // Anda bisa menambahkan penanganan error di sini, misal menampilkan toast
    } finally {
      // Beri sedikit jeda agar spinner terlihat jika proses refresh terlalu cepat
      setTimeout(() => {
        setIsRefreshing(false);
      }, 500); // Jeda 0.5 detik, sesuaikan jika perlu
    }
  }, [refreshDataFunction]);

  return { isRefreshing, onRefresh };
};

export default useRefresh;