import { Response } from 'express';
import { z } from 'zod';
import { localStore } from '../db/index.js';
import { AuthenticatedRequest, Appointment, AppointmentStatus } from '../types/index.js';

const CreateAppointmentSchema = z.object({
  doctorId: z.string().min(1, 'Doctor is required'),
  doctorName: z.string().min(1, 'Doctor name is required'),
  specialty: z.string().min(1, 'Specialty is required'),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  type: z.enum(['video', 'in-person', 'phone']).default('video'),
  symptoms: z.string().min(3, 'Symptoms description required'),
});

const UpdateStatusSchema = z.object({
  status: z.enum(['REQUESTED', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'FAILED', 'RESCHEDULED']),
  notes: z.string().optional(),
  newDate: z.string().optional(),
  newTime: z.string().optional(),
});

export async function getAppointments(req: AuthenticatedRequest, res: Response) {
  try {
    const user = req.user!;
    const store = localStore.get();
    let list: Appointment[] = store.appointments || [];

    if (user.role === 'patient') {
      list = list.filter(a => a.patientId === user.id);
    } else if (user.role === 'doctor') {
      list = list.filter(a => a.doctorId === user.id);
    } // admin sees all

    return res.json({
      success: true,
      data: list
    });
  } catch (error) {
    console.error('getAppointments error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve appointments' });
  }
}

export async function createAppointment(req: AuthenticatedRequest, res: Response) {
  try {
    const user = req.user!;
    const parsed = CreateAppointmentSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: parsed.error.errors[0]?.message || 'Validation failed'
      });
    }

    const { doctorId, doctorName, specialty, date, time, type, symptoms } = parsed.data;
    const store = localStore.get();
    const appointments: Appointment[] = store.appointments || [];

    // Slot Conflict Protection: Prevent double booking same doctor at same date & time slot
    const conflict = appointments.find(a => 
      a.doctorId === doctorId &&
      a.date === date &&
      a.time === time &&
      !['CANCELLED', 'FAILED'].includes(a.status)
    );

    if (conflict) {
      return res.status(409).json({
        success: false,
        message: `Dr. ${doctorName} already has a scheduled consultation at ${time} on ${date}. Please select an alternate time slot.`
      });
    }

    const now = new Date().toISOString();
    const newAppointment: Appointment = {
      id: `apt-${Date.now()}`,
      patientId: user.id,
      patientName: user.name,
      doctorId,
      doctorName,
      specialty,
      date,
      time,
      type,
      status: 'REQUESTED',
      symptoms,
      createdAt: now,
      updatedAt: now,
      auditLog: [
        {
          timestamp: now,
          actorId: user.id,
          actorName: user.name,
          actorRole: user.role,
          action: 'REQUESTED',
          details: 'Appointment request submitted by patient'
        }
      ]
    };

    appointments.unshift(newAppointment);
    store.appointments = appointments;
    localStore.save(store);

    return res.status(201).json({
      success: true,
      message: 'Consultation requested successfully',
      data: newAppointment
    });
  } catch (error) {
    console.error('createAppointment error:', error);
    return res.status(500).json({ success: false, message: 'Failed to schedule appointment' });
  }
}

export async function updateAppointmentStatus(req: AuthenticatedRequest, res: Response) {
  try {
    const user = req.user!;
    const { id } = req.params;
    const parsed = UpdateStatusSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: parsed.error.errors[0]?.message || 'Validation failed'
      });
    }

    const { status, notes, newDate, newTime } = parsed.data;
    const store = localStore.get();
    const appointments: Appointment[] = store.appointments || [];

    const index = appointments.findIndex(a => a.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    const existing = appointments[index];

    // Authorization: Patients can only cancel their own appointment. Doctors can manage their assigned ones.
    if (user.role === 'patient') {
      if (existing.patientId !== user.id) {
        return res.status(403).json({ success: false, message: 'Unauthorized access to appointment' });
      }
      if (status !== 'CANCELLED') {
        return res.status(403).json({ success: false, message: 'Patients can only cancel their own appointments.' });
      }
    } else if (user.role === 'doctor') {
      if (existing.doctorId !== user.id) {
        return res.status(403).json({ success: false, message: 'Unauthorized: You are not the assigned doctor for this appointment.' });
      }
    }

    const now = new Date().toISOString();
    const updated: Appointment = {
      ...existing,
      status: status === 'RESCHEDULED' ? 'CONFIRMED' : status,
      date: newDate || existing.date,
      time: newTime || existing.time,
      notes: notes || existing.notes,
      updatedAt: now,
      auditLog: [
        ...(existing.auditLog || []),
        {
          timestamp: now,
          actorId: user.id,
          actorName: user.name,
          actorRole: user.role,
          action: status,
          details: notes || `Appointment moved to ${status}`
        }
      ]
    };

    appointments[index] = updated;
    store.appointments = appointments;
    localStore.save(store);

    return res.json({
      success: true,
      message: `Appointment ${status.toLowerCase()} successfully`,
      data: updated
    });
  } catch (error) {
    console.error('updateAppointmentStatus error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update appointment status' });
  }
}
