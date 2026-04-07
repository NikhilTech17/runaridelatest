// Simple Test Script for Run A Ride Backend
// Run this after starting the server to verify everything works

const API_BASE = 'http://localhost:5000/api';

console.log('🧪 Testing Run A Ride Backend API...\n');

// Test 1: Health Check
async function testHealth() {
  try {
    const response = await fetch(`${API_BASE}/health`);
    const data = await response.json();
    
    if (data.status === 'OK') {
      console.log('✅ Health Check: PASSED');
      console.log(`   Message: ${data.message}`);
      return true;
    } else {
      console.log('❌ Health Check: FAILED');
      return false;
    }
  } catch (error) {
    console.log('❌ Health Check: FAILED - Server not responding');
    console.log(`   Error: ${error.message}`);
    return false;
  }
}

// Test 2: User Registration
async function testUserRegistration() {
  try {
    const testUser = {
      fullName: 'Test User',
      email: `test${Date.now()}@example.com`,
      phone: '9876543210',
      password: 'testpassword123'
    };
    
    const response = await fetch(`${API_BASE}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testUser)
    });
    
    const data = await response.json();
    
    if (response.ok && data.token) {
      console.log('\n✅ User Registration: PASSED');
      console.log(`   User ID: ${data._id}`);
      console.log(`   Email: ${data.email}`);
      return data.token; // Return token for other tests
    } else {
      console.log('\n❌ User Registration: FAILED');
      console.log(`   Error: ${data.message}`);
      return null;
    }
  } catch (error) {
    console.log('\n❌ User Registration: FAILED');
    console.log(`   Error: ${error.message}`);
    return null;
  }
}

// Test 3: Create Ride (requires auth token)
async function testCreateRide(token) {
  if (!token) {
    console.log('\n⏭️  Create Ride: SKIPPED (No token)');
    return null;
  }
  
  try {
    const rideData = {
      pickupLocation: 'Test Pickup Location',
      dropLocation: 'Test Drop Location',
      distance: 5.5,
      duration: 15,
      baseFare: 25,
      taxes: 2.5,
      totalAmount: 71.5,
      rideType: 'auto'
    };
    
    const response = await fetch(`${API_BASE}/rides`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(rideData)
    });
    
    const data = await response.json();
    
    if (response.ok && data._id) {
      console.log('\n✅ Create Ride: PASSED');
      console.log(`   Ride ID: ${data._id}`);
      console.log(`   Status: ${data.status}`);
      return data._id; // Return ride ID for payment test
    } else {
      console.log('\n❌ Create Ride: FAILED');
      console.log(`   Error: ${data.message}`);
      return null;
    }
  } catch (error) {
    console.log('\n❌ Create Ride: FAILED');
    console.log(`   Error: ${error.message}`);
    return null;
  }
}

// Test 4: Create Payment Order (requires ride ID)
async function testCreatePaymentOrder(rideId, token) {
  if (!rideId || !token) {
    console.log('\n⏭️  Create Payment Order: SKIPPED');
    return null;
  }
  
  try {
    const paymentData = {
      amount: 71.5,
      rideId: rideId
    };
    
    const response = await fetch(`${API_BASE}/payment/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(paymentData)
    });
    
    const data = await response.json();
    
    if (response.ok && data.orderId) {
      console.log('\n✅ Create Payment Order: PASSED');
      console.log(`   Order ID: ${data.orderId}`);
      console.log(`   Amount: ₹${data.amount / 100}`);
      return data;
    } else {
      console.log('\n❌ Create Payment Order: FAILED');
      console.log(`   Error: ${data.message}`);
      return null;
    }
  } catch (error) {
    console.log('\n❌ Create Payment Order: FAILED');
    console.log(`   Error: ${error.message}`);
    return null;
  }
}

// Main test runner
async function runTests() {
  console.log('Starting API tests...\n');
  console.log('=' .repeat(50));
  
  // Test 1: Health Check
  const healthPassed = await testHealth();
  
  if (!healthPassed) {
    console.log('\n❌ Server is not running or not responding!');
    console.log('\n💡 Make sure to start the server first:');
    console.log('   npm run dev\n');
    return;
  }
  
  // Test 2: User Registration
  const token = await testUserRegistration();
  
  // Test 3: Create Ride
  const rideId = await testCreateRide(token);
  
  // Test 4: Create Payment Order
  const orderData = await testCreatePaymentOrder(rideId, token);
  
  // Summary
  console.log('\n' + '=' .repeat(50));
  console.log('\n📊 Test Summary:\n');
  console.log(`Health Check:          ${healthPassed ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`User Registration:     ${token ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`Create Ride:           ${rideId ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`Create Payment Order:  ${orderData ? '✅ PASSED' : '❌ FAILED'}`);
  
  if (healthPassed && token && rideId && orderData) {
    console.log('\n🎉 All tests passed! Backend is working correctly.');
    console.log('\n💡 Next steps:');
    console.log('   1. Configure your Razorpay API keys in .env file');
    console.log('   2. Open http://localhost:5000 in browser');
    console.log('   3. Test the complete booking and payment flow\n');
  } else {
    console.log('\n⚠️  Some tests failed. Check the errors above.');
    console.log('\n💡 Troubleshooting:');
    console.log('   - Make sure MongoDB is running');
    console.log('   - Check .env file configuration');
    console.log('   - Verify all dependencies are installed');
    console.log('   - Check terminal for error messages\n');
  }
  
  console.log('=' .repeat(50) + '\n');
}

// Run tests
runTests();
