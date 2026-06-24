import sequelize from '../src/config/database';
import { Tenant, User, Category, Supplier, Medicine, Sale, SaleItem } from '../src/database/models';

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('Connected to database...');

    // Get the first tenant (created during registration test)
    const tenant = await Tenant.findOne();
    if (!tenant) {
      console.log('No tenant found. Please register a tenant first.');
      process.exit(1);
    }
    
    const user = await User.findOne({ where: { tenant_id: tenant.id }});
    if (!user) {
      console.log('No user found.');
      process.exit(1);
    }

    console.log(`Seeding data for Tenant: ${tenant.name} (ID: ${tenant.id})`);

    // 1. Categories
    const categories = await Category.bulkCreate([
      { tenant_id: tenant.id, name: 'Pain Relief', description: 'Analgesics and pain killers' },
      { tenant_id: tenant.id, name: 'Antibiotics', description: 'Anti-bacterial medicine' },
      { tenant_id: tenant.id, name: 'Vitamins', description: 'Supplements' },
    ]);

    // 2. Suppliers
    const suppliers = await Supplier.bulkCreate([
      { tenant_id: tenant.id, name: 'Sun Pharma', contact_person: 'Rahul D', phone: '9876543210' },
      { tenant_id: tenant.id, name: 'Cipla Ltd', contact_person: 'Amit S', phone: '9876543211' },
    ]);

    // 3. Medicines
    const medicines = await Medicine.bulkCreate([
      {
        tenant_id: tenant.id,
        name: 'Dolo 650',
        generic_name: 'Paracetamol',
        manufacturer: 'Micro Labs',
        batch_number: 'B-1001',
        purchase_price: 20.00,
        selling_price: 28.00,
        mrp: 30.00,
        gst_percentage: 12,
        stock_quantity: 500,
        minimum_stock: 50,
        expiry_date: new Date('2027-12-31')
      },
      {
        tenant_id: tenant.id,
        name: 'Azithral 500',
        generic_name: 'Azithromycin',
        manufacturer: 'Alembic',
        batch_number: 'B-1002',
        purchase_price: 60.00,
        selling_price: 75.00,
        mrp: 80.00,
        gst_percentage: 12,
        stock_quantity: 200,
        minimum_stock: 20,
        expiry_date: new Date('2026-06-30')
      }
    ]);

    // 4. Sales
    const sale = await Sale.create({
      tenant_id: tenant.id,
      invoice_number: 'INV-10001',
      subtotal: 103.00,
      gst_amount: 12.36,
      discount: 0,
      total_amount: 115.36,
      payment_method: 'CASH',
      created_by: user.id
    });

    await SaleItem.bulkCreate([
      {
        sale_id: sale.id,
        medicine_id: medicines[0].id,
        quantity: 2,
        price: 28.00,
        gst: 3.36,
        total: 56.00 + 3.36
      },
      {
        sale_id: sale.id,
        medicine_id: medicines[1].id,
        quantity: 1,
        price: 75.00,
        gst: 9.00,
        total: 75.00 + 9.00
      }
    ]);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();
