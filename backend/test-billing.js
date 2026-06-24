async function testBilling() {
  const baseUrl = 'http://localhost:5000/api';

  console.log('1. Registering new tenant...');
  const regRes = await fetch(`${baseUrl}/auth/register-tenant`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      tenantName: 'Test Pharmacy ' + Date.now(),
      businessName: 'Test Business',
      userName: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'password123'
    })
  });
  
  const regData = await regRes.json();
  if (!regData.success && !regData.token) {
    console.error('Registration failed:', regData);
    return;
  }
  
  const token = regData.token || regData.data?.token;
  console.log('Registration successful. Token:', token.substring(0, 20) + '...');

  console.log('2. Creating a sale with an external item...');
  const saleRes = await fetch(`${baseUrl}/billing/sale`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      customer_name: 'Walk-in Test',
      payment_method: 'CASH',
      discount: 10,
      items: [
        {
          medicine_id: 'EXT-test1', // fake global catalog id
          isExternal: true,
          name: 'Test Oximeter',
          mrp: 1000,
          batch: 'EXT123',
          expiry: '2027-12-31',
          pack: '1 Piece',
          quantity: 1,
          price: 900,
          gst: 18,
          total: 900
        }
      ]
    })
  });

  const saleData = await saleRes.json();
  if (!saleData.success) {
    console.error('Sale creation failed:', saleData);
    return;
  }

  console.log('Sale successfully created!');
  console.log('Invoice Number:', saleData.data.invoice_number);
  console.log('Sale ID:', saleData.data.id);

  console.log('3. Fetching sale by ID to verify Print functionality...');
  const printRes = await fetch(`${baseUrl}/billing/sales/${saleData.data.id}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const printData = await printRes.json();
  if (!printData.success) {
    console.error('Fetch sale failed:', printData);
    return;
  }

  console.log('Fetch sale successful! Item count:', printData.data.items.length);
  console.log('All API tests passed successfully!');
}

testBilling().catch(console.error);
