import React from 'react';
import { User, Activity } from 'lucide-react';

interface PharmacyCustomerPanelProps {
  customer: any;
  onChange: (field: string, value: any) => void;
}

export const PharmacyCustomerPanel: React.FC<PharmacyCustomerPanelProps> = ({ customer, onChange }) => {
  return (
    <div className="bg-white dark:bg-[#1a1a24] rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm p-3 mb-3 grid grid-cols-1 md:grid-cols-2 gap-4 relative overflow-hidden">
      
      {/* Patient Information */}
      <div className="space-y-2 relative z-10">
        <h3 className="font-bold text-xs text-gray-900 dark:text-gray-100 flex items-center gap-1.5 border-b border-gray-100 dark:border-gray-800 pb-1.5">
          <User className="w-3.5 h-3.5 text-primary-500" /> Customer Details
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <div className="col-span-2 sm:col-span-1">
            <input 
              type="text" 
              value={customer.name || ''} 
              onChange={e => onChange('name', e.target.value)} 
              className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md p-1.5 text-xs focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              placeholder="Customer Name"
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <input 
              type="text" 
              value={customer.phone || ''} 
              onChange={e => onChange('phone', e.target.value)} 
              className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md p-1.5 text-xs focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              placeholder="Mobile Number"
            />
          </div>
          <div>
            <input 
              type="number" 
              value={customer.patient_age || ''} 
              onChange={e => onChange('patient_age', e.target.value)} 
              className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md p-1.5 text-xs focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              placeholder="Age (Yrs)"
            />
          </div>
          <div>
            <select 
              value={customer.patient_gender || ''} 
              onChange={e => onChange('patient_gender', e.target.value)} 
              className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md p-1.5 text-xs focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            >
              <option value="">Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Doctor Information */}
      <div className="space-y-2 md:border-l border-gray-100 dark:border-gray-800 md:pl-4 relative z-10">
        <h3 className="font-bold text-xs text-gray-900 dark:text-gray-100 flex items-center gap-1.5 border-b border-gray-100 dark:border-gray-800 pb-1.5">
          <Activity className="w-3.5 h-3.5 text-emerald-500" /> Doctor Details
        </h3>
        <div className="grid grid-cols-1 gap-2">
          <div>
            <input 
              type="text" 
              value={customer.doctor_name || ''} 
              onChange={e => onChange('doctor_name', e.target.value)} 
              className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md p-1.5 text-xs focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              placeholder="Doctor Name"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input 
              type="text" 
              value={customer.doctor_reg_no || ''} 
              onChange={e => onChange('doctor_reg_no', e.target.value)} 
              className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md p-1.5 text-xs focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              placeholder="Reg Number (Opt)"
            />
            <input 
              type="text" 
              value={customer.doctor_specialty || ''} 
              onChange={e => onChange('doctor_specialty', e.target.value)} 
              className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md p-1.5 text-xs focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              placeholder="Specialty (Opt)"
            />
          </div>
        </div>
      </div>

    </div>
  );
};
