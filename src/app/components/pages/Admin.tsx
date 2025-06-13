'use client'
import { COMPONENT_TYPES } from '../../../lib/constants'
import { useConfig } from '../../../hooks/useConfig'
import { CircleArrowLeft, CircleArrowRight } from 'lucide-react'

export default function Admin() {
      
  const { config, loading, updateConfig } = useConfig()

  const moveComponent = (component: string, fromPage: string, toPage: string) => {
    const newConfig = { ...config }
    
    // Remove from current page
    if (newConfig[fromPage]) {
      newConfig[fromPage] = newConfig[fromPage].filter(c => c !== component)
    }    
    // Add to new page
    if (!newConfig[toPage]) {
      newConfig[toPage] = []
    }
    newConfig[toPage].push(component)
    
    if (newConfig[fromPage] && newConfig[fromPage].length === 0) {
      return
    }
    updateConfig(newConfig)
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">Loading configuration...</div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">Admin Configuration</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg text-center font-semibold mb-4">Page 2 Components</h3>
          <div className="space-y-4">
            {(config.page2 || []).map(component => {
              const ComponentIcon = COMPONENT_TYPES[component]?.icon
              return (
                <div key={component} className="flex items-center justify-between p-3 bg-[#F0E7E2] rounded-md">
                  <div className="flex items-center space-x-2">
                    {ComponentIcon && <ComponentIcon className="w-6 h-6" />}
                    <span>{COMPONENT_TYPES[component]?.label}</span>
                  </div>
                  <button
                    onClick={() => moveComponent(component, 'page2', 'page3')}
                    className="text-sm px-2 py-1 bg-[#B75D48] text-white rounded hover:bg-[#9C4E3D]"
                    disabled={(config.page2 || []).length <= 1}
                  >
                    <CircleArrowRight />
                  </button>
                </div>
              )
            })}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg text-center font-semibold mb-4">Page 3 Components</h3>
          <div className="space-y-2">
            {(config.page3 || []).map(component => {
              const ComponentIcon = COMPONENT_TYPES[component]?.icon
              return (
                <div key={component} className="flex items-center justify-between p-3 bg-[#ECE8F0] rounded-md">
                  <button
                    onClick={() => moveComponent(component, 'page3', 'page2')}
                    className="text-sm px-2 py-1 bg-[#8077A3] text-white rounded hover:bg-[#6C6490]"
                    disabled={(config.page3 || []).length <= 1}
                  >
                    <CircleArrowLeft />
                  </button>
                  <div className="flex items-center space-x-2">
                    {ComponentIcon && <ComponentIcon className="w-6 h-6" />}
                    <span>{COMPONENT_TYPES[component]?.label}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-[#E6D5C3] rounded-md border border-[#D3C0A4]">
        <p className="text-sm text-[#8C5A00]">
          <strong>Note:</strong> Each page must have at least one component. You can move components between pages but cannot leave a page empty.
        </p>
      </div>
    </div>
  )
}