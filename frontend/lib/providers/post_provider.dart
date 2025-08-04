import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import '../models/post_model.dart';
import '../services/api_service.dart';

class PostProvider with ChangeNotifier {
  final ApiService _apiService = ApiService();
  final FirebaseAuth _auth = FirebaseAuth.instance;

  List<PostModel> _posts = [];
  bool _isLoading = false;
  String? _error;
  int _currentPage = 1;
  bool _hasMore = true;

  List<PostModel> get posts => _posts;
  bool get isLoading => _isLoading;
  String? get error => _error;
  bool get hasMore => _hasMore;

  Future<void> loadFeed({bool refresh = false}) async {
    if (_isLoading) return;

    try {
      _isLoading = true;
      _error = null;
      
      if (refresh) {
        _currentPage = 1;
        _posts.clear();
        _hasMore = true;
      }

      notifyListeners();

      final token = await _auth.currentUser?.getIdToken();
      if (token == null) return;

      final newPosts = await _apiService.getFeed(
        token: token,
        page: _currentPage,
        limit: 20,
      );

      if (newPosts.isEmpty) {
        _hasMore = false;
      } else {
        if (refresh) {
          _posts = newPosts;
        } else {
          _posts.addAll(newPosts);
        }
        _currentPage++;
      }
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> createPost({
    required String content,
    String? imageUrl,
    List<String>? tags,
    bool isAIGenerated = false,
  }) async {
    try {
      final token = await _auth.currentUser?.getIdToken();
      if (token == null) return false;

      final success = await _apiService.createPost(
        token: token,
        content: content,
        imageUrl: imageUrl,
        tags: tags,
        isAIGenerated: isAIGenerated,
      );

      if (success) {
        await loadFeed(refresh: true);
      }

      return success;
    } catch (e) {
      _error = e.toString();
      notifyListeners();
      return false;
    }
  }

  Future<void> likePost(String postId) async {
    try {
      final token = await _auth.currentUser?.getIdToken();
      if (token == null) return;

      // Optimistically update UI
      final postIndex = _posts.indexWhere((post) => post.id == postId);
      if (postIndex != -1) {
        final post = _posts[postIndex];
        final isCurrentlyLiked = post.isLiked ?? false;
        
        _posts[postIndex] = post.copyWith(
          isLiked: !isCurrentlyLiked,
          likesCount: isCurrentlyLiked 
              ? post.likesCount - 1 
              : post.likesCount + 1,
        );
        notifyListeners();

        // Make API call
        final success = await _apiService.likePost(token: token, postId: postId);
        
        if (!success) {
          // Revert on failure
          _posts[postIndex] = post;
          notifyListeners();
        }
      }
    } catch (e) {
      _error = e.toString();
      notifyListeners();
    }
  }

  Future<bool> addComment({
    required String postId,
    required String content,
  }) async {
    try {
      final token = await _auth.currentUser?.getIdToken();
      if (token == null) return false;

      final success = await _apiService.addComment(
        token: token,
        postId: postId,
        content: content,
      );

      if (success) {
        // Update comment count
        final postIndex = _posts.indexWhere((post) => post.id == postId);
        if (postIndex != -1) {
          _posts[postIndex] = _posts[postIndex].copyWith(
            commentsCount: _posts[postIndex].commentsCount + 1,
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

  Future<String?> generateAIPost({
    required String prompt,
    String type = 'text',
  }) async {
    try {
      final token = await _auth.currentUser?.getIdToken();
      if (token == null) return null;

      return await _apiService.generatePost(
        token: token,
        prompt: prompt,
        type: type,
      );
    } catch (e) {
      _error = e.toString();
      notifyListeners();
      return null;
    }
  }

  Future<List<String>> generateHashtags(String content) async {
    try {
      final token = await _auth.currentUser?.getIdToken();
      if (token == null) return [];

      return await _apiService.generateHashtags(
        token: token,
        content: content,
      );
    } catch (e) {
      return [];
    }
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }
}