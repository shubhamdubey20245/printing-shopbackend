import { useState, useEffect } from 'react'
import { Settings as SettingsIcon, Building, Shield, Bell, Palette, Bot, Smartphone } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import api from '@/lib/api'

export default function Settings() {
  const [activeSection, setActiveSection] = useState('business')
  const { isDark, toggleDark, themeColor, setThemeColor } = useAppStore()
  
  const [isSaving, setIsSaving] = useState(false)
  const [profile, setProfile] = useState({
    STORE_NAME: '',
    OWNER_NAME: '',
    STORE_ADDRESS: '',
    STORE_CITY: '',
    STORE_STATE: '',
    STORE_PINCODE: '',
    STORE_MOBILE: '',
    STORE_EMAIL: '',
    GST_NUMBER: '',
    DRUG_LICENSE_NUMBER: ''
  })

  useEffect(() => {
    if (activeSection === 'business') {
      api.get('/settings/store-profile').then(res => {
        if (res.data?.success && res.data?.data) {
          setProfile(prev => ({ ...prev, ...res.data.data }))
        }
      }).catch(console.error)
    }
  }, [activeSection])

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value })
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      await api.post('/settings/store-profile', profile)
      alert('Store Profile updated successfully!')
    } catch (error) {
      console.error(error)
      alert('Failed to save store profile.')
    } finally {
      setIsSaving(false)
    }
  }

  const sections = [
    { id: 'business', label: 'Business Profile', icon: Building },
    { id: 'gst', label: 'Tax & GST', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'categories', label: 'Categories', icon: Building },
    { id: 'suppliers', label: 'Suppliers', icon: Building },
    { id: 'ai', label: 'AI Features', icon: Bot },
    { id: 'whatsapp', label: 'WhatsApp API', icon: Smartphone },
    { id: 'appearance', label: 'Appearance', icon: Palette },
  ]

  const Switch = ({ checked, onChange }: { checked: boolean, onChange: () => void }) => (
    <button 
      onClick={onChange}
      className={`w-11 h-6 rounded-full relative transition-colors ${checked ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-700'}`}
    >
      <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${checked ? 'translate-x-5' : 'translate-x-0'}`}></span>
    </button>
  )

  return (
    <div className="flex gap-6 h-[calc(100vh-6rem)] -m-2 p-2">
      {/* Left Nav */}
      <div className="w-64 flex-shrink-0 flex flex-col gap-2">
        <h1 className="page-header px-4 py-2 flex items-center gap-2 mb-4">
          <SettingsIcon className="w-6 h-6 text-primary-500" /> Settings
        </h1>
        {sections.map(s => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 font-semibold transition-all ${
              activeSection === s.id 
                ? 'bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 shadow-sm border border-transparent dark:border-gray-700' 
                : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800/50'
            }`}
          >
            <s.icon className={`w-5 h-5 ${activeSection === s.id ? 'text-primary-500' : 'text-gray-400'}`} />
            {s.label}
          </button>
        ))}
      </div>

      {/* Right Content */}
      <div className="flex-1 card overflow-y-auto p-8 relative">
        <div className="max-w-2xl">
          
          {activeSection === 'appearance' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div>
                <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Appearance Settings</h2>
                <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>Customize how MediFlow ERP looks on your device.</p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-xl border bg-gray-50/50 dark:bg-gray-800/30" style={{ borderColor: 'var(--border)' }}>
                  <div>
                    <p className="font-bold" style={{ color: 'var(--text-primary)' }}>Dark Mode</p>
                    <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Switch to a dark theme that's easier on the eyes.</p>
                  </div>
                  <Switch checked={isDark} onChange={toggleDark} />
                </div>

                <div className="p-4 rounded-xl border bg-gray-50/50 dark:bg-gray-800/30 space-y-4" style={{ borderColor: 'var(--border)' }}>
                  <div>
                    <p className="font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Theme Color</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Select your primary brand color.</p>
                  </div>
                  <div className="flex gap-3 flex-wrap">
                    {[
                      { color: '#6366f1', label: 'Indigo' },
                      { color: '#8b5cf6', label: 'Violet' },
                      { color: '#3b82f6', label: 'Blue' },
                      { color: '#10b981', label: 'Emerald' },
                      { color: '#f43f5e', label: 'Rose' },
                      { color: '#f59e0b', label: 'Amber' },
                      { color: '#06b6d4', label: 'Cyan' },
                      { color: '#ec4899', label: 'Pink' },
                    ].map(({ color, label }) => {
                      const isSelected = themeColor === color
                      return (
                        <button
                          key={color}
                          title={label}
                          onClick={() => setThemeColor(color)}
                          className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-all duration-200 ${
                            isSelected
                              ? 'ring-2 ring-offset-2 dark:ring-offset-[#111118] scale-110'
                              : 'opacity-80 hover:opacity-100'
                          }`}
                          style={{
                            backgroundColor: color,
                            ...(isSelected ? { outline: `2px solid ${color}`, outlineOffset: '3px' } : {})
                          }}
                        >
                          {isSelected && <div className="w-2.5 h-2.5 bg-white rounded-full shadow" />}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'ai' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div>
                <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>AI Features</h2>
                <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>Configure intelligence modules across the ERP.</p>
              </div>

              <div className="space-y-4">
                {[
                  { title: 'Enable AI Copilot', desc: 'Show the floating AI assistant chat everywhere.', checked: true },
                  { title: 'Smart Search Suggestions', desc: 'Show AI-powered typo-tolerant medicine search.', checked: true },
                  { title: 'Prescription OCR', desc: 'Enable image-to-bill parsing module.', checked: true },
                  { title: 'Expiry Financial Prediction', desc: 'Calculate potential loss from expiring medicines automatically.', checked: false },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl border hover:border-primary-300 transition-colors" style={{ borderColor: 'var(--border)' }}>
                    <div>
                      <p className="font-bold" style={{ color: 'var(--text-primary)' }}>{item.title}</p>
                      <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{item.desc}</p>
                    </div>
                    <Switch checked={item.checked} onChange={() => {}} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'categories' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div>
                <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Manage Categories</h2>
                <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>Add or remove medicine categories.</p>
              </div>
              <div className="flex flex-col items-center justify-center text-center py-10 text-gray-500 bg-gray-50 dark:bg-gray-800/30 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                <p className="text-sm">Category management will be integrated here.</p>
                <button className="btn-primary mt-4 px-4 py-2 rounded-xl text-sm">Add Category</button>
              </div>
            </div>
          )}

          {activeSection === 'suppliers' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div>
                <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Manage Suppliers</h2>
                <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>Configure suppliers for your inventory.</p>
              </div>
              <div className="flex flex-col items-center justify-center text-center py-10 text-gray-500 bg-gray-50 dark:bg-gray-800/30 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                <p className="text-sm">Supplier management will be integrated here.</p>
                <button className="btn-primary mt-4 px-4 py-2 rounded-xl text-sm">Add Supplier</button>
              </div>
            </div>
          )}

          {activeSection === 'business' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div>
                <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Medical Store Profile</h2>
                <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>This information will be printed on your invoices and reports.</p>
              </div>
              
              <form onSubmit={handleSaveProfile} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold mb-1 text-gray-500">Store Name</label>
                    <input name="STORE_NAME" value={profile.STORE_NAME} onChange={handleProfileChange} className="input-field" placeholder="e.g. SHREE RADHE MEDICOSE" required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1 text-gray-500">Owner Name</label>
                    <input name="OWNER_NAME" value={profile.OWNER_NAME} onChange={handleProfileChange} className="input-field" placeholder="Owner Name" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-bold mb-1 text-gray-500">Store Address</label>
                    <input name="STORE_ADDRESS" value={profile.STORE_ADDRESS} onChange={handleProfileChange} className="input-field" placeholder="Shop No., Street Name" required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1 text-gray-500">City</label>
                    <input name="STORE_CITY" value={profile.STORE_CITY} onChange={handleProfileChange} className="input-field" placeholder="City" required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1 text-gray-500">State & Pincode</label>
                    <div className="flex gap-2">
                      <input name="STORE_STATE" value={profile.STORE_STATE} onChange={handleProfileChange} className="input-field w-2/3" placeholder="State" />
                      <input name="STORE_PINCODE" value={profile.STORE_PINCODE} onChange={handleProfileChange} className="input-field w-1/3" placeholder="Pincode" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1 text-gray-500">Mobile Number</label>
                    <input name="STORE_MOBILE" value={profile.STORE_MOBILE} onChange={handleProfileChange} className="input-field" placeholder="Phone Number" required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1 text-gray-500">Email Address</label>
                    <input name="STORE_EMAIL" value={profile.STORE_EMAIL} onChange={handleProfileChange} type="email" className="input-field" placeholder="Email" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1 text-gray-500">GST Number</label>
                    <input name="GST_NUMBER" value={profile.GST_NUMBER} onChange={handleProfileChange} className="input-field" placeholder="GSTIN" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1 text-gray-500">Drug License Number (D.L.No.)</label>
                    <input name="DRUG_LICENSE_NUMBER" value={profile.DRUG_LICENSE_NUMBER} onChange={handleProfileChange} className="input-field" placeholder="DL Number" />
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-end">
                  <button type="submit" disabled={isSaving} className="btn-primary px-8 py-2.5 rounded-xl text-sm shadow-md disabled:opacity-70">
                    {isSaving ? 'Saving...' : 'Save Profile'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeSection !== 'business' && activeSection !== 'appearance' && activeSection !== 'ai' && activeSection !== 'categories' && activeSection !== 'suppliers' && (
            <div className="flex flex-col items-center justify-center text-center py-20 text-gray-500 animate-in fade-in">
              <SettingsIcon className="w-16 h-16 text-gray-200 dark:text-gray-800 mb-4 animate-spin-slow" />
              <h3 className="text-lg font-bold mb-2 text-gray-800 dark:text-gray-200">{sections.find(s=>s.id===activeSection)?.label} Configuration</h3>
              <p className="text-sm max-w-sm mx-auto">This settings panel is functional in the full production build. Basic options shown here.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
