// Practical 11 — prescriptionData.js (ES6 Module)
// Exports patient clinical routine and medication dataset

export const initialPrescriptions = [
  {
    id: 'rx_101',
    medication: 'Cardiovascular Beta-Blocker',
    genericName: 'Metoprolol Succinate 25mg',
    doctor: 'Dr. S. Nair (Cardiology)',
    scheduledTime: '08:00 AM',
    intakeInstructions: 'Take with warm water before meals',
    targetOffsetMinutes: 18,
    category: 'Prescription Rx',
    color: '#E11D48',
    doseUnit: '1 Tablet'
  },
  {
    id: 'rx_102',
    medication: 'Multivitamin & Omega-3',
    genericName: 'Dietary Micronutrient Complex',
    doctor: 'Dr. P. Deshpande (Internal Med)',
    scheduledTime: '01:00 PM',
    intakeInstructions: 'Post-lunch dietary supplement with milk',
    targetOffsetMinutes: 105,
    category: 'Supplement',
    color: '#D97706',
    doseUnit: '2 Softgels'
  },
  {
    id: 'rx_103',
    medication: 'Fasting Blood Sugar Test',
    genericName: 'Diagnostic Clinical Evaluation',
    doctor: 'Pathology Lab B-12',
    scheduledTime: '05:30 PM',
    intakeInstructions: '8 hours water fasting required prior to draw',
    targetOffsetMinutes: 270,
    category: 'Diagnostic Lab',
    color: '#0D9488',
    doseUnit: 'Lab Blood Draw'
  },
  {
    id: 'rx_104',
    medication: 'Neuro-Calm Night Dose',
    genericName: 'Melatonin & Magnesium Glycinate 5mg',
    doctor: 'Dr. K. Verma (Neurology)',
    scheduledTime: '10:00 PM',
    intakeInstructions: '30 mins before sleep in low light',
    targetOffsetMinutes: 540,
    category: 'Night Routine',
    color: '#7C3AED',
    doseUnit: '1 Capsule'
  }
];

export class PrescriptionManager {
  constructor(data = initialPrescriptions) {
    this.items = [...data];
  }

  getAll() {
    return this.items;
  }

  addRoutine(routine) {
    this.items.push({
      ...routine,
      id: `rx_${Date.now()}`
    });
  }

  getSortedUpcoming() {
    return this.items.sort((a, b) => a.targetOffsetMinutes - b.targetOffsetMinutes);
  }
}
