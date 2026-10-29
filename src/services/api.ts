/**
 * HealthBridge Unified API Client
 * Connects frontend with the Node.js + Express + PostgreSQL backend.
 * Provides resilient offline fallback to local StorageRepository if backend is unreachable.
 */

import { storageService } from './storage';
import { Appointment, HealthRecord, MedicineStock, User } from '@/types/medical';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const TOKEN_KEY = 'healthbridge_auth_token';

export const apiClient = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  },

  clearToken() {
    localStorage.removeItem(TOKEN_KEY);
  },

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {})
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || `Request failed with status ${res.status}`);
    }

    return data;
  },

  // ── Authentication ──────────────────────────────────────────────────────────

  async login(email: string, password: string): Promise<{ success: boolean; token: string; user: User }> {
    try {
      const res = await this.request<{ success: boolean; token: string; user: User }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      if (res.token) {
        this.setToken(res.token);
      }
      return res;
    } catch (err) {
      console.warn('Backend login unavailable, evaluating demo user offline...');
      throw err;
    }
  },

  async register(data: { name: string; email: string; password: string; phone?: string; location?: string }): Promise<{ success: boolean; token: string; user: User }> {
    const res = await this.request<{ success: boolean; token: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    if (res.token) {
      this.setToken(res.token);
    }
    return res;
  },

  async getCurrentUser(): Promise<{ success: boolean; user: User }> {
    return this.request<{ success: boolean; user: User }>('/auth/me');
  },

  // ── Appointments ───────────────────────────────────────────────────────────

  async getAppointments(): Promise<Appointment[]> {
    try {
      const res = await this.request<{ success: boolean; data: Appointment[] }>('/appointments');
      return res.data;
    } catch {
      // Offline fallback
      return storageService.getAppointments();
    }
  },

  async createAppointment(appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Appointment> {
    try {
      const res = await this.request<{ success: boolean; data: Appointment }>('/appointments', {
        method: 'POST',
        body: JSON.stringify(appointmentData)
      });
      return res.data;
    } catch (err: unknown) {
      if (err instanceof Error && err.message.includes('already has a scheduled consultation')) {
        throw err;
      }
      // Offline fallback
      return storageService.createAppointment(appointmentData, {
        id: appointmentData.patientId,
        name: appointmentData.patientName,
        role: 'patient',
        email: ''
      });
    }
  },

  async updateAppointmentStatus(id: string, status: string, notes?: string, newDate?: string, newTime?: string): Promise<Appointment> {
    const res = await this.request<{ success: boolean; data: Appointment }>(`/appointments/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, notes, newDate, newTime })
    });
    return res.data;
  },

  // ── Health Records ─────────────────────────────────────────────────────────

  async getHealthRecords(user?: User): Promise<HealthRecord[]> {
    try {
      const res = await this.request<{ success: boolean; data: HealthRecord[] }>('/records');
      return res.data;
    } catch {
      return storageService.getHealthRecords(user);
    }
  },

  async createHealthRecord(recordData: Omit<HealthRecord, 'id' | 'createdAt' | 'createdBy'>): Promise<HealthRecord> {
    const res = await this.request<{ success: boolean; data: HealthRecord }>('/records', {
      method: 'POST',
      body: JSON.stringify(recordData)
    });
    return res.data;
  },

  // ── Medicine Inventory ─────────────────────────────────────────────────────

  async searchInventory(query?: string): Promise<MedicineStock[]> {
    try {
      const path = query ? `/inventory?query=${encodeURIComponent(query)}` : '/inventory';
      const res = await this.request<{ success: boolean; data: MedicineStock[] }>(path);
      return res.data;
    } catch {
      return storageService.searchMedicineInventory(query || '');
    }
  },

  async updateStock(medicineId: string, quantity: number, mode: 'set' | 'adjust'): Promise<MedicineStock> {
    const res = await this.request<{ success: boolean; data: MedicineStock }>(`/inventory/${medicineId}/stock`, {
      method: 'PATCH',
      body: JSON.stringify({ quantity, mode })
    });
    return res.data;
  },

  // ── Telemetry & Audit Logs ─────────────────────────────────────────────────

  async getTelemetry(): Promise<Record<string, unknown>> {
    try {
      const res = await this.request<{ success: boolean; data: Record<string, unknown> }>('/admin/telemetry');
      return res.data;
    } catch {
      return storageService.getRealAnalytics() as unknown as Record<string, unknown>;
    }
  },

  async getAuditLogs(): Promise<Record<string, unknown>[]> {
    try {
      const res = await this.request<{ success: boolean; data: Record<string, unknown>[] }>('/admin/audit-logs');
      return res.data;
    } catch {
      return storageService.getAuditLogs() as unknown as Record<string, unknown>[];
    }
  }
};
