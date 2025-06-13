'use client'

export default function AddressComponent({ value, onChange, errors }: any) {
    const handleChange = (field: string, fieldValue: string) => {
      onChange({ ...value, [field]: fieldValue });
    };
  
    return (
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Address Information</h3>
        <div className="grid grid-cols-1 gap-4">
          <div className = "space-y-2">
            <label className="block text-sm font-medium text-gray-700">Street Address</label>
            <input
              type="text"
              value={value?.street || ''}
              onChange={(e) => handleChange('street', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#B75D48] focus:border-[#B75D48] ${
                errors?.street ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Street address, apartment or suite?"
            />
            {errors?.street && <p className="text-sm text-red-600">{errors.street}</p>}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className = "space-y-2">
              <label className="block text-sm font-medium text-gray-700">City</label>
              <input
                type="text"
                value={value?.city || ''}
                onChange={(e) => handleChange('city', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#B75D48] focus:border-[#B75D48] ${
                  errors?.city ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="What's your city?"
              />
              {errors?.city && <p className="text-sm text-red-600">{errors.city}</p>}
            </div>
            
            <div className = "space-y-2">
              <label className="block text-sm font-medium text-gray-700">State</label>
              <input
                type="text"
                value={value?.state || ''}
                onChange={(e) => handleChange('state', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#B75D48] focus:border-[#B75D48] ${
                  errors?.state ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Which of the 50 States?"
              />
              {errors?.state && <p className="text-sm text-red-600">{errors.state}</p>}
            </div>
          </div>
          
          <div className="w-1/2 space-y-2">
            <label className="block text-sm font-medium text-gray-700">ZIP Code</label>
            <input
              type="text"
              value={value?.zip || ''}
              onChange={(e) => handleChange('zip', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#B75D48] focus:border-[#B75D48] ${
                errors?.zip ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Got a ZIP Code?"
            />
            {errors?.zip && <p className="text-sm text-red-600">{errors.zip}</p>}
          </div>
        </div>
      </div>
    );
  }