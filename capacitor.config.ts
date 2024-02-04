import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    "appId": "com.example.app",
    "appName": "appointments-app",
    "webDir": "out",
    "bundledWebRuntime": false,
    server: {
      url: 'http://192.168.0.178:3000',
      cleartext: true
    }
};

export default config;
