'use client'
import React, { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import ProgressIndicator from '../common/ProgressIndicator'
import AboutComponent from '../forms/AboutComponent'
import AddressComponent from '../forms/AddressComponent'
import BirthDateComponent from '../forms/BirthDateComponent'
import { useSession } from '../../../hooks/useSession';
import { useConfig } from '@/hooks/useConfig'
import { validateStep, type ValidationErrors, type UserData } from '@/lib/validation'
import { api } from '@/lib/api'
import bcrypt from 'bcryptjs';

type RegisterResponse = {
  sessionId: string;
  ok: boolean;
};

type AddressErrors = {
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
};

export default function Onboarding() {
  const { sessionId, setSessionId, userData, setUserData, currentStep, setCurrentStep } = useSession()
  const { config } = useConfig()
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [loading, setLoading] = useState<boolean>(false)

  const handleValidation = (): boolean => {
    const { errors: validationErrors, isValid } = validateStep(currentStep, userData, config)
    setErrors(validationErrors)
    return isValid
  }

  const handleNext = async (): Promise<void> => {
    if (!handleValidation()) return
    
    setLoading(true)
    try {
      if (currentStep === 1) {
        try {
        const response = await api.post<RegisterResponse>('/auth/register', {
          email: userData.email,
          password: userData.password
        })
        setSessionId(response.sessionId)

        } catch (error: any) {
          if (error.status === 400) {
          const encodedEmail = encodeURIComponent(userData.email!);
          const existingUser = await api.get(`/auth/${encodedEmail}`);
          const isMatch = await bcrypt.compare(userData.password!, existingUser.user.password);
            if (!isMatch) {
              setErrors({ general: 'Password mismatch for existing user!' });
              return;
            }
            setSessionId(existingUser.user.id);
            if (existingUser.user.onboarding_step !== 4) {
            setCurrentStep(existingUser.user.onboarding_step);  
            } else {
              setErrors({ general: 'User has already Onboarded!' });
            }
            return;
          } else {
          console.error('Unexpected error:', error);
          setErrors({ general: 'Something went wrong during registration.' });
            }
        }
      } else {
        await api.put(`/users/${sessionId}`, {
          ...userData,
          currentStep: currentStep + 1
        })
      }
      
      if (currentStep < 3) {
        setCurrentStep(currentStep + 1)
      } else {
        await api.put(`/users/${sessionId}`, {
          ...userData,
          completed: true
        })
        alert('Onboarding completed successfully!')
        setCurrentStep(1)
      }
    } catch (error) {
      console.error('Error saving data:', error)
      setErrors({ general: 'User already registered!' })
    } finally {
      setLoading(false)
    }
  }

  const handlePrevious = (): void => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const updateUserData = (field: keyof UserData, value: any): void => {
    setUserData((prev: UserData) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev: ValidationErrors) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const renderStep = () => {
    if (currentStep === 1) {
      return (
        <div className="space-y-6">
          <div>
            <input
              type="email"
              value={userData.email || ''}
              onChange={(e) => updateUserData('email', e.target.value)}
              className={`w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#B75D48] focus:border-[#9c4e3d] ${
                errors.email ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Valid Email"
            />
            {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
          </div>
          
          <div>
            <input
              type="password"
              value={userData.password || ''}
              onChange={(e) => updateUserData('password', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#B75D48] focus:border-[#9c4e3d] ${
                errors.password ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Your password"
            />
            {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
          </div>
        </div>
      )
    }
    const pageComponents = config[`page${currentStep}`] || []
    
    return (
      <div className="space-y-6">
        {pageComponents.map((component: string) => {
          switch (component) {
            case 'about':
              return (
                <AboutComponent
                  key="about"
                  value={userData.about}
                  onChange={(value: string) => updateUserData('about', value)}
                  error={errors.about}
                />
              )
            case 'address':
              return (
                <AddressComponent
                  key="address"
                  value={userData.address}
                  onChange={(value: UserData['address']) => updateUserData('address', value)}
                  errors={{
                    street: errors['address.street'],
                    city: errors['address.city'],
                    state: errors['address.state'],
                    zip: errors['address.zip']
                  } as AddressErrors}
                />
              )
            case 'birthdate':
              return (
                <BirthDateComponent
                  key="birthdate"
                  value={userData.birthdate}
                  onChange={(value: string) => updateUserData('birthdate', value)}
                  error={errors.birthdate}
                />
              )
            default:
              return null
          }
        })}
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-8">
        <ProgressIndicator currentStep={currentStep} totalSteps={3} />
        
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          {currentStep === 1 && 'Create Your Account'}
          {currentStep === 2 && 'Tell Us More'}
          {currentStep === 3 && 'Final Details'}
        </h2>

        {errors.general && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{errors.general}</p>
          </div>
        )}

        {renderStep()}

        <div className="flex justify-between mt-8">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <button
            onClick={handleNext}
            disabled={loading}
            className="flex items-center space-x-2 px-6 py-2 text-white bg-[#B75D48] rounded-md hover:bg-[#9c4e3d]"
          >
            <span>{loading ? 'Saving...' : currentStep === 3 ? 'Complete' : 'Next'}</span>
            {!loading && <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  )
}