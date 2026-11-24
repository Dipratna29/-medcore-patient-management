import api from './api';

export async function getPatients(filters = {}) {
  const params = {};
  if (filters.search?.trim()) params.search = filters.search.trim();
  if (filters.ward) params.ward = filters.ward;
  if (filters.department) params.department = filters.department;
  if (filters.doctor) params.doctor = filters.doctor;
  if (filters.status) params.status = filters.status;

  const response = await api.get('/api/patients', { params });
  return response.data;
}

export async function getPatientById(id) {
  const response = await api.get(`/api/patients/${id}`);
  return response.data;
}

export async function createPatient(patientData) {
  const response = await api.post('/api/patients', patientData);
  return response.data;
}

export async function updatePatient(id, patientData) {
  const response = await api.put(`/api/patients/${id}`, patientData);
  return response.data;
}

export async function deletePatient(id) {
  const response = await api.delete(`/api/patients/${id}`);
  return response.data;
}

export async function dischargePatient(id) {
  const response = await api.patch(`/api/patients/${id}/discharge`);
  return response.data;
}

export async function getDashboardStats() {
  const response = await api.get('/api/dashboard/stats');
  return response.data;
}

export async function getDropdownOptions() {
  const response = await api.get('/api/options');
  return response.data;
}
