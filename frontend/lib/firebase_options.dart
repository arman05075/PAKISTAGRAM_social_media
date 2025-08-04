import 'package:firebase_core/firebase_core.dart' show FirebaseOptions;
import 'package:flutter/foundation.dart'
    show defaultTargetPlatform, kIsWeb, TargetPlatform;

class DefaultFirebaseOptions {
  static FirebaseOptions get currentPlatform {
    if (kIsWeb) {
      return web;
    }
    switch (defaultTargetPlatform) {
      case TargetPlatform.android:
        return android;
      case TargetPlatform.iOS:
        return ios;
      case TargetPlatform.macOS:
        return macos;
      case TargetPlatform.windows:
        throw UnsupportedError(
          'DefaultFirebaseOptions have not been configured for windows - '
          'you can reconfigure this by running the FlutterFire CLI again.',
        );
      case TargetPlatform.linux:
        throw UnsupportedError(
          'DefaultFirebaseOptions have not been configured for linux - '
          'you can reconfigure this by running the FlutterFire CLI again.',
        );
      default:
        throw UnsupportedError(
          'DefaultFirebaseOptions are not supported for this platform.',
        );
    }
  }

  static const FirebaseOptions web = FirebaseOptions(
    apiKey: 'AIzaSyC0tlPM5KblUDLqW8jN1pPslmL8fWWDs2Y',
    appId: '1:980541844466:web:2b04299e2829a813add96b',
    messagingSenderId: '980541844466',
    projectId: 'deft-legacy-458411-u4',
    authDomain: 'deft-legacy-458411-u4.firebaseapp.com',
    storageBucket: 'deft-legacy-458411-u4.firebasestorage.app',
    measurementId: 'G-EQ6RT3QQXQ',
  );

  static const FirebaseOptions android = FirebaseOptions(
    apiKey: 'AIzaSyC0tlPM5KblUDLqW8jN1pPslmL8fWWDs2Y',
    appId: '1:980541844466:android:2b04299e2829a813add96b',
    messagingSenderId: '980541844466',
    projectId: 'deft-legacy-458411-u4',
    authDomain: 'deft-legacy-458411-u4.firebaseapp.com',
    storageBucket: 'deft-legacy-458411-u4.firebasestorage.app',
  );

  static const FirebaseOptions ios = FirebaseOptions(
    apiKey: 'AIzaSyC0tlPM5KblUDLqW8jN1pPslmL8fWWDs2Y',
    appId: '1:980541844466:ios:2b04299e2829a813add96b',
    messagingSenderId: '980541844466',
    projectId: 'deft-legacy-458411-u4',
    authDomain: 'deft-legacy-458411-u4.firebaseapp.com',
    storageBucket: 'deft-legacy-458411-u4.firebasestorage.app',
    iosBundleId: 'com.pakistagram.app',
  );

  static const FirebaseOptions macos = FirebaseOptions(
    apiKey: 'AIzaSyC0tlPM5KblUDLqW8jN1pPslmL8fWWDs2Y',
    appId: '1:980541844466:ios:2b04299e2829a813add96b',
    messagingSenderId: '980541844466',
    projectId: 'deft-legacy-458411-u4',
    authDomain: 'deft-legacy-458411-u4.firebaseapp.com',
    storageBucket: 'deft-legacy-458411-u4.firebasestorage.app',
    iosBundleId: 'com.pakistagram.app',
  );
}