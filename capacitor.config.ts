import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    "appId": "com.example.app",
    "appName": "appointments-app",
    "webDir": "out",
    "bundledWebRuntime": false,
    server: {
      url: 'http://10.0.2.2:3000',
      cleartext: true
    }
};

export default config;