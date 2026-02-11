import { useState, useEffect } from 'react';
import { Student } from '../types/student';

interface StudentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (student: Omit<Student, 'id' | 'avatar'>) => void;
  editStudent: Student | null;
}

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  grade: string;
  age: number;
  gender: Student['gender'];
  enrollmentDate: string;
  address: string;
  parentPhone: string;
  status: Student['status'];
  gpa: number;
};

const emptyForm: FormData = {
  firstName: '',
  lastName: '',
  email: '',
  grade: '9th',
  age: 14,
  gender: 'Male',
  enrollmentDate: new Date().toISOString().split('T')[0],
  address: '',
  parentPhone: '',
  status: 'Active',
  gpa: 0.0,
};

export function StudentForm({ isOpen, onClose, onSubmit, editStudent }: StudentFormProps) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editStudent) {
      setForm({
        firstName: editStudent.firstName,
        lastName: editStudent.lastName,
        email: editStudent.email,
        grade: editStudent.grade,
        age: editStudent.age,
        gender: editStudent.gender,
        enrollmentDate: editStudent.enrollmentDate,
        address: editStudent.address,
        parentPhone: editStudent.parentPhone,
        status: editStudent.status,
        gpa: editStudent.gpa,
      });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
  }, [editStudent, isOpen]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!form.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Invalid email format';
    if (form.age < 5 || form.age > 25) newErrors.age = 'Age must be between 5 and 25';
    if (form.gpa < 0 || form.gpa > 4) newErrors.gpa = 'GPA must be between 0 and 4';
    if (!form.parentPhone.trim()) newErrors.parentPhone = 'Parent phone is required';
    if (!form.address.trim()) newErrors.address = 'Address is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(form);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 rounded-t-2xl flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {editStudent ? 'Edit Student' : 'Add New Student'}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {editStudent ? 'Update student information' : 'Fill in the student details below'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">First Name *</label>
              <input
                type="text"
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${errors.firstName ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50'}`}
                placeholder="Enter first name"
              />
              {errors.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name *</label>
              <input
                type="text"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${errors.lastName ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50'}`}
                placeholder="Enter last name"
              />
              {errors.lastName && <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>}
            </div>

            {/* Email */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50'}`}
                placeholder="student@school.edu"
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>

            {/* Grade */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Grade</label>
              <select
                value={form.grade}
                onChange={(e) => setForm({ ...form, grade: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all cursor-pointer"
              >
                <option value="9th">9th Grade</option>
                <option value="10th">10th Grade</option>
                <option value="11th">11th Grade</option>
                <option value="12th">12th Grade</option>
              </select>
            </div>

            {/* Age */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Age *</label>
              <input
                type="number"
                value={form.age}
                onChange={(e) => setForm({ ...form, age: parseInt(e.target.value) || 0 })}
                className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${errors.age ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50'}`}
                min="5"
                max="25"
              />
              {errors.age && <p className="mt-1 text-xs text-red-500">{errors.age}</p>}
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Gender</label>
              <select
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value as Student['gender'] })}
                className="w-full px-4 py-2.5 border border-gray-200 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all cursor-pointer"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* GPA */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">GPA *</label>
              <input
                type="number"
                step="0.1"
                value={form.gpa}
                onChange={(e) => setForm({ ...form, gpa: parseFloat(e.target.value) || 0 })}
                className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${errors.gpa ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50'}`}
                min="0"
                max="4"
              />
              {errors.gpa && <p className="mt-1 text-xs text-red-500">{errors.gpa}</p>}
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as Student['status'] })}
                className="w-full px-4 py-2.5 border border-gray-200 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all cursor-pointer"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Graduated">Graduated</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>

            {/* Enrollment Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Enrollment Date</label>
              <input
                type="date"
                value={form.enrollmentDate}
                onChange={(e) => setForm({ ...form, enrollmentDate: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Parent Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Parent Phone *</label>
              <input
                type="text"
                value={form.parentPhone}
                onChange={(e) => setForm({ ...form, parentPhone: e.target.value })}
                className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${errors.parentPhone ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50'}`}
                placeholder="(555) 123-4567"
              />
              {errors.parentPhone && <p className="mt-1 text-xs text-red-500">{errors.parentPhone}</p>}
            </div>

            {/* Address */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Address *</label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${errors.address ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50'}`}
                placeholder="123 Main St, City, State"
              />
              {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address}</p>}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-all shadow-md shadow-indigo-200 hover:shadow-lg active:scale-[0.98]"
            >
              {editStudent ? 'Update Student' : 'Add Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
