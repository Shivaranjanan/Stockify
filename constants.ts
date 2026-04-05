import { AppConfig, Product, Supplier } from './types';

export const APP_CONFIG: AppConfig = {
  appName: "Stockify",
  currency: "₹",
  themeColor: "blue",
  companyName: "Stockify Enterprise Solutions",
  socialLinks: {
    twitter: "https://twitter.com/stockify",
    linkedin: "https://linkedin.com/company/stockify",
    website: "https://stockify.app"
  }
};

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'MacBook Pro M3 14"',
    sku: 'APL-MBP-M3-14',
    category: 'Electronics',
    price: 1999.00,
    quantity: 12,
    minThreshold: 5,
    supplier: 'Apple Inc.',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca4?auto=format&fit=crop&q=80&w=200',
    lastUpdated: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Ergonomic Office Chair',
    sku: 'FUR-ERGO-001',
    category: 'Furniture',
    price: 299.50,
    quantity: 45,
    minThreshold: 10,
    supplier: 'Herman Miller',
    imageUrl: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&q=80&w=200',
    lastUpdated: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Wireless Mechanical Keyboard',
    sku: 'ACC-KEY-MECH',
    category: 'Accessories',
    price: 129.99,
    quantity: 3, // Low Stock
    minThreshold: 15,
    supplier: 'Keychron',
    imageUrl: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=200',
    lastUpdated: new Date().toISOString()
  },
  {
    id: '4',
    name: '27" 4K Monitor',
    sku: 'MON-4K-27',
    category: 'Electronics',
    price: 450.00,
    quantity: 20,
    minThreshold: 8,
    supplier: 'Dell',
    imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=200',
    lastUpdated: new Date().toISOString()
  },
  {
    id: '5',
    name: 'Standing Desk Frame',
    sku: 'FUR-STD-DSK',
    category: 'Furniture',
    price: 350.00,
    quantity: 8,
    minThreshold: 5,
    supplier: 'Uplift',
    imageUrl: 'https://images.unsplash.com/photo-1595515106969-1ce29569ff88?auto=format&fit=crop&q=80&w=200',
    lastUpdated: new Date().toISOString()
  },
  {
    id: '6',
    name: 'USB-C Docking Station',
    sku: 'ACC-DOCK-C',
    category: 'Accessories',
    price: 89.99,
    quantity: 150,
    minThreshold: 20,
    supplier: 'Anker',
    imageUrl: 'https://images.unsplash.com/photo-1551636898-4760f358b154?auto=format&fit=crop&q=80&w=200',
    lastUpdated: new Date().toISOString()
  },
  {
    id: '7',
    name: 'Noise Cancelling Headphones',
    sku: 'AUD-NC-SONY',
    category: 'Electronics',
    price: 348.00,
    quantity: 2, // Low Stock
    minThreshold: 10,
    supplier: 'Sony',
    imageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=200',
    lastUpdated: new Date().toISOString()
  },
  {
    id: '8',
    name: 'Industrial Shelving Unit',
    sku: 'WH-SHLV-IND',
    category: 'Warehouse',
    price: 120.00,
    quantity: 30,
    minThreshold: 5,
    supplier: 'Uline',
    imageUrl: 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&q=80&w=200',
    lastUpdated: new Date().toISOString()
  },
  {
    id: '9',
    name: 'Label Printer',
    sku: 'WH-PRT-LBL',
    category: 'Warehouse',
    price: 199.99,
    quantity: 11,
    minThreshold: 5,
    supplier: 'Zebra',
    imageUrl: 'https://images.unsplash.com/photo-1612815154858-60aa4c4603e1?auto=format&fit=crop&q=80&w=200',
    lastUpdated: new Date().toISOString()
  },
  {
    id: '10',
    name: 'Packing Tape (Pack of 6)',
    sku: 'WH-TAPE-006',
    category: 'Warehouse',
    price: 24.50,
    quantity: 200,
    minThreshold: 50,
    supplier: '3M',
    imageUrl: 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&q=80&w=200',
    lastUpdated: new Date().toISOString()
  }
];

export const MOCK_SUPPLIERS: Supplier[] = [
  {
    id: '1',
    name: 'Apple Inc.',
    contactPerson: 'Tim Cook',
    email: 'contact@apple.com',
    phone: '+1-800-692-7753',
    address: 'One Apple Park Way, Cupertino, CA'
  },
  {
    id: '2',
    name: 'Herman Miller',
    contactPerson: 'Andi Owen',
    email: 'info@hermanmiller.com',
    phone: '+1-888-443-4357',
    address: '855 East Main Ave, Zeeland, MI'
  },
  {
    id: '3',
    name: 'Keychron',
    contactPerson: 'Nick Xu',
    email: 'support@keychron.com',
    phone: '+852-5555-1234',
    address: 'Hong Kong'
  },
  {
    id: '4',
    name: 'Dell Technologies',
    contactPerson: 'Michael Dell',
    email: 'sales@dell.com',
    phone: '+1-800-456-3355',
    address: '1 Dell Way, Round Rock, TX'
  },
  {
    id: '5',
    name: 'Uplift Desk',
    contactPerson: 'Jon Paulsen',
    email: 'team@upliftdesk.com',
    phone: '+1-800-349-3839',
    address: '2139 W Anderson Ln, Austin, TX'
  }
];