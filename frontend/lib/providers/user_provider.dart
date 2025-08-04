import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import '../models/user_model.dart';
import '../services/api_service.dart';

class UserProvider with ChangeNotifier {
  final ApiService _apiService = ApiService();
  final FirebaseAuth _auth = FirebaseAuth.instance;

  UserModel? _currentUser;
  Map<String, UserModel> _userCache = {};
  bool _isLoading = false;
  String? _error;

  UserModel? get currentUser => _currentUser;
  bool get isLoading => _isLoading;
  String? get error => _error;

  Future<void> loadCurrentUser() async {
    try {
      _isLoading = true;
      _error = null;
      notifyListeners();

      final token = await _auth.currentUser?.getIdToken();
      if (token == null) return;

      _currentUser = await _apiService.getCurrentUserProfile(token);
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<UserModel?> getUserByUsername(String username) async {
    // Check cache first
    if (_userCache.containsKey(username)) {
      return _userCache[username];
    }

    try {
      final user = await _apiService.getUserByUsername(username);
      if (user != null) {
        _userCache[username] = user;
      }
      return user;
    } catch (e) {
      return null;
    }
  }

  Future<bool> updateProfile({
    String? displayName,
    String? bio,
    String? avatar,
  }) async {
    try {
      _isLoading = true;
      _error = null;
      notifyListeners();

      final token = await _auth.currentUser?.getIdToken();
      if (token == null) return false;

      final success = await _apiService.updateProfile(
        token: token,
        displayName: displayName,
        bio: bio,
        avatar: avatar,
      );

      if (success && _currentUser != null) {
        _currentUser = _currentUser!.copyWith(
          displayName: displayName ?? _currentUser!.displayName,
          bio: bio ?? _currentUser!.bio,
          avatar: avatar ?? _currentUser!.avatar,
          updatedAt: DateTime.now(),
        );
      }

      return success;
    } catch (e) {
      _error = e.toString();
      return false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> followUser(String username) async {
    try {
      final token = await _auth.currentUser?.getIdToken();
      if (token == null) return false;

      final success = await _apiService.followUser(
        token: token,
        username: username,
      );

      if (success) {
        // Update cache and current user following count
        if (_userCache.containsKey(username)) {
          final user = _userCache[username]!;
          _userCache[username] = user.copyWith(
            followersCount: user.followersCount + 1,
          );
        }

        if (_currentUser != null) {
          _currentUser = _currentUser!.copyWith(
            followingCount: _currentUser!.followingCount + 1,
          );
          notifyListeners();
        }
      }

      return success;
    } catch (e) {
      _error = e.toString();
      notifyListeners();
      return false;
    }
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }

  void clearCache() {
    _userCache.clear();
  }
}