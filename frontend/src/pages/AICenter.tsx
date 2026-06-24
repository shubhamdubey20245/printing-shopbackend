import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Bot, Search, Mic, Upload, Camera, Lightbulb, AlertTriangle, 
  TrendingUp, Info, ShoppingCart, ArrowRight, Zap, Play, Calendar, Plus
} from 'lucide-react'
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts'
import { aiSearchResults, aiInsights } from '@/data/mockData'
import { formatCurrency } from '@/utils/cn'

export default function AICenter() {
  const [activeTab, setActiveTab] = useState('search')
  
  const tabs = [
    { id: 'search', label: 'Smart Search' },
    { id: 'advisor', label: 'Business Advisor' },
    { id: 'scanner', label: 'Prescription OCR' },
    { id: 'voice', label: 'Voice Billing' },
    { id: 'expiry', label: 'Expiry Predictor' },
    { id: 'whatsapp', label: 'WhatsApp Order' },
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-primary flex-shrink-0">
          <Bot className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-primary">AI Center</h1>
          <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Next-generation intelligence for your pharmacy</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto pb-2 scrollbar-hide border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800/50 rounded-xl">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="min-h-[500px]">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: Smart Search */}
          {activeTab === 'search' && (
            <motion.div key="search" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div className="card p-2 flex gap-2 max-w-2xl mx-auto relative group">
                <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-20 rounded-2xl blur-xl transition-opacity duration-500 -z-10"></div>
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-500" />
                  <input 
                    defaultValue="fever medicine"
                    className="w-full pl-12 pr-4 py-4 rounded-xl text-lg font-medium bg-transparent border-none outline-none"
                    style={{ color: 'var(--text-primary)' }}
                  />
                </div>
                <button className="w-14 h-14 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-primary-50 hover:text-primary-600 transition-colors text-gray-500">
                  <Mic className="w-6 h-6" />
                </button>
              </div>

              <div className="flex justify-center gap-2">
                {['fever medicine', 'diabetes medicine', 'blood pressure'].map(q => (
                  <span key={q} className="px-3 py-1 rounded-full text-xs font-medium border bg-white dark:bg-gray-900 cursor-pointer hover:border-primary-500 transition-colors" style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
                    "{q}"
                  </span>
                ))}
              </div>

              <div className="mt-8">
                <h3 className="text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                  <Zap className="w-4 h-4 text-amber-500" /> AI Suggestions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {aiSearchResults['fever medicine'].map((res, i) => (
                    <div key={res.name} className="card p-5 border-l-4 hover:shadow-md transition-shadow flex flex-col" style={{ borderLeftColor: res.stock > 0 ? '#10b981' : '#f43f5e' }}>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>{res.name}</h4>
                          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{res.genericName}</p>
                        </div>
                        <span className="text-lg font-black text-primary-600">{formatCurrency(res.mrp)}</span>
                      </div>
                      
                      <div className="my-4">
                        <div className="flex justify-between text-xs mb-1">
                          <span style={{ color: 'var(--text-secondary)' }}>AI Confidence match</span>
                          <span className="font-bold text-emerald-500">{res.relevance}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-success rounded-full" style={{ width: `${res.relevance}%` }}></div>
                        </div>
                      </div>

                      <div className="mt-auto pt-4 flex items-center justify-between">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${res.stock > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                          {res.stock > 0 ? `${res.stock} in stock` : 'Out of Stock'}
                        </span>
                        
                        {res.stock > 0 ? (
                          <button className="px-4 py-1.5 rounded-lg bg-primary-50 text-primary-600 font-semibold text-sm hover:bg-primary-100 flex items-center gap-2">
                            <Plus className="w-4 h-4" /> Add
                          </button>
                        ) : (
                          <button className="px-4 py-1.5 rounded-lg border font-semibold text-sm hover:bg-gray-50 flex items-center gap-2" style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
                            View Substitutes <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: Advisor */}
          {activeTab === 'advisor' && (
            <motion.div key="advisor" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {aiInsights.map((insight, i) => {
                const getStyle = () => {
                  if(insight.type==='warning') return { bg: 'bg-amber-50 dark:bg-amber-900/10 border-amber-200', icon: AlertTriangle, color: 'text-amber-500' }
                  if(insight.type==='success') return { bg: 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200', icon: TrendingUp, color: 'text-emerald-500' }
                  if(insight.type==='tip') return { bg: 'bg-blue-50 dark:bg-blue-900/10 border-blue-200', icon: Lightbulb, color: 'text-blue-500' }
                  return { bg: 'bg-gray-50 dark:bg-gray-800/50 border-gray-200', icon: Info, color: 'text-gray-500' }
                }
                const s = getStyle()
                return (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i*0.1 }} key={insight.id} className={`card p-6 border-2 ${s.bg}`}>
                    <div className="flex gap-4">
                      <div className={`w-12 h-12 rounded-2xl bg-white dark:bg-[#111118] flex items-center justify-center shadow-sm flex-shrink-0 ${s.color}`}>
                        <s.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>{insight.title}</h3>
                        <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>{insight.description}</p>
                        {insight.action && (
                          <button className={`px-4 py-2 bg-white dark:bg-[#111118] rounded-xl text-sm font-bold shadow-sm ${s.color} hover:scale-105 transition-transform`}>
                            {insight.action}
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          )}

          {/* TAB 3: Scanner */}
          {activeTab === 'scanner' && (
            <motion.div key="scanner" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col lg:flex-row gap-6">
              <div className="w-full lg:w-1/2 h-96 card border-dashed border-2 flex flex-col items-center justify-center bg-gray-50/50 dark:bg-gray-800/20 hover:bg-gray-50 hover:border-primary-400 transition-colors cursor-pointer group" style={{ borderColor: 'var(--border)' }}>
                <div className="w-20 h-20 rounded-full bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Upload className="w-8 h-8 text-primary-500" />
                </div>
                <h3 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Upload Prescription</h3>
                <p className="text-sm mt-1 text-center max-w-xs" style={{ color: 'var(--text-muted)' }}>Drag and drop image or click to browse</p>
                
                <div className="flex items-center gap-4 mt-6">
                  <span className="h-px w-12 bg-gray-300 dark:bg-gray-700"></span>
                  <span className="text-xs font-bold text-gray-400 uppercase">OR</span>
                  <span className="h-px w-12 bg-gray-300 dark:bg-gray-700"></span>
                </div>
                
                <button className="mt-6 px-6 py-2.5 rounded-xl border flex items-center gap-2 font-semibold bg-white dark:bg-gray-900 shadow-sm" style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
                  <Camera className="w-4 h-4" /> Use Camera
                </button>
              </div>

              <div className="w-full lg:w-1/2 card p-6 relative overflow-hidden flex flex-col">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-bl-full -z-10"></div>
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <h3 className="font-bold uppercase tracking-wider text-sm text-emerald-600">Scan Results Ready</h3>
                </div>

                <div className="space-y-4 flex-1">
                  {[
                    { name: 'Dolo 650', qty: '1 strip', stat: 'In Stock (300)' },
                    { name: 'Amoxicillin 500', qty: '2 strips', stat: 'In Stock (45)' },
                    { name: 'Vitamin D3 Sachet', qty: '1 sachet', stat: 'In Stock (70)' }
                  ].map((m, i) => (
                    <div key={i} className="p-3 rounded-xl border bg-white dark:bg-gray-900 flex justify-between items-center" style={{ borderColor: 'var(--border)' }}>
                      <div>
                        <p className="font-bold" style={{ color: 'var(--text-primary)' }}>{m.name}</p>
                        <p className="text-xs mt-0.5 text-emerald-500 font-medium">{m.stat}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>{m.qty}</span>
                        <button className="w-8 h-8 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center hover:bg-primary-100">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <button className="mt-6 w-full btn-primary py-3 rounded-xl font-bold flex justify-center items-center gap-2">
                  <ShoppingCart className="w-5 h-5" /> Add All to Bill
                </button>
              </div>
            </motion.div>
          )}

          {/* TAB 4: Voice */}
          {activeTab === 'voice' && (
            <motion.div key="voice" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-10">
              
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-primary-500 rounded-full animate-ping opacity-20"></div>
                <div className="absolute inset-[-20px] border border-primary-500 rounded-full animate-ping opacity-10" style={{ animationDuration: '2s' }}></div>
                <button className="w-24 h-24 rounded-full bg-gradient-primary shadow-primary flex items-center justify-center relative z-10 hover:scale-105 transition-transform">
                  <Mic className="w-10 h-10 text-white" />
                </button>
              </div>

              <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Listening...</h2>
              <p className="text-sm mb-10" style={{ color: 'var(--text-muted)' }}>"Give me 2 strips of Dolo and 1 strip of Metformin"</p>

              <div className="flex gap-1 h-12 items-end mb-12">
                {[40, 70, 40, 90, 60, 100, 50, 80, 30].map((h, i) => (
                  <motion.div 
                    key={i}
                    animate={{ height: [`${h/2}%`, `${h}%`, `${h/2}%`] }}
                    transition={{ repeat: Infinity, duration: 1, delay: i * 0.1 }}
                    className="w-3 rounded-t-sm bg-primary-500"
                  />
                ))}
              </div>

              <div className="w-full max-w-md card p-4">
                <h3 className="text-xs font-bold uppercase text-gray-400 mb-3">Live Transcription</h3>
                <p className="text-lg font-medium italic" style={{ color: 'var(--text-primary)' }}>
                  Dolo 650 <span className="text-primary-500">2 strips</span>, Metformin 500 <span className="text-primary-500">1 strip</span>
                </p>
                <div className="h-px w-full bg-gray-200 dark:bg-gray-700 my-4"></div>
                <button className="w-full py-2.5 rounded-xl bg-emerald-50 text-emerald-600 font-bold hover:bg-emerald-100 transition-colors">
                  Generate Bill
                </button>
              </div>

            </motion.div>
          )}

          {/* TAB 5: Expiry Predictor */}
          {activeTab === 'expiry' && (
            <motion.div key="expiry" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              <div className="lg:col-span-2 card p-5">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="section-title flex items-center gap-2"><Calendar className="w-5 h-5 text-primary-500" /> Expiry Timeline</h3>
                  <select className="text-xs bg-gray-50 border p-1.5 rounded-lg" style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
                    <option>Next 6 Months</option>
                  </select>
                </div>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={[
                    { month: 'Jul', items: 2 },
                    { month: 'Aug', items: 5 },
                    { month: 'Sep', items: 12 },
                    { month: 'Oct', items: 3 },
                    { month: 'Nov', items: 8 },
                    { month: 'Dec', items: 15 },
                  ]} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
                    <Tooltip cursor={{ fill: 'rgba(244,63,94,0.1)' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow-floating)' }} />
                    <Bar dataKey="items" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="card p-6 border-2 border-rose-100 dark:border-rose-900/30 bg-gradient-to-b from-rose-50/50 to-white dark:from-rose-900/10 dark:to-[#111118]">
                <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-500 flex items-center justify-center mb-4">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-rose-500 mb-1">Financial Risk</h3>
                <p className="text-4xl font-black text-rose-600 mb-2">₹12,400</p>
                <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>Estimated loss from 5 items expiring within 30 days.</p>
                
                <h4 className="font-bold text-xs uppercase tracking-wider mb-3 text-gray-400">AI Recommendations</h4>
                <div className="space-y-2">
                  <button className="w-full p-3 rounded-xl border text-left bg-white dark:bg-gray-900 hover:border-primary-500 transition-colors" style={{ borderColor: 'var(--border)' }}>
                    <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Apply 30% Discount</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Recover approx ₹8,680</p>
                  </button>
                  <button className="w-full p-3 rounded-xl border text-left bg-white dark:bg-gray-900 hover:border-primary-500 transition-colors" style={{ borderColor: 'var(--border)' }}>
                    <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Return to Supplier</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Eligible for Sun Pharma items</p>
                  </button>
                </div>
              </div>

            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}
