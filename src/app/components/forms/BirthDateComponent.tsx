'use client'
export default function BirthDateComponent({ value, onChange, error }: any) {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium">Date of Birth</label>
        <input
          type="date"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#B75D48] focus:border-[#B75D48] ${
            error ? 'border-red-300' : 'border-gray-300'
          }`}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    );
  }