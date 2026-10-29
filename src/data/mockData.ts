import { User, UserRole } from '@/types/auth';
import { Appointment, Prescription, MedicineStock, AnalyticsData } from '@/types/medical';

// Demo users with predefined credentials
export const demoUsers: User[] = [
  {
    id: '1',
    email: 'patient@demo.com',
    password: '12345',
    name: 'Krishna',
    role: 'patient',
    location: 'Village Rampur, Gujarat',
    phone: '+91 9876543210'
  },
  {
    id: '2',
    email: 'doctor@demo.com',
    password: '12345',
    name: 'Dr. Rachit',
    role: 'doctor',
    specialization: 'General Medicine',
    location: 'Ahmedabad Medical Center',
    phone: '+91 9876543211'
  },
  {
    id: '3',
    email: 'pharmacy@demo.com',
    password: '12345',
    name: 'Rural Health Pharmacy',
    role: 'pharmacy',
    location: 'Mehsana District, Gujarat',
    phone: '+91 9876543212'
  },
  {
    id: '4',
    email: 'admin@demo.com',
    password: '12345',
    name: 'Abhay Singh Chauhan',
    role: 'admin',
    location: 'Telemedicine HQ',
    phone: '+91 9876543213'
  }
];

// Mock appointments
export const mockAppointments: Appointment[] = [
  {
    id: 'apt1',
    patientId: '1',
    patientName: 'Krishna',
    doctorId: '2',
    doctorName: 'Dr. Rachit',
    specialty: 'General Medicine',
    date: '2024-01-15',
    time: '10:00 AM',
    status: 'pending',
    symptoms: 'Fever, cough, body pain for 3 days'
  },
  {
    id: 'apt2',
    patientId: '5',
    patientName: 'Meera Singh',
    doctorId: '2',
    doctorName: 'Dr. Rachit',
    specialty: 'General Medicine',
    date: '2024-01-16',
    time: '2:00 PM',
    status: 'approved',
    symptoms: 'Headache and nausea'
  }
];

// Mock prescriptions
export const mockPrescriptions: Prescription[] = [
  {
    id: 'presc1',
    patientId: '1',
    patientName: 'Krishna',
    doctorId: '2',
    doctorName: 'Dr. Rachit',
    medicines: [
      {
        id: 'med1',
        name: 'Paracetamol',
        dosage: '500mg',
        frequency: 'Twice daily',
        duration: '5 days',
        instructions: 'Take after meals'
      },
      {
        id: 'med2',
        name: 'Azithromycin',
        dosage: '250mg',
        frequency: 'Once daily',
        duration: '3 days',
        instructions: 'Take on empty stomach'
      }
    ],
    notes: 'Complete rest for 3 days. Drink plenty of fluids.',
    date: '2024-01-10',
    status: 'active'
  }
];

// Mock medicine stock
export const mockMedicineStock: MedicineStock[] = [
  {
    id: 'stock1',
    pharmacyId: '3',
    name: 'Paracetamol',
    stock: 150,
    price: 25,
    manufacturer: 'Sun Pharma',
    expiryDate: '2025-06-30'
  },
  {
    id: 'stock2',
    pharmacyId: '3',
    name: 'Azithromycin',
    stock: 45,
    price: 120,
    manufacturer: 'Cipla',
    expiryDate: '2024-12-31'
  },
  {
    id: 'stock3',
    pharmacyId: '3',
    name: 'Cetirizine',
    stock: 0,
    price: 35,
    manufacturer: 'Dr. Reddy\'s',
    expiryDate: '2024-08-15'
  },
  {
    id: 'stock4',
    pharmacyId: '3',
    name: 'Amoxicillin',
    stock: 80,
    price: 150,
    manufacturer: 'Ranbaxy',
    expiryDate: '2025-03-20'
  }
];

// Mock analytics data
export const mockAnalytics: AnalyticsData = {
  totalConsultations: 245,
  weeklyConsultations: [
    { day: 'Mon', count: 35 },
    { day: 'Tue', count: 42 },
    { day: 'Wed', count: 38 },
    { day: 'Thu', count: 45 },
    { day: 'Fri', count: 40 },
    { day: 'Sat', count: 25 },
    { day: 'Sun', count: 20 }
  ],
  topMedicines: [
    { name: 'Paracetamol', requests: 65 },
    { name: 'Azithromycin', requests: 42 },
    { name: 'Cetirizine', requests: 38 },
    { name: 'Amoxicillin', requests: 35 },
    { name: 'Ibuprofen', requests: 28 }
  ],
  fulfillmentRate: 87.5,
  activePatients: 1250,
  activeDoctors: 45,
  totalPharmacies: 18
};