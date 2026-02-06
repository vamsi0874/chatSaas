
import { initializeApp, cert, getApps, App, getApp } from "firebase-admin/app";

import { getFirestore } from "firebase-admin/firestore";


import { ServiceAccount } from "firebase-admin/app";
import serviceKey from "./service-key.json";

let app: App;

if (getApps().length === 0) {
  app = initializeApp({
    credential: cert(serviceKey as ServiceAccount),
  });
} else {
  app = getApp();
}

const adminDb = getFirestore(app);

export { adminDb , app as adminApp };