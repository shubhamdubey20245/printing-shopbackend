export interface GlobalProduct {
  id: string
  name: string
  genericName?: string
  manufacturer?: string
  category: string
  type: 'Medicine' | 'Injection' | 'Surgical' | 'Consumable' | 'Device'
  mrp: number
  hsn: string
  gstRate: number
  unit: string
  barcode?: string
}



export const globalCatalog: GlobalProduct[] = [
  // Medicines & Brand Names
  { id: 'g1', name: 'Cheston Cold', genericName: 'Cetirizine + Paracetamol + Phenylephrine', manufacturer: 'Cipla', category: 'Cold & Cough', type: 'Medicine', mrp: 45, hsn: '30049099', gstRate: 12, unit: '10 Tabs', barcode: '8901111111101' },
  { id: 'g2', name: 'Augmentin 625 Duo', genericName: 'Amoxicillin + Clavulanic Acid', manufacturer: 'GSK', category: 'Antibiotics', type: 'Medicine', mrp: 200, hsn: '30041090', gstRate: 12, unit: '10 Tabs', barcode: '8901111111102' },
  { id: 'g3', name: 'Telma 40', genericName: 'Telmisartan', manufacturer: 'Glenmark', category: 'Cardiac', type: 'Medicine', mrp: 130, hsn: '30049099', gstRate: 12, unit: '15 Tabs', barcode: '8901111111103' },
  { id: 'g4', name: 'Calpol 500', genericName: 'Paracetamol', manufacturer: 'GSK', category: 'Analgesics', type: 'Medicine', mrp: 15, hsn: '30049099', gstRate: 12, unit: '15 Tabs', barcode: '8901111111104' },

  // Injections & IV
  { id: 'g5', name: 'Monocef 1gm Injection', genericName: 'Ceftriaxone', manufacturer: 'Aristo', category: 'Antibiotics', type: 'Injection', mrp: 65, hsn: '30041090', gstRate: 12, unit: '1 Vial', barcode: '8901111111105' },
  { id: 'g6', name: 'Rabipur Vaccine', genericName: 'Rabies Vaccine', manufacturer: 'Chiron Behring', category: 'Vaccines', type: 'Injection', mrp: 350, hsn: '30022019', gstRate: 5, unit: '1 Vial', barcode: '8901111111106' },
  { id: 'g7', name: 'IV Set (Vented)', category: 'Infusion', type: 'Consumable', mrp: 120, hsn: '90183990', gstRate: 12, unit: '1 Piece', barcode: '8901111111107' },
  { id: 'g8', name: 'Normal Saline (NS 0.9%) 500ml', manufacturer: 'Nirma', category: 'IV Fluids', type: 'Medicine', mrp: 40, hsn: '30049099', gstRate: 12, unit: '1 Bottle', barcode: '8901111111108' },

  // Surgical Items & Consumables
  { id: 'g9', name: 'Adult Diaper Large', manufacturer: 'Friends', category: 'Hygiene', type: 'Consumable', mrp: 450, hsn: '96190090', gstRate: 12, unit: '10 Pieces', barcode: '8901111111109' },
  { id: 'g10', name: 'Surgical Gloves Sterile (7.5)', manufacturer: 'Nulife', category: 'Surgical', type: 'Surgical', mrp: 35, hsn: '40151100', gstRate: 12, unit: '1 Pair', barcode: '8901111111110' },
  { id: 'g11', name: 'Hand Sanitizer 500ml', manufacturer: 'Dettol', category: 'Hygiene', type: 'Consumable', mrp: 250, hsn: '38089400', gstRate: 18, unit: '1 Bottle', barcode: '8901111111111' },
  { id: 'g12', name: 'Toilet Roll Tissue (2 Ply)', category: 'Hygiene', type: 'Consumable', mrp: 45, hsn: '48181000', gstRate: 18, unit: '1 Roll', barcode: '8901111111112' },
  { id: 'g13', name: 'Syringe 5ml with Needle', manufacturer: 'Dispovan', category: 'Surgical', type: 'Surgical', mrp: 10, hsn: '90183100', gstRate: 12, unit: '1 Piece', barcode: '8901111111113' },
  { id: 'g14', name: 'Feeding Bag 1000ml', manufacturer: 'Romsons', category: 'Surgical', type: 'Surgical', mrp: 180, hsn: '90183990', gstRate: 12, unit: '1 Piece', barcode: '8901111111114' },
  { id: 'g15', name: 'Foley Catheter 2 Way (16FR)', manufacturer: 'Romsons', category: 'Surgical', type: 'Surgical', mrp: 150, hsn: '90183990', gstRate: 12, unit: '1 Piece', barcode: '8901111111115' },
  { id: 'g16', name: 'Cotton Roll 100g', category: 'Dressing', type: 'Consumable', mrp: 50, hsn: '30059040', gstRate: 5, unit: '1 Piece', barcode: '8901111111116' },
  { id: 'g17', name: 'Gauze Swab Sterile 10x10', category: 'Dressing', type: 'Consumable', mrp: 40, hsn: '30059040', gstRate: 5, unit: '1 Pkt', barcode: '8901111111117' },
  { id: 'g18', name: 'Micropore Surgical Tape 1 Inch', manufacturer: '3M', category: 'Dressing', type: 'Consumable', mrp: 110, hsn: '30051090', gstRate: 12, unit: '1 Roll', barcode: '8901111111118' },
  { id: 'g19', name: 'Surgical Face Mask (3 Ply)', category: 'Hygiene', type: 'Surgical', mrp: 10, hsn: '63079090', gstRate: 5, unit: '1 Piece', barcode: '8901111111119' },

  // Medical Devices
  { id: 'g20', name: 'Compressor Nebulizer Kit', manufacturer: 'Omron', category: 'Devices', type: 'Device', mrp: 1800, hsn: '90192090', gstRate: 12, unit: '1 Kit', barcode: '8901111111120' },
  { id: 'g21', name: 'Digital Thermometer', manufacturer: 'Dr. Morepen', category: 'Devices', type: 'Device', mrp: 250, hsn: '90251910', gstRate: 18, unit: '1 Piece', barcode: '8901111111121' },
  { id: 'g22', name: 'Pulse Oximeter', manufacturer: 'BPL', category: 'Devices', type: 'Device', mrp: 1200, hsn: '90278090', gstRate: 18, unit: '1 Piece', barcode: '8901111111122' },
  { id: 'g23', name: 'Digital BP Monitor', manufacturer: 'Omron', category: 'Devices', type: 'Device', mrp: 2500, hsn: '90189019', gstRate: 18, unit: '1 Piece', barcode: '8901111111123' },
]
