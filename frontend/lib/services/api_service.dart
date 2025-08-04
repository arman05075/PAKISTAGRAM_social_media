import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/post_model.dart';
import '../models/user_model.dart';

class ApiService {
  static const String baseUrl = 'http://localhost:3000/api';

  // Auth endpoints
  Future<bool> createUserProfile({
    required String token,
    required String username,
    required String displayName,
    String? bio,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/auth/create-profile'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode({
          'username': username,
          'displayName': displayName,
          'bio': bio,
        }),
      );

      return response.statusCode == 201;
    } catch (e) {
      return false;
    }
  }

  Future<UserModel?> getCurrentUserProfile(String token) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/auth/profile'),
        headers: {
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return UserModel.fromMap(data);
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  // Posts endpoints
  Future<bool> createPost({
    required String token,
    required String content,
    String? imageUrl,
    List<String>? tags,
    bool isAIGenerated = false,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/posts'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode({
          'content': content,
          'imageUrl': imageUrl,
          'tags': tags,
          'isAIGenerated': isAIGenerated,
        }),
      );

      return response.statusCode == 201;
    } catch (e) {
      return false;
    }
  }

  Future<List<PostModel>> getFeed({
    required String token,
    int page = 1,
    int limit = 20,
  }) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/posts/feed?page=$page&limit=$limit'),
        headers: {
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final posts = data['posts'] as List;
        return posts.map((post) => PostModel.fromMap(post)).toList();
      }
      return [];
    } catch (e) {
      return [];
    }
  }

  Future<bool> likePost({
    required String token,
    required String postId,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/posts/$postId/like'),
        headers: {
          'Authorization': 'Bearer $token',
        },
      );

      return response.statusCode == 200;
    } catch (e) {
      return false;
    }
  }

  Future<bool> addComment({
    required String token,
    required String postId,
    required String content,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/posts/$postId/comments'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode({
          'content': content,
        }),
      );

      return response.statusCode == 201;
    } catch (e) {
      return false;
    }
  }

  Future<List<CommentModel>> getComments({
    required String postId,
  }) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/posts/$postId/comments'),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final comments = data['comments'] as List;
        return comments.map((comment) => CommentModel.fromMap(comment)).toList();
      }
      return [];
    } catch (e) {
      return [];
    }
  }

  // AI endpoints
  Future<String?> generatePost({
    required String token,
    required String prompt,
    String type = 'text',
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/ai/generate-post'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode({
          'prompt': prompt,
          'type': type,
        }),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return data['content'];
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  Future<List<String>> generateHashtags({
    required String token,
    required String content,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/ai/generate-hashtags'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode({
          'content': content,
        }),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return List<String>.from(data['hashtags']);
      }
      return [];
    } catch (e) {
      return [];
    }
  }

  // Users endpoints
  Future<UserModel?> getUserByUsername(String username) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/users/$username'),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return UserModel.fromMap(data);
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  Future<bool> followUser({
    required String token,
    required String username,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/users/$username/follow'),
        headers: {
          'Authorization': 'Bearer $token',
        },
      );

      return response.statusCode == 200;
    } catch (e) {
      return false;
    }
  }

  Future<bool> updateProfile({
    required String token,
    String? displayName,
    String? bio,
    String? avatar,
  }) async {
    try {
      final response = await http.put(
        Uri.parse('$baseUrl/users/profile'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode({
          'displayName': displayName,
          'bio': bio,
          'avatar': avatar,
        }),
      );

      return response.statusCode == 200;
    } catch (e) {
      return false;
    }
  }
}